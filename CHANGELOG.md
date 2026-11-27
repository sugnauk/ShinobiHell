# Changelog

## 0.8.17: Faster heroes, guardian walk cycles and sealed boss arenas
- **Faster heroes.** Every hero moves 12% faster (for example, the wizard goes from 78 to 87 px/s and the shinobi from 92 to 104). Class, relic, skill-tree and daily bonuses still apply on top. Foes and dashes keep their speed.
- **Walk cycles that keep pace.** A hero's walk cycle now advances with the ground actually covered, so the feet don't slide at the new speed, when slowed, or when hasted.
- **The sumo's walk.** His feet now step in turn instead of shifting together.
- **Guardians that had no walk now move as they travel:**
  - **Akagane** charges on his running legs.
  - **Kageyama** strides in his hakama.
  - **The two Ruri wardens** step on their crystal shards.
  - **Kurogane on foot, Hoshiyomi, Getsurei and the Corrupt Emperor** glide, with a swaying robe, a bob and swinging arms.
  - **The Moth Queen and the Hitobashira** drift up and down as they hover.
  - Every guardian still uses its attack frames when it attacks.
- **Sealed boss arenas.** When a guardian wakes, a gate of iron bars rises across the arena's mouth, carrying a glowing ward in the guardian's colour, with the message "THE GATE SEALS BEHIND YOU".
  - Nothing gets out until the guardian falls: walking, shots and blinks are all stopped. A teleport or leap that lands outside is brought back in.
  - The gate sinks when the guardian dies, when the fight resets (for example, a prologue respawn), and on leaving the stage.
  - It works in the Boss Rush and Test Mode too.

## 0.8.16: Mobile controls and Temple balance

- Bring the landscape phone camera 12% closer while retaining safe-area HUD and touch positions.
- Extend dungeon lighting and cinematic effects to the screen edges so the safe-area seam disappears.
- Show equipped ability sprites on touch buttons, with a cooldown badge and a heavy-attack charge ring. Dash and potion buttons have icons too.
- Rebalance all eight Temple branches. A maxed Wizard has 150 base HP, 30% crit, about 20% shorter passive cooldowns and twice the sustained ability damage against bosses and elites before crits and situational bonuses. Undying grants a second starting revive on standard difficulty.
- Fortune upgrades give a maxed tree a 30% chance to raise eligible gear in ordinary loot bags by one quality tier. Prologue gear remains capped at uncommon.

## 0.8.15: Mobile aim and Siegebreaker

- Draw the dungeon edge to edge on landscape phones while keeping the HUD and touch controls inside the safe area.
- Touch abilities and charged heavy attacks aim along your current or last walking direction when auto-aim has no target. Ground-targeted casts aim ahead up to the first wall.
- Give the Gunner's Siegebreaker a heavier cannon, a visible fuse, and a two-part pressure wave. The shot kicks the Gunner backward in a short slide that stops at walls.

## 0.8.14: The First Flame

- Start with Wizard, Samurai and Archer. Recruit one hero for each of the first ten lifetime guardian clears, with Sumo on the ninth. Prologue clears and past wins count.
- Fit mobile play and menus inside the phone’s safe area. Give Pause, Bag, Swap and Fullscreen a dedicated row above the map, and keep gold and revives beside equipped gear.
- Raised guardian HP by 50% in the prologues, 85% in stages I–IV, 100% in V–XII and 60% from XIII onward. Enrage timers scale with the added health. Lair bosses, the Moth Queen and guardian echoes also have more HP.
- Narrowed the damage gap across all 13 heroes while keeping a close-range damage advantage. Test Mode now equips the selected hero’s own starter weapon when switching characters.
- Executioner’s Mark deathblows deal 1% of a guardian’s max HP or the hit’s damage, whichever is greater.
- Added the Temple of the First Flame after Ruri. Master Kaito alternates palm, bow and sword forms, then links them after his braziers go out. His guardian artwork also appears at campfires and in training.
- Shops stock up to three different relics. Each stage allows one relic purchase.
- Sumo’s Salt Throw heals for 25% of damage dealt, up to 20% max HP per throw.
- Centred Lord Kurogane's mounted sprite in his boss intro. In phase two he dismounts, and Yamikaze pursues the player with telegraphed charges. Both must be defeated.

