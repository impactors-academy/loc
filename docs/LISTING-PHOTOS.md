# Listing photos — curation guideline

Applies when adding or reviewing a stay or experience listing's photos in
`/admin/properties` or `/admin/experiences`. A rule for the person curating
photos, not something the app enforces — a machine can't reliably tell "same
room, useful new angle" from "same room, near-identical repeat."

**The problem this addresses:** listings ranged from 8 to 79 photos with no
consistent logic to the count. A host hands over everything on their phone;
without a pass to select from it, a viewer scrolling the gallery hits several
near-identical shots of the same room in a row and it reads as broken. The
2026-09-28 feedback also had a real bug behind it: byte-identical re-uploads
(8 each on two Guéliz apartments), now blocked in code, see the last section.

## The rule

One photo per distinct space. Add a second photo of the same space only if it
shows something the first one doesn't:

- A different room, area or feature (bedroom 2, the pool, the view, the
  entrance) — always its own photo.
- A second angle of the *same* space only when it adds real information: the
  first shot is wide, the second is a close-up of a feature worth showing
  (a fireplace, a view through a specific window, a detail finish). Two wide
  shots of the same room from two feet apart are the same photo twice.
- Never keep a photo that's near-identical to one already kept, even if the
  file itself is different (slightly different crop, same framing, a few
  seconds apart in a phone burst).

## Target count

A guide, not a hard cap. Let the property's actual size and features decide,
but treat a count near the top of these ranges as a prompt to double check for
near-duplicates before publishing. Airbnb allows up to about 100 photos, but the
common recommendation is 20–30; past that, more photos don't help:

| Property size | Target |
|---|---|
| Studio / 1-bedroom apartment | 10–15 |
| 2–3 bedroom villa or apartment | 15–25 |
| Large villa (4+ bedrooms, multiple living areas, pool) | 25–35 |

Nothing in LOC's current catalog should need more than ~25 photos to show
every space once, plus a handful of genuinely useful second angles.

## How to apply it

1. Open every photo the host provided, full size, in order.
2. Group them mentally by space (living room, bedroom 1, bedroom 2, kitchen,
   bathroom(s), pool/exterior, view).
3. Keep the single best photo per space. Add a second only per the rule above.
4. Drop everything else, including near-duplicates within a "burst" of shots
   from the same spot.
5. Order what's left to walk through the property logically (exterior →
   living spaces → bedrooms → bathrooms → pool/view), not in upload order.

## What's already handled in code

- **Exact re-uploads** can't create a second copy any more. Uploads are keyed
  by the file's sha256 (`build_object_key` in `backend/app/core/r2.py`), so the
  same file always gets the same URL, and the admin uploader skips a photo the
  listing already has.
- **Duplicate URLs** in an `images` array are removed on save and on read
  (`PropertyBase.dedupe_images` / `ExperienceBase.dedupe_images`).
- **The lightbox** renders each photo in its own keyed element and preloads the
  neighbours, so fast swiping never shows the previous photo again.

Near-duplicates (different files, same shot) still need a human, which is what
the rule above is for.

## Curation pass 2026-09-28

Every listing was curated to this rule: 496 photos down to 195. Also dropped:
truncated JPEGs, an app screenshot, soft or low-resolution shots, empty
wardrobe and corridor shots.

| Listing | Before | After |
|---|---|---|
| loc-1001a-gueliz-marrakech | 21 | 11 |
| loc-1002a-gueliz-marrakech | 32 | 15 |
| loc-1003a-gueliz-marrakech | 21 | 13 |
| modern-2br-apartment-doha-val-fleurie-tangier | 18 | 7 |
| villa-kais-marrakech | 8 | 8 |
| villa-gina-marrakech | 35 | 19 |
| villa-bahamas-designer-interiors-marrakech | 79 | 24 |
| 4-bedroom-villa-route-de-fes-marrakech | 45 | 16 |
| villa-mima-marrakech | 55 | 20 |
| villa-emna-marrakech | 59 | 19 |
| villa-dalia-marrakech | 55 | 19 |
| villa-perle-rouge-private-pool-terrace-marrakech | 68 | 24 |
