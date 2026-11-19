# Ability animation audit

This is the plan for bringing every ability up to the standard of the three reference abilities. Key names follow the game's default bindings:

| Key | Slot | Kind |
|---|---|---|
| RMB | `h` | heavy (held to charge) |
| Q | `q` | ability |
| E | `w` | ability |
| F | `f` | ability |
| R | `e` | ultimate |

Basic attacks (LMB) are out of scope.

**References (not modified):**
- Samurai Q: **WHIRLWIND**
- Samurai R: **DRAGON CLEAVE**
- Onmyoji R: **DRAGON SPIRIT**

---

## Step 1 · How the reference abilities are built (the toolkit)

### Samurai Q: WHIRLWIND
- **Body:** it uses the `spin` pose in `AB_ANIM` (`167-ability-anim.js`): `['spin',.62,3]`, which is three full turns in 620 ms.
  - `abPoseAt` turns the body for real. It squashes `sx` to `|cos θ|`, swaps to the back-view sheet when `cos θ < 0` and flips at the side.
  - A ghost (`o.ghost`) trails the turn 0.7 rad behind, drawn white at 32%. The body bobs up on a sine.
- **Hit timing:** the `whirl` class zone (`CZ.whirl`, `15-classes.js`) follows the player and deals three hits, 200 ms apart. Each hit also cuts nearby enemy bullets.
  - The three hits line up with the three turns: one cut per revolution.
- **VFX:** three blade arcs orbit the hero (`CZD.whirl` → `fxArc`). That's a few pixels, not a particle cloud.

### Samurai R: DRAGON CLEAVE
- **Anticipation:** the ultimate lead-in (`ULTSEQ` in `168-ult-anim.js`): `pre .38 s`, rooted and invulnerable.
  - The body rises 22 px in the dash stance (`u_hover` with `dashPose`) and leans into the line in the last 40%.
  - A ground ring and the shadow stay on the floor (the shadow shrinks), and a gold dash line shows the exact path the dash will take.
- **Action:** `castUlt` then actually moves the hero up to 130 px along the aim, stopping at walls (`blocked` checks every 3 px).
  - Damage is a `lineHit` along that same path, so the hitbox is the visible line. The landing explodes (`fx 'ult'` radius 50).
- **Follow-through:** the `dragondash` pose (420 ms). It holds the strike frame, then recovers, with an afterimage streak drawn along `from → to` and an `impact` flash and shake on landing.
- **Camera/impact:** `impact(x,y,col,8,true)` (shake 8, hit-stop about 64 ms, screen flash) and a `blade` strike line (`171-strike-fx.js`).

### Onmyoji R: DRAGON SPIRIT
- **Anticipation:** a `u_kneel` lead-in (`pre .3 s`). He crouches with a rune circle on the ground.
- **Summoned entity:** `170-dragon-spirit.js` pushes a `DRAGONS` entry. A pixel-art dragon head (horns, mane, a glowing eye, snapping jaws, whiskers) swims along the aim line, weaving on a sine and flying above the ground.
  - It is drawn in the "top layer" between the sprites and the bullets, so it never hides a shot. Its path is clamped to walls.
- **Hit timing:** nine blasts are queued along the same line (`fx 'ult'` with `wait: i*.1`). The dragon's head reaches each blast point as it explodes, so the entity is the hitbox.
- **Follow-through:** the dragon fades out over 350 ms while sparks and motes shed from its body.

### Shared systems to reuse (no parallel systems)

| System | Where | Use |
|---|---|---|
| `AB_ANIM` + `abPoseAt` | 167 | per-ability body motion: frame, flip, back view, squash/stretch, skew, rotation, ghost and afterimages |
| `ULTSEQ` lead-ins | 168 | rooted anticipation before an ultimate fires |
| HPOSE frames 8–15 | 02-sprites | per-class arm and weapon poses (wind-up 12, strike 13, follow 14, sheathe 15, cast 8/9, raised 10, dash 11) |
| top-layer entities | 170 `drawPortal` wrap, `TOPFX` in 179 | summoned things drawn above sprites and below bullets |
| `PSPR[spr]` | 26-render | shaped projectiles drawn along their velocity |
| class zones `CZ` / `CZD` | 15-classes | persistent summons and areas with their own logic and drawing |
| `impact`, `hitstop`, `shake`, `flashT` | 11-combat | impact feel; ultimates use about 6–8 shake, basics 1–3 |
| `fx 'line'` + `STRIKE_STYLE` | 171 | shaped line strikes (blade, spear, chain, beam, blast) |

