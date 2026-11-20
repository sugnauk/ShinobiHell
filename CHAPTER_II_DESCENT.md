# Chapter II, stages XVI–XX: the descent beneath the palace (design brief)

## Where it sits
- **Prologues I–III:** Genjuro, Tatsuma, Kageyama.
- **Chapter I, stages I–X:** the march to the castle.
- **Chapter II, stages XI–XX:** from the Jade Palace to the Hollow Throne.
  - **Kept as they are:** Kurogane (XI), the Emperor (XII), Hoshiyomi (XIII), Getsurei (XIV) and Sazanami (XV).
  - **New:** the five stages below the Ferryman's gate, XVI–XX.
  - **After XX:** the endless Abyss opens.
- **How the descent starts:** when Sazanami falls, his gate stands open. The black lake has drained through it, and the road goes down into what it left behind.
- **Technical notes:**
  - New stages are installed with `lateAdd(...)`, after Sazanami.
  - They are marked `remix:false`, so the Abyss keeps remixing XIII and XIV, and Abyss depth records stay stable.
  - Each new stage pushes the Abyss's first index one later. Saves made inside the Abyss are migrated (`R.lateLayout`), the same way they were when XV arrived.

## The rule for every dungeon
Each dungeon has **one idea**, and it reaches the player in three steps:
1. **Teach:** a quiet room near the start shows the idea with little or no pressure.
2. **Combine:** on the approach, the idea is paired with another threat (ranged foes, a pack, a hazard).
3. **Central:** the guardian's fight is built around it.

Each guardian has:
- a **signature attack** with a readable tell, a clear response and an opening to strike back;
- a **second phase that changes a rule** the player has learned.

## The five dungeons

| | Dungeon | Guardian | The idea | Signature attack: tell → response → opening | Phase two changes the rule |
|---|---|---|---|---|---|
| XVI | **The Silt Cellars**: the lakebed under the gate, drowned storehouses, tar vents | **Nebari** | **Mire.** Wet silt grips your feet: you walk at about half speed in it. | **Tar Bloom.** Tell: a dark ring spreads on the floor round the spot he marks, with a gurgle and rising bubbles, for 1.1s. Response: walk out of the ring before it bursts, or dash out. Opening: the bloom drags him into his own tar, so he is **mired for 1.6s** and takes extra posture damage. | **The silt sets.** The patches he leaves harden into stone mounds. They no longer slow you, but they **block shots**, his and yours. He switches to aimed volleys, so the hazard you avoided becomes the cover you need. |
| XVII | **The Lapis Cistern**: a flooded reservoir of blue glass pillars | **Ruri** (approved sprite, still to be added to the repo) | **Reflection.** Glass pillars bounce shots, yours and the enemies'. | **Prism Lance.** Tell: the full bounce path is drawn as a thin line. Response: step off the path. Opening: the pillar it last struck cracks, and she staggers while she recharges. | **The glass shatters.** Pillars stop bouncing shots and hang as shards. Her lance now bounces off the **arena walls** instead, so safe ground moves from behind the glass to beside it. |
| XVIII | **The Ink Archive**: endless scroll stacks and ink wells | **Sumi** | **Ink.** Clouds of ink hide any shot inside them. Lanterns burn clouds away. | **Brushstroke.** Tell: a wet stroke is painted across the room, with one dry gap. Response: cross through the gap before the stroke dries into a wall of shots. Opening: after the third stroke he refills his brush at the inkstone. | **The lights go out.** Shots are visible only near lanterns you light by hitting them, so the lanterns become something you have to tend. |
| XIX | **The Bell Foundry**: casting pits, molten bronze, hanging bells | **Kane** | **Rhythm.** Bells toll on a steady beat, and each toll sends out a ring. Dash through a ring on the beat. | **Great Toll.** Tell: the bell is hauled up and the beat counts down 3-2-1 on screen. Response: dash through the ring on "1". Opening: the bell is stuck in the floor and he has to wrench it free. | **The beat breaks.** The tolls go off-beat and then double-time. The rhythm you learned is now a trap, so you have to watch the bell rather than count. |
| XX | **The Hollow Throne**: the palace's true throne room, at the bottom | **Mukuro** | **Memory.** The hollow emperor borrows each guardian's rule in turn: mire, glass, ink, then bells. | **Hollow Decree.** Tell: the throne's crest shows the next rule's icon. Response: use what that dungeon taught. Opening: he sinks into the throne for 2s after each decree. | **Two rules at once.** In phase two the rules pair up: mire with glass, then ink with bells. After he falls, the floor gives way into **the Abyss**. |

