# Handoff: ShinobiDungeons 0.8.7 (roster balance and animation pass)

You are continuing work on ShinobiDungeons, a browser pixel-art bullet-hell dungeon game in plain JavaScript. Read `CLAUDE.md` first. It has the house rules:
- Every pull request bumps the patch version in `GAME_VERSION` (`src/00-core.js`), in every `?v=` in `index.html`, and in `CHANGELOG.md`.
- Scripts load in numeric order (`src/NNN-*.js`). Later files extend earlier ones by wrapping, e.g. `{const _x=fn;fn=function(){...}}`.
- For new sprites, draw a large detailed version first, then reduce it with nearest-pixel scaling.

## Where things stand
- **Branch:** `roster-balance`, also pushed as `claude/jolly-newton-hw5grc`. It is based on `archer-wizard-rework`, which is 0.8.6 and PR #45 into `develop`, still open. Merge #45 first, then open a PR from `roster-balance` into `develop` titled `0.8.7: ...`.
- **Version:** already bumped to 0.8.7, and the CHANGELOG has a 0.8.7 section.
- **Done in 0.8.7:**
  - Shrine offerings can be tapped on mobile: a `mode==='event'` click handler at the end of `src/183-touch.js`.
  - Mobile auto-aim range is `TOUCHAIM=130` (was 180) in `src/183-touch.js`.
  - The damage changes listed under "Balance changes already made" below.

## The owner's latest feedback (the brief)
> "Sumo the Q and E are good. the F and R animations need work. This character balancing needs a look at in whole. Same for the characters that I added. Their abilities are great and fun, but the animations dont all look in line with what we have at the moment, and also possibly need balancing. For example the tornados both stun and immobilise enemies and the character has two of them. which does feel fun/powerful but possibly too much?"
>
> "The auto aim on mobile feels slightly too good as some of the ranges offered are very generous."

The added heroes are:
- Marionettist
- Tengu
- Kagura
- Chimiko (internal key `bloodoracle`)
- Kanemori the Bell Warden (`bellwarden`)
- Sumo

## Balance measurements
These come from a headless Playwright bench. Every hero was run at stage VII, form 6. Each ability was cast once against 6 pinned dummies (pack) and against 1 (single). Damage is in multiples of ATK, per second of cooldown. The RMB cooldown includes the 0.6s charge.

Bench gotcha: an earlier version seeded `Math.random` with a weak LCG (seed 12345, ×16807). Its first values were tiny, so every chance roll succeeded and some figures were inflated about 4×. Use a well-mixed generator such as mulberry32. Melee basic attacks need the dummy about 24 px away.

These numbers are from before the 0.8.7 changes.

| hero | basic single/s | abilities single/s | abilities pack/s | crowd-control s/s |
|---|---|---|---|---|
| wizard | 11.8 | 9.0 | 17.2 | 3.48 |
| archer | 9.5 | 12.2 | 35.3 | 0.84 |
| samurai | 8.8 | 10.5 | 43.2 | 1.69 |
| shinobi | 14.3 | 7.7 | 40.2 | 0.82 |
| onmyoji | 8.1 | 12.4 | 28.3 | 0.86 |
| gunner | 10.4 | 9.8 | 33.3 | 0.85 |
| lancer | 4.5 | 11.2 | 46.0 | 3.21 |
| sumo | 2.6 | 8.2 | 22.2 | 2.57 |
| marionettist | 8.5 | 9.0 | 22.4 | 3.80 |
| tengu | 7.5 | 4.5 | 24.2 | **5.45** |
| kagura | 16.1 | 5.4 | 21.6 | 0.17 |
| chimiko | 9.3 | 5.0 | 28.7 | 0.81 |
| bellwarden | 12.4 | 7.6 | 26.4 | 1.15 |

Ultimates, damage per cast as pack / single:

