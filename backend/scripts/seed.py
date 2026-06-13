"""
Idempotent seed script for local development.
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

# ── helpers ─────────────────────────────────────────────────────────────────

def _embed_text(text: str) -> list[float] | None:
    try:
        from app.core.embeddings import embed
        return embed(text)
    except Exception:
        return None


def _upsert(db, model, slug: str, **kwargs) -> bool:
    """Return True if a new row was inserted, False if it already existed."""
    if db.query(model).filter(model.slug == slug).first():
        return False
    db.add(model(slug=slug, **kwargs))
    return True


# ── seed data ────────────────────────────────────────────────────────────────

EXPERIENCES = [
    dict(
        slug="desert-sunrise-merzouga",
        title="Desert Sunrise Camel Trek — Merzouga",
        description=(
            "Wake before dawn in Erg Chebbi, mount a camel at the foot of the dunes, "
            "and watch the Sahara ignite in gold. Includes traditional Berber breakfast "
            "in a nomadic tent and a short sandboarding session."
        ),
        category="adventure",
        location="Merzouga, Drâa-Tafilalet",
        duration="Half-day (5 hours)",
        price_min=65.0,
        price_max=95.0,
        images=["https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200"],
        is_featured=True,
        provider_contact="hassan.desert@example.com",
    ),
    dict(
        slug="hammam-ritual-fes",
        title="Authentic Hammam Ritual — Medina of Fès",
        description=(
            "Surrender to a centuries-old cleansing ceremony in a traditional hammam "
            "inside the Fès el-Bali medina. Includes black soap scrub, ghassoul clay mask, "
            "and mint tea served afterward in a private cooling room."
        ),
        category="wellness",
        location="Fès, Fès-Meknès",
        duration="2 hours",
        price_min=40.0,
        price_max=70.0,
        images=["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200"],
        is_featured=False,
        provider_contact="riad.hammam@example.com",
    ),
    dict(
        slug="pottery-workshop-safi",
        title="Master Pottery Workshop — Safi",
        description=(
            "Safi is Morocco's ceramics capital. Spend a morning at a fourth-generation "
            "pottery studio, throw your own bowl on a foot-driven wheel, and glaze it "
            "with traditional cobalt blue motifs. Fire-and-ship included."
        ),
        category="culture",
        location="Safi, Marrakech-Safi",
        duration="3 hours",
        price_min=55.0,
        price_max=55.0,
        images=["https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200"],
        is_featured=False,
        provider_contact="crafts.safi@example.com",
    ),
    dict(
        slug="surf-lesson-taghazout",
        title="Beginner Surf Lesson — Taghazout",
        description=(
            "Taghazout's consistent Atlantic swells make it West Africa's surf mecca. "
            "Our ISA-certified instructors take you from dry-land basics to riding your "
            "first wave in a single 2-hour session. Boards and rash guards included."
        ),
        category="adventure",
        location="Taghazout, Souss-Massa",
        duration="2 hours",
        price_min=35.0,
        price_max=50.0,
        images=["https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200"],
        is_featured=True,
        provider_contact="surf.taghazout@example.com",
    ),
    dict(
        slug="cooking-class-marrakech",
        title="Moroccan Cooking Class — Marrakech Medina",
        description=(
            "Shop the souks with a local chef, then cook a full Moroccan feast: "
            "bastilla, lamb tagine with prunes, and pastilla au lait. "
            "Held in a riad kitchen. Dietary adaptations available."
        ),
        category="culinary",
        location="Marrakech, Marrakech-Safi",
        duration="4 hours",
        price_min=70.0,
        price_max=90.0,
        images=["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200"],
        is_featured=True,
        provider_contact="riad.kitchen@example.com",
    ),
    dict(
        slug="atlas-mountains-hike",
        title="High Atlas Day Hike — Imlil Valley",
        description=(
            "Trek through walnut orchards and terraced Berber villages on the slopes "
            "of Jbel Toubkal. Guided 15 km loop starting from Imlil village. "
            "Mule luggage transfer available."
        ),
        category="adventure",
        location="Imlil, Marrakech-Safi",
        duration="Full day (8 hours)",
        price_min=45.0,
        price_max=80.0,
        images=["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200"],
        is_featured=False,
        provider_contact="atlas.guides@example.com",
    ),
]

PROPERTIES = [
    dict(
        slug="riad-zouak-marrakech",
        type="riad",
        title="Riad Zouak — Hidden Gem in Marrakech Medina",
        description=(
            "Seven rooms arranged around a central courtyard fountain, each adorned "
            "with hand-painted zellij tilework. Rooftop terrace with Atlas views, "
            "daily hammam access, and a candlelit dinner option on request."
        ),
        location="Marrakech Medina, Marrakech-Safi",
        price_min=120.0,
        price_max=220.0,
        images=["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200"],
        listing_tier="featured",
        owner_contact="riad.zouak@example.com",
    ),
    dict(
        slug="dar-atlas-imlil",
        type="gite",
        title="Dar Atlas — Mountain Gîte, Imlil",
        description=(
            "Stone-built gîte at 1740 m with panoramic Atlas views. "
            "Wood-burning stove in every room, organic breakfast sourced from the valley, "
            "and a knowledgeable host who doubles as a mountain guide."
        ),
        location="Imlil, Marrakech-Safi",
        price_min=60.0,
        price_max=90.0,
        images=["https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200"],
        listing_tier="standard",
        owner_contact="dar.atlas@example.com",
    ),
    dict(
        slug="villa-bleue-chefchaouen",
        type="villa",
        title="Villa Bleue — Chefchaouen Hillside Retreat",
        description=(
            "Perched above the blue city with a terrace that overlooks the medina, "
            "this five-bedroom villa blends Andalusian architecture with Rif Mountain "
            "cool. Private pool, wood-fired oven, and forested garden."
        ),
        location="Chefchaouen, Tanger-Tétouan-Al Hoceïma",
        price_min=200.0,
        price_max=350.0,
        images=["https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200"],
        listing_tier="premium",
        owner_contact="villa.bleue@example.com",
    ),
    dict(
        slug="bivouac-sahara-merzouga",
        type="bivouac",
        title="Luxury Bivouac — Erg Chebbi Dunes",
        description=(
            "Spend a night in Bedouin-style caidal tents on a private dune plateau. "
            "En-suite facilities, solar-powered lighting, Berber music around the fire, "
            "and a 4x4 transfer from Merzouga village."
        ),
        location="Merzouga, Drâa-Tafilalet",
        price_min=150.0,
        price_max=250.0,
        images=["https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200"],
        listing_tier="featured",
        owner_contact="bivouac.sahara@example.com",
    ),
]

PRODUCTS = [
    dict(
        slug="morocco-travel-guide-2025",
        title="LOC Morocco Travel Guide 2025",
        description=(
            "124-page curated PDF covering all 12 regions: best experiences, "
            "hidden riads, transport hacks, Arabic/Tamazight phrasebook, and "
            "offline-friendly maps."
        ),
        type="guide",
        price=12.0,
        image_url="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
        purchase_url="https://shop.loctravels.com/morocco-guide-2025",
    ),
    dict(
        slug="atlas-adventures-pack",
        title="Atlas Adventures Starter Pack",
        description=(
            "Printable itinerary cards for 7-day High Atlas and Sahara loop: "
            "daily distances, waypoints, gîte contacts, and altitude profiles. "
            "GPX files included."
        ),
        type="itinerary",
        price=8.0,
        image_url="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        purchase_url="https://shop.loctravels.com/atlas-pack",
    ),
    dict(
        slug="moroccan-spice-masterclass",
        title="Moroccan Spice Masterclass — Video Course",
        description=(
            "6 short-form videos (total 90 min) taught by Marrakech chef Fatima Ouhssain: "
            "ras el hanout from scratch, preserved lemons, chermoula, and three tagines."
        ),
        type="course",
        price=24.0,
        image_url="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
        purchase_url="https://shop.loctravels.com/spice-masterclass",
    ),
]

BLOG_POSTS = [
    dict(
        slug="best-time-to-visit-morocco",
        title="Best Time to Visit Morocco: A Month-by-Month Guide",
        excerpt=(
            "From snow-capped Atlas skiing in January to September harvest festivals, "
            "Morocco rewards visitors year-round — if you know which region to target."
        ),
        content="""<h2>Spring (March–May)</h2>
