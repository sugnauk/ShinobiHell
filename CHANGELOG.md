# Changelog

## Unreleased (after 0.7.1)

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
- **Tips pause the game:** when a one-time tip appears, the fight freezes and a compact card sits at the top of the screen. Play resumes when you do what it suggests: C to drink, dash to get away, an ability, G for a bag. The press also does the action. ENTER always works as "got it".
- **No damage in training:** bullets and blows still hit you, with the flash and sound, but take no health. A "HIT" marker shows where a number would.

### Prologue I: The Burning Village
- **The stage:** a gentle opening stage before stage I, with fewer and weaker foes. It is on by default, and P on character select switches it off.
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
- **Daily challenge:** the same stages, hero and twist for everyone each day, with your best kept.

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
