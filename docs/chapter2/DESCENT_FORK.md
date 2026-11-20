# The fork beneath the Ferryman's gate

Pick the road at the campfire to see its dungeon, guardian and relic. Use the arrow keys and Enter, press 1 or 2, or tap a card. The journey bar marks the selected road after the descent. The two roads share the same dungeon number. The checkpoint stores selected road IDs and records defeated guardians separately so the final fight can read actual victories.

| Stage | Branch B | What the player learns | Reward direction |
|---|---|---|---|
| XVI | Nebari, the Lacquer Master | Wet lacquer carries movement. Cured lacquer stops shots from either side. Step sideways out of a marked stroke and strike while his tool sticks. In form two the stroke cures on impact. | Lacquer Seal. Perfect dodges power heavy hits for four seconds. |
| XVII | Ruri, the Furnace Warden | Walking onto a brittle pane primes it. Step out before it breaks, then strike while Ruri's shards draw back. In form two a lit pane primes its linked neighbor. | Tempered Seal. A perfect dodge grants 0.7 seconds of ward. |
| XVIII | Sumi, the Ink Shadow | Ink seals replay a trace of your footsteps as delayed cuts. In form two the trace runs backward. | Reward repositioning between attacks. |
| XIX | Kane, the Bell Warden | Pillars shelter players from directional sound waves. In form two a wall sends the wave back. | Reward a well-timed guard. |
| XX | Mukuro, the Bone General | The crest announces a rule from a guardian you defeated. Form two pairs rules with staggered warnings and recovery between decrees. | To be designed with the finale. |

The XVI workshop introduces wet and cured strips in the first combat room with at most one foe. Later rooms add press strokes to ranged enemy groups. Inside the arena, the three-dab warning marks a row that is safe to leave sideways. The finishing sequence alternates axes. The Mire Warden remains the first road and retains the Mire Lantern.

In XVII, the Lapis Cistern starts with one mirror and at most one foe. Later rooms combine mirrors with ranged enemies. The Glass Warden's Prism Lance draws its entire path before firing. Leaving the path opens time to strike while Ruri recharges. In form two the pillars go dark and the lance reflects from the walls. The Lapis Prism allows the player's shots to ricochet once off walls.

The Shard Kiln starts with one brittle pane and at most one foe. Later rooms add panes to mixed groups. In the arena, Ruri's amber Furnace Warden form places two panes and primes the one near the player. The second pane lights when stepped on. In form two, priming either one starts a staggered countdown on both. The Shardsmith keeps her tongs, linked panes, and two forms in the optional Side Furnace lair. Its door opens without a lair key and the fight awards the usual lair hoard. The Abyss begins after either XVII road in this build.

## XVI playtest results

The fight bot used seed 412892, test gear and final forms. Each run cleared the Lacquer Master. It tops up at low health, so damage here is cumulative damage as a percentage of maximum HP.

| Hero | Keyboard time / damage | Touch time / damage |
|---|---:|---:|
| Samurai | 227 s / 40% | 228 s / 56% |
| Archer | 235 s / 7% | 273 s / 0% |
| Sumo | 143 s / 32% | 156 s / 19% |

Across the six fights, zero warnings extended outside the arena. The minimum estimated escape margin was 0.48 s, including a 0.24 s allowance to change direction on wet lacquer. Samurai and keyboard Archer fell within the 180–240 s target. Touch Archer ran longer, and Sumo ran shorter. Human timing is still to be measured.

Run from the repository root with Playwright and Chromium:

```sh
node docs/chapter2/fight-bot.js samurai,archer,sumo NEB_I:nebariB
node docs/chapter2/fight-bot.js samurai,archer,sumo NEB_I:nebariB touch
```

## XVII playtest results

The bot cleared both guardians with all three test builds. No warnings extended outside the arena. The minimum estimated escape margins were 0.96 s for Prism Lance and 0.59 s for the kiln panes. Samurai and Archer took 180–209 s. Sumo took 100–107 s, below the 180–240 s target. Human timings are still to be measured.

| Hero | Glass Warden keyboard / touch | Furnace Warden keyboard / touch |
|---|---:|---:|
| Samurai | 184 s / 182 s | 180 s / 190 s |
| Archer | 191 s / 209 s | 184 s / 195 s |
| Sumo | 100 s / 101 s | 107 s / 106 s |

```sh
node docs/chapter2/fight-bot.js samurai,archer,sumo RURI_I:ruriA,RURI_I:ruriB
node docs/chapter2/fight-bot.js samurai,archer,sumo RURI_I:ruriA,RURI_I:ruriB touch
```
