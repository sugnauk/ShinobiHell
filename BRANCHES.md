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
| Sprites (`feature/sprites`) | `02-sprites.js`, `05-foe-sprites.js`, `92-foe-sprites.js` (redrawn common foes), `17-boss-art.js`, the REDRAWN SPRITES and SECOND FORMS sections of `90-bosses.js`, `assets/`, `build-*.ps1` |
| Bosses (`feature/bosses`) | `06-boss-roster.js`, `18-campaign.js`, `20-boss-mechanics.js`, `90-bosses.js` (the boss director and all twelve fights), `93-miniboss.js` (the Moth Queen). `19-boss-scripts.js` holds older fights the game no longer uses, plus props the new ones still need |
| Enemies (`feature/enemies`) | `04-attacks.js`, `16-enemies.js`, `24-enemy-ai.js` |
| Player and spells (`feature/player-spells`) | `13-training.js`, `14-spells.js`, `15-classes.js`, `25-update.js`, `94-melee.js` (melee survival: blades cut bullets), `95-classes-new.js` (the Gunner and Lancer) |
| Levels (`feature/levels`) | `03-themes.js`, `09-map.js`, `10-run.js`, `22-rooms.js`, `23-world.js` |
| Combat | `11-combat.js` effects, projectiles, damage and deaths (shared by everything) |
| Arcade layer | `91-arcade.js` score, boss ranks, the bullets-cleared reward, dash flash, boss relics, spirit trails, New Game+ |
| Items and loot (`feature/items-loot`) | `07-items.js`, `12-loot.js`, `21-items-extra.js`, `96-gear-powers.js` (gear abilities, legendaries), `97-item-icons.js`, `98-skilltree.js` (the temple skill tree) |
| UI and menus (`feature/ui-menus`) | `26-render.js`, `27-menus.js`, `index.html` |
| Scenery and story | `100-scenery.js`: each stage's story, borders (bamboo, reeds, rock, hedges, walls), terrain beyond the walls, boss arena seals, the screen-wide range cap, selling to the trader, boss trophies on the player |

## Versions

`GAME_VERSION` in `src/00-core.js` is shown on the title screen. Bump it with every change that reaches `main`.

## Testing levels and bosses

Press **T** on the title screen or in the hub for TEST MODE (`src/99-testmode.js`): pick any stage, any character, where to
start (stage start, boss arena, boss at half health, boss event, boss last phase, the Moth Queen), god mode, gear quality,
extra power, difficulty and New Game+. In a test run press **`** for the test panel; its number keys are commands (god mode,
teleport to the boss, boss to half health, boss to its next event, kill the boss, next stage, a legendary, heal and reset
cooldowns, gold and a relic, reveal the map). Test runs never save and never change gold, unlocks, ranks or trails.
