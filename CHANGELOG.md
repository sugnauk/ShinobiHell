# Changelog

## 0.8.2: Prologues II and III, mobile play, Sumo can heal, primary attacks never spin, line weapons fire projectiles

- **Prologues II and III (new: `184-prologues.js`):** the road from the burning village to the bamboo is now three short stages before stage I, each a little harder than the last, and each guardian teaches one thing.
  - **I. The Burning Village:** Goro, the bandit captain. Big telegraphed swings and charges, and slow fans of shots.
  - **II. The Flooded Fields:** Kurobe, the river pirate, ships the village's stolen rice downriver. He teaches bullet patterns: water rings off his oar, spray spirals, floating jars that burst. He also calls his river rats in to fight.
    - A burly, bearded pirate in a sea-blue headscarf and an open indigo happi coat with a white wave hem, tattooed forearms, a rope and clay jars, and a long boat oar. In his second form his hair is wild and wet and he holds a lit fire-jar.
  - **III. The Hill Watchtower:** Kageyama, the tower captain, a sharp-eyed archer. He teaches aimed shots: volleys straight at you, sniper arrows down a warning line, and an arrow rain. Dash through them.
    - He wears samurai archer armour: a lacquered jingasa helmet with a gold crest, a dark red half-mask, laced plates, big shoulder plates, skirt plates and iron shin guards. He carries a katana and a quiver, and his great bow is bound in rattan and gripped below its middle. In his second form he wears a bloodied headband.
  - **Goro, refined:** a stitched leather vest with a fur collar, a muscled and scarred chest, wrapped forearms, a sake gourd on his rope belt, straw sandals, a cloth-wrapped machete hilt, and long headband tails.
  - **Flow:** the campfire after each prologue leads on to the next, and after III to stage I. The master's words tie the story together: the village, then the rice on the pirate barge, then the watchtower that signals the warbands, then the bamboo.
  - **Evolution:** only Kageyama makes you grow, so you still reach stage I one form up, as before.
  - **Like Prologue I:** fewer and weaker foes, and a fall sends you back to the start of that prologue with everything you carry. A saved run continues in the right prologue.
- **Play on a phone or tablet (new: `183-touch.js`):** touch controls switch on at your first touch on the screen.
  - **No cost on PC:** nothing runs, draws or listens beyond a single check. On a touchscreen laptop, moving a real mouse hides the controls again.
  - **Move:** a floating stick anywhere on the left half, with smooth, any-direction movement.
  - **Aim and attack:** a floating stick on the right half aims and attacks while held. When you're not aiming, the aim rests on the nearest foe, so abilities fire at it.
  - **Buttons:** an arc in the bottom-right, above the ability bar: DASH, HEAVY (hold to charge), Q, E, F, R, POTION and USE. Each button dims and counts down its cooldown, and HEAVY fills a ring as it charges.
  - **Top-right:** PAUSE, BAG and SWAP. They also work while the bag or pause menu is open.
  - **Menus, the bag, shops and reward cards:** a tap acts as a click. A tap also closes a tip card.
  - **Phone setup:** the first tap asks for full screen and landscape where the browser allows it, and a notice asks you to turn the device if it's held upright. Phones start one zoom step closer, unless you've picked a zoom yourself. Page zoom and scrolling are blocked.
- **Line weapons fire real projectiles (new: `182-weapon-shots.js`):** Yari Thrust, Kusarigama and Spirit Mirror used to hit everything on a line at once, drawn as a solid spear, chain or beam that shot out and snapped back. Each now fires a projectile that flies out to the same reach and pierces everything on its way, with the same damage and attack speed.
  - **Yari Thrust:** a spirit spear-tip. Every third thrust still throws three.
  - **Kusarigama:** a spinning sickle trailing chain links. It still tugs foes back toward you.
  - **Spirit Mirror:** a fast shard of mirror light.
- **The prologue is a little gentler:**
  - Minions deal 60% damage (was 70%), and the boss deals 65% (was 75%).
  - Rooms hold fewer minions: after the first two, each extra one has a 50% chance to be left out (was 35%). Ambush waves bring one foe fewer, never below two.
  - A prologue now averages about 20 minions instead of 22.
- **Primary attacks never spin:** Naginata Sweep, Dancing Cut and Bell Swing used a half-turn spin on every swing, so holding LMB kept the hero spinning. They now play a swing: a wind-up, a leaning slash toward your aim, and a recovery.
- **A hard rule:** any spin on a primary (LMB) attack always plays as a swing.
- **Heavies keep their spins:** a fully charged Iai Cleave still ends in its spin, and so do Spiral Lunge, Spirit Blade, Moonlit Crescent and Silk Veil.
- **Salt Throw (E) heals Sumo:** 8% of max HP at once, plus 1% for every enemy shot the salt erases, up to 20% a throw. Throwing it into a volley heals the most.
- **Text:** the ability description and tip on character select and in the tooltip say so.

