"""
Idempotent seed script for local development — global destinations.
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


EXPERIENCES = [
    # ── Japan ──────────────────────────────────────────────────────────────
    dict(
        slug="kyoto-tea-ceremony",
        title="Traditional Tea Ceremony — Kyoto",
        description=(
            "Step inside a 200-year-old machiya townhouse in Higashiyama and learn "
            "the art of chado from a certified tea master. Matcha whisking, wagashi "
            "sweets, and the meditative silence of a tatami room included."
        ),
        category="culture",
        country="Japan",
        location="Higashiyama, Kyoto",
        duration="1.5 hours",
        price_min=45.0,
        price_max=65.0,
        images=["https://images.unsplash.com/photo-1568393691622-c7ba131d1b16?w=1200"],
        is_featured=True,
        provider_contact="kyototeahouse@example.com",
    ),
    dict(
        slug="tokyo-street-food-tour",
        title="Tokyo Street Food Night Tour — Shinjuku",
        description=(
            "Navigate the izakayas, yakitori alleys, and ramen counters of Shinjuku "
            "with a local food journalist. Eight stops, eight tastings. "
            "Covers tonkotsu, takoyaki, gyoza, and sake pairing."
        ),
        category="culinary",
        country="Japan",
        location="Shinjuku, Tokyo",
        duration="3 hours",
        price_min=70.0,
        price_max=90.0,
        images=["https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200"],
        is_featured=False,
        provider_contact="tokyofoodtours@example.com",
    ),
    # ── France ─────────────────────────────────────────────────────────────
    dict(
        slug="bordeaux-wine-tasting",
        title="Grand Cru Wine Tasting — Bordeaux",
        description=(
            "Tour three classified châteaux on the Left Bank, meet the winemakers, "
            "and taste six vintages from 2015–2022. Includes a cellar visit, cheese "
            "pairings, and a bottle of your favourite to take home."
        ),
        category="culinary",
        country="France",
        location="Médoc, Bordeaux",
        duration="Full day",
        price_min=120.0,
        price_max=180.0,
        images=["https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200"],
        is_featured=True,
        provider_contact="bordeauxwineclub@example.com",
    ),
    dict(
        slug="provence-lavender-cycling",
        title="Lavender Fields Cycling Tour — Provence",
        description=(
            "Glide through blooming lavender rows between Valensole and Manosque "
            "on a curated 40 km route with an e-bike option. Includes a stop at a "
            "family-run distillery and a Provençal picnic lunch."
        ),
        category="adventure",
        country="France",
        location="Valensole, Provence",
        duration="Full day",
        price_min=85.0,
        price_max=110.0,
        images=["https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200"],
        is_featured=False,
        provider_contact="provencecycles@example.com",
    ),
    # ── UK ─────────────────────────────────────────────────────────────────
    dict(
        slug="scottish-highlands-hike",
        title="Scottish Highlands Trek — Ben Nevis Foothills",
        description=(
            "A guided 18 km circular walk through ancient Caledonian pine forest, "
            "past lochs, and up to the shoulder of Britain's highest mountain. "
            "Waterproofs, packed lunch, and whisky dram at the summit provided."
        ),
        category="adventure",
        country="United Kingdom",
        location="Fort William, Scottish Highlands",
        duration="Full day (9 hours)",
        price_min=60.0,
        price_max=85.0,
        images=["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200"],
        is_featured=True,
        provider_contact="highlandtrekkers@example.com",
    ),
    # ── Belgium ────────────────────────────────────────────────────────────
    dict(
        slug="bruges-chocolate-workshop",
        title="Artisan Chocolate Workshop — Bruges",
        description=(
            "Join a fourth-generation chocolatier in a medieval guildhall. "
            "Temper couverture, hand-pipe pralines, and leave with a 500 g box "
            "of your own creations. Belgian beer pairing included."
        ),
        category="culinary",
        country="Belgium",
        location="Bruges, West Flanders",
        duration="2.5 hours",
        price_min=55.0,
        price_max=75.0,
        images=["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200"],
        is_featured=False,
        provider_contact="brugescacao@example.com",
    ),
    # ── Bali ───────────────────────────────────────────────────────────────
    dict(
        slug="bali-sunrise-volcano-trek",
        title="Sunrise Volcano Trek — Mount Batur",
        description=(
            "Start at 2 am, reach the 1717 m crater rim just as dawn breaks over "
            "the caldera lake and Mount Agung. Breakfast cooked in volcanic steam, "
            "and a 4x4 transfer back through jungle villages."
        ),
        category="adventure",
        country="Indonesia",
        location="Kintamani, Bali",
        duration="7 hours",
        price_min=45.0,
        price_max=65.0,
        images=["https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200"],
        is_featured=True,
        provider_contact="baturtreks@example.com",
    ),
    # ── Morocco ────────────────────────────────────────────────────────────
    dict(
        slug="desert-sunrise-merzouga",
        title="Desert Sunrise Camel Trek — Merzouga",
        description=(
            "Wake before dawn in Erg Chebbi, mount a camel at the foot of the dunes, "
            "and watch the Sahara ignite in gold. Includes traditional Berber breakfast "
            "in a nomadic tent and a short sandboarding session."
        ),
        category="adventure",
        country="Morocco",
        location="Merzouga, Drâa-Tafilalet",
        duration="Half-day (5 hours)",
        price_min=65.0,
        price_max=95.0,
        images=["https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200"],
        is_featured=False,
        provider_contact="hassan.desert@example.com",
    ),
    # ── Greece ─────────────────────────────────────────────────────────────
    dict(
        slug="santorini-sailing-sunset",
        title="Catamaran Sunset Sail — Santorini",
        description=(
            "Board a 12-metre catamaran in Vlychada and sail to the hot springs at "
            "Palea Kameni, snorkel above the volcanic reef, and anchor off Oia "
            "for the world-famous sunset. BBQ dinner and open bar included."
        ),
        category="water",
        country="Greece",
        location="Oia, Santorini",
        duration="5 hours",
        price_min=110.0,
        price_max=150.0,
        images=["https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200"],
        is_featured=True,
        provider_contact="santorinicatamarans@example.com",
    ),
    # ── Italy ──────────────────────────────────────────────────────────────
    dict(
        slug="tuscany-cooking-class",
        title="Tuscan Farmhouse Cooking Class — Siena",
        description=(
            "Learn to make fresh pici pasta, wild boar ragù, and tiramisu from "
            "a Nonna in her 14th-century farmhouse kitchen. Followed by a long "
            "table lunch in the olive grove with Brunello di Montalcino."
        ),
        category="culinary",
        country="Italy",
        location="Chianti, Siena Province",
        duration="4 hours",
        price_min=95.0,
        price_max=130.0,
        images=["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200"],
        is_featured=True,
        provider_contact="casatoscana@example.com",
    ),
]

PROPERTIES = [
    # ── France ─────────────────────────────────────────────────────────────
    dict(
        slug="paris-marais-apartment",
        type="apartment",
        title="Le Marais Pied-à-Terre — Paris 4e",
        description=(
            "A 65 m² Haussmann apartment on Rue de Bretagne, two blocks from "
            "the covered market. Original parquet floors, exposed beams, and a "
            "cast-iron balcony overlooking an interior courtyard."
        ),
        country="France",
        location="Le Marais, Paris",
        price_min=180.0,
        price_max=280.0,
        images=["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200"],
        listing_tier="featured",
        owner_contact="lemarais.stays@example.com",
    ),
    dict(
        slug="provence-mas-villa",
        type="villa",
        title="Mas Provençal — Luberon Valley",
        description=(
            "An 18th-century stone mas (farmhouse) with a 12-metre pool, lavender "
            "terraces, and views to the Luberon ridge. Sleeps 8; private chef "
            "available. Ideal May–July for the bloom."
        ),
        country="France",
        location="Lourmarin, Luberon, Provence",
        price_min=450.0,
        price_max=750.0,
        images=["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200"],
        listing_tier="premium",
        owner_contact="luberon.villas@example.com",
    ),
    # ── UK ─────────────────────────────────────────────────────────────────
    dict(
        slug="cotswolds-farmhouse",
        type="gite",
        title="The Old Woolstore — Cotswolds",
        description=(
            "A converted 17th-century wool merchant's house in the village of "
            "Bourton-on-the-Water. Inglenook fireplace, garden with hot tub, "
            "and four bedrooms sleeping up to seven."
        ),
        country="United Kingdom",
        location="Bourton-on-the-Water, Gloucestershire",
        price_min=250.0,
        price_max=420.0,
        images=["https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200"],
        listing_tier="featured",
        owner_contact="cotswolds.stays@example.com",
    ),
    # ── Japan ──────────────────────────────────────────────────────────────
    dict(
        slug="kyoto-ryokan-higashiyama",
        type="ryokan",
        title="Ryokan Kiyomizu — Higashiyama, Kyoto",
        description=(
            "A family-run ryokan on the stone-paved Ninenzaka lane. Eight rooms with "
            "futon beds, yukata robes, and private hinoki wood baths. "
            "Kaiseki dinner and matcha breakfast included."
        ),
        country="Japan",
        location="Higashiyama, Kyoto",
        price_min=220.0,
        price_max=380.0,
        images=["https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200"],
        listing_tier="premium",
        owner_contact="kiyomizu.ryokan@example.com",
    ),
    # ── Bali ───────────────────────────────────────────────────────────────
    dict(
        slug="ubud-jungle-villa",
        type="villa",
        title="Jungle Edge Villa — Ubud, Bali",
        description=(
            "A three-bedroom villa cantilevered over a river gorge in Penestanan. "
            "Infinity pool that merges with the rice-terrace horizon, open-air "
            "dining pavilion, and a private spa gazebo."
        ),
        country="Indonesia",
        location="Penestanan, Ubud, Bali",
        price_min=280.0,
        price_max=450.0,
        images=["https://images.unsplash.com/photo-1613490493576-4196e2f1a788?w=1200"],
        listing_tier="featured",
        owner_contact="ubudjungle.villas@example.com",
    ),
    # ── Morocco ────────────────────────────────────────────────────────────
    dict(
        slug="riad-zouak-marrakech",
        type="riad",
        title="Riad Zouak — Hidden Gem in Marrakech Medina",
        description=(
            "Seven rooms arranged around a central courtyard fountain, each adorned "
            "with hand-painted zellij tilework. Rooftop terrace with Atlas views, "
            "daily hammam access, and a candlelit dinner option on request."
        ),
        country="Morocco",
        location="Marrakech Medina",
        price_min=120.0,
        price_max=220.0,
        images=["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200"],
        listing_tier="featured",
        owner_contact="riad.zouak@example.com",
    ),
]

PRODUCTS = [
    dict(
        slug="world-traveler-bundle",
        title="World Traveler's Digital Bundle",
        description=(
            "Six destination PDF guides (Japan, France, Morocco, Bali, Greece, UK), "
            "68 pages each: top experiences, curated stays, transport tips, "
            "language cheat sheets, and offline-friendly maps."
        ),
        type="guide",
        price=29.0,
        image_url="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800",
        purchase_url="https://shop.loctravels.com/world-traveler-bundle",
    ),
    dict(
        slug="europe-hidden-gems-pack",
        title="Europe Hidden Gems Itinerary Pack",
        description=(
            "Printable itinerary cards for six under-the-radar European routes: "
            "Faroe Islands, Albanian Riviera, Slovenia's Soča Valley, "
            "Azores, Transylvania, and the Lofoten Islands. GPX files included."
        ),
        type="itinerary",
        price=12.0,
        image_url="https://images.unsplash.com/photo-1519677584237-752f8853252e?w=800",
        purchase_url="https://shop.loctravels.com/europe-hidden-gems",
    ),
    dict(
        slug="asia-pacific-masterclass",
        title="Asia Pacific Travel Masterclass — Video Course",
        description=(
            "8 short-form videos (total 2 hrs) covering Japan, Bali, Vietnam, and "
            "Thailand: when to go, where to stay, what to eat, and how to get "
            "off the tourist trail. Lifetime access."
        ),
        type="course",
        price=34.0,
        image_url="https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800",
        purchase_url="https://shop.loctravels.com/asia-pacific-masterclass",
    ),
]

BLOG_POSTS = [
    dict(
        slug="hidden-destinations-2026",
        title="10 Off-the-Beaten-Path Destinations for 2026",
        excerpt=(
            "From Albania's turquoise coast to Kyushu's onsen towns, these ten "
            "destinations offer the experiences travellers crave — without the crowds."
        ),
        content="""<h2>1. Faroe Islands, Denmark</h2>
