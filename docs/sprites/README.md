# Sprite sheets (rendered from the game)
These are pictures of the in-game sprites, so you can see them without running the game. They are rendered straight from the game's code, so they match exactly. Regenerate them after art changes; commands below.

| File | What it shows |
|---|---|
| `genjuro_sheet.png` | **Genjuro, the Hired Blade** (Prologue I). Code: `src/204-guardian-redesign.js` |
| `tatsuma_sheet.png` | **Tatsuma, the Barge Master** (Prologue II). Code: `src/204-guardian-redesign.js` |
| `sazanami_sheet.png` | **Sazanami, Ferryman of the Hollow** (stage XV). Code: `src/204-guardian-redesign.js` |
| `nebari_sheet.png` | **Nebari, the Mire Warden** (stage XVI; temporary art, concept A). Code: `src/205-silt-cellars.js` |
| `lacquer_master_sheet.png` | **Nebari, the Lacquer Master** (stage XVI, Palace Lacquer Works). Code: `src/206-lacquer-works.js` |
| `ruri_sheet.png` | **Ruri, the Glass Warden** (stage XVII, Lapis Cistern). Code: `src/208-glass-roads.js` |
| `furnace_warden_sheet.png` | **Ruri, the Furnace Warden** (stage XVII, Shard Kiln). Code: `src/208-glass-roads.js` |
| `shardsmith_sheet.png` | **The Shardsmith** (stage XVII, optional Side Furnace lair). Code: `src/208-glass-roads.js` |
| `all_guardians.png` | Every guardian in the game, first and second form |
| `all_heroes.png` | Every hero at first, middle and final form |
| `../chapter2/concept_sheet.png` | Concepts for the Chapter II guardians: two directions each for Nebari, Kane, Sumi and Mukuro. Code: `../chapter2/guardian-concepts.js` |

**How to read a boss sheet:**
- **Rows:** the top row is the first form, the second row the second form.
- **Columns, left to right:** idle, idle (breathing), attack, walk 1, walk 2, wind-up, follow-through, cast, flinch.
- **Ruri columns:** idle, idle (breathing), attack, wind-up, recovery.
- **Last column:** the frame at in-game size (scale 1.1).
- **Size:** most frames are 72x76 pixels, drawn at 3x on the sheet. Both Ruri variants use 112x98 frames to fit their shards.

**How they are drawn:** each frame is painted at twice the size with `hiArt()` (`src/204-guardian-redesign.js`), then reduced to 72x76. Each 2x2 block becomes the most common colour, and a tie goes to the darker one. Thin outlines; no shirtless looks.

**Regenerate** from the repo root (needs Playwright with Chromium):
```
node docs/sprites/render-boss-sheet.js "NEBARI, THE MIRE WARDEN" docs/sprites/nebari_sheet.png
node docs/sprites/render-boss-sheet.js "NEBARI, THE LACQUER MASTER" docs/sprites/lacquer_master_sheet.png
node docs/sprites/render-boss-sheet.js "RURI, THE GLASS WARDEN" docs/sprites/ruri_sheet.png
node docs/sprites/render-boss-sheet.js "RURI, THE FURNACE WARDEN" docs/sprites/furnace_warden_sheet.png
node docs/sprites/render-boss-sheet.js "THE SHARDSMITH" docs/sprites/shardsmith_sheet.png
node docs/sprites/render-gallery.js
node docs/chapter2/render-concept-sheet.js
```