## 0.8.1: new kits for Sumo and the five newer heroes, fewer bags, the old archer

### Five new hero kits (new: `179-hero-kits.js`)
Every ability of Marionettist, Tengu, Kagura, Chimiko and Kanemori was replanned. Most used to be a ring of damage around a point. Now each one moves, controls, blocks or redirects something. Their shows come from shaped projectiles, objects in the world and the hero's pose, not particle clouds.

**Marionettist: controls foes on strings**
- **Silk Needle (LMB):** a needle trailing silk. Each hit stitches the foe, up to 3 stitches.
- **Reel In (RMB):** a hook on a string yanks the first foe to you, stunned. Stitches add damage. A boss pulls you to it instead. Full charge: pierces and reels up to 3.
- **Cursed Thread (Q):** a spool ricochets between up to 5 foes and links them. Hit one and the others hurt. Linked foes are tethered and can't spread apart.
- **Swap Doll (E):** leaves a wooden doll and leaps you back. Nearby foes attack the doll for 3s, and it soaks up to 8 shots.
- **Puppet Dance (F):** lifts a foe on strings for 3s. It follows your cursor, and you smash it into the others. A boss is bound and slowed instead.
- **Grand Theatre (R):** a giant puppeteer's cross-bar appears overhead. Strings hoist up to 10 foes into the air, then yank them together and slam them down.

**Tengu: wind that moves things**
- **Feather Blade (LMB):** two feathers weave around each other.
- **Gust (RMB):** a wall of wind shoves foes back and blows enemy shots back as yours.
- **Wind Cutter (Q):** a spinning blade that ricochets off walls up to 3 times, faster and stronger after every bounce.
- **Updraft (E):** leap on the wind toward the cursor, untouchable, with wings spread. Landing blasts foes away.
- **Cyclone (F):** a real tornado drifts after your cursor. It sucks foes in and spins them around it, catches enemy shots in orbit, then flings them out as yours.
- **Heaven's Gale (R):** a colossal tornado drags the room in while giant feathers dive from the sky onto everything caught in it.

**Kagura: a dancer who reads the beat**
- **Dancing Cut (LMB):** alternating left and right fan cuts build FLOW.
- **Silk Veil (RMB):** a ribbon sweep throws enemy shots back as petals at the nearest foe.
- **Fan Waltz (Q):** two fans fly to the cursor, dance a figure eight there, then return.
- **Pirouette (E):** a spinning dash. Every foe you pass gets a petal that blooms into a cut a moment later.
- **Rhythm (F):** a beat ring closes on you every half second. Hits on the beat deal +60% and build extra FLOW.
- **Lotus Dance (R):** blink-strike foe after foe, untouchable. A lotus grows on each one, and they all bloom at once.

**Chimiko: blood ink and seals**
- **Scarlet Ink (LMB):** a piercing ink dart. Three hits seal a foe. Sealed foes take +20%.
- **Blood Brush (RMB):** paint a brush stroke to the cursor that erupts into spikes. Full charge: the stroke stands as a wall that blocks enemy shots.
- **Blood Seal (Q):** costs 6% HP. A talisman seals the first foe hit, and the seal jumps to 5 more.
- **Blood Mirror (E):** swap places with a sealed (or any) foe. Shots meant for you hit it instead.
- **Harvest (F):** red threads tear blood orbs out of sealed foes. The orbs fly back to heal you, hurting foes on the way.
- **Crimson Moon (R):** a blood moon rises and a giant kanji is painted stroke by stroke. Each stroke erupts, and sealed foes that die burst into seeking lances.

**Kanemori: the temple bell keeper**
- **Bell Swing (LMB):** a wide swing that smashes up to 3 enemy shots for ECHO.
- **Iron Bell (RMB):** hurl the bell on its chain. It stands as a shield that turns shots into ECHO, then is yanked back through foes.
- **Standing Wave (Q):** three sound waves roll forward, shoving foes and destroying shots.
- **Sanctuary (E):** a great bell drops over you: untouchable, and shots that hit it become ECHO. Its toll stuns foes beside you.
- **Echo Notes (F):** every stored ECHO becomes a note that ricochets between foes.
- **Heaven's Bell (R):** a colossal bell falls from the sky and rings 3 times. Each ring freezes every enemy shot, and the last ring fires them all back at the foes.

**Ultimate lead-ins:** each of the five ultimates has its own (rise, leap, twirl, kneel or brace).

### Sumo, renovated (new: `181-sumo.js`)
Every move pushes, carries, throws or pins foes instead of hitting a ring around him.
- **Tsuppari (LMB):** rapid open-palm thrusts, drawn as palms. Every third is a double palm that shoves the foe back.
- **Tachiai (RMB):** the charging clash.
  - You plow forward carrying the first foe you meet and bowl the others aside.
  - Drive the carried foe into a wall for **Oshidashi**: double damage and a long stun.
  - A boss stops you cold and takes heavy posture damage.