New in this pass: **`ABTUNE`** (`191-ability-motion.js`), a tuning table holding every new timing, plus a switch that mutes the generic cast burst (`castShow` → `juice` rings, rays and seals in `147-juice.js`) for abilities that now have their own motion. That generic burst is the "effect slapped on top" this pass removes.

---

## Step 2 · Audit

Gap to the reference standard runs from 1 (already there) to 5 (generic effect only). "Generic pose" means one of the shared poses (`cast`, `guard`, `roar`, `plant`...) with the shared cast burst on top.

| Character | Ability | What it does | How it looks now | Gap |
|---|---|---|---|---|
| Samurai | RMB IAI CLEAVE | short dash, cuts every foe passed; full charge spends Resolve and cuts shots | lunge pose with afterimages, a real dash, a blade cut line at the end | 2 |
| Samurai | Q WHIRLWIND | 3 spin slashes around you | **reference** | – |
| Samurai | E GUARD STANCE | 1.2 s block; the first hit taken triggers a 360° counter | generic crouch, shield arc, gold ring; the counter is only a ring and text | 4 |
| Samurai | F WAR CRY | radial stun, haste and rage | generic `roar` shake with two rings | 4 |
| Samurai | R DRAGON CLEAVE | dash and explode | **reference** | – |
| Onmyoji | RMB SPIRIT FOX | homing piercing orb (2 on a full charge) | generic cast, an orange ball with a particle tail | 4 |
| Onmyoji | Q SHIKIGAMI | 2 orbiting spirits shoot homing shots for 7 s | generic cast, two 7×2 paper rectangles, plain dots | 4 |
| Onmyoji | E BARRIER | shield of 30% HP for 6 s | generic guard and ring; nothing shows while the shield holds | 5 |
| Onmyoji | F HEALING CIRCLE | heal zone for 5 s that also hurts foes | generic plant, a flat green disc with little crosses | 3 |
| Onmyoji | R DRAGON SPIRIT | summoned dragon along the aim | **reference** | – |
| Wizard | RMB VOID ORB | slow piercing orb | generic cast, a coloured orb | 4 |
| Wizard | Q CHAIN LIGHTNING | bolt chaining between 4 foes | generic cast, lightning lines | 3 |
| Wizard | E SPIRIT WARD | reflects shots for 2.2 s | generic guard, ring | 4 |
| Wizard | F FROST NOVA | chilling blast around you | slam pose and rings | 3 |
| Wizard | R DRAGON DESCENT | delayed huge blast at the cursor | hover lead-in with runes, a big flash | 3 |
| Archer | RMB CHARGED SHOT | piercing arrow | recoil pose, drawn-string frames | 2 |
| Archer | Q ARROW RAIN | volley on the cursor for 1.6 s | generic cast, a disc with streaks | 4 |
| Archer | E EVADE ROLL | roll away and leave a snare | a real roll, a small trap sprite | 2 |
| Archer | F HAWK | hawk fires homing feathers for 8 s | a 9×3 bird blob, plain shots | 3 |
| Archer | R ARROW STORM | 30 arrows rain around the cursor | leap lead-in, fall follow-through, slow-motion | 2 |
| Shinobi | RMB SHURIKEN FAN | fan of 5 shuriken | throw pose, plain grey shots | 3 |
| Shinobi | Q SHADOW STEP | blink behind a foe and stab | blink then stab pose, a real teleport | 2 |
| Shinobi | E SMOKE BOMB | vanish 1.2 s, blind foes | vanish flicker, smoke | 2 |
| Shinobi | F CALTROPS | spike field 5 s | throw pose, a dark disc with dots | 3 |
| Shinobi | R SHADOW CLONES | 3 clones throw kunai 6 s | smoke lead-in, translucent copies | 2 |
| Gunner | RMB HEAVY SLUG | huge piercing round | recoil, a plain big shot | 3 |
| Gunner | Q GRAPESHOT | 11-pellet cone | recoil, plain pellets | 3 |
| Gunner | E POWDER ROLL | roll back, leave a keg | roll, bomb sprite | 2 |
| Gunner | F TRIPOD GUN | turret 7 s | generic plant, turret sprite | 3 |
| Gunner | R SIEGEBREAKER | wide cannon blast | brace lead-in with a drawn cannon, recoil, blast line | 1 |
| Lancer | RMB SPIRAL LUNGE | untouchable spear lunge | lunge pose and spear strike line | 2 |
| Lancer | Q WHEEL SWEEP | 2 spear sweeps around | spin pose (twice) and arcs | 2 |
| Lancer | E DEFLECT | reflect bullets 1 s | generic guard, ring | 4 |
| Lancer | F WAR BANNER | buff zone | slam pose, generic zone | 4 |
| Lancer | R THOUSAND THRUSTS | 20 thrusts over 1.6 s | twirl lead-in, flurry pose, phantom spears | 1 |
| Sumo | all five | push, carry, throw and pin kit | built for this standard (`181-sumo.js`): carried foes, a thrown foe, a spirit yokozuna | 1 |
| Marionettist, Tengu, Kagura, Chimiko (Blood Oracle), Kanemori (Bell Warden) | all five each | shaped projectiles and world objects | built in 0.8.1 (`179-hero-kits.js`): reel hooks, bells, fans, moon and kanji; bodies use generic poses for several | 2 |