<p>Dramatic sea cliffs, grass-roofed villages, and a total of zero traffic lights. The Faroes top every 'hidden gem' list for a reason: they are genuinely spectacular and still genuinely quiet. Fly direct from Copenhagen or Edinburgh.</p>

<h2>2. Puglia, Italy</h2>
<p>While crowds flood the Amalfi Coast, southern Puglia offers whitewashed hill towns, olive groves over 2,000 years old, and seafood so fresh it barely left the Adriatic before reaching your plate. Base yourself in Ostuni or Lecce.</p>

<h2>3. Kyushu, Japan</h2>
<p>Japan's southernmost main island gets a fraction of Kyoto's visitors but packs in volcanic hot springs, samurai castle towns, ramen culture (Fukuoka originated hakata-style tonkotsu), and world-class ceramics in Arita.</p>

<h2>4. Albanian Riviera</h2>
<p>Pristine Ionian beaches, Ottoman-era villages perched on cliffs, and meal prices that feel like 2005. Himara and Dhermi are the anchor towns; the drive along the coast road is one of Europe's great road trips.</p>

<h2>5. Soča Valley, Slovenia</h2>
<p>The Soča River runs an impossible turquoise through Julian Alps forest. Kayak it, hike above it, or simply sit beside it. Kobarid village has a Michelin-starred restaurant and a museum about World War I that will stay with you.</p>