- **Uwatenage (Q):** grab a foe, swing it round you to club anything it hits, then hurl it skidding through the pack.
- **Salt Throw (E):** a fan of purifying salt. Each grain erases enemy shots, and the foes it hits are blinded and can't shoot for 2.5s.
- **Shiko (F):** raise a leg high and stomp.
  - Cracks race through the floor to the 3 nearest foes, and rock spikes launch them into the air.
  - The stomp crushes shots at your feet.
- **Yokozuna's Ring (R):** a towering spirit yokozuna stomps behind you, and a straw sumo ring forms with its four coloured corner tassels.
  - For 6s, foes inside can't walk out, and shots from outside stop at the rope.
  - You deal +40% inside.
  - Any foe you shove, charge or throw out of the ring takes massive **Oshidashi** damage.
- **Sprite:** the original compact shape, now with detail:
  - A face with eyes, cheeks and a mouth, a topknot, belly shading and a navel.
  - A mawashi with its knot and hanging fringe, and knuckled fists.
  - Middle forms wear an embroidered apron instead of armour plates.
  - The final form is a yokozuna, with the white braided rope, paper zigzags and a ginkgo-leaf topknot.

### The five newer heroes' looks
- **Marionettist:** a white porcelain mask, and a little marionette doll dancing on strings at her side.
- **Tengu:** the red long-nosed face, a wild white mane, a black tokin, and folded black wings that spread wide in the final form.
- **Kagura:** a shrine dancer: long black hair, a gold crown with dangling ornaments, a white kosode and red hakama.
- **Chimiko:** a blood miko with a red ribbon and a seal talisman floating at her side, and a halo of seals in the final form.
- **Kanemori:** a bronze temple bell strapped to his back and prayer beads, and a golden halo in the final form.
- **Final forms:** each keeps its own headwear instead of the samurai helmet they all shared.

### Archer
- **The old archer sprite is back:** the awakened and final-form overlays from 0.8.0 no longer cover it.

### Bags (new: `180-bags.js`)
- **Five bags instead of twelve:** a bag looks like the best thing inside it: common, uncommon, rare, epic or legendary. Take the best item out and the bag changes to match what's left.
- **One bag per foe:** no foe drops more than one bag.
- **Random drops instead of last-kill bags:** rooms no longer give a bag to the last foe killed. Every minion has its own chance to drop one: about 8% of basic foes, 26% of heavy foes and 78% of elites.
  - Foes in ambush and challenge rooms carry better odds, and those rooms pay a little more gold.
  - Bosses and mini-bosses keep their trophy bags.

## 0.8.0: Character overhaul

- Expand the playable roster to thirteen with Marionettist, Tengu, Kagura, Chimiko and Kanemori.
- Sumo has innate damage reduction, an aimed Toss with collision and landing damage, and a Grand Slam that knocks enemies up and damages them again on landing.
- Original characters gain combat techniques tied to their existing moves and evolutions. Final forms feature new looks and effects.
- Show class resources during combat.
- Pace updates and drawing to a maximum of 60 FPS on high-refresh displays.
- Awaken at evolution V with new sprites and an ultimate aftershock. At evolution IX the final form enlarges and strengthens that aftershock. Preview all three forms in character selection.
- Give the five new heroes distinct weapon sprites and Shinobi a Shadow Katana with its existing attack. Rename Blood Oracle to Chimiko and Bellwarden to Kanemori while keeping their saved mastery.
- Give survival bosses a visible shield and an invulnerability label. Telegraph a blast and aimed volley when players linger against walls or at long range. Keep enemy room centres more open.
- Lower base dash invulnerability from 0.22s to 0.18s. Shadow Step relics shorten cooldown only. Dash uptime is capped at 40%, perfect dodges refund up to 0.15s of dash cooldown and 0.2s on Q, E and F, and random dodge chance is capped at 30%.
- Test Mode shows the share of combat spent in i-frames. Press J to reset the sample.
- Character mastery now goes to level 50, carries existing XP and unlocks forward, and adds cosmetic rewards. The Temple Skill Tree remains shared.

## 0.7.4: Iai Cleave becomes a dash, and stat potions are gone

### Stats: no more stat potions
- **Stat potions (elixirs) are gone.** They gave permanent saved points, so long-played saves kept growing stronger.
- **Where the six stats (ATT, DEF, SPD, DEX, VIT, WIS) come from now:**
  - **Hero base stats:** each hero has their own, the knob for balancing heroes (wizard ATT 3 / WIS 3, archer DEX 3 / SPD 3, samurai DEF 3 / VIT 3, shinobi SPD 3 / DEX 2 / ATT 1, onmyoji WIS 3 / VIT 3, gunner ATT 4 / DEF 2, lancer ATT 2 / DEF 2 / VIT 2).
  - **Relics:** every relic also grants points in the stat that fits it (+2 common and uncommon, +3 rare, +4 legendary), shown on its description.
  - **Enchants:** every enchant stack grants +2 of its stat (Flame and Venom and Blast ATT, Frost WIS, Storm DEX, Leech VIT, Gale SPD).
  - **Rings** keep the stats they roll.