---

## Step 3 · Designs

Each ability also lists what gameplay it already has, so the timings line up. Times are in ms. "A→A→F" is anticipation → action → follow-through. All timings live in the `ABTUNE` table.

### Visual language per character
- **Samurai:** steel-white crescents and gold Resolve; one red accent kept for the ultimate. Every motion is done with the sword: a draw, a guard, a cut.
- **Onmyoji:** white paper talismans with red ink, and pale cyan spirit light. The Seimei five-point star is the recurring shape. Everything he makes is paper or spirit.
- **Wizard:** amber runes and void violet; geometric glyph circles.
- **Archer:** bone-white fletching and leaf green; feathers and wind lines.
- **Shinobi:** violet shadow and smoke-grey; things vanish and reappear.
- **Gunner:** black powder smoke, orange muzzle fire, brass.
- **Lancer:** ice-blue steel and banner red; long straight lines.
- **Sumo, Marionettist, Tengu, Kagura, Chimiko, Kanemori:** keep their existing languages: salt/straw, silk thread, wind and feathers, fans and petals, blood ink, bronze bells.

### Samurai (build now)

**RMB IAI CLEAVE**
- **Fantasy:** the draw is invisible; you only see the samurai arrive and the cut appear.
- **Body:** while charging, he crouches with his hand on the hilt (sheathe frame 15). He dashes in the lunge pose, then resheathes: frame 15 with a click and a slow-motion beat.
- **A→A→F:** charge (held) → dash 200 → resheathe 220.
- **Signature:** a white blade line (existing); on resheathe, every foe hit flashes white at once.
- **Impact:** hit-stop 30 ms on resheathe if anything was cut, shake 2.
- **Gameplay:** unchanged. The cuts already land as he passes; the resheathe flash is follow-through only.

**E GUARD STANCE**
- **Fantasy:** a still, low guard: the sword held level across the body, waiting.
- **Body:** a crouched seigan stance (frame 12 squashed) with the katana drawn level in front of him and a gleam running along the blade. A thin gold circle on the floor marks the counter's reach (50).
- **Counter:** when a hit lands he snaps into a horizontal full-circle draw cut. He uses the strike frame and swing pose toward the attacker, and a single white crescent ring of radius 50 closes in 120 ms.
- **A→A→F:** stance 0 → hold up to 1200 → counter 160 → recover 140.
- **Signature:** steel and gold; one crescent, so it doesn't read as Whirlwind's three orbiting arcs.
- **Impact:** counter hit-stop 50 ms, shake 3, white flash on the blade.
- **Gameplay:** the counter radius is unchanged (50), and the ring drawn is exactly that radius.

