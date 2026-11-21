# Chapter II guardian fight brief

Chapter II starts with Sazanami at XV. The XVI and XVII forks are playable. Sumi, Kane and Mukuro at XVIII–XX are design work. Each guardian should have a repeatable movement problem, a signature that changes it, and a readable window to deal damage. The timings and counts below are prototype settings.

## What to borrow from the reference fights

- **The Observatory and Eclipse Shrine** already layer sustained fields with phase-specific specials. The reusable pieces are `bhStart` for emitters, `ldirCompatible` for layer budgets, and `bhFair` for screening new batches. Chapter II can use those pieces with authored sequences tied to room rules. Script the first two cycles so the player sees each rule in order. After that, vary direction, lane position and cadence within the same sequence. [Observatory](../../src/189-observatory.js) · [Eclipse Shrine](../../src/190-eclipse.js) · [Layer director](../../src/187-director.js)
- **Taisei’s stage 5 and 6 timelines** alternate recurring regular attacks with named specials, and stage 6 uses a dedicated transition when the equipment and attack vocabulary change. The transferable idea is to teach a movement rhythm, interrupt it with a special, then reintroduce it under a changed rule. Keep the geometry, presentation and timings original to ShinobiDungeons. [Stage 5 timeline](https://github.com/taisei-project/taisei/blob/ae82249439dc8b1c3f5cb7a134dcd92a4650b77f/src/stages/stage5/timeline.c#L56-L89) · [Stage 6 timeline](https://github.com/taisei-project/taisei/blob/ae82249439dc8b1c3f5cb7a134dcd92a4650b77f/src/stages/stage6/timeline.c#L369-L404)
- **Current baseline.** Sazanami already has meaningful bank changes. Nebari and both Ruris have distinctive cover, reflection or footing rules, but their biggest attacks often play as isolated floor warnings with sparse projectiles between them. The published XVI–XVII bot runs also show a large difference between Sumo and other test builds. Hold health steady for the first pattern pass. Measure live combat time, time in forced survival, and damage per opening before retuning it. [Current fork and fight results](DESCENT_FORK.md)

## Fight structure and tuning

1. **100%–50% health.** Give the first field 2–3 seconds on its own. A regular attack loop should have a slow field, a named signature and a roughly 1.4–1.8 second attack window. Most loops should last 6–9 seconds. The opening begins after the last pulse that can reach the intended attack position. The boss stops backing away, and no new emitters start during that window.
2. **50% health.** Use the existing form transition. Fade the guardian’s old field, reveal the changed rule through pose, sound and floor geometry, then run the new field once before combining it with the signature. One change is enough for this beat.
3. **Around 25%–30% health.** Use one named finale with three authored beats over 10–14 seconds. Give the final beat a distinct cue and end it with a visible recovery. A brief invulnerable survival finale can work when it is part of the encounter’s identity. Most phases should allow damage.
4. **Layering.** Start with one field and one pressure layer at most. Prototype slow bullets at 45–65 world px/s, aimed packets at 85–115, and most locked floor tells at 1.0–1.25 seconds. Use an initial 36–48 world px clear lane after hitbox padding, then verify the actual travel distance. Those values are starting points. Near walls, on mire and on wet lacquer, the escape route must account for the movement the hero actually has. Damage and health stay at the baseline while these values are being tuned.
5. **Visual language.** Give slow fields a round silhouette, aimed pressure a pointed silhouette, and lethal floor marks an outlined countdown. Keep the player core visible above effects. Each signature needs a recognizable wind-up, release and recovery pose. Check the projected result on a phone in Near view. Reflections, linked panes and late beat shifts need shape or motion cues in addition to color.

## XV · Sazanami, Ferryman of the Hollow

**Movement lesson: cross the lane before the opposite bank takes over.** Sazanami can keep the existing ferry theme, phase art and two crossings.

- **100%–50%:** In Lantern Ferry, send three rows from alternating banks at 0.85-second intervals, about 95 px/s, with a roughly 60 px opening. Announce each bank with the raised lantern and mark the next opening before the row moves. On the second pass only, place one Anchor Toll behind the player’s current lane after they have had time to start crossing. Lock it at placement with a 1.15-second tell. Drop the lantern for a 1.6-second attack window after the last row clears the boss.
- **50%–24%:** Red lanterns signal a bank reversal. Start with one solo reversal. In the repeat loop, announce the next bank 0.9 seconds in advance and send its first row only once the previous safe lane connects to the next one. Shift the lane by 16–24 px per row, with an initial width of 48 px. Keep Mooring Cut for the end of a crossing and clip both lines to the usable floor.
- **24% finale — Last Crossing:** Over 12 seconds, show a straight crossing, then a bank reversal, then a sweep that leaves the last lane open. Give players a stationary recovery after the sweep. A player watching the lantern can predict the next direction without reading a tutorial mid-fight.
- **Prototype hook:** Keep `ferryCrossing` and the existing lane overlay. Stage the row bullets as authored batches with a fixed gap rather than using the randomized stock wall emitter. Audit the current Anchor Toll placement and Mooring Cut extents at arena corners. [Sazanami code](../../src/203-chapter-two.js)

## XVI A · Nebari, Mire Warden

**Movement lesson: steer around wet silt, then reuse the same ground as cover.**

- **100%–50%:** Replace the isolated Silt Spray with two slow crescent fans, 9 globs each at 52 px/s, spaced 0.85 seconds apart and offset by half a pellet. Leave one broad diagonal through dry floor. Lock Tar Bloom on the route the player just used, give its normal warning, then mire Nebari for the existing 1.6-second opening. Keep the close sweep as a solo attack in the first cycle.
- **50%–28%:** Harden the four central mounds before adding pressure. Telegraph a fixed shooting line for approximately 1.0 second, then send three aligned 3-shot packets at 105–115 px/s, 0.28 seconds apart. Walking behind a mound and stepping around the volley both work. Keep a clear flank where a ranged hero can shoot around the mound during reload.
- **28% finale — The Draining:** Use inward crescents, one mud volley across the middle, then a pair of blooms on opposite flanks in succession. Seed the bloom sites from valid floor positions with tested paths between them. Leave the central cover route usable until the last bloom, then give a clear mired opening.
- **Prototype hook:** Keep `nebClamp`, soft/hard pools and cover interception. Shorten straight aim tells to the actual floor. Verify escapes at the slowest legal speed while standing in soft mire. [Mire Warden code](../../src/205-silt-cellars.js)

## XVI B · Nebari, Lacquer Master

**Movement lesson: plan the turn before you slide, then use your own trail placement.**

- **100%–50%:** Use two distinct brushstroke beats. First mark one wet strip for 1.2 seconds. About 0.6 seconds after impact, send a shallow row of 7 droplets parallel to it at 55 px/s, with an open end that can be reached from dry ground. After the first demonstration, alternate which end stays clear. The brush sticks for 1.6 seconds after the droplets pass the approach to the boss.
- **50%–27%:** The marked row cures on impact. Preview the solid edge as a dashed line during wind-up. On selected cycles, fire a 3-shot packet from the opposite bank after the new wall exists. A usable wall blocks the volley and leaves a walkable flank toward the boss. Only one newly cured row may steer the active lane during a signature.
- **27% finale — Final Coat:** Lay one horizontal stroke, one vertical stroke and one final baited stroke over about 11 seconds. Stagger them so the next safe turn is visible before the current corridor closes. End with the brush stuck. Use the existing lacquer red form accent plus a glossy versus matte treatment to distinguish wet from cured lanes.
- **Prototype hook:** Reuse `lacquerStroke` and cover behavior. Include drift from the previous movement vector in escape tests. Check both directions at the intersection of a cured strip and an arena wall. [Lacquer Master code](../../src/206-lacquer-works.js)

## XVII A · Ruri, Glass Warden

**Movement lesson: read the first bounce, then stand outside the return line.**

- **100%–50%:** Send two layers of 7 slow Lapis Shards from a locked direction at 52–64 px/s, 0.75 seconds apart. Angle the second field to one identified pillar so the first reflected lane is predictable. Draw Prism Lance’s entire locked path for 1.15 seconds. Keep the lance on one mirror bounce and let the rest of the field drain before the 1.65-second recharge.
- **50%–27%:** The pillars go dark and the wall becomes the reflector. Run one solo wall-bounced lance. Later, overlay a sparse outward 12-shot ring at 48 px/s with one blocked sector deliberately omitted so the walking route out of the lance stays open. Offset the two reflected strikes by about 0.15 seconds instead of firing every segment simultaneously.
- **27% finale — Broken Light:** Preview the first wall, then release two complete lance paths on staggered cues. Finish with one lance plus a slow, rotating gap ring. Validate a route around the inside of the return angle at both near and far positions. Purple shard separation in the second form can expose the core when she recovers.
- **Prototype hook:** Use one geometry calculation for projectile reflection, the locked line preview and collision wherever applicable. Extend the fairness forecast for reflected paths before layering them heavily. Preserve the approved crystal silhouette. [Ruri code](../../src/208-glass-roads.js)

## XVII B · Ruri, Furnace Warden

**Movement lesson: decide which pane to trigger and when, then cross the lane it frees.**

- **100%–50%:** Ruri primes a radius-22 pane with a 1.15-second tell and leaves an unarmed pane beside it. Start with a solo pair. On the repeat cycle, send two 7-shot fans along one outer lane, 0.65 seconds apart, leaving the lane beside the unarmed pane open. Step in during the 1.75-second shard recoil after the last fan.
- **50%–28%:** Keep the linked-pane rule. Show the connection before release and stagger breaks by 0.4–0.5 seconds. On the second repeat, follow the second break with one slow four-arm field lasting 1.5 seconds. Route an arm away from the visible escape lane. A player can prime the pair on purpose before the field reaches it.
- **28% finale — Kiln Release:** Use one horizontal pair, one vertical pair, then a final pair beside a single slow fan. Start each new pair after the previous link has fired. Keep the amber and hot coral crystal palette for both phases so this reads as the same Ruri as the Cistern.
- **Optional Shardsmith:** Keep her tongs and shorter side fight. Teach a single pane pair, then add one fan between pairs after her form change. Keep the lair encounter independent of the guardian’s finale and check cleanup on leave, death and reset. [Kiln and lair code](../../src/208-glass-roads.js)

## XVIII · Sumi

**A, the Ink Archive — read space by lighting it.** Open with two Brushstroke rows of 9–13 pellets, moving at about 60 px/s through a roughly 48 px dry gap. The floor shows the gap for 1.15 seconds and the lantern over it lights before release. On later cycles, layer a 3-shot aimed packet after the first row. At half health, lanterns expire and can be relit. Ink can mute the bullet’s fill, with a visible outline or wake on any dangerous shot close to the player. Always leave one lit route reachable without having to land a hit. Finale: three alternating strokes through the two lantern zones, with time to cross between them. Sumi refills his brush for 1.7 seconds after the third stroke.

**B, Ink Shadow — place a trail, then dodge its replay.** Show the last 1.25 seconds of sampled footsteps as a dotted trace, lock it, and replay a cut every 0.22 seconds after a 1.1-second tell. First replay in order. At half health replay in reverse, with end arrows and two independent chimes separating lock from release. On repeat cycles add one slow fan outside the trace’s escape lane. Finale: two short traces, with the second beginning only after the first releases. Leave a clear opening while Sumi rewinds the brush. Test motionless players, tight loops and camera rotations.

## XIX · Kane

**A, the Bell Foundry — anticipate the beat and thread the gap.** Use three bell notes about 0.85 seconds apart. Each note releases a visible expanding ring of 16–20 shots at 55–65 px/s with a marked gap of about 0.8 radians. The first gap stays fixed. The second cycle rotates it one step per toll. At half health, switch to a short–long cadence of roughly 0.55 and 1.15 seconds. Show each impact on a visual countdown and begin with a solo example of the new beat. Finale: a slow roll, a double toll, then Great Toll with one wider gap. Give a 1.8-second opening while Kane lifts the bell. A dash is a shortcut and walking through the gap is always viable.

**B, Bell Warden — move between sound shadows.** Telegraph which of two wall-side bells will emit a directional wave. Let pillars cut persistent escape lanes in the wave. At half health, return one wave off the far wall with a distinct pre-return floor arrow and at least 1.1 seconds of warning. Shift the shelter from one pillar to the other over two waves. Aimed pressure can push players out of permanent camping spots only after the next shelter is reachable. Finish with a single reflected crest and an unobstructed route to punish. Verify that covered lanes work at the edges of the pillar as well as at its center.

## XX · Mukuro

**Movement lesson: recognize a rule you have already beaten, then read the order in which two rules arrive.**

- Build the memory list from `R.roadClears`, using the selected route only to resolve legacy or explicit Test Mode presets. Deduplicate by depth. Store semantic IDs for each cleared variant and resolve those IDs to curated pattern adapters. A preset for Test Mode, direct Boss Rush visits and legacy saves must work when no victories are recorded.
- **100%–50%:** Cue one rule with its crest, floor marker and sound. Use a shortened 3–4 second version with one field, followed by about 2 seconds of visible recovery. Cycle through the cleared rules in order before repeating. Mukuro’s silhouette and throne crest should stay visible behind guest effects.
- **50%–26%:** Pair two rules with different functions and stagger their first releases by about 0.8 seconds. Start with a field plus a positional choice, for example an open-sector bell ring plus a locked reflected lance. Let the first cue remain visible while showing the second. Pair only adapters with an authored walking route. A glass wall and an ink effect that obscures the one opening have no valid pairing.
- **26% finale:** Use three distinct decrees in 12–14 seconds. Echo a recent single rule, then a compatible pair, then open the boss for a final punish. Both XX designs should preserve that recognition loop. Mukuro A emphasizes reading and repetition from the throne. The Bone General variant announces the same memories through advancing formation lines, with a retreat lane after each advance. The final guardian and the transition to the Abyss occupy the same numbered slot on either route.

## Implementation and acceptance

1. Prototype **Sazanami first**. His existing crossing provides a baseline for adding sustained pressure while keeping a visible route. Implement the first regular loop and one form-two reversal, then play both before adding the finale. Capture one phone clip of the tell, safe response and punish. Apply the approved pacing to XVI and XVII before building new rooms.
2. Keep the existing `BKIT` phase and recovery flow. Use `bhStart` for reusable fields and authored `BHP` batches when bank, timing, gap or source must be locked. Keep arena effects in the existing `mark` helpers. Use a predictable attack rotation for tutorial cycles, with safe variation introduced later. Stop pattern instances and lasers with `bhStop(e)` when a phase or fight ends, and explicitly clear the guardian’s relevant live bullets and marks when their cue no longer applies. Check interruptions by posture break, leaving the room, and rapid damage pushing through a threshold.
3. Record **zero** warnings outside walkable arena bounds. Test from the center, flanks, corners and at melee distance. Require at least **0.35 seconds** of modeled walking escape margin for the slowest supported baseline hero, including mire and lacquer movement. Validate the whole overlapping window with per-frame paths or replay, including lines, bounces, lingering hazards and cover edges. `bhFair` forecasts a local 1.6-second window with mostly linear bullet paths and includes circular marks, so its counters alone cannot prove these combinations are safe. If safety thinning repeatedly eats a hallmark pattern, widen the planned lane or stagger its layers.
4. Compare keyboard and touch at 60 FPS and under a 30 FPS render throttle. Use Samurai, Archer, Sumo and Gunner. Run the existing fight bot, then add per-phase duration, source, escapes under overlap, and peak active shots to the report. Use representative builds and human playtests, since the bot tops up HP and its movement is imperfect. Preserve the **180–240 second** target for the major fights at XVI–XX and check why a hero is outside it before changing health. If a long fight is mostly invulnerability or cover downtime, fix the attack window first.
5. Before shipping, check both roads in normal play, Test Mode, Boss Rush and NG+. Reload XVI and XVII checkpoints, verify that the optional Shardsmith does not alter the recorded road, and test Mukuro’s adapter selection and the Abyss transition once XX exists. Add pattern and pose names to the in-game guide when each encounter is implemented. [Fight bot](fight-bot.js) · [Descent design](../../CHAPTER_II_DESCENT.md)

## XV prototype results

The first prototype keeps Sazanami’s health at its previous value. The regular crossing has three rows at 1.00, 1.95 and 2.90 seconds, with a bank cue 0.9 seconds before each. The first cycle in each form holds one line, and later cycles shift it by 18 px. Anchor Toll can mark a player outside the shared lane. Form two reverses the opening bank, narrows the gap to 48 px, and adds Mooring Cut beside the last gap after its demonstration cycle. The 1.6-second stationary opening starts at 5.9 seconds. The Last Crossing at 24% uses straight, reversed and one-bank sequences over 12 seconds.

Headless Chromium, seed 412892, using the fight bot’s epic test gear and final-form heroes. The bot replenishes health and follows the displayed bank cue.

| Hero | Keyboard clear | Touch clear |
|---|---:|---:|
| Samurai | 135 s | 135 s |
| Archer | 102 s | 113 s |
| Sumo | 76 s | 73 s |
| Gunner | 139 s | 148 s |

All eight fights reached the finale and cleared. Peak simultaneous row bullets ranged from 99 to 117. No sampled warning extended outside the arena. The smallest estimated escape margin for an individual warning was 0.79 seconds. The visual smoke check exercised bank changes, overlapping finale lanes, stationary recovery and cleanup. These checks do not establish full overlap solvability or human fight times. Sumo remains the fastest build in this pass.

```sh
node docs/chapter2/fight-bot.js samurai,archer,sumo,gunner FERRY_STAGE
node docs/chapter2/fight-bot.js samurai,archer,sumo,gunner FERRY_STAGE touch
```

## Playable late-game pass

This pass covers the existing XIII–XVII fights, the Side Furnace, and the Observatory and Eclipse encounters reused by the Abyss.

| Encounter | Field and phase change | Punish window |
|---|---|---|
| XIII Hoshiyomi | Signature-first cycles. Learn the constellation, then read the Orrery and later chart fields. New phases clear the old field. Constellation anchors and lines fit the usable room. | 1.55 seconds between field cycles. The finale ends with a separate recovery. |
| XIV Getsurei | Returning crescents lead the fight. Later cycles start with the moving Eclipse, with low-health coverage built around Total Eclipse. Corona rays clip to the room. | 1.65 seconds between field cycles. The finale ends with a separate recovery. |
| XV Sazanami | Alternating banks, narrowing lanes, Mooring Cut, and a one-bank final sweep. | 1.6 seconds after the regular sequence, with a second opening after the finale. |
| XVI Mire Warden | Two slow silt fans give way to a locked three-packet volley and stone cover. The Draining moves from slow fans to a volley and then two deliberate blooms. | The bloom and finale mire him and keep his attack timer paused. |
| XVI Lacquer Master | A marked stroke sets first, then a staggered splatter travels through the room. Flash-cured strips give phase two cover from the faster volley. The finale alternates the stroke axis. | The tool sticks after the follow-up instead of during its wind-up. |
| XVII Glass Warden | Two shard layers include a bank shot off a live pillar. Broken Light staggers the wall-reflected lances and one slow ring with an open sector. | The recoil follows the last segment, with a final recharge after Broken Light. |
| XVII Furnace Warden | Two slow fans, paired panes, and a delayed shard packet after the linked breaks. The finale changes which axis the player clears before the final shard fan. | The shards retract after the linked-pane follow-up. |
| Optional Shardsmith | Shorter variation of the linked-pane sequence with a narrower follow-up fan in the side lair. | Her tongs reset after the last pane and shot sequence. |

Abyss modifiers still affect the first two encounters. Swift and Relentless multiply once per attack interval, so the latter no longer compresses the interval again every frame. The first retest showed XVI and XVII clearing well below the existing target with the revised openings. The Mire Warden uses `BOSS_HPT` 19, the Lacquer Master 24, and each Ruri form 29. The earlier three guardians retain their existing health. XVIII–XX are new encounters and remain in the design section above.

Four-hero keyboard and touch sweeps cleared all seven main encounters. Edge regressions were retested on Getsurei and the Mire Warden with no sampled warnings outside the arena. Browser smoke checks covered both routes, checkpoint migration, Test Mode, Boss Rush, New Game+, the two Abyss remixes, and the Side Furnace on 24 layouts. Several test builds still cleared below the original XVI–XVII duration target. Getsurei's ranged bot runs often needed health top-ups, so their clears are timing and behavior checks. Human difficulty and whole-pattern walking routes still need playtesting.

```sh
node docs/chapter2/fight-bot.js samurai,archer,sumo,gunner OBS_I,ECL_I,FERRY_STAGE
node docs/chapter2/fight-bot.js samurai,archer,sumo,gunner NEB_I:nebariA,NEB_I:nebariB,RURI_I:ruriA,RURI_I:ruriB touch
```