- **Loot:** bags that used to hold an elixir now hold a relic (60%) or an enchant.
- **Old saves:** every elixir point already collected is refunded as 25 jade, with a message at the start of the next run.
- **Display:** the pause screen shows each stat as hero base + bonuses; the guide's stat pages explain the new sources.

### Samurai
- **Iai Cleave (RMB) is a short dash with a cut:**
  - The samurai darts about 40px along the aim, and is untouchable for the dash.
  - Every foe on the way, and just ahead of the blade, is cut once (same damage and stun as before, about the same reach).
  - On a full charge, it also cuts the enemy shots the dash passes through.
  - Uses the lunge motion, and the blade cut is drawn along the whole dash when it ends.
- **Description updated** on character select and in the tooltip.

## 0.7.3: ability animations, ultimates, strikes, revives and a gentler start

### A gentler start
- **No forced tutorial:** a new player's first run starts straight away.
  - The first stage teaches as you play, opening with a paused controls card (move, aim, attack, heavy, dash, abilities, potion, interact, pack, guide) and then the one-time tips.
  - The tutorial is on the main menu, now called **TUTORIAL**, marked NEW until played.
  - A new player's death screen points to it.
  - Finishing or skipping the tutorial returns you to the main menu, with NEW RUN selected.
- **No potion is used for you:** the low-health tip only closes on C or ENTER. Drinking stays your call; the tip just reminds you that C drinks a potion.

### Fixes
- **Ronin Seven crash:** a member dying while its dash-aim telegraph was still up could crash the game. The telegraph now stops following a fallen member.

### Coming back from the dead
- **Revive sequence:** a revive still happens on its own, but it is now an event.
  - The world freezes and darkens for about a second and a half.
  - Your hero falls, their spirit rises out of the body, and a pillar of golden light comes down and draws it back.
  - They rise to their feet in a burst of light, with a REVIVED banner and how many revives are left.
  - Then the world moves again, with the usual push-back and cleared bullets.

### Interactables come alive
- **No more markers:** the pillar of light, ground ring and bobbing icon over shrines, springs, chests, gongs and prisoner cages are gone.
- **Their own particles instead:** like the blood shrine, each now shows itself with gentle particles in its own colour, and goes quiet once used:
  - Shrines: spirit motes rising, with the odd twinkle.
  - Springs: bubbles and a cool mist, with sparkles on the water.
  - Chests: gold glints, or red embers while still sealed.
  - Gongs: a golden hum of sparks.
  - Cages: the prisoner's colour drifting up through the bars.