## Difficulty curve
- **Pacing:** these are tier-5 stages. Every new guardian fight is about as long as Getsurei's (`BOSS_HPT` 10.5).
- **Damage:** the danger comes from the rules, not from bigger numbers. Damage follows the existing late-game scaling.
- **Movement:** every warning leaves enough time to get clear at **base movement speed**. A marked area is never larger than base speed can leave in the warning time. Warnings are kept inside the arena's walls, so they stay readable at the edges.
- **Hero types:** melee heroes get the openings (mired, stuck, staggered). Ranged heroes get the cover (phase-two stone, glass angles).

## Prototype: XVI first
XVI is being built as the complete slice:
- the stage itself, with its scenery, foes and story;
- the teaching room, the combined approach rooms and tar vents that preview the signature attack;
- Nebari's full fight.

The slice is used to judge chapter difficulty and visual direction before the other four stages are built.

Nebari uses **temporary art** until the concept sheet is approved.

## XVI prototype: what was built and what testing found
**Built** (`src/205-silt-cellars.js`):
- **The stage:** silt cellars with mooring posts, sunken jars, tar torches and dead reeds, plus its floor art, mood and music.
- **The teaching room** holds wide silt pools and only two slow foes.
- **The approach rooms** have silt among ranged foes, and tar vents that bloom on a 1.1s warning.
- **Nebari's fight:**
  - Tar Bloom, with the 1.6s mired opening.
  - The ladle sweep, the silt spray and the mud volley.
  - "The silt sets" at half health.
  - The Draining event at 28%.
- **Story and route:** XV's campfire line now leads into XVI, and XVI's leads on.
- **His relic:** the Mire Lantern.
- **Temporary art:** Nebari uses concept A until a direction is chosen.

**Testing.** A bot fought him with gear from Test Mode, as samurai, archer, kagura and gunner on keyboard, and archer and sumo on touch.
- **Warnings:**
  - Every warning stays inside the arena: 0 outside, in every run.
  - Every bloom can be walked out of from its centre at base speed through silt, with at least 0.41s to spare.
- **Fight length:** two and a half to five minutes, depending on the hero and how cautiously the bot plays. That is in line with Getsurei and Sazanami, so his health was set to match Getsurei's (2900).
- **Melee damage, before fixes:** melee heroes took most of their damage from contact with his body and from the sweep while standing in silt. Fixed:
  - no contact damage, as in Sazanami's fight;
  - the sweep's warning is now 1.0s and its reach 56px;
  - the spray is used only at range.

**Bugs found on the way:**
- **Every director guardian went passive after its first posture break.** The stagger timer ended at -0.017, and the director attacks only when `!e.stag`. Fixed in `src/24-enemy-ai.js`.
- **Stage XV's music used a scale name the piano did not know** (`insen`). It crashed the game loop when the music started. Fixed with an alias.

**Touch auto-fire range for ranged heroes (fixed after this test).** Auto-fire now uses each basic's real reach, learned from its first shot when it is not in the table, and is capped at 150px. The longest weapons (about 156–169px) are trimmed to 150. Previously: Auto-fire is capped at 130px. Archer, onmyoji, gunner, marionettist, tengu and chimiko basics reach about 170px and are not in `TOUCH_BASICS`. On touch, a ranged hero has to stand closer than on keyboard to keep firing. The cap was set on purpose (the owner found 180 too generous), so it is unchanged here and flagged for a decision.

## Target fight lengths (owner's table)
| Boss category | Target |
|---|---|
| Early-game boss | 45–90s |
| Mid-game boss | 90–120s |
| Late-game boss | 120–180s |
| Chapter I final boss | 150–210s |
| Chapter II major bosses (XVI–XX) | 180–240s |
| Ultimate optional boss | 240–300s |

**Nebari (XVI)** is tuned with `BOSS_HPT` 9:
- **The test bot:** it reads every warning and keeps attacking, so it plays like a careful player. It finishes in about 135–150s with the archer and sumo, and slower with the samurai. The spread between runs is wide.
- **A real player** fights less efficiently than the bot, so should land in the 180–240s window.
- **Still needed:** confirm the length in human playtests.
