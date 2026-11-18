# Changelog

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