## 0.8.13: Late-game guardian fights

- Reworked the Stage XV fight with telegraphed bullet rows, visible safe lanes, a red-lantern reversal, and a three-part finale.
- Added clipped Mooring Cut warnings and a stationary attack window when Sazanami lowers his lantern.
- Hoshiyomi and Getsurei open each attack cycle with a signature, layer supporting patterns, and give players a stationary recovery window. Their Abyss versions keep their modifiers.
- Both Nebari and Ruri variants now combine staged volleys with their arena rules. Their low-health sequences build in distinct beats. The optional Shardsmith gains a follow-up volley when her panes link.
- Fixed the Lacquer Seal icon and a reward-screen drawing error that could enlarge the dungeon and HUD over the reward cards. Boss-exclusive relics stay out of random loot.
- Hero unlock banners wait until after the player chooses a boss reward.
- The three prologues now award common and uncommon loot. Players keep their inventory into Stage I.
- Prologue III has one prisoner rescue with a potion reward. The healer restores 25% max HP at campfires, and the peddler gives 30 gold and a 10% shop discount.
- The Wizard can move during ultimate wind-ups.
- Reduced cooldown bonuses from the skill tree, relics, gear, scrolls, shrines, and Daily pacts. Stacked bonuses can lower ability cooldowns by up to 25%. Grazes, perfect dodges, Echo Mind, and kills refund less time.
- Smoothed camera scrolling while walking diagonally on keyboard and touch.
- Gave Master Kaito a dedicated sprite in camp and training, and reduced Genji’s campfire size.
- Lair minibosses and the Moth Queen have a 10% chance to drop legendary loot. Otherwise, they drop a war chest with two epic items.
- Guardian Echoes can recur among regular enemies in later dungeons after their guardian is beaten. Echoes award 4% Legendary and 12% Epic loot.
- Reduced relics from random bags and chests. Shops and shrines each offer at most one relic trade per stage. Duplicate relic effects scale to 150% and 175%, with single-copy limits on special relics.
- Documented attack patterns for the rest of Chapter II and recorded the keyboard and touch playtest results.

## 0.8.12: The fork beneath Still Water and mobile fullscreen

- The campfire after XV offers two roads into XVI, with keyboard and touch controls. Checkpoints retain the chosen road.
- Added the Palace Lacquer Works and the Lacquer Master. Wet lacquer carries movement and cured lacquer stops shots. The Lacquer Seal powers heavy hits after a perfect dodge.
- Both XVI roads lead to a second fork. The Lapis Cistern houses Ruri, the Glass Warden, and awards the Lapis Prism. The Shard Kiln houses Ruri's Furnace Warden form and awards the Tempered Seal. The Shardsmith guards an optional side furnace in the kiln.
- Test Mode and Boss Rush include both guardians at XVI and XVII. Checkpoints in older Abyss layouts keep their depth.
- Touch players can enter or leave fullscreen from the title and during play. iPhone Safari shows the Home Screen shortcut instructions if it cannot fullscreen the page.
- The Near camera makes gameplay about 5% larger on phones using touch controls.

## 0.8.11: Stage XVI, the Silt Cellars, and Nebari the Mire Warden
- **New stage XVI, the Silt Cellars.** This is the first stage of the descent below Sazanami's gate, and the Abyss now opens after it.
  - **The idea is mire:** black silt slows you to about half speed, though a dash still carries you across it.
  - **The first room teaches it** with silt pools and only two slow foes.
  - **The rooms that follow** put silt among ranged foes, with tar vents that bloom on a warning.
- **New guardian: Nebari, the Mire Warden.**
  - **Tar Bloom:** a ring of tar spreads where he aims for 1.1s. Walk out of it. The splash traps him in his own tar for 1.6s, and that is your opening.
  - **"The silt sets":** at half health his pools harden into stone that stops shots from both sides, and he switches to aimed mud volleys.
  - **"The Draining":** an event at 28% health.
  - **New relic: the Mire Lantern.**
  - **Art:** he uses temporary art (concept A).
