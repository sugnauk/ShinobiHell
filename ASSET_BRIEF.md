# SHINOBI DUNGEONS: Art Brief (for ChatGPT)

Game: single-player roguelite, 10 dungeons, boss at the end of each. Sekiro-inspired (Sengoku Japan, shinobi, oni, ghosts).
View: top-down RotMG / Binding of Isaac style. Characters are drawn **front-facing**, the game flips them left/right.

## Global style (paste this at the start of EVERY prompt)

> 8-bit pixel art sprite, NES/early-RPG look, limited palette (max 16 colors), 1px dark outline,
> no anti-aliasing, no gradients, no dithering blur, flat shading with one highlight and one shadow tone,
> transparent background, front-facing, top-down RPG perspective like Realm of the Mad God.
> Dark, moody Sengoku Japan / Sekiro tone with red and gold accents.

## Technical rules
- Final PNGs must be exact sizes below, **transparent background**, nearest-neighbor only (never smoothed).
- ChatGPT's image generator usually outputs big, slightly blurry images. Fix: ask it (code interpreter) to
  "downscale to exactly WxH using nearest-neighbor and quantize to 16 colors", or clean up in Piskel/Aseprite/Lospec.
- Sprite sheets: frames side by side in a single row, left to right.
- Name files exactly as listed so I can load them without changes.

## 1. Characters (frames in a row, 2 frames = idle/walk step)
| File | Size per frame | Frames | Description |
|---|---|---|---|
| player.png | 32x32 | 2 | One-armed shinobi: dark blue garb, red scarf, topknot, katana on hip |
| e_ashigaru.png | 32x32 | 2 | Foot soldier, straw kasa hat, brown armor, spear |
| e_archer.png | 32x32 | 2 | Archer, kasa hat, bow |
| e_samurai.png | 32x32 | 2 | Samurai, dark armor, topknot, katana |
| e_ninja.png | 32x32 | 2 | Masked ninja, dark hood, red eyes, fast-looking |
| e_monk.png | 32x32 | 2 | Bald corrupted monk, gold robe, purple glow, prayer beads |
| e_brute.png | 48x48 | 2 | Huge armored brute / ogre, club or giant blade |

## 2. Bosses (64x64, 2 frames each, sheet = 128x64)
1. boss_01.png  Gyoubu Oniwa: red oni armor, horned helm, mounted-warrior look
2. boss_02.png  Chained Ogre: giant gray brute, chains, bald
3. boss_03.png  Genichiro: blue and white samurai general, bow, lightning
4. boss_04.png  Lady Butterfly: purple kimono, butterfly motifs, ninja-lady
5. boss_05.png  Guardian Ape: giant gray ape, headless variant optional, wild
6. boss_06.png  Corrupted Monk: white and gold robes, glowing eyes, huge prayer beads
7. boss_07.png  Armored Warrior: gunmetal full armor, giant sword
8. boss_08.png  Owl, Father of Shinobi: green-black ninja master, long scarf
9. boss_09.png  Demon of Hatred: black-red demon, flames, horns
10. boss_10.png Isshin the Sword Saint: old samurai, white hair, straw cloak, gold and white

## 3. Tiles (16x16 each). One sheet per dungeon, 4 tiles: floor A, floor B, wall top, wall front-face (sheet = 64x16)
Files: tiles_01.png ... tiles_10.png (floor tiles must tile seamlessly)
1. Ashina Outskirts: grass and dirt, mossy stone walls
2. Abandoned Dungeon: dark gray cracked stone, iron
3. Ashina Castle: tatami / wood floor, dark timber walls
4. Hirata Estate: burnt wood, orange ember glow
5. Sunken Valley: teal moss, wet stone
6. Senpou Temple: autumn leaves, red lacquer wood
7. Mt. Kongo: snow and ice, blue-gray rock
8. Fountainhead Palace: pale blue marble, white and silver
9. Ashina Depths: dark purple cave, bones
10. Ashina Reservoir: crimson floor, gold-trimmed black walls

## 4. Items and tools (16x16 icons, one sheet each, in this order)
**items.png** (22 icons, 352x16): sword/ichimonji, swift blade, long katana, vitality bead, posture bead, boots, parry charm,
eye, blood drop, fire oil, poison vial, shadow step, emblem pouch, spiked reprisal, wind slash, gourd seed,
rice ball (resurrection), sen coin magnet, skull (deathblow hunger), counter-thrust, iron armor, ghost.
**tools.png** (5 icons, 80x16): shuriken, firecracker, loaded axe, flame vent, loaded spear.
**pickups.png** (5 icons, 80x16): sen coin, red health orb, spirit emblem, healing gourd, treasure-glow.

## 5. Projectiles and effects (16x16 frames)
**fx.png** (row, 16x16 each): arrow, purple orb, red orb, shuriken, slash-wave crescent, spark/impact star (3 frames), portal (4 frames swirling).

## 6. Optional
- title.png (320x180): moonlit mountains and a red torii gate, with room for a logo
- logo.png (160x40): "SHINOBI DUNGEONS" pixel logo, red and gold

## Suggested workflow
1. Do **player.png** first and show it to me (or paste back). We lock the style on that one.
2. Do the 6 minions, then bosses 1-3, then one tileset.
3. Drop files into `TestGame/assets/`. I'll hook them up; anything missing falls back to placeholder art.
