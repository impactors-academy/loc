# Listing photos — curation guideline

Applies when adding or reviewing a stay or experience listing's photos in
`/admin/properties` or `/admin/experiences`. A rule for the person curating
photos, not something the app enforces — a machine can't reliably tell "same
room, useful new angle" from "same room, near-identical repeat."

**The problem this addresses:** listings ranging from 8 to 79 photos, with no
consistent logic to the count. A host hands over everything on their phone;
without a pass to select from it, a viewer scrolling the gallery hits several
near-identical shots of the same room in a row and it reads as broken, even
though every file is technically a different photo (confirmed: LOC's actual
duplicate-URL bug is separately fixed in code — this guideline is about photos
that are all genuinely distinct files, just badly curated).

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

A guide, not a hard cap — let the property's actual size and features decide,
but treat a count near the top of these ranges as a prompt to double check for
near-duplicates before publishing:

| Property size | Target |
|---|---|
| Studio / 1-bedroom apartment | 10–15 |
| 2–3 bedroom villa or apartment | 15–20 |
| Large villa (4+ bedrooms, multiple living areas, pool) | 20–30 |

Nothing in LOC's current catalog should need more than ~30 photos to show
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

- **Exact re-uploads** (the same file uploaded twice) are deduplicated
  automatically, both on save and on read — see `PropertyBase.dedupe_images`
  / `ExperienceBase.dedupe_images` in `backend/app/schemas/`. This guideline
  is about near-duplicates (different files, same or near-same shot), which
  code can't reliably catch.

## Existing listings to review

These four are the largest in the current catalog and are the most likely to
have near-duplicate angles worth trimming — not confirmed broken, just the
ones with the least curation pressure so far:

- `villa-bahamas-designer-interiors-marrakech` (79 photos)
- `villa-perle-rouge-private-pool-terrace-marrakech` (68 photos)
- `villa-dalia-marrakech` (55 photos)
- `villa-gina-marrakech` (35 photos — this is very likely the listing behind
  the "photos repeat" feedback logged 2026-09-28)