- **Fix: guardians stopped attacking after a posture break.** Every guardian using the shared boss director went passive for the rest of the fight after its first stagger.
- **Fix: stage XV's music could crash the game.**
- **Touch:** auto-fire uses each weapon's real reach, capped at 150px. Ranged weapons missing from the reach table were stuck at 130px.
- **Saves:** Abyss checkpoints saved before stage XVI existed keep their depth.
- **Docs:**
  - `CHAPTER_II_DESCENT.md` is the design brief for XVI–XX.
  - `docs/chapter2/` holds the guardian concept sheet (two directions each), its source, and the fight-testing bot.
  - `CHATGPT_BRANCHING_PROMPT.md` hands over the next pass.

## 0.8.10: New prologue guardians and a redrawn ferryman
- **Prologue I: Genjuro, the Hired Blade** replaces Goro the bandit captain. He is a ronin the Emperor's tax men hired to collect from the villages that could not pay. He wears a battered straw hat with a notch cut from the brim, a cloth mask over his lower face, a patched dark kimono, scavenged armour (a dented breastplate and one shoulder plate) and carries a long nodachi, with its scabbard slung across his back. In his second form the hat is sliced away and the mask torn down, his long hair is tied back, and his eyes are red. The stage text and the campfire line are rewritten to match.
- **Prologue II: Tatsuma, the Barge Master** replaces Kurobe the river pirate. He is master of the Emperor's tithe barges, in a heavy indigo quilted coat with white stitching, a straw rain cape, a twisted headband, a full beard and an iron-shod barge pole with a hook. In his second form the cape smoulders, his hair is loose and he carries a lit fire-jar. The stage text and the campfire line are rewritten to match.
- **Sazanami, Ferryman of the Hollow** is redrawn: a deep straw hat, glowing eyes, a long white beard, a straw cape, a string of coins for the dead, a lantern on his pole and two drifting spirit flames. When the lanterns go red, his eyes, flames and lantern turn red, and his hat and cape are torn.
- All three are painted at twice the size and reduced, with thin outlines in line with the other guardians, and they now walk, wind up, follow through, cast and flinch.
- The attacks and fights are unchanged.

## 0.8.9: Chapter II opens at the Gate of Still Water

- Stage XV follows the Eclipse Shrine. Face Sazanami, Ferryman of the Hollow, and earn the Ferryman's Token before continuing into the Abyss.
- Sazanami uses alternating lantern volleys, marked anchor strikes and two crossings with a marked safe lane.
- Pole Vault adds outward recoil and a steel strike on contact. Shiko adds a separate footfall, stone break and enemy landing. Grand Theatre holds targets in the air before the strings pluck and pull them down.

## 0.8.8: Tornado counterplay and roster animation polish

- **Tengu:** Cyclone throws foes out after a 1-second hold. The main Heaven's Gale funnel holds for 1.4 seconds. Both share a 1.5-second reprieve from pull and stun, including the final form's side funnels. Tornado damage and Cyclone's shot returns still work during the reprieve. Gale feathers strike their marked landing spot on the simulation timer, up to four hits per foe.
- **Chimiko:** Crimson Moon starts with blood-red ink spreading under the caster.
- **Mobile:** Basic auto-fire follows the equipped weapon's reach, up to 130 px. Tapped abilities can still aim at a visible foe up to 130 px away.
- **Wizard:** Frost Nova sends a low wave of solid ice facets out from the caster, then breaks into shards.
- **Archer:** The hawk banks into a smoother swoop and glides between wingbeats. Arrow Storm uses faint green landing patches without the bright rings.
- **Samurai:** War Cry drops its floating label. Guard Stance now raises the sword, tracks the aim and snaps from a brace into the countercut.
- **Shinobi:** Caltrops last 7 seconds. A thrown capsule hits the ground and releases Smoke Bomb's cloud. Shadow Clones split and fade smoothly without the gold flash.
- **Onmyoji:** Barrier displays only the ring and cracking dome.
- **Gunner:** Matchlock and repeater shots push foes a little harder, with Heavy Slug retaining the strongest push. The tripod targets within 160 px. Siegebreaker uses a short hand cannon and a single travelling blast.
- **Lancer:** War Banner's base radius rises from 70 to 100. Thousand Thrusts uses three visible lanes. Pole Vault holds a fixed-length spear through a slower, point-first landing. Sky Piercer is a shorter braced jab.
- **Sumo:** Salt Throw shows a sweeping fan of grains. Shiko adds a stronger raised-leg wind-up, deeper fissures, and larger slabs. Yokozuna's Ring summons a newly drawn guardian with a braided ring boundary and visible ring-out impacts.
- **Marionettist:** Cursed Thread deals 30% less direct damage, and the spool's hits no longer trigger shared link damage. Grand Theatre uses lacquered puppet hands for the overhead rig.
- **Kagura:** Petal Volley replaces Rhythm. Flow powers the three-fan spread and widens it to five fans at three stacks.

