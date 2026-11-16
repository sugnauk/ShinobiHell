# Shinobi Hell

An isometric bullet-hell roguelite. March on the corrupt Emperor's palace through twelve stages: from the bamboo forest, the
rice marsh and the smugglers' caverns, over the frozen pass and the outer walls, into the temple, the cellars and the keep,
through the royal gardens and the jade palace to the throne room. Each stage ends in a guardian with its own fight.

## Play

Open `index.html` in a browser. There is no build step: the game is plain JavaScript loaded from `src/` in order.
`serve.ps1` starts a small local web server if your browser blocks local files.

| | |
|---|---|
| Move | WASD |
| Aim / attack | mouse, LMB (auto-fire can be turned on in Settings) |
| Heavy | hold RMB |
| Abilities | Q, E (ward), F, R (ultimate) |
| Dash | Space (dash through a shot just as it hits for a perfect dodge) |
| Focus | hold Shift: move slowly with a small hitbox |
| Potion / interact / backpack | C / G / Tab |
| Pause, settings, guide | Esc, O, K |

In the temple between runs: the skill tree (Tab from the character screen), Boss Rush (B) and the guide's Trials.
Press T on the title screen for test mode (any stage, boss or character).

## Repository

- `src/` the game, one file per area; `BRANCHES.md` has the full code map and the branch workflow
- `CHANGELOG.md` what changed in each version
- `assets/` source art and the few PNG sprite overrides; `build-*.ps1` regenerate sprite sheets from it
- `ASSET_BRIEF.md` the art brief
