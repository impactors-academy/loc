# LOC — Search Strategy Decision

**Question:** keyword, semantic, hybrid, or vector search?
**Answer:** **Keyword (PostgreSQL FTS) as the first arm + pgvector cosine as the second arm, fused via Reciprocal Rank Fusion (RRF).** Both arms run inside Postgres — never a standalone vector DB.

**Current status:** Phase 2 (hybrid) is **live** as of R3. Embeddings are gated behind `OPENAI_API_KEY` — if the key is unset, the search falls back to keyword-only with zero cost.

---

## Why, in one paragraph

LOC's catalog is small, structured, and filter-driven (category, country, location, price range). The dominant action a tourist takes is *browse + filter*, not free-text search — that's plain SQL `WHERE`, not "search" at all. Where free text matters ("tea ceremony Kyoto", "riad Marrakech"), the queries are short and contain proper nouns and place names, which **keyword/full-text search nails and pure vector search actually hurts** (semantic models blur exact terms). So we start with Postgres full-text search — zero new infrastructure. Semantic search earns its place for *natural-language discovery* ("romantic coastal villa with pool under €400/night") and *related-content recommendations* on the blog. We keep it inside **the same Postgres** via `pgvector` and **fuse** it with keyword results (RRF) rather than replacing them. A dedicated vector DB (Pinecone/Weaviate) is unjustified at LOC's scale and violates the "stay lean" principle.

---

## Decision by feature

| Feature | Query pattern | Phase 1 (launched) | Phase 2 (current) |
|---|---|---|---|
| **Experiences** | category/country/location filters + short text | Faceted filters + Postgres FTS | **Hybrid (FTS + vector, RRF)** ✅ |
| **Properties** | country/location/type/price filters | Faceted filters + Postgres FTS | Keyword only — semantic adds little |
| **Digital products** | tiny catalog, browse | Filter + keyword | Keyword only — *never* vector |
| **Blog / content hub** | tag browse + text | Postgres FTS + tags | Vector for "related articles" recs ✅ |

---

## Phase 1 — PostgreSQL full-text search (live)

- **Full-text:** generated `tsvector` column over title + description + location, indexed with **GIN**, ranked with `ts_rank`.
- **Fuzzy / typo tolerance:** the **`pg_trgm`** extension (`similarity()`, trigram GIN index) so "skydving" finds "skydiving".
- **Filters:** indexed columns (`category`, `country`, `location`, `price_min/max`) combined with the text query in one SQL expression.
- **Caching:** `@cache()` on the search service (TTL 5 min, key `experiences:search:{hash}`), invalidated on write.

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE experiences
  ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce(title,'')), 'A') ||
    setweight(to_tsvector('simple', coalesce(location,'')), 'B') ||
    setweight(to_tsvector('simple', coalesce(description,'')), 'C')
  ) STORED;

CREATE INDEX idx_experiences_search ON experiences USING GIN (search_vector);
CREATE INDEX idx_experiences_trgm   ON experiences USING GIN (title gin_trgm_ops);
```

This belongs in the **repository layer** (raw query lives there); the service layer decides caching and merges filters.

---

## Phase 2 — Hybrid (FTS + pgvector), same database (LIVE)

### Infrastructure

No new services. The `db` service already runs `pgvector/pgvector:pg16`. Migration `003r3vector` adds:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
ALTER TABLE experiences ADD COLUMN embedding vector(1536);
ALTER TABLE blog_posts  ADD COLUMN embedding vector(1536);

CREATE INDEX idx_experiences_embedding ON experiences USING hnsw (embedding vector_cosine_ops);
CREATE INDEX idx_blog_embedding        ON blog_posts  USING hnsw (embedding vector_cosine_ops);
```

### Embedding generation

- Model: `text-embedding-3-small` (OpenAI) — 1536 dimensions, $0.02/million tokens.
- Generated at **write time** in the service layer (not in repositories, not on read).
- Gated: `settings.embeddings_enabled = bool(OPENAI_API_KEY)` — if key is unset, the column stays `null` and the vector arm is skipped at query time. Zero cost.

### Hybrid search flow (experiences)

```python
def hybrid_search(db, q, category=None, country=None, limit=20):
    # 1. Keyword arm — FTS ranked list of IDs
    keyword_ids = repo.fts_search(db, q, category, country)

    # 2. Vector arm — cosine ranked list of IDs (skipped if no embeddings)
    query_embedding = embed(q) if settings.embeddings_enabled else None
    vector_ids = repo.vector_search(db, query_embedding, limit) if query_embedding else []

    # 3. Fuse with RRF
    fused = _rrf([keyword_ids, vector_ids], k=60)

    # 4. Re-fetch ORM objects in fused order
    return repo.get_by_ids(db, fused[:limit])

def _rrf(ranked_lists: list[list[str]], k: int = 60) -> list[str]:
    scores: dict[str, float] = {}
    for ranked in ranked_lists:
        for pos, id_ in enumerate(ranked):
            scores[id_] = scores.get(id_, 0.0) + 1.0 / (k + pos + 1)
    return sorted(scores, key=lambda i: scores[i], reverse=True)
```

### Related articles (blog)

`GET /api/v1/blog/{slug}/related`:
1. Load source post's embedding.
2. If embedding exists: cosine similarity via raw SQL `ORDER BY embedding <=> $1 LIMIT 3`, excluding self.
3. If embedding null: fall back to tag overlap (array intersection).

### Triggering hybrid vs. keyword-only

The experiences service routes to hybrid only when:
- `q` is non-empty **and**
- `semantic=True` query param is set **and**
- `settings.embeddings_enabled` is True (i.e., `OPENAI_API_KEY` is set)

Otherwise falls back to pure keyword search. This means the platform degrades gracefully with no API key.

---

## Country filter integration (R4)

The `country` field (migration 004) extends the search interface:

```python
def search(db, q=None, category=None, country=None, semantic=False, limit=20):
    # country filter applies to BOTH keyword and vector arms
    # repository adds: .filter(Experience.country.ilike(country)) when set
```

Cache key includes `country` to avoid serving Tokyo results cached for a Paris query.

---

## Cost / complexity guardrails

- Only embed entities with rich descriptions: **experiences** and **blog posts**.
- Properties and products stay keyword-only (short descriptions, filter-dominated).
- `text-embedding-3-small` at LOC's current scale (< 1,000 records): effectively **$0** even with embeddings on.
- Revisit a separate vector DB only past ~100k embedded rows.

---

## What we explicitly reject

- **Pure vector search as the primary path** — loses exact matching on place/provider names and prices, which is most of LOC's real traffic.
- **A separate vector database (Pinecone, Weaviate, Milvus)** — extra service, extra cost, extra ops. Postgres + pgvector covers the need.
- **A search engine (Elasticsearch/Meilisearch)** — Postgres FTS covers the need; adding a search cluster is the kind of over-engineering the project principles warn against.
- **Embedding at read time** — too slow and expensive; always embed at write time (create/update), cache aggressively.