## 0.8.7: Mobile fixes and roster balance
- **Shrines on mobile:** each offering is now a tap target, and so is LEAVE. The screen used to accept only the 1-4 keys, so shrines couldn't be used on touch.
- **Mobile auto-aim:** it now locks on to foes within 130 instead of 180, so long-range kits no longer hit foes you can't see coming.
- **Balance.** A bench of every hero's kit showed the added heroes trailing the originals, apart from the Tengu's crowd control:
  - Tengu: Heaven's Gale lasts 3s (was 3.5s). Gust x1.3 to x1.45, Wind Cutter x1.05 to x1.4, Cyclone ticks .26 to .3.
  - Kagura: Silk Veil x1.5 to x1.75, Fan Waltz .62 to .74.
  - Chimiko: Blood Brush x2.4 to x2.7, Blood Seal x1.3 to x1.8.
  - Marionettist: Cursed Thread x1.3 to x1.5.
  - Sumo: Tsuppari x1.25 to x1.6, Uwatenage x2.3 to x3. Yokozuna's Ring stomp is 45% to 80% of the ring's power, and its lift is 15% to 25%.
  - Lancer: Thousand Thrusts .75 to .65 per thrust. It was the strongest ultimate by a wide margin.

## 0.8.6: Feedback pass on the Wizard, Archer, Samurai, Shinobi and Onmyoji kits

- **Wizard:**
  - **Spirit Ward:** a gyroscope of three tilted rune rings turning round him. They flash, and a ripple spreads, when a shot is thrown back.
  - **Frost Nova:** the staff stabs the floor and frost crawls out in branching lines to the blast's edge, then shatters into shards. Every foe it caught is crusted in ice while the chill lasts.
  - **Dragon Descent:** a sigil of turning rings opens in the sky over the target, a thread of light drops from it, and a pillar of golden fire slams down the full width of the blast, leaving a scorched ring.
- **Archer:**
  - **Arrow Rain:** its coloured area is back, with dust and splinters where the arrows land.
  - **Evade Roll:** a low skid backwards instead of a somersault.
  - **Hawk:** seen from above and always facing where it flies, so it no longer flips (it looked two-headed).
  - **Arrow Storm:** matches Arrow Rain: tinted patches, dust and standing arrows, with no white pillars or generic bursts.
  - **Slow motion:** shorter (1.8s, was 2.5s) and lighter.
- **Samurai:**
  - **Guard Stance:** chudan no kamae, crouched with the full blade held out at the foe and a gleam running along it.
  - **War Cry:** the original roar and rings are back, together with the dust rings and a smaller 喝 in samurai red.
  - **Dragon Cleave:** he rises coiled like a charged heavy (crouched, trembling, flashing when ready) before the dash.
- **Shinobi:**
  - **Smoke Bomb:** the original smoke is back.
  - **Blinks:** every blink takes a breath: Shadow Step, Kitsune Step and Blood Mirror pinch into shadow for 0.14s before they land, and Lotus Dance pauses 0.18s between blinks (was 0.12s).
