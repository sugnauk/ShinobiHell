# Branches and where the code lives

## Branch model

| Branch | What it is for |
|---|---|
| `main` | Stable, playable game. Only merged into from `develop` once a change has been played. |
| `develop` | Integration branch. Feature branches merge here first. |
| `feature/bosses` | Boss fights: `bosses.js`, boss music, the campaign roster. |
| `feature/sprites` | All pixel art: player, foes, bosses, props, `assets/`, the `build-*.ps1` generators. |
| `feature/player-spells` | Player movement and actions, spells, character classes, status effects. |
| `feature/enemies` | Stage foes: attack builders, foe types, elites, enemy AI, bullet patterns. |
| `feature/levels` | Dungeon themes, map generation, rooms, props, shops, shrines, traps. |
| `feature/items-loot` | Relics, gear, loot bags, legendaries, meta progression and the skill tree. |
| `feature/ui-menus` | Rendering, HUD, menus, guide, options, tutorial, saving. |
| `feature/audio` | Sound effects and the procedural music. |

Workflow: branch from `develop` (or work on the matching `feature/*` branch), keep each change to one area, open a pull
request into `develop`, play it, then merge `develop` into `main`. Pull `develop` into a feature branch before starting new
work on it so it stays current.

## Code map

`game.js` is one file, split into commented sections (`// ---------- name ----------` and `// ===== NAME =====`).
Search for the section header rather than a line number; line numbers drift.

| Area | Sections in `game.js` | Other files |
|---|---|---|
| Audio | `audio`, boss music (`BMUSIC`, `mkBossSong`), `SFX` | |
| Sprites | `sprites (code-drawn...)`, `FOE SPRITES`, `boss sprites`, `BOSS ART` | `bosses.js` (REDRAWN SPRITES and each boss's `BART` entry), `assets/`, `build-*.ps1` |
| Bosses | `THE CAMPAIGN`, `SCRIPTED BOSS FIGHTS` (older, mostly unused), `boss mechanics` | `bosses.js`: the boss director and all twelve fights |
| Enemies | `attack builders`, `elites`, `extra enemy types`, `bullet hell pass`, `enemy AI` | |
| Player and spells | `player actions`, `spells`, `CHARACTER CLASSES`, `status effects & reactions`, `TRAINING GROUNDS` | |
| Levels | `dungeon themes`, `map generation`, `run / dungeon setup`, `rooms, props, shop, shrines, traps`, `world simulation` | |
| Items and loot | `items & tools`, `meta progression`, `loot bags, potions & gear`, `POWER SYSTEMS`, `extra items`, `TEMPLE SKILL TREE` | |
| UI and menus | `rendering`, `isometric projection`, `character select`, `BETWEEN STAGES`, `THE GUIDE`, `options`, `save and continue`, `tutorial` | `index.html` |

## Testing a boss quickly

Open the browser console on `index.html` and run `meta.trained=true;__dbg.start(N)` (N = stage 0-11), then
`__dbg.teleportBoss()` and `__dbg.god()`.
