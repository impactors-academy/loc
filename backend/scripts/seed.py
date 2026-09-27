"""
Idempotent seed script for local development. Mirrors what is live.
Run via: make seed   OR   uv run python -m scripts.seed
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.db.session import SessionLocal
from app.models.experience import Experience
from app.models.property import Property
from app.models.product import Product
from app.models.blog_post import BlogPost


def _upsert(db, model, slug: str, **kwargs) -> bool:
    if db.query(model).filter(model.slug == slug).first():
        return False
    db.add(model(slug=slug, **kwargs))
    return True


# No experiences are launched yet, so none are seeded: local dev should show
# what the live site shows ("coming soon"), not demo listings from countries
# LOC doesn't operate in. Add real ones here as they launch (targets: Morocco,
# France, Belgium). The earlier global demo set is in git history.
EXPERIENCES: list[dict] = []

# The org's real listings, mirrored from production (api.loctravels.com) so
# local dev shows the same inventory as the live site instead of unrelated
# global demo data. Images are the real R2-hosted first photo for each
# listing; prices/tiers/descriptions match production as of 2026-09-10.
# Re-sync by re-running the export in loc's session notes if listings change.
PROPERTIES = [
    dict(
        slug="villa-bahamas-designer-interiors-marrakech",
        type="villa",
        title="Villa Bahamas — Designer Interiors, Marrakech",
        description=(
            "A sleek, designer-finished villa built around curved bouclé sofas and a "
            "travertine coffee table, with floor-to-ceiling glass that folds open onto "
            "a lit garden, private pool, and outdoor dining terrace. Built for guests "
            "who want a five-star interior without leaving the villa."
        ),
        country="Morocco",
        location="Marrakech",
        price_min=1600.0,
        price_max=2400.0,
        currency="MAD",
        images=["https://media.loctravels.com/properties/f3375e62ab3a4399be805b50df50f29e.jpg"],
        listing_tier="premium",
    ),
    dict(
        slug="4-bedroom-villa-route-de-fes-marrakech",
        type="villa",
        title="4-Bedroom Villa — Route de Fès, Marrakech",
        description=(
            "A professionally interior-designed 4-bedroom villa with brass pendant "
            "lighting, a curated terracotta-and-cream palette, and a bedroom that "
            "opens directly onto the pool terrace through floor-to-ceiling glass."
        ),
        country="Morocco",
        location="Route de Fès, Marrakech",
        price_min=2200.0,
        price_max=3200.0,
        currency="MAD",
        images=["https://media.loctravels.com/properties/d29fc6f41aad463594c660eae36b3a77.jpg"],
        listing_tier="premium",
    ),
    dict(
        slug="villa-mima-marrakech",
        type="villa",
        title="Villa Mima — Marrakech",
        description=(
            "A group-friendly villa with a private pool, sun loungers under wide "
            "umbrellas, a table-tennis table, and a trampoline on the lawn — built "
            "for families and groups who want to stay in rather than go out."
        ),
        country="Morocco",
        location="Marrakech",
        price_min=1800.0,
        price_max=2500.0,
        currency="MAD",
        images=["https://media.loctravels.com/properties/5a90b192bdf14b7aa8a071be64114a06.jpg"],
        listing_tier="premium",
    ),
    dict(
        slug="loc-1003a-gueliz-marrakech",
        type="apartment",
        title="The Atelier Apartment, Guéliz",
        description=(
            "The most design-led of the three Guéliz units: recessed arched wall "
            "niches styled with small sculptural objects, sculptural black dining and "
            "coffee tables, and a private terracotta-tiled balcony overlooking "
            "Guéliz's pink rooftops."
        ),
        country="Morocco",
        location="Guéliz, Marrakech",
        price_min=1150.0,
        price_max=1600.0,
        currency="MAD",
        images=["https://media.loctravels.com/properties/fc9b2a94c2df447a9b0e0a4acf8b6149.jpg"],
        listing_tier="featured",
    ),
    dict(
        slug="villa-emna-marrakech",
        type="villa",
        title="Villa Emna — Marrakech",
        description=(
            "A sleek, minimalist two-story villa in ochre-render with a covered "
            "carport and tall palms, set on a quiet residential street in a gated "
            "modern development."
        ),
        country="Morocco",
        location="Marrakech",
        price_min=1400.0,
        price_max=2000.0,
        currency="MAD",
        images=["https://media.loctravels.com/properties/83390b0824d14676863c74fb52fe600d.jpg"],
        listing_tier="featured",
    ),
    dict(
        slug="villa-gina-marrakech",
        type="villa",
        title="Villa Gina — Marrakech",
        description=(
            "A well-equipped modern villa with a full kitchen — gas hob, built-in "
            "oven, dishwasher and washing machine — plus a private rooftop terrace "
            "with sun loungers and Moroccan-style lounge seating for evenings above "
            "the rooftops."
        ),
        country="Morocco",
        location="Marrakech",
        price_min=1200.0,
        price_max=1700.0,
        currency="MAD",
        images=["https://media.loctravels.com/properties/38bd4ec5a84641698e9460fb629f7f9c.jpg"],
        listing_tier="featured",
    ),
    dict(
        slug="villa-kais-marrakech",
        type="villa",
        title="Villa Kais — Marrakech",
        description=(
            "A boutique villa with a standout feature: twin bamboo-framed cabana "
            "daybeds, curtained in white linen, set in a private bamboo-screened "
            "courtyard — a quiet, design-forward outdoor lounge."
        ),
        country="Morocco",
        location="Marrakech",
        price_min=1400.0,
        price_max=2000.0,
        currency="MAD",
        images=["https://media.loctravels.com/properties/529e086598d54a03a66406241255755f.jpg"],
        listing_tier="featured",
    ),
    dict(
        slug="loc-1002a-gueliz-marrakech",
        type="apartment",
        title="The Cobalt & Gold Apartment, Guéliz",
        description=(
            "The boldest apartment in Guéliz: a full living room in royal-blue velvet "
            "sofas and armchairs with gold-and-navy accents, gilded coral-branch wall "
            "art, and an ornate gold coffered ceiling over a formal dining table."
        ),
        country="Morocco",
        location="Guéliz, Marrakech",
        price_min=1100.0,
        price_max=1600.0,
        currency="MAD",
        images=["https://media.loctravels.com/properties/a8b0a589da08423bab12e9925ee8d946.jpg"],
        listing_tier="featured",
    ),
    dict(
        slug="villa-dalia-marrakech",
        type="villa",
        title="Villa Dalia — Marrakech",
        description=(
            "A family-friendly villa built around a large private garden — full-size "
            "trampoline, a table-tennis table, and mature palms behind a "
            "bougainvillea-covered privacy wall."
        ),
        country="Morocco",
        location="Marrakech",
        price_min=1300.0,
        price_max=1900.0,
        currency="MAD",
        images=["https://media.loctravels.com/properties/55f9ea0d328b4ceb82a4e2f6eed18eab.jpg"],
        listing_tier="featured",
    ),
    dict(
        slug="loc-1001a-gueliz-marrakech",
        type="apartment",
        title="The Cove-Lit Apartment, Guéliz",
        description=(
            "Every room is trimmed in the same continuous warm-amber cove lighting "
            "recessed into the ceiling edge, giving the whole apartment one "
            "consistent, calm glow — a quiet, well-lit modern base in Marrakech's "
            "upscale Guéliz district."
        ),
        country="Morocco",
        location="Guéliz, Marrakech",
        price_min=900.0,
        price_max=1300.0,
        currency="MAD",
        images=["https://media.loctravels.com/properties/09e2d8ab38b9428fa2f7e6874d9fb7c1.jpg"],
        listing_tier="standard",
    ),
    dict(
        slug="villa-perle-rouge-private-pool-terrace-marrakech",
        type="villa",
        title="Villa Perle Rouge — Private Pool & Terrace, Marrakech",
        description=(
            "A striking modern villa wrapped in warm ochre render, built around a "
            "private infinity-edge pool lit for evening swims. Floor-to-ceiling glass "
            "doors open the bedrooms and lounge straight onto the terrace."
        ),
        country="Morocco",
        location="Marrakech",
        price_min=1000.0,
        price_max=1700.0,
        currency="MAD",
        images=["https://media.loctravels.com/properties/9a55ddeb36564d8d8a57ab2550a6e1e9.jpg"],
        listing_tier="standard",
    ),
    dict(
        slug="modern-2br-apartment-doha-val-fleurie-tangier",
        type="apartment",
        title="Modern 2BR Apartment — Doha Val Fleurie, Tangier",
        description=(
            "A clean, modern 2-bedroom apartment on a high floor of the Doha Val "
            "Fleurie residence, with a fully equipped kitchen and bright living space."
        ),
        country="Morocco",
        location="Doha Val Fleurie, Tangier",
        price_min=700.0,
        price_max=1000.0,
        currency="MAD",
        images=["https://media.loctravels.com/properties/3eb256e0d6834c42aa9892f9bc6c18bf.jpg"],
        listing_tier="standard",
    ),
]

# No travel guides or digital products are launched yet; see EXPERIENCES above.
PRODUCTS: list[dict] = []

# No blog posts are published yet, so none are seeded; the blog shows "coming
# soon" locally just as it does on the live site. The earlier demo articles
# (non-target destinations) are in git history.
BLOG_POSTS: list[dict] = []


def run():
    db = SessionLocal()
    try:
        print("Seeding experiences...")
        for exp in EXPERIENCES:
            _upsert(db, Experience, exp["slug"], **{k: v for k, v in exp.items() if k != "slug"})
        db.commit()
        print(f"  {len(EXPERIENCES)} experiences ready")

        print("Seeding properties...")
        for prop in PROPERTIES:
            _upsert(db, Property, prop["slug"], **{k: v for k, v in prop.items() if k != "slug"})
        db.commit()
        print(f"  {len(PROPERTIES)} properties ready")

        print("Seeding products...")
        for prod in PRODUCTS:
            _upsert(db, Product, prod["slug"], **{k: v for k, v in prod.items() if k != "slug"})
        db.commit()
        print(f"  {len(PRODUCTS)} products ready")

        print("Seeding blog posts...")
        for post in BLOG_POSTS:
            _upsert(db, BlogPost, post["slug"], **{k: v for k, v in post.items() if k != "slug"})
        db.commit()
        print(f"  {len(BLOG_POSTS)} blog posts ready")

        from app.config import settings
        if settings.embeddings_enabled:
            print("Generating embeddings...")
            from app.core.embeddings import embed, experience_text, blog_text
            exps = db.query(Experience).filter(Experience.embedding.is_(None)).all()
            for e in exps:
                e.embedding = embed(experience_text(e.title, e.description, e.location, e.category))
            db.commit()
            print(f"  Embedded {len(exps)} experiences")
            posts = db.query(BlogPost).filter(BlogPost.embedding.is_(None)).all()
            for p in posts:
                p.embedding = embed(blog_text(p.title, p.excerpt, p.content))
            db.commit()
            print(f"  Embedded {len(posts)} blog posts")
        else:
            print("Skipping embeddings (OPENAI_API_KEY not set)")

        print("\nSeed complete.")
    finally:
        db.close()


if __name__ == "__main__":
    run()