- **Onmyoji:**
  - **Shikigami:** no backdrop behind the paper spirits.
  - **Barrier:** no star under it, just a plain ring.
  - **Healing Circle:** a soft green circle with motes rising inside it.
- **Lancer:**
  - **RMB SKY PIERCER** (was Spiral Lunge, a dash like the samurai's): he steps in and drives one very long thrust. Everything on the line is hit and shoved back down it. A full charge reaches a third further, pins foes for a moment and breaks shots along the line.
  - **Q POLE VAULT** (was Wheel Sweep, a spin like the samurai's): he plants the spear and vaults to the cursor, untouchable in the air. He comes down spear-first, throwing nearby foes out and breaking shots near the landing.
  - **Deflect:** the spin is much clearer: a longer spear spun faster, with a blur disc, trailing ghosts and speed lines.
  - **War Banner:** shows the area it covers.
  - **Thousand Thrusts:** the waiting phantom spears stand in two stacks either side of him instead of on top of him.
- **Gunner:**
  - **Tripod Gun:** shows its firing range.
  - **Powder Roll:** the keg shows its blast area.
  - **Siegebreaker:** the gun is now a bronze o-zutsu with a dragon-head muzzle on a red lacquered stock. Its jaws glow as it charges and breathe fire when it fires.
  - **Thunder Totem** (Wizard): shows its reach as well.

## 0.8.5: Every ability performed by the body or a summoned thing; the star sigil is gone; ability fixes

The full plan and audit are in `ANIMATION_AUDIT.md`.

- **The white star sigil is gone:** the spinning star that appeared under every hero on E and R has been removed. Only ultimates flash the screen now.
- **Samurai:**
  - **Iai Cleave:** he resheathes, and everything he cut flashes at once.
  - **Guard Stance:** a high guard; a hit sets off a full-circle counter cut drawn at its real reach.
  - **War Cry:** a kiai with a big 喝 (KATSU) glyph and dust rings that run out to the stun's edge.
- **Onmyoji:**
  - **Spirit Fox:** a running fox spirit.
  - **Shikigami:** paper servants that unfold and throw origami cranes.
  - **Barrier:** five talismans pin a star and a dome rises; it cracks as the shield is spent.
  - **Healing Circle:** a gohei wand planted at the centre, with paper wards standing on the heal radius.
- **Wizard:**
  - **Void Orb:** a black hole.
  - **Chain Lightning:** a forked, flickering bolt.
  - **Spirit Ward:** orbiting rune tablets.
  - **Frost Nova:** a ring of ice spikes.
  - **Dragon Descent:** a golden dragon's claw falling from the sky.
- **Archer:**
  - **Charged Shot:** a long arrow with a wind wake.
  - **Arrow Rain:** one arrow shot up, then arrows falling and staying stuck in the ground.
  - **Evade Roll:** the snare is a rope noose.
  - **Hawk:** a real hawk that swoops, circles and screeches.
  - **Arrow Storm:** you see the arrows falling.
- **Shinobi:**
  - **Shuriken Fan:** spinning stars.
  - **Caltrops:** bounce out from the hand.
  - **Smoke Bomb:** billowing smoke.
  - **Shadow Clones:** the clones throw in pose.
- **Gunner:**
  - **Heavy Slug:** muzzle fire and a smoking iron slug.
  - **Grapeshot:** a cone of fire.
  - **Powder Roll:** the keg explodes with flying staves.
  - **Tripod Gun:** assembled leg by leg, then it aims and kicks on every shot.
- **Lancer:**
  - **Spiral Lunge:** a real lunge.
  - **Wheel Sweep:** the whole spear sweeps round him.
  - **Deflect:** a propeller spin.
  - **War Banner:** a rippling banner with stakes on its edge.
- **Kagura, Bell Warden, Sumo, Tengu, Chimiko, Marionettist:** their own body motion for the abilities that used shared poses, and their own wind-ups for Heaven's Bell and Yokozuna's Ring.
- **Guardian echoes (new: `201-echoes.js`):** a guardian you have beaten can return in later dungeons as a mini-boss waiting in a side room.
  - It's drawn as its little boss rush portrait, with its second form at half health.
  - It fights with a shadow of its old fight: its own bullet patterns and its own way of moving.
  - Its health and damage are set by the stage you're on.
  - It drops a royal bag of that stage's loot.
  - At most one per dungeon, in about 3 runs out of 5. Never in its own stage, the prologues, training or the boss rush.
- **Use your abilities:** a tip early in the first fight says to use your abilities the moment they are ready, and every ability tooltip ends with the same advice.
- **Boss rush menu lag:** hovering the boss rush entry rebuilt every guardian's full sheet on every frame. Each sheet is now built once.
- **Title screen:** a new logo, drawn from the game's pixel font: a solid crimson DUNGEONS with a heavy outline and drop shadow, and a light sheen that sweeps across it. A gold SHINOBI sits between rules, a katana lies under the title, and a red 忍 seal is stamped beside it. Below it is one line that changes on every visit (22 jabs at the bosses and the game) and the prompt. That's all: no blurb, tips or key hints.
- **Touch controls:**
  - The buttons are bigger and spread over the whole right side: DASH, then an arc of RMB/Q/E/F, then R, POT and USE.
  - Auto-aim and auto-attack are always on, so there's no aim stick.
  - The buttons stay usable during tips, and the ones a tip asks for pulse.
  - The ability bar along the bottom is hidden on touch; the buttons show the cooldowns.
  - No cursor on a touchscreen: it is all touch.
  - Full screen: every tap asks for full screen until the browser grants it, including the older prefixed form, so the address bar goes away on Android and iPad. The page is also a web app (a manifest and Apple's web-app tags), so on iPhone, where Safari never lets a page hide its bars, adding it to the home screen opens it full screen in landscape. A one-time note on the menu tells iPhone players how.
- **Fixes:**
  - The Siegebreaker cannon showed up on Heavy Slug, Grapeshot, and the Sumo's and Bell Warden's ultimates.
  - Spiral Lunge teleported instead of lunging.
  - Wheel Sweep used the Samurai's arcs.
  - Uwatenage whiffed at arm's length.
  - Harvest and Echo Notes failed silently.
- **Balance:**
  - Shadow Step with no target is a short blink toward the cursor at half cooldown.
  - Thousand Thrusts deals 0.75× ATK per thrust instead of 0.9×.
  - Arrow Rain's damage starts as the arrows land.

## 0.8.4: Samurai, Gunner and Lancer each get their own look; a higher Dragon Cleave lift

- **Samurai, Gunner and Lancer look different:** they were the same robed figure in different colours, with the same straw hat and horned helmet. Each now has a silhouette of their own at every stage, and their gear changes as they evolve:
  - SAMURAI: an armoured torso with great shoulder plates and wide split hakama. He keeps his straw hat through the middle stages, and each one adds something you can see: at IV the hat gains a red band and gold knob and he wears a red lacquered breastplate laced in gold; at V, armour plates over his hakama; at VI, a black sleeveless battle coat and a gold crest on the hat. The horned helmet arrives at VII, and the coat stays.
  - GUNNER: a short open jacket with a bandolier of powder flasks, a smouldering match-cord, narrow legs in white wraps, and an ammunition box on the back. A flat iron war hat, then a steel crested helmet with an upturned brim, and a crimson cape in the final form.
  - LANCER: a slim cuirass over a skirt of armour plates, and greaves. A white headband, then a rounded helmet with a neck guard, and a tall blade crest in the final form. A banner on his back grows taller as he evolves.

  The shoulder cords and shoulder blocks that every hero's middle and final forms used to share no longer appear on these three.
- **DRAGON CLEAVE lift:** the samurai's ultimate now raises him more than twice as high (22 px instead of 10), and he rises in his dash stance, leaning into the line he is about to cut, instead of with his arms raised.

## 0.8.3: Beyond the throne: stages XIII and XIV, the endless Abyss, a bullet-pattern library and a fair attack director

- **The campaign goes on (new: `188-lategame.js`):** beating the Emperor still wins the run, and a run that has beaten him always ends as a victory. At his portal, and at every portal after it, **G** goes deeper and **L** leaves in triumph. The victory screen shows how far beyond the throne you got.
- **Tiers:** stages I–XII are unchanged. **XIII** is Tier 3 (advanced), **XIV** is Tier 4 (the endgame), and **the Abyss** beyond is Tier 5 and up, endless. Each Abyss depth remixes a late stage with a deeper director tier and one to three guardian modifiers, announced when the guardian wakes:
  - **SWIFT:** its patterns come faster.
  - **ECHOING:** every pattern repeats, mirrored, a moment later.
  - **SHROUDED:** the arena closes in from time to time.
  - **TWINNED:** a shade on the far side of the arena casts a second layer.
  - **RELENTLESS:** shorter pauses between attacks.
  - **STAR-WARDED:** three orbiting wards absorb hits until each is struck down.

  Depth adds a little health and damage. The patterns provide the difficulty.
- **Bullet-pattern library (new: `186-danmaku2.js`):** reusable generators with adjustable parameters:
  - Spirals: multi-arm, interlocking, reversing, swaying, breathing.
  - Rings and aimed rings with rotating gaps.
  - Aimed fire: direct, predictive, successive and fan volleys, and snares.
  - Crossing fire: diagonal, walls with gaps, and the four directions.
  - Moving bullets: curving, accelerating, turning, splitting, shedding, orbiting.
  - Arena control: lasers, rotating lasers, walls, corridors, a closing boundary and sequences.

  Lasers flash a warning that widens to the beam's width before they fire. Turning, bursting and released bullets flash just before they change. Bullets are pooled, and player shots only check foes in nearby grid cells.
- **Layered attack director and fairness check (new: `187-director.js`):**
  - **Layering:** the director stacks compatible patterns. Every pattern has tags and a complexity cost; a layer joins only if its tags fit with what is already running and the total stays within the tier's budget. It never repeats a pattern family twice running.
  - **Tier scaling:** higher tiers get narrower gaps, faster rotation, interlocking and reversing spirals, predictive aim and more layers, rather than simply more bullets.
  - **Fairness:** before any new bullets appear, the next 1.6 seconds are simulated around you, including bullets, lasers and hazard circles. A flood fill checks that you can still walk, without dashing, to safety at every step and can't slip through a line of bullets. If not, one opening is cut into the new batch; if that fails, or you are already boxed in, the batch is dropped.
- **Stage XIII: THE STARFALL OBSERVATORY (new: `189-observatory.js`):**
  - **The stage:** an astrologers' tower above the clouds. Indigo walls with gold bands and inlaid stars, a gold star-map floor with a zodiac ring, and new armillary spheres, telescopes, star charts, candelabra, celestial globes and star desks.
  - **Six new foes, each with its own sprite and a warning before it attacks:**
    - WEAVER: slow star spirals.
    - SEER: a sniper whose red sight-line aims where you are going.
    - ORBITER: circles you and fires from the side.
    - SPLITTER: orbs that burst into rings.
    - WARDEN: marching curtains of shards with one gap.
    - HERALD: links nearby allies and fires them all on one beat.
  - **Guardian: HOSHIYOMI, THE STAR READER.** His signatures are CONSTELLATIONS (star nodes joined by lines of light, which then burst) and THE ORRERY (orbiting shells of stars released one at a time).
  - **His four phases:** establishment, escalation, advanced (he blinks between stars) and the climax. Survival phases: THE TURNING HEAVENS, then THE FALLING HEAVENS (falling meteors, a rotating pentagram of light, a galaxy spiral and a last orrery).
  - **Second form:** the hood falls and the stars turn red.
  - **Relic:** ORRERY CHARM, three wards that each block one shot and re-form after 8s.
  - **Cosmetic:** the STARFALL trail.
- **Stage XIV: THE ECLIPSE SHRINE (new: `190-eclipse.js`):**
  - **The stage:** a black-lake shrine. Black lacquered walls with silver bands and vermilion posts, a slate floor inlaid with moon phases, and new mirror stands, moon lanterns, sacred rocks, pampas grass, offering tables and black torii. The six late foes return in their Tier 4 forms.
  - **Guardian: GETSUREI, THE ECLIPSE PRIESTESS.** Her signatures are THE TIDE (crescents that wash in, stop and pull back out with a moved gap) and ECLIPSE (a black moon that drifts after you with a corona of rotating beams).
  - **Her four phases** end in TOTAL ECLIPSE (a long rotating corona round the arena's heart, tides from every side and a final shattering burst). Survival phase: THE TIDE OF NIGHT.
  - **Second form:** the mirror cracks and the corona turns red.
  - **Relic:** ECLIPSE MIRROR, where a perfect dodge returns the nearest shot as a moon-bolt, at most once per second.
  - **Cosmetic:** the ECLIPSE trail.
- **Late trials:** ABOVE THE THRONE, THE MIRROR BROKEN, THE ABYSS GAZES BACK (depth V), BOTTOMLESS (depth X) and DANCER IN THE DARK (no-hit a late guardian).
- **Fixes:**
  - The relic draft skips stages that have no guardian relic.
  - A late stage's scenery is now based on its base stage's.

## 0.8.2: Prologues II and III, mobile play, Sumo can heal, primary attacks never spin, line weapons fire projectiles

- **Heroes are earned (new: `185-unlocks.js`):** the SAMURAI and the ARCHER are available from the start. Every other hero joins when you complete a challenge of their own, instead of one new hero per finished run in roster order. Character select shows a locked hero's challenge and your progress, and a banner announces a hero the moment they join.
  - **Wizard:** finish the prologue (defeat Kageyama), or defeat Akagane in stage I.
  - **Shinobi:** graze 60 enemy shots in one run.
  - **Onmyoji:** make offerings at 4 shrines.
  - **Gunner:** break 40 barrels, crates and powder kegs.
  - **Lancer:** defeat 3 stage guardians in one run.
  - **Sumo:** defeat a guardian without drinking a potion on that stage.
  - **Marionettist:** free 3 prisoners from their cages.
  - **Tengu:** reach Frostpeak Pass, stage V.
  - **Kagura:** win 3 challenge rooms.
  - **Chimiko:** take on 3 curses at curse altars.
  - **Kanemori:** defeat a guardian without being hit.
  - **Old saves:** they keep every hero already unlocked. The daily challenge picks its hero from the heroes you own.
- **Arrow Storm's slow motion is quicker and shorter:**
  - The world slows to 65% speed (was 55%) for 2.5s of game time (was 3.1s), about 3.6s real time (was 5s).
  - The 30 arrows land a little faster, over 2.4s (was 2.7s).
- **Prologues II and III (new: `184-prologues.js`):** the road from the burning village to the bamboo is now three short stages before stage I, each a little harder than the last, and each guardian teaches one thing.
  - **I. The Burning Village:** Goro, the bandit captain. Big telegraphed swings and charges, and slow fans of shots.
  - **II. The Flooded Fields:** Kurobe, the river pirate, ships the village's stolen rice downriver. He teaches bullet patterns: water rings off his oar, spray spirals, floating jars that burst. He also calls his river rats in to fight.
    - A burly, bearded pirate in a sea-blue headscarf and an open indigo happi coat with a white wave hem, tattooed forearms, a rope and clay jars, and a long boat oar. In his second form his hair is wild and wet and he holds a lit fire-jar.
  - **III. The Hill Watchtower:** Kageyama, the tower captain, a sharp-eyed archer. He teaches aimed shots: volleys straight at you, sniper arrows down a warning line, and an arrow rain. Dash through them.
    - He wears archery dress, nothing like the red-armoured warlords of the stages: a white kimono with the drawing arm bare, a dark teal jacket, wide black hakama and a straw jingasa. A tall signal flag on his back bears the tower crest, and a conch horn hangs at his belt. His great bow is bound in rattan and gripped below its middle. In his second form his hat is gone, his hair hangs loose and his flag is torn.
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
