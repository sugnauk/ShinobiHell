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

The game is plain JavaScript with no build step. `index.html` loads the files in `src/` in numeric order, and they share
one global scope. Order matters only for code that runs at load time (data tables, `storyCampaign()`), so add a new
file with a number after anything it uses, and add its `<script>` tag to `index.html`.

| Area (branch) | Files in `src/` |
|---|---|
| Core | `00-core.js` utils and pixel font, `08-state-input.js` global state and input, `28-loop.js` main loop and debug hook |
| Audio (`feature/audio`) | `01-audio.js` |
| Sprites (`feature/sprites`) | `02-sprites.js`, `05-foe-sprites.js`, `17-boss-art.js`, the REDRAWN SPRITES and SECOND FORMS sections of `90-bosses.js`, `assets/`, `build-*.ps1` |
| Bosses (`feature/bosses`) | `06-boss-roster.js`, `18-campaign.js`, `20-boss-mechanics.js`, `90-bosses.js` (the boss director and all twelve fights). `19-boss-scripts.js` holds older fights the game no longer uses, plus props the new ones still need |
| Enemies (`feature/enemies`) | `04-attacks.js`, `16-enemies.js`, `24-enemy-ai.js` |
| Player and spells (`feature/player-spells`) | `13-training.js`, `14-spells.js`, `15-classes.js`, `25-update.js` |
| Levels (`feature/levels`) | `03-themes.js`, `09-map.js`, `10-run.js`, `22-rooms.js`, `23-world.js` |
| Combat | `11-combat.js` effects, projectiles, damage and deaths (shared by everything) |
| Items and loot (`feature/items-loot`) | `07-items.js`, `12-loot.js`, `21-items-extra.js`, the skill tree in `27-menus.js` |
| UI and menus (`feature/ui-menus`) | `26-render.js`, `27-menus.js`, `index.html` |

## Testing a boss quickly

Open the browser console on `index.html` and run `meta.trained=true;__dbg.start(N)` (N = stage 0-11), then
`__dbg.teleportBoss()` and `__dbg.god()`.