**F WAR CRY**
- **Fantasy:** a kiai that physically shoves the air.
- **Body:** a quick inhale (squash, 90 ms), then he rears up with the sword raised overhead (frame 10, stretched), then plants (squash 160).
- **Visual:** a large 喝 (KATSU) brush glyph bursts above his head and fades. Two pressure rings made of dust puffs run along the floor. Stunned foes get a star-swirl.
- **A→A→F:** 90 → 120 → 300.
- **Impact:** shake 4, hit-stop 40 ms. No flash; flash is kept for ultimates.
- **Gameplay:** the stun radius (85) equals the outer pressure ring, which reaches it in 120 ms.

### Onmyoji (build now)

**RMB SPIRIT FOX**
- **Fantasy:** a talisman flicked from the fingers bursts into a running fox spirit.
- **Body:** a talisman flick (strike frame 13 with the charm in hand), throw pose.
- **Entity:** the projectile is drawn as a running pixel fox: ears, a pointed snout, a two-frame gallop, and one or two cyan-white flame tails. It faces its velocity and turns as it homes. A full charge sends two foxes.
- **A→A→F:** 100 → flight → on each hit, a bite flash.
- **Signature:** pale cyan and white fox-fire, which no other character uses for a projectile.
- **Impact:** a small bite flash per hit; no shake.
- **Gameplay:** the hitbox is the projectile (r4) and the fox is drawn centred on it.

**Q SHIKIGAMI**
- **Fantasy:** two paper talismans unfold into paper servants.
- **Body:** the cast pose, with two charms flicking up.
- **Entity:** each shikigami is a hitogata, a human-shaped paper doll with head, arms and red ink seal. It hovers and sways. It unfolds over its first 300 ms, growing from a folded slip.
  - When it fires, it leans forward and throws an origami crane: a homing projectile drawn as a little folded crane flapping.
