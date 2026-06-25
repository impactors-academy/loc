"""
Local dev setup — creates the database schema without requiring pgvector.
Semantic search is disabled; all other features (text search, filters, seed
data) work normally.

Usage:
    uv run python scripts/local_setup.py
"""
from sqlalchemy import create_engine, text

from app.config import settings

engine = create_engine(settings.database_url)

DDL = """
-- ── Extensions ────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ── Core tables ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS experiences (
    id              VARCHAR PRIMARY KEY,
    slug            VARCHAR UNIQUE NOT NULL,
    title           VARCHAR NOT NULL,
    description     TEXT,
    category        VARCHAR NOT NULL,
    country         VARCHAR,
    location        VARCHAR,
    price_min       FLOAT,
    price_max       FLOAT,
    images          JSONB NOT NULL DEFAULT '[]',
    is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
    provider_name   VARCHAR,
    provider_contact VARCHAR,
    referral_url    VARCHAR,
    embedding       TEXT
);

CREATE TABLE IF NOT EXISTS properties (
    id              VARCHAR PRIMARY KEY,
    slug            VARCHAR UNIQUE NOT NULL,
    title           VARCHAR NOT NULL,
    description     TEXT,
    type            VARCHAR NOT NULL,
    country         VARCHAR,
    location        VARCHAR,
    price_min       FLOAT,
    price_max       FLOAT,
    images          JSONB NOT NULL DEFAULT '[]',
    listing_tier    VARCHAR NOT NULL DEFAULT 'standard',
    owner_contact   VARCHAR
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id              VARCHAR PRIMARY KEY,
    slug            VARCHAR UNIQUE NOT NULL,
    title           VARCHAR NOT NULL,
    excerpt         TEXT,
    content         TEXT,
    image_url       VARCHAR,
    published_at    TIMESTAMP,
    tags            VARCHAR,
    embedding       TEXT
);

CREATE TABLE IF NOT EXISTS products (
    id              VARCHAR PRIMARY KEY,
    slug            VARCHAR UNIQUE NOT NULL,
    title           VARCHAR NOT NULL,
    description     TEXT,
    type            VARCHAR NOT NULL,
    price           FLOAT NOT NULL,
    image_url       VARCHAR,
    purchase_url    VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS inquiries (
    id              VARCHAR PRIMARY KEY,
    name            VARCHAR NOT NULL,
    email           VARCHAR NOT NULL,
    phone           VARCHAR,
    message         TEXT NOT NULL,
    subject         VARCHAR NOT NULL,
    source_type     VARCHAR NOT NULL DEFAULT 'general',
    source_id       VARCHAR,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS ix_experiences_slug     ON experiences (slug);
CREATE INDEX IF NOT EXISTS ix_experiences_category ON experiences (category);
CREATE INDEX IF NOT EXISTS ix_experiences_country  ON experiences (country);
CREATE INDEX IF NOT EXISTS ix_experiences_location ON experiences (location);

CREATE INDEX IF NOT EXISTS ix_properties_slug     ON properties (slug);
CREATE INDEX IF NOT EXISTS ix_properties_type     ON properties (type);
CREATE INDEX IF NOT EXISTS ix_properties_country  ON properties (country);
CREATE INDEX IF NOT EXISTS ix_properties_location ON properties (location);

CREATE INDEX IF NOT EXISTS ix_blog_posts_slug ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS ix_products_slug   ON products (slug);

-- ── FTS — search_vector generated column (requires pg_trgm) ───────────────
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'experiences' AND column_name = 'search_vector'
    ) THEN
        ALTER TABLE experiences
        ADD COLUMN search_vector tsvector
        GENERATED ALWAYS AS (
            to_tsvector('english',
                coalesce(title, '') || ' ' ||
                coalesce(description, '') || ' ' ||
                coalesce(location, '') || ' ' ||
                coalesce(category, '') || ' ' ||
                coalesce(country, '')
            )
        ) STORED;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS ix_experiences_search_vector
    ON experiences USING gin (search_vector);

CREATE INDEX IF NOT EXISTS ix_experiences_title_trgm
    ON experiences USING gin (title gin_trgm_ops);

-- ── Alembic version stamp ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alembic_version (
    version_num VARCHAR(32) NOT NULL,
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

INSERT INTO alembic_version (version_num)
VALUES ('004global')
ON CONFLICT DO NOTHING;
"""

with engine.begin() as conn:
    conn.execute(text(DDL))

print("Local database schema created and stamped at migration head.")
print("Now run:  uv run python scripts/seed.py")