| ultimate | pack | single | note |
|---|---|---|---|
| Lancer Thousand Thrusts | 146 | 29 | too strong |
| Archer | 111 | 15 | |
| Onmyoji | 106 | 23 | |
| Shinobi | 89 | 16 | |
| Bell Warden | 80 | 15 | |
| Wizard | 72 | 11 | |
| Chimiko | 69 | 10 | |
| Marionettist | 69 | 8 | crowd control 36 |
| Samurai | 68 | 9 | |
| Gunner | 67 | 11 | |
| Tengu | 60 | 10 | crowd control 32 |
| Kagura | 46 | 25 | |
| Sumo Yokozuna's Ring | 34 | 6 | far too weak |

Buff and utility abilities (Rhythm, Pirouette, Harvest, Echo Notes, Blood Mirror, Swap Doll) score 0 by design.

### Reading of the measurements
- Most added heroes trail the originals on damage. Tengu leads everyone on crowd control: its Cyclone (F) and Heaven's Gale (R) both pull foes in and stun them for as long as they stay in the funnel.
- Sumo's basic attack is very low (2.6). He has +60% HP and takes 15% less damage, but he still needs more.
- Lancer's ultimate is the outlier at the top.

### Balance changes already made (0.8.7)
In the `KITDEF` table in `src/179-hero-kits.js`, `src/181-sumo.js` and `src/199-balance-pass.js`:

**Tengu**
- Gust ×1.3 → ×1.45.
- Wind Cutter ×1.05 → ×1.4.
- Cyclone tick .26 → .3.
- Heaven's Gale lasts 3.5s → 3s.

**Kagura**
- Silk Veil ×1.5 → ×1.75.
- Fan Waltz .62 → .74.

**Chimiko**
- Blood Brush ×2.4 → ×2.7.
- Blood Seal ×1.3 → ×1.8.

**Marionettist**
- Cursed Thread ×1.3 → ×1.5.

**Sumo**
- Tsuppari ×1.25 → ×1.6.
- Uwatenage ×2.3 → ×3.
- Yokozuna's Ring stomp is .45 → .8 of the ring's power, and its lift .15 → .25.

**Lancer**
- Thousand Thrusts `BAL.flurry` .75 → .65.

None of these has been re-measured yet. Re-run a bench to confirm.

## To do next

### 1. Tengu tornado crowd control (the main balance ask)
`tenCyclone` in `src/179-hero-kits.js` is used by both Cyclone and Heaven's Gale. Every frame, any non-boss foe inside `z.r` gets `stun .15`, `e.z` lift and `spun`, so it is held for the whole duration.

Plan: track how long each foe has been in the funnel (`e.cycT`). After about 1.0s (perhaps 1.4s for the big Gale), fling it outward with a `hurtE(..., {kb: angle out, kbm: ~2.5})` hit. Then give it `e.cycImm = R.time + 1.5`, during which the pull and stun skip it, though tick damage can still hit. The result is still chaotic and fun but no longer a permanent lock.

`tenCyclone` is a global function declaration, so a later file can redefine it, or you can edit it in place. Update the ability text in `ABTXT` (the `'CYCLONE'` and `"HEAVEN'S GALE"` entries near line 463 of 179).

### 2. Sumo F (SHIKO) animation
`sumShiko` is in `src/181-sumo.js`. It currently plays the generic `'slam'` pose and the generic F "juice": two big expanding rings from `castShow` in `src/147-juice.js`.

Plan:
- Add `'SHIKO'` to `ABX_OWN`, which mutes the generic juice (defined in `src/191-ability-motion.js`).
- Make a real shiko pose: one leg raised high to the side and held, then stamped down. Sumo frames are drawn entirely by `drawSumoFrame` (redefined in 181). Frame 15 is unused by the Sumo, so turn it into a leg-raised frame. Clear `HEROC` entries that start with `sumo` afterwards.
- Add a new pose kind (pattern in `src/198-roster-motion.js`, `abPoseAt` wrapper): frame 15 for about the first 75%, then a squash on the stamp at about 0.42s, when the zone's `end()` fires.
- Add a crisp pixel dust shockwave ring on the stamp (see the `u_dohyo` stamp `topFx` in 198 for the style) alongside the existing floor cracks.