- **A→A→F:** 120 → unfold 300 → 7 s of service → folds back up and burns away in its last 300 ms.
- **Signature:** white paper, red seal, cyan glow.
- **Impact:** none (it's a summon).
- **Gameplay:** the crane is the same homing shot (r2), drawn on it.

**E BARRIER**
- **Fantasy:** five talismans pin a five-point star around him and a dome of light rises.
- **Body:** a hand seal held in front (cast frame 8, squash), then he stands.
- **Entity:** five talismans fly out and stick in the ground at the points of a pentagram (radius 16). Lines of light join them into the Seimei star, and a translucent dome rises over him.
  - The dome cracks as the shield absorbs damage, with crack lines added per 20% lost. When it breaks or expires, the talismans burn away.
- **A→A→F:** 120 → 200 (talismans land, star draws) → holds up to 6 s → burn 300.
- **Signature:** cyan star, white paper.
- **Impact:** on break, a glass-crack flash and shake 2.
- **Gameplay:** the dome shows exactly when the shield is up and how much is left.

**F HEALING CIRCLE**
- **Fantasy:** a gohei wand is planted and a ring of paper wards stands up.
- **Body:** a kneel-and-plant (plant pose), driving the wand into the ground.
- **Entity:** the gohei stands at the centre with its zig-zag paper streamers fluttering. Eight ofuda stand on end around the radius and sway. A slow-turning star is traced inside, and soft green-white motes rise only where it heals.
- **A→A→F:** 150 → 5 s zone → the ofuda fall flat and fade 300.
- **Signature:** paper and pale jade; no flat disc.
- **Impact:** none.
- **Gameplay:** the ring of ofuda sits exactly on the healing radius.

### The rest of the roster (built in the second pass)
Each entry gives the fantasy and what was built. Timings are in `ABTUNE`, and every visual reach equals the gameplay reach.

- **Wizard** (`193-wizard-motion.js`): amber runes and void violet.
  - **RMB Void Orb:** the staff is drawn back and thrust (260 ms); the orb is a small black hole, a dark core inside a turning violet disc, drawing motes in.
  - **Q Chain Lightning:** the body jolts with the current (260 ms); the bolt is forked and jagged and re-strikes every 40 ms while it holds (250 ms), with a white burst on each foe.
  - **E Spirit Ward:** the staff is planted; four rune tablets orbit him as the shield, passing in front of and behind him, and one flares each time a shot is thrown back. This replaces the flat bubble.
  - **F Frost Nova:** the staff slam (existing); a ring of ice spikes erupts outward to the exact blast radius in 150 ms, holds for 300 ms, then shatters. The screen flash and plain rings are gone.
  - **R Dragon Descent:** the hover lead-in (existing); a golden dragon's claw falls out of the sky onto the blast over 900 ms and lands as it explodes.
- **Archer** (`194-archer-motion.js`): bone-white fletching and leaf green.
  - **RMB Charged Shot:** a long fletched arrow leaving a wake of wind.
  - **Q Arrow Rain:** she leans back and looses one arrow straight up; the volley falls and the arrows stay stuck in the ground, so you can see where it rained. The damage now starts when the first arrows land, 0.18 s after the cast.
  - **E Evade Roll:** the roll (existing); the snare is a rope noose on a stake.
  - **F Hawk:** a real hawk with three-frame wing beats. It swoops down from 70 px up, circles and banks, and spreads its wings as it throws a feather.
  - **R Arrow Storm:** an arrow is seen falling onto every blast and stays stuck for a moment.
- **Shinobi** (`195-shinobi-motion.js`): violet shadow and smoke grey.
  - **RMB Shuriken Fan:** a sweeping throw; spinning four-point stars.
  - **E Smoke Bomb:** the bomb cracks and 14 puffs billow out and drift.
  - **F Caltrops:** a low underhand toss; twelve jacks bounce out from the hand and land.
  - **R Shadow Clones:** the clones are drawn in his throwing pose when they throw.
  - **Q Shadow Step** was already physical.
- **Gunner** (`196-gunner-motion.js`): powder smoke, orange fire, brass.
  - **RMB Heavy Slug:** a fan of fire and a smoke cloud at the muzzle; a hot iron slug trailing a corkscrew of smoke.
  - **Q Grapeshot:** a cone of fire the width of the spread; pellets as hot shards.
  - **E Powder Roll:** the keg goes up in a fireball, a smoke ring and flying staves, with no screen flash.
  - **F Tripod Gun:** set up leg by leg, then the gun drops onto it; it turns to its target, kicks and flashes on every shot.
  - **R Siegebreaker** was already at standard.
- **Lancer** (`197-lancer-motion.js`): ice-blue steel and banner red.
  - **RMB Spiral Lunge:** now a real lunge (it was a teleport): he travels 360 px/s, and each foe is cut as the spearhead reaches it.
  - **Q Wheel Sweep:** its own move: the full spear sweeps round twice, with the blade trailing. It no longer borrows the Samurai's Whirlwind arcs.
  - **E Deflect:** the spear spun in front of him like a propeller, throwing a spark per shot turned.
  - **F War Banner:** a tall banner with rippling cloth, and pennant stakes on the area's edge instead of a red disc.
- **Kagura, Bell Warden, Sumo, Tengu, Chimiko, Marionettist** (`198-roster-motion.js`): their kits were already built around real objects, so they got body motion for the abilities that used shared poses.
  - **Kagura Rhythm:** stamps and turns on the beat.
  - **Bell Warden:**
    - Iron Bell: an overhead heave before the throw.
    - Sanctuary: kneels in prayer as the bell drops.
    - Echo Notes: strikes the bell.
    - Heaven's Bell: hauls an unseen bell rope twice.
  - **Sumo:** Yokozuna's Ring opens with a leg-raise and stamp (a dohyo-iri) that sends dust rolling out.
  - **Tengu:** Updraft is a crouch and spring; Cyclone is a full fan swing.
  - **Chimiko Harvest:** strains against the threads.
  - **Marionettist Puppet Dance:** fingers working the strings.

## Build log

| Character | Status | File |
|---|---|---|
| Samurai | built (first pass) | `191-ability-motion.js` (also holds the shared core) |
| Onmyoji | built (first pass) | `192-onmyoji-motion.js` |
| Wizard | built | `193-wizard-motion.js` |
| Archer | built | `194-archer-motion.js` |
| Shinobi | built | `195-shinobi-motion.js` |
| Gunner | built | `196-gunner-motion.js` |
| Lancer | built | `197-lancer-motion.js` |
| Kagura, Bell Warden, Sumo, Tengu, Chimiko, Marionettist | body-motion pass | `198-roster-motion.js` |
| Balance and clarity fixes | built | `199-balance-pass.js` |

### Global changes
- **Sigil removed:** the white star sigil (the generic `seal` burst under every hero on E and R) is gone for every hero.
- **No screen flash on basic abilities:** only ultimates flash the screen; shake and hit-stop are kept.
- **Generic burst muted:** the rings and rays from 147 are muted for every ability that now performs itself.

### Bugs found and fixed
- **Siege cannon everywhere:** the Gunner's Siegebreaker cannon was drawn on Heavy Slug and Grapeshot, and during the Sumo's and Bell Warden's ultimate lead-ins. It now shows only for Siegebreaker itself.
- **Spiral Lunge teleported** the lancer instead of lunging.
- **Wheel Sweep** drew the Samurai's Whirlwind arcs.
- **Uwatenage** whiffed on a foe at arm's length (38 px grab); the reach is now 54 px.
- **Harvest and Echo Notes** failed silently with nothing to spend; they now say why.

### Balance and strategy changes
- **Shadow Step with no foe in reach:** a 70 px shadow blink toward the cursor at half cooldown, instead of doing nothing.
- **Thousand Thrusts:** each thrust is trimmed from 0.9× to 0.75× ATK. It dealt about 1.5× the next strongest ultimate on a pack: 133× ATK against six foes, versus 91× for Crimson Moon.
- **Arrow Rain timing:** damage starts when the arrows land, 0.18 s later.

The per-cast damage of every ability (six dummies, evolution 6) is listed in the PR. Nothing else stood out once AoE and single-target roles are accounted for. A 30-second rotation simulation was tried and dropped: positioning noise swamped it.

### Checks (headless, Playwright)
- **Ability sweep (all 13 heroes × RMB/Q/E/F/R):** cast against a pack; no errors, no NaN positions, no stuck poses, and no movement ability fired into a wall ends inside it.
- **Every ability fired at evolution 6 and 9:** each pose ends on its own, with nothing stuck mid-air or mid-pose.
  - Samurai: RMB 0.45 s (lunge + resheathe), Q 0.63, E 1.20 (or as soon as the guard ends), F 0.48, R 0.82.
  - Onmyoji: RMB 0.32, Q 0.43, E 0.47, F 0.52, R 0.93.
- **Cancel:** a dash cancels every new motion. The reference ultimates keep their rooted lead-in, as designed.
- **Visuals match gameplay:**
  - the counter ring is drawn at the counter radius (50);
  - the War Cry rings reach the stun radius (85) in 120 ms, and the stun itself is instant, as before;
  - the healing wards stand on the heal radius;
  - the fox and crane are drawn on their projectiles;
  - the dome shows only while the Barrier's shield is up and cracks per 20% lost.
- **Walls:** no new movement was added. Iai Cleave's dash is unchanged and already wall-checked.
- **Performance:** a busy scene (40 foes, every onmyoji summon, barrier, heal circle, foxes and the ultimate recast every 1.5 s) costs the same with and without these files: update plus render averaged 11–12 ms with them and 10.6–13.4 ms without in software rendering, which is within run-to-run noise.
- **Regression:** no basic attack spins (312 pairs), and the 156-cast ability sweep matches the baseline.

### Timing changes to flag
- **War Cry:** the stun lands on the cast frame, so there is room for only a 50 ms inhale before the shout. A fuller wind-up (about 120 ms) would mean delaying the stun by that much; that is a gameplay change, so it was not made. Say if you want it.

### What real art would improve
- **The 喝 glyph:** a hand-brushed glyph sheet (wet ink, dry-brush edges) instead of the 13×13 pixel bitmap.
- **The fox and crane:** 4-frame gallop and flap cycles.
- **The paper doll:** an unfold flipbook.
- **The barrier dome:** a shimmer texture.
