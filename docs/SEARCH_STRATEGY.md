# LOC — Search Strategy Decision

**Question:** keyword, semantic, hybrid, or vector search?
**Answer:** **Keyword (PostgreSQL FTS) now → Hybrid (FTS + pgvector) later.** Never a standalone vector DB.

---

## Why, in one paragraph

LOC's catalog is small, structured, and filter-driven (category, location, price range). The dominant action a tourist takes is *browse + filter*, not free-text search — that's plain SQL `WHERE`, not "search" at all. Where free text matters ("quad biking Marrakech", "riad Fes"), the queries are short and contain proper nouns and place names, which **keyword/full-text search nails and pure vector search actually hurts** (semantic models blur exact terms). So we start with Postgres full-text search — zero new infrastructure, already in the stack. Semantic search earns its place only for *natural-language discovery* ("romantic 3-day desert escape under $300") and *related-content recommendations* on the blog. When we add it, we keep it inside the **same Postgres** via the `pgvector` extension and **fuse** it with keyword results (hybrid) rather than replacing them. A dedicated vector DB (Pinecone/Weaviate) is unjustified at LOC's scale and violates the "stay lean" principle.

---

## Decision by feature

| Feature | Query pattern | Phase 1 (launch) | Phase 2 (discovery) |
|---|---|---|---|
| **Experiences** | category/location filters + short text | Faceted filters + Postgres FTS | **Hybrid** (FTS + vector, RRF) |
| **Properties** | location/type/price filters + place name | Faceted filters + Postgres FTS | Keep keyword (semantic adds little) |
| **Digital products** | tiny catalog, browse | Filter + keyword | Keyword only — *never* vector |
| **Blog / content hub** | tag browse + text | Postgres FTS + tags | Vector for "related articles" recs |

---

## Phase 1 — PostgreSQL full-text search (ship this now)

No new services. Uses the existing Postgres + the layered backend.

- **Full-text:** a generated `tsvector` column over title + description + provider + location, indexed with **GIN**, ranked with `ts_rank`.
- **Fuzzy / typo tolerance / autocomplete:** the **`pg_trgm`** extension (`similarity()`, trigram GIN index) so "skydving" still finds "skydiving".
- **Filters:** indexed columns (`category`, `location`, `price_min/max`) combined with the text query in one query.
- **Caching:** wrap the search service in `fastapi-cache2` `@cache()` (TTL 5 min, key e.g. `experiences:search:{hash}`), invalidated on write — same pattern as the listing endpoints.

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

This lands in a normal Alembic migration. It belongs in the **repository layer** (raw query lives there); the service layer decides caching and merges filters.

## Phase 2 — Hybrid (FTS + pgvector), same database

Triggered when the catalog grows and we want natural-language discovery. The `db` service already runs the `pgvector/pgvector:pg16` image, so **no infra change** — just `CREATE EXTENSION vector;` in a migration.

1. Store an `embedding vector(1536)` column alongside each searchable row.
2. Generate the embedding **at write time** in the service layer (e.g. `text-embedding-3-small`), so reads stay fast; cache aggressively.
3. At query time run both: keyword rank (`ts_rank`) and vector distance (`<=>` cosine), then combine with **Reciprocal Rank Fusion (RRF)** — robust, tuning-free, and well-suited to a small team.

```sql
CREATE EXTENSION IF NOT EXISTS vector;
ALTER TABLE experiences ADD COLUMN embedding vector(1536);
CREATE INDEX idx_experiences_embedding ON experiences
  USING hnsw (embedding vector_cosine_ops);
```

**Cost/complexity guardrail:** only embed entities with rich descriptions (experiences, blog posts). Properties and products stay keyword-only unless data proves otherwise.

---

## What we explicitly reject

- **Pure vector search as the primary path** — loses exact matching on place/provider names and prices, which is most of LOC's real traffic.
- **A separate vector database (Pinecone, Weaviate, Milvus)** — extra service, extra cost, extra ops for a catalog that fits comfortably in Postgres. Revisit only past ~100k embedded rows.
- **A search engine (Elasticsearch/Meilisearch) in Phase 1** — Postgres FTS covers the need; adding a search cluster now is the kind of over-engineering the project principles warn against.