<p>The most universally pleasant season. Wildflowers blanket the High Atlas, temperatures in Marrakech hover around 22 °C, and the Sahara hasn't yet hit peak summer heat. Book riad stays early — demand is highest in April.</p>

<h2>Summer (June–August)</h2>
<p>Head north. Chefchaouen stays cool at altitude, and the Atlantic coast from Agadir to Essaouira benefits from the trade-wind effect — Essaouira's nickname is "Wind City of Africa" for good reason. Avoid interior cities in July; Marrakech can exceed 40 °C.</p>

<h2>Autumn (September–November)</h2>
<p>Date harvest in the Drâa Valley, rose harvest in Kelaat M'Gouna (actually May), and the Fès Sacred Music Festival. Ideal desert temperatures (day 28 °C, night 12 °C).</p>

<h2>Winter (December–February)</h2>
<p>Oukaïmeden ski resort opens above Marrakech. Imperial cities (Fès, Meknès, Rabat) are uncrowded and crisp. The Sahara sees its only rain in January — a rare, ethereal spectacle.</p>""",
        image_url="https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200",
        tags="planning,seasons,regions",
    ),
    dict(
        slug="moroccan-street-food-guide",
        title="Moroccan Street Food: 12 Dishes You Must Try",
        excerpt=(
            "Morocco's streets are its best restaurant. Here's what to order, "
            "where to find it, and how to eat it without scalding your chin on a sfenj."
        ),
        content="""<h2>1. Msemen</h2>
<p>Square, flaky flatbread cooked on a griddle. Best eaten at breakfast, drizzled with argan oil and honey. Find it at any neighbourhood café from 07:00.</p>

<h2>2. Harira</h2>
<p>The national soup — tomato, lentils, chickpeas, coriander, and a squeeze of lemon. Served to break the fast during Ramadan and, thankfully, year-round everywhere else.</p>

<h2>3. Briouat</h2>
<p>Crispy filo parcels filled with either spiced kefta and egg, or almond paste with cinnamon and icing sugar. The sweet version is an acquired addiction.</p>

<h2>4. Merguez</h2>
<p>Thin beef-and-lamb sausages grilled over charcoal. Order a handful stuffed into a quarter-baguette with harissa and cumin-salted tomatoes.</p>

<h2>5. Sfenj</h2>
<p>Moroccan doughnuts: ring-shaped, chewy, unsweetened. Sold hot from street vendors at dawn, threaded onto a rush-grass string. Dip in sugar or honey.</p>""",
        image_url="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200",
        tags="food,culture,marrakech,fes",
    ),
]


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

        # Optionally generate embeddings
        from app.config import settings
        if settings.embeddings_enabled:
            print("Generating embeddings (OPENAI_API_KEY is set)...")
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