<h2>6. Jericoacoara, Brazil</h2>
<p>No paved roads, no traffic — just dune lakes, kite-surfers, and the best caipirinhas on the planet, served at sunset from a sandbar. Accessible only by 4WD from Fortaleza.</p>

<h2>7. Azores, Portugal</h2>
<p>Mid-Atlantic volcanic islands with crater lakes, thermal spas, and landscapes that shift from lunar to lush within a kilometre. São Miguel is the entry point; Flores is the reward for those who go further.</p>

<h2>8. Draa-Tafilalet, Morocco</h2>
<p>Beyond Marrakech's medina, the Drâa Valley unfolds into a 200 km ribbon of palmeries, kasbahs, and desert. Zagora and Mhamid are quieter alternatives to Merzouga for reaching the dunes.</p>

<h2>9. Gjirokastra, Albania</h2>
<p>A UNESCO-listed Ottoman city of grey-stone mansions cascading down a hillside, topped by a 12th-century castle. Birthplace of novelist Ismail Kadare. Completely undervisited.</p>

<h2>10. Lofoten, Norway</h2>
<p>Red fishermen's cabins reflected in still fjords, with the Northern Lights overhead from October to March and the midnight sun blazing in July. Book your rorbuer (fishing cabin) at least six months ahead.</p>""",
        image_url="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200",
        tags="destinations,2026,europe,asia,hidden-gems",
    ),
    dict(
        slug="tokyo-street-food-guide",
        title="Tokyo Street Food: Your Complete First-Timer's Guide",
        excerpt=(
            "Navigating Tokyo's food scene for the first time is overwhelming "
            "— in the best possible way. Here is where to start."
        ),
        content="""<h2>The Golden Rule</h2>
<p>Follow the salarymen. If there's a line of suited office workers at 1 pm, the food is excellent and the price is fair. This rule works 99% of the time in Tokyo.</p>

<h2>Tsukiji Outer Market (Breakfast)</h2>
<p>The inner wholesale market moved to Toyosu, but the outer market's tiny shops are still the best place in the world to eat grilled tamagoyaki, sashimi on rice, and fresh uni (sea urchin) at 8 am. Get there before 10.</p>

<h2>Yurakucho Under the Tracks (Lunch)</h2>
<p>The warren of izakayas and ramen counters under the Yamanote Line tracks between Yurakucho and Shinbashi stations is a time-warp to 1970s Tokyo. Yakitori grilled over binchōtan charcoal, cold Sapporo, no English menu needed — just point.</p>

<h2>Asakusa (Afternoon Snacking)</h2>
<p>Nakamise-dori leads to Senso-ji, and the side streets surrounding it are lined with vendors selling ningyo-yaki (little sponge cakes in temple shapes), ningyo-yaki, and mochi pounded to order. The melonpan (sweet bread) shops here are the best in the city.</p>

<h2>Shinjuku Golden Gai (Night)</h2>
<p>Six narrow alleys, 200 bars, most seating eight people maximum. No cover charge if you go before 9 pm. Order highball whisky and whatever the chef is making that night. Each bar has a theme: jazz, horror films, baseball, 90s J-pop.</p>

<h2>Practical Notes</h2>
<p>Cash is still king in most street-food spots. Budget ¥3,000–5,000 (€18–30) for a full day of snacking. The Tokyo Metro day pass (¥800) puts all of this within reach.</p>""",
        image_url="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200",
        tags="japan,tokyo,food,culture,asia",
    ),
    dict(
        slug="morocco-vs-bali-comparison",
        title="Morocco or Bali? How to Choose Your Next Adventure",
        excerpt=(
            "Both deliver ancient culture, jaw-dropping scenery, and extraordinary food "
            "for a fraction of European prices. But they are very different journeys."
        ),
        content="""<h2>For Culture Depth: Morocco</h2>
<p>Few places on earth compact so much history into a medina walk. Fès el-Bali is a living medieval city — the tanners, the brass-beaters, the Quranic schools — unchanged in structure for 900 years. Bali has extraordinary Hindu temple culture, but the scale and density of Morocco's imperial cities is in a class of its own.</p>

<h2>For Nature & Landscapes: Both (Different)</h2>
<p>Morocco offers three distinct biomes within a day's drive: Atlantic coast, High Atlas peaks (skiing December–March), and Sahara desert. Bali's canvas is narrower but no less dramatic: volcanic peaks, terraced rice paddies, black-sand beaches, and jungle river gorges. If you want diversity of terrain, Morocco wins by area. If you want a single island where everything is within two hours, Bali is unbeatable.</p>

<h2>For Food: Morocco</h2>
<p>Moroccan cuisine is one of the great under-celebrated food cultures — tagine, bastilla, couscous, pastilla au lait, preserved lemons, argan oil. Bali's food scene is excellent but leans heavily toward tourist-facing warungs serving nasi goreng and mie goreng. For genuine depth, Morocco.</p>

<h2>For Wellness & Spiritual Reset: Bali</h2>
<p>Ubud is the global capital of yoga retreats, sound baths, and holistic healing — for better or worse. Morocco has hammams, which are magnificent, but Bali built an entire industry around slowing down. If a retreat is the goal, Bali wins.</p>

<h2>For Budget: Bali (Slightly)</h2>
<p>Both destinations are good value versus Europe. Bali edges ahead for mid-budget travellers: excellent villas with pools for €80–120/night and restaurant meals for €4–8. Morocco is close behind, especially outside Marrakech.</p>

<h2>Verdict</h2>
<p>Go to Morocco if: you want history, medinas, Sahara, and the Atlantic. Go to Bali if: you want nature, spirituality, surf, and temple culture on a compact island. Go to both if you can — they are utterly different and both exceptional.</p>""",
        image_url="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1200",
        tags="morocco,bali,indonesia,planning,comparison",
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