### 3. Sumo R (YOKOZUNA'S RING) animation
The "spirit yokozuna" at the end of `sumRing` in 181 draws `heroSpr('sumo',9)` at 4× and 38% alpha. Over the floor it reads as a muddy brown hut.

Plan:
- Replace it with a glowing pale-gold spirit: a tinted copy of the sprite built with `source-atop`, plus a light outline from `whiteOf`. Draw it towering behind the hero, possibly in a zone `ground()` so it sits under enemies.
- It should perform the shiko: leg up, then a stamp at 0.6s, when the ring's stomp lands.
- Make the lead-in (`case 'u_dohyo'` in 198) use the same leg-raise frame.
- Optionally tone down the ring's floor disc (`wdisc` alpha .18) so the straw bales read crisply.

### 4. Make the added heroes' animations consistent
- Grand Theatre (Marionettist) and Crimson Moon (Chimiko) still use the generic rune circle drawn for `u_hover` and `u_kneel` in `src/168-ult-anim.js`. They are set in `ULTSEQ` around line 449 of 179 with `runes:1`.
- Give them their own lead-in kinds:
  - Grand Theatre: violet strings coming down from above to the hands.
  - Crimson Moon: a dark red blood pool spreading under the kneeling hero.
- Approach: new pose cases plus a `drawPlayer` wrapper, as 168 does.
- The owner has rejected these generic touches elsewhere: star and pentagram sigils, white screen flashes on non-ultimates, rune tablets, and backdrops behind summons. They prefer area indicators that show what an ability covers.

### 5. Mobile auto-aim, optional further step
Instead of one fixed range, lock on only to foes within the current basic attack's real reach, for example a per-class reach table, with a little slack.

### 6. Verify and ship
- Load the page headlessly with no errors.
- Cast every slot for every hero.
- Re-run the bench.
- Take screenshots of the reworked animations for the owner.
- Update `CHANGELOG.md` under 0.8.7 (or bump to 0.8.8 if 0.8.7 has already been released).

## Useful code facts
- **Poses:** `AB_ANIM[name] = [kind, dur, p]`.
  - `abPoseAt(H)` returns frame, dx, dy, sx, sy, skew, rot and so on.
  - Hero frames: 8/9 cast, 10 arms up, 11 dash, 12 wind-up, 13 strike, 14 follow-through, 15 hilt.
- **Ultimate lead-ins:** `ULTSEQ[name] = {pre, iv, k, ...}`, played as pose `'u_' + k`.
- **Drawing layers:** `topFx({dur, draw(o,k)})` draws above the sprites. `kitZone({t, step, end, ground, top})` is a generic zone.
- **Helpers:** `HSX/HSY` (screen position), `kLine`, `KR`, `wdisc`.
- **Damage:** `hurtE(e, dmg, posture, {src, kb, kbm, slash})`.
- **Ability-name order per hero:** `m` (basic), `h` (RMB), `q`, `w` (E key), `f`, `e` (R key, the ultimate).


## Guardian sprite rework (0.8.10), and what is still to do
The owner asked for complete sprite reworks of **Sazanami, Mukuro, Sumi, Nebari, Ruri and Kane**. Only Sazanami exists in the repo. The other five were never pushed (they are not on any branch), so add them with the same method once their code is in.

**How the new guardians are drawn** (`src/204-guardian-redesign.js`):
- `hiArt(paint)` paints a frame at twice the size (144x152, centre x 72, feet at y 146) with canvas shapes: `poly`, `ell`, `ln`, `limb`, `rect`, and `pt` for the 1x pose points.
- It then reduces each 2x2 block to one pixel: the most common colour wins, and a tie goes to the darkest, so draw outlines and creases 2 px wide.
- Register the art with `humBoss(name, hiArt(...), {idle0, idle1, atk}, {sc})`, then call `hiPoses(name, [farArm, nearArm])` to get walk, wind-up, follow-through, cast and flinch frames.
- Render sheets to check them by calling `bossArt(name)` with `ARTHURT` false and then true (the second form).

**The owner's taste:** no shirtless or bare-chested looks ("they look effeminate"). Armour, heavy coats and readable weapons work well.