### Effects that never hide a bullet
- **Ultimates:**
  - There is no full-screen flash. A brief glow at the screen edges, in the ultimate's colour, replaces it.
  - There is no ray burst, and one ring replaces three.
  - Every spark burst is cut to a handful, including the blasts an ultimate calls down.
  - The lead-in and dragon motes are thinned out.
  - Particles on screen during an ultimate are roughly halved for every hero (the lancer's drop from 81 to 21 at peak).
- **Legendary items:**
  - Legendary weapons and armour keep their colours and character, but shed about a third as many motes.
  - The motes are drawn fainter, so they never read as enemy bullets.
  - At most 70 motes are on screen at once; in testing a legendary staff peaked at 241 before.

### Straight-line strikes
- **Drawn as what they are:** every line attack used to draw the same thin line. Damage and hitboxes are unchanged:

| Strike | Abilities | What you see |
|---|---|---|
| Spear | Yari Thrust, Spiral Lunge | a spear drives out to the full reach, flashes at the tip, and snaps back |
| Phantom spears | Thousand Thrusts | spectral spears stab out one after another, while a fan of phantom spears hovers behind the lancer |
| Blade | Iai Cleave, Dragon Cleave | a thick, tapered cut of light splits apart in the air, shedding sparks |
| Chain | Kusarigama | chain links lash out with the sickle blade on the end |
| Beam | Spirit Mirror | a glowing beam thins away from a mirror flash |
| Blast | Siegebreaker | a cannonball tears down a trail of fire and smoke, with shock rings, instead of five thin lines |

### Ultimates with a show
- **Lead-in and follow-through:** pressing R plays a short lead-in before the ultimate fires. You are invulnerable and rooted for it, energy rushes in, and then the follow-through plays:

| Ultimate | Lead-in | Follow-through |
|---|---|---|
| Dragon Cleave (samurai) | rises into the air, the dash line burning gold, then leans forward into the line, blade drawn back | a streak of afterimages along the path, then a landing slam |
| Arrow Storm (archer) | leaps high and looses the storm from the top of the leap | drops back down |
| Shadow Clones (shinobi) | vanishes in smoke as three shadows split away | reappears among them |
| Siegebreaker (gunner) | swings a massive banded iron hand-cannon off the back and levels it, trembling while the muzzle glows | fires it with a flash and kick, is shoved back, then puts it away |
| Thousand Thrusts (lancer) | twirls the spear overhead | the flurry |
| Dragon Spirit (onmyoji) | kneels inside a circle of runes | rises as a fearsome spirit dragon's head swims along the aim line over the blasts: midnight-blue hide, a spiked mane, swept-back horns, a red eye under a jagged brow, gaping fanged jaws breathing cold fire. It is drawn under the bullets |
| Dragon Descent, Meteor Rain, Talisman Storm, Stopped Time | float up inside turning runes (a clock face for Stopped Time) | the release |

### Prologue
- **First rooms are fights:** the first two rooms along the road are always fights. The trader, shrine and curse altar sit further on.

### Ability animations
- **Every ability acts out its own motion:** the hero's body now plays a motion that matches what each ability does, over several frames, instead of one generic cast or swing. It is built from the hero's sheets (front and back views) and pose transforms:

| Motion | What you see | Used by |
|---|---|---|
| Spin | a real turn: front, side, back, side, front, with a ghost trailing it | Whirlwind (3 turns), Wheel Sweep (2), sweeping heavies (half a turn), Talisman Storm |
| Thrust and lunge | wind back, then lunge forward with afterimages | Yari, Iai Cleave, Flame Wave, Dragon Cleave, Spiral Lunge (which spins at the end on a full charge) |
| Flurry | rapid alternating thrusts | Thousand Thrusts |
| Slam | rise, stretch, then crash into a squash with dust | Odachi, Frost Nova, War Banner |
| Cast and big cast | arms raised and hovering, or the ultimate pose rising and releasing with a ring at the feet | spells and ultimates |
| Throw | a quick wind-up and release | kunai, shuriken, caltrops |
| Recoil | the body kicks back with the shot | Tanegashima-style heavies, Heavy Slug, Grapeshot, Siegebreaker |
| Roll | a full head-over-heels roll | Evade Roll, Powder Roll |
| Guard | crouched behind a glowing shield arc | Guard Stance, Spirit Ward, Barrier, Deflect |
| Vanish | fades out in the smoke | Smoke Bomb, Shadow Clones |
| Blink | pinches to a line and snaps open | Kitsune Step, Shadow Step (which then stabs) |
| Plant | kneels to set something down | totems, the tripod gun, circles |
| Roar | rears up and shakes | War Cry |

- **Charging a heavy:** the hero crouches and trembles while you hold RMB, and flashes when the charge is full.

### Ability descriptions
- **Rewritten:** all 68 abilities (basic attacks, heavies, Q, E, F and ultimates for every hero, and the rare scroll spells) have new descriptions. Each one says plainly what the ability does, adds a second line when it needs one (full-charge effects, durations, what stuns or freezes), and gives a green **TIP** on how to use it well.
- **Character select:** shows the description and tip, and the header names the ability type and its cooldown. Ultimates note that kills cut their cooldown.
- **In-game tooltip** (hover an ability slot): the description, the live damage and cooldown, then the tip. The technical "FORMULA" lines are gone.
- **Fixed claims:** Spirit Blade and Whirlwind no longer say they cut bullets. Only a full-charge heavy, or the Bullet Cleaver scroll, does that.

### Tips
- **Moving never closes a tip:** you are usually already moving when one appears.
- **Reading time:** every tip stays up at least 0.9 seconds.
- **How each tip closes:**
  - the stage-start, shop, shrine and curse altar tips close with G or ENTER
  - guardian tips close with dash
  - a key already held down also works
- **Start tip timing:** it shows as the stage loads, and the province map waits until it is closed.

### The Burning Village
- **Wall tops:** no more black slabs floating above the walls (also in Burning Castle Town).
- **Furnishings:** the prologue is furnished like a burnt village (rubble, charred beams, braziers, ember light) instead of stage I's bamboo camp.

## 0.7.2: the prologue, allies, honest damage and daily pacts

### Bosses
- **Veteran:** each run a hero wins makes that hero's next runs a little harder and better paid. It is per hero, up to Veteran V. Each level gives foes and guardians +8% health and +5% damage, and you get +10% jade. Your own power is never looked at, so a god run stays a god run. It is not applied to the prologue, training, the daily challenge or boss rush, and character select shows each hero's level.
- **Armour floor:** whatever you stack, a hit always does at least half its damage. Defence and Iron Body could cut it to a third before.
- **Guardians always hurt:** a hit from a guardian or anything it summons does at least 4% of your max health (bullets) or 8% (blows, charges, hazards), scaled by difficulty. Wards, shields, dodges and dashes still stop it.
- **No skipping phases:** a guardian's health stops at its next phase threshold. Extra damage does nothing: the boss turns invulnerable for a moment and the next phase begins. It can only die after every phase has been played.
- **Longer survival phases:** every survival phase lasts 50% longer.
- **Rage:** eight guardians fly into a rage in their last 15% of health, with a red banner and glow and 20% harder hits:
  - Charge: Akagane, Kusakari, Onikuma and Kurogane charge along a telegraphed red line.
  - Flee: Tetsuo, Kage and Tamamo back away and fire as they go, and Kage also vanishes across the arena.
  - Frenzy: Itohime turns much faster.

### Tutorial
- **About a minute of action:** the ten-trial tutorial is cut to four quick beats, one new key at a time, with Master Kaito shouting from the side:
  1. AMBUSH! Straw bandits rush in from both sides: walk, aim and LMB.
  2. ARROW STORM: dash through two volleys. A perfect dodge clears it at once.
  3. THE STRAW OGRE: a giant dummy with a health bar slams red circles at you. RMB and all four abilities unlock with near-instant cooldowns.
  4. JACKPOT: the ogre bursts into a treasure bag and gold, and the portal opens beside you.
- **Taught later instead:** potions, bags, shops, shrines, curse altars, stuns, elites, guardians and their invulnerable events are now one-time tips when you first meet them. Curse altars and guardian events are new tips.
- **Tips only on the first stage:** one-time tips now only appear on a run's first stage (the prologue, or stage I), and are never shown or used up elsewhere. While a new player still has tips to see, that stage always holds a trader, a shrine, a curse altar and an elite, so it teaches everything.
- **Tips pause the game:** when a one-time tip appears, the fight freezes and a compact card sits at the top of the screen. Play resumes when you do what it suggests: C to drink, dash to get away, an ability, G for a bag. The press also does the action, except at shops, shrines and curse altars, where G only closes the tip and never buys, prays or accepts a curse. ENTER always works as "got it".
- **No damage in training:** bullets and blows still hit you, with the flash and sound, but take no health. A "HIT" marker shows where a number would.

### Prologue I: The Burning Village
- **The stage:** a gentle opening stage before stage I, with fewer and weaker foes. Its layout is one winding road from the start to the guardian: every room is on the way, with no dead ends or detours. It is on by default, and P on character select switches it off.
- **The boss:** Goro, the Bandit Captain, a new teaching boss with his own sprite and a second form.
- **Falling here:** Master Kaito pulls you out. You restart the stage with everything you carry, and opened chests, killed foes and used shrines stay as they were.

### Story encounters
- **Prisoners:** prisoners of the Emperor are caged in fight rooms; the Iron Cellars hold two. Clear the room and free them.
- **Allies:** freed prisoners sit at the campfire and help for the rest of the run:
  - Hanzo the Smith: +5 power.
  - Oyuki the Healer: a full heal at every fire.
  - Genji the Peddler: shops 25% cheaper.
  - Aya the Scout: every later stage's map revealed.
  - Takeda the Ronin: fights at your side.

### Foes and fights
- **Foe health:** +30% for every stage foe, scaled by body size and speed. Big, slow foes are tougher; small, quick ones are frailer.
- **Elites:** more of them, with four new elite powers: Giant, Berserk, Splitter and Vampiric.
- **Ambushes:** they seal a smaller arena with solid palisade walls, so foes can no longer get stuck where you can't reach them.
- **Blades and bullets:** blades no longer cut bullets. Only the very rare legendary scroll card BULLET CLEAVER grants it, to melee heroes.

### Music and modes
- **Boss themes:** every guardian has its own melody in the piano score.
- **Hero mastery:** heroes level I to X from their runs, unlocking starting weapons (Q/E) and colour schemes (Z/C).
- **Daily challenge:** the same stages and hero for everyone each day, harder and better paid, with your best kept.
  - **Always:** foes have +15% health and damage, and the run pays +25% jade.
  - **Pact bonus:** the more pacts, the bigger the payout. Jade grows exponentially, ×1.3 for every pact after the first: 2 pacts give ×1.3, 3 give ×1.69, 4 give ×2.2 and 5 give ×2.86, on top of each pact's own jade.
  - **Two to five pacts a day, all at once:** each pact is a trade, a drawback paired with a reward, for example:
    - Brutal Blows: take 30% more damage, get 30% more jade.
    - Muddy Roads: move 10% slower, get 25% more gold.
    - Windwalker: move 50% faster, deal 10% less damage.
    - Glass Cannon: +60% damage, half health.
    - Ricochet: enemy shots bounce, +25% jade.
    - Elite Hunt: an extra elite in every fight, and every elite drops a bag.
    - No Traders: the shops are gone, and every guardian gives a relic.
    - Blood Thirst: kills heal, but no potions.
    - Blood Price: start with 2 relics, 25% less health.
  - **The pool:** 16 pacts in all. The day draws 2 to 5 of them (all active together, multiplied), and the menu panel shows them with the combined jade multiplier.

## 0.7.1: ShinobiDungeons

### Name and menus
- **ShinobiDungeons:** the game's new name. The title card is kept, and ENTER opens a new main menu in the pause screen's style.
- **Main menu:** Continue, New Run, Training, Boss Rush, Skill Tree, Guide and Settings, with a detail panel for each.
- **Character select:** restyled to match the menus. The in-between "hub" screen is gone, and picking a hero starts the run.
- **Victory screen:** its own animated celebration. Dawn breaks over the castle with fireworks, the stats count up, a rank (S, A, B or C) stamps down, and jade flies into its counter.
- **Death screen:** shows where the march halted and gives a tip about what killed you.

### New players
- **Apprentice difficulty:** below Story. You take 40% damage, foes have 60% health, foe bullets are slower, and you get an extra revive.
- **One-time tips:** short hints the first time something new happens.
- **Danger warnings:** a BOLD setting adds pulsing rings around foes winding up an attack.
- **Suggestions:** a star marks a good pick on reward cards and in the shop.
- **Training:** Master Kaito's Trials, a new ten-trial tutorial. The main menu recommends it until you have finished it once.

### Guide and skill tree
- **Guide:** wider, with sprites for every foe and guardian and silhouettes for undiscovered ones.
- **New guide tabs:** ENCHANTS, with every enchant grouped and explained, and CHRONICLE, with the story of each stage.
- **Skill tree:** wider, with a stat icon on every node, tooltips and a branch legend.

### World
- **Indoor stages:** furnished (cushions, tables, scrolls, shelves, lamps) instead of overgrown.
- **Stage props:** placed as small scenes, with lamps in pairs at doorways.
- **Province campaign map:** slides in at the start of each stage.
- **Treasure rooms:** guarded, with the chest sealed until the room is clear.
- **Shops:** marked at every entrance.
- **Minimap:** enemies show as dots.
- **Corner pockets:** unreachable pockets are sealed.
- **Bags:** they no longer pick themselves up. G takes everything, and 1-6 take one item.

### Guardians and foes
- **Hitboxes:** guardian hitboxes match their sprites.
- **Defeat sequence:** a beaten guardian shudders, topples and bursts into embers under a GUARDIAN DEFEATED banner.
- **Intro:** a letterbox intro for every guardian.
- **Phase changes:** you can't attack while a guardian is changing phase.
- **Boss rush:** includes all twelve guardians.
- **Animation pass:**
  - Foes walk, wind up, lunge, recoil, flinch, rise when they spawn and topple when they die.
  - Humanoid foes have four-frame walk cycles.
  - Guardians gain new frames, and Kurogane's horse gallops.
- **New foes:** kappa, tengu, kasa-obake, gaikotsu and yamabushi.
- **New projectiles:** 15 new projectile sprites, handed out to the foes that shoot.
- **Tetsuo and Onikuma:** Tetsuo holds his gun in every frame, and Onikuma's hood has proper teeth.

### Feel, sound and screen
- **Abilities:** every cast has its own light show and layered sound, and big hits land with impact rings.
- **Piano score:** replaces the chiptune and intensifies with fights and guardian phases.
- **New sounds:** footsteps, bags, chests, the stage bell, and the guardian taiko and gong.
- **Full screen:** the game fills the window and is zoomed further out. Settings has FULLSCREEN and VIEW ZOOM.

## 0.6.4: stages, sprites and gameplay (second batch)

### Fixed
- **Stage borders:** the bamboo, reed, rock, hedge and wall borders had stopped drawing after the renderer was restructured. They draw again, and now go through the new prebuilt wall list.

### Stage environments
- **Cover:** the bigger fight rooms now hold 1–5 obstacles in the stage's own style:
  - bamboo groves, crystal rocks, snowy boulders, crenellated stone blocks, brick blocks, little shoji houses, clipped hedges and black-and-gold blocks
  - they **block bullets both ways**, so you can break a foe's line of fire, and they can break yours
- **Floor centrepieces:** every fight room gets one painted into its floor:
  - I, II, III: a trampled clearing with ash, crossing plank boardwalks, dark moss with glowing spores
  - IV, V, VI: cobbled street patches, a packed-snow path with footprints, muddy cart ruts
  - VII, VIII, IX: a stone mosaic, drain grates and stains, red rugs with gold borders
  - X, XI, XII: raked sand with stepping stones, a jade and gold inlay ring, a red carpet runner
- **Story props:** each stage now has its own decoration list, so stages that share a floor no longer look alike:
  - I: Akagane's war camp (tents, campfires, spear racks)
  - II: scarecrows in the abandoned paddies
  - III: the smugglers' crates and spider webs
  - IV: burnt-out houses and rubble in the town
  - V: waystation signposts and campfires on the pass
  - VI: Tetsuo's cannons, spiked barricades and arrow bundles
  - VIII: the jailer's cages and chains
  - IX: folding screens, armour stands and vases in the keep
  - XI: jade statues and gold braziers in the palace
- **Mood:** each stage has a soft vignette in its own light. The caves and cellars close in darker, the burnt town has a red haze, and the pass has a cold pale edge.
- **Sway:** bamboo, reeds, grass, trees, banners, tents and scarecrows sway gently in the breeze.

### Gameplay
- **Breakable props:** barrels, crates, vases, urns and rice bales break when your shots, slashes or blasts hit them. Some spill gold, and a few drop a potion.
- **Powder kegs:** red kegs on the war-camp, burnt-town and rampart stages explode when hit. They hurt every foe nearby (and you, if you're too close), and set off neighbouring kegs. Enemy shots can set them off too.

### Sprites
- **Critters redrawn:** bigger, shaded two-frame sprites for the salamander, toad, bat (wings up and down), hornet, viper, centipede, crab and beetle.

### Checked
- **Headless runs:**
  - a full campaign
  - all 12 boss fights
  - every class fighting at stages II, VII and XI
- **No errors** in any of them.
- **Frame cost:** about 3 ms per frame (the budget at 60 fps is 16.7 ms).

## 0.6.4 (first batch): patterns, progression and fairness

### Bullet patterns (research-led)
Every new pattern is built on the basic shmup building blocks: fixed, aimed and random angles, combined into rings, fans and stacks.
Each one tests one dodging skill, and each always leaves a way through:

- **Stack:** aimed columns that get faster. Answer: small, steady side-steps (streaming).
- **Sniper:** a fast aimed shot with flankers. Answer: a quick tap aside, not a run.
- **Aimed ring:** one shot is always on your line, so standing still is never safe.
- **Rose:** a ring whose speed swells with its petals, leaving slow lanes to thread.
- **Double spiral:** counter-turning spirals that weave a moving lattice.
- **Layered rings:** three slow nested rings, each offset by half a step.
- **Lattice:** two crossing walls, each with a gap. Find where the gaps line up.
- **Sweep:** a wide wobbling wall whose gap shifts every volley.
- **Encircle:** needles appear around you, aim, then close in. One arc is open: run for it.

Where they appear:

- **Bosses:** every guardian gets 2–5 of these, themed to them. For example, the Earth Spider's web lattice, the Jailer's closing cage and the Emperor's full set. Stronger versions join at half health and in survival phases.
- **Stage foes:** archers fire stacks, snipers fire sniper bursts and priests fire aimed rings. Monks use double spirals, cranes sweeps, shamans roses and toads layered rings.
- **Elites:** each gets a signature volley, with more kinds unlocking deeper in.
- **Ambushes:** now three waves. The second brings **spirit lanterns** in the corners that fire in step and can be broken for gold. The third brings an elite.
- **Formation squads:** a third of fight rooms from stage II hold a bannered line of ranged foes. Their volleys ripple down the line.
- **Guide:** TERMS explains how to read each pattern.

### Fairness and readability
- **Mercy window:** after a bullet hits you, bullets can't hurt you for a third of a second and the ones touching you shatter. A tight cluster now costs one hit instead of four.
- **Bullet contrast** (Settings, Display): enemy bullets get a dark rim and a bright core.
- **Danger ticks:** bullets near you but still off screen show as red ticks on the screen edge.

### Skill tree
- **Branch mastery:** learn 6, 14 and 24 nodes in one region for three escalating, themed bonuses (e.g. War: Veteran, Blooded, Warmaster). Pips under each region tab show your tier.
- **Free respec:** press R twice for a full jade refund, so experimenting costs nothing.
- **Build page** (B): every bonus you own added up, plus your keystones and masteries.
- **Node preview:** a node shows what it does to your running total, e.g. "NOW +19% > +22%".

### New ways to play
- **Boss Rush** (B in the temple, once two guardians are beaten):
  - Fight every guardian you've beaten, back to back, with a relic pick and a 30% heal between each.
  - Your gear scales up for each arena.
  - Your best rush is recorded.
- **Temple Trials:** 17 feats with jade bounties, such as an untouched guardian, 300 perfect dodges, Mastery III or a full roster. They're in the guide's new TRIALS tab and pay out the moment you earn them, including past progress.
- **Relic synergies:**
  - 12 relic pairs combine into a bonus, e.g. Fire Oil + Static Seal = Plasma, Critical Eye + Amaterasu Eye = Sun and Moon, Glass Cannon + Iron Body = Balanced Blade.
  - The boss reward cards flag a relic that would complete one.
  - Formed synergies are listed in the guide's RELICS tab.

### Character select
- The pedestal shows each hero in their final form.

### Checked
- **Headless runs:**
  - two full campaigns, stage I to the Emperor, with the Wizard and the Gunner
  - all 12 boss fights
  - the tutorial
  - every class fighting at stages II, VII and XI
  - a Boss Rush
- **Scripted checks:** every new pattern, the mercy window, mastery and respec, trials, synergies and squads.
- **No errors** in any of them.
- **Bullet density:** boss fights hold 100–260 bullets on screen, about the same as before.
- **Frame cost:** about 3 ms per frame in the Emperor fight (the budget at 60 fps is 16.7 ms).
