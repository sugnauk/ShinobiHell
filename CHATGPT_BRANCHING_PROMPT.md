# Prompt: branching guardians in the Chapter II descent (stages XVI–XX)

You are continuing work on **ShinobiDungeons** (repo `sugnauk/ShinobiHell`, branch `chapter-two-descent`, version 0.8.11). Read these first:
- **`CLAUDE.md`:** house rules, including the version bump on every pull request and the sprite method.
- **`HANDOFF.md`**
- **`CHAPTER_II_DESCENT.md`:** the design brief for XVI–XX, with the stage XVI prototype results and the fight-length targets.

Then study the working example: **`src/205-silt-cellars.js`** (stage XVI, Nebari).

## The owner's request
> "I'm thinking about having both directions available for different rewards, e.g. go to fight Boss A for this, fight Boss B for that, in the late game."

Each Chapter II guardian (Nebari, Kane, Sumi, Mukuro) has two concept directions, A and B, in `docs/chapter2/concept_sheet.png`. The paint code is in `docs/chapter2/guardian-concepts.js`. Instead of picking one, **both become real guardians on a forking road**. The player chooses which to fight, and each gives different rewards.

## What to build
1. **A fork at each campfire from XV to XIX.**
   - The campfire after a guardian offers **two roads down**. Each road names its guardian, its dungeon and its reward theme, and the player picks one.
   - Show it on the existing campfire screen: `openMaster` and `CS` in `src/27-menus.js`, extended in `src/188-lategame.js`.
   - Keyboard and touch must both work. Note that menus with key-only input have broken touch before: shrines needed a fix (`src/183-touch.js`).
2. **Two stages per depth.**
   - The pairs:
     - XVI: Nebari A (the Mire Warden, silt cellars) or Nebari B (the Lacquer Master, the palace lacquer works).
     - XVIII: Sumi A or B.
     - XIX: Kane A or B.
   - **XVII is Ruri.** Her sprite is approved but not yet in the repo. Either keep XVII single, or design a Ruri B; ask the owner.
   - Each branch keeps the brief's dungeon rules: **one idea**, taught in a quiet room, combined on the approach, and central to the fight. Each guardian needs a **signature attack** with a readable tell, a clear response and an opening, and a **phase two that changes a rule**.
   - Branch B must be its own idea, not a reskin. Example for Nebari B: *lacquer*. Wet lacquer coats the floor and anything that crosses it, and dries hard after a few seconds. Fresh trails are slippery, so you slide, while dried trails block shots. Phase two: lacquer sets instantly where he strikes.
3. **Different rewards per branch.** Each guardian drops its own relic, pointing towards a different build: for example a defensive or control relic on one road and an offensive relic on the other. Use the `BOSSRELIC` field on the stage definition (see `MIRE LANTERN` in 205). Optionally also differ in gold, a guaranteed enchant, or a scroll upgrade.
4. **XX remembers the route.** Mukuro (the Hollow Throne; A or B can itself be the last fork, or decide from the route) borrows **the rules of the guardians the player actually beat** (Hollow Decree in the brief). Store the route in the run, e.g. `R.route=['nebariA','ruri','sumiB','kaneA']`, and save it with the checkpoint.
5. **Replay value.**
   - The road not taken is marked on the campfire's journey bar.
   - Beating both versions of a guardian across runs could unlock a trial (the `TRIALS` list in 188).
   - The **Boss Rush** and **Test Mode** list every branch.

## Technical notes
- **Installing stages:** late stages go in with `lateAdd({...})` (`src/188-lategame.js`). Mark Chapter II stages `remix:false`, so the Abyss keeps remixing XIII and XIV and its depth records stay stable.
  - Every added stage pushes the Abyss's first index later. Saves already handle one shift (see the `savedRun` wrapper at the end of 205). Branching adds more stage slots, so either keep one slot per depth and swap its tables when a branch is chosen (as the prologues do in `src/157-prologue.js`, `proOn`/`proOff`), or extend the migration. **Swapping per depth is recommended:** depth indices and Abyss numbering don't move.
- **Art:** draw with `hiArt(...)` (`src/204-guardian-redesign.js`). Paint at 2x and the code reduces it. Register with `humBoss(name, art, {idle0, idle1, atk}, {sc})` and `hiPoses(name, arms)`.
  - The concept paint functions in `docs/chapter2/guardian-concepts.js` are the starting point; refine them at full detail.
  - The owner's taste: no shirtless or bare-chested looks; thin outlines; readable weapons; a clear second form.
- **Fights:** `BKIT[name]={director:bossDirector, atks:[...], events:[...], onHalf, halfName, move, floor, drawAfter, noContact:true}`. Attacks use `mark()` warnings (`k:'c'|'l'|'cone'|'ring'|'rect'`) and `bsh()` shots. Keep every warning inside `arenaOf(e)`, as `nebClamp` does.
- **Fight-length targets** (owner):

  | Boss category | Target |
  |---|---|
  | Early-game boss | 45–90s |
  | Mid-game boss | 90–120s |
  | Late-game boss | 120–180s |
  | Chapter I final boss | 150–210s |
  | Chapter II major bosses | 180–240s |
  | Ultimate optional boss | 240–300s |

  - Tune with `BOSS_HPT` on the stage definition. Nebari is 9.
  - Measure with `node docs/chapter2/fight-bot.js samurai,archer,sumo NEB_I` (add `touch` for touch controls). Use both melee and ranged heroes.
- **Fairness checks** (the bot reports both):
  - every warning must stay inside the arena;
  - a hero at base speed, through any slow, must be able to leave a warning's centre before it fires.

## Delivery
- **First:** a short design brief for the branch-B guardians and the fork. Then build the **XVI fork end to end** (Nebari B plus the choice at XV's campfire) and check difficulty and the visual direction there before doing the rest.
- **Verify:**
  - the normal route down both branches;
  - Test Mode;
  - Boss Rush;
  - New Game+;
  - saves made mid-branch;
  - the transition into the Abyss after XX.
- **Show** the design brief, in-game previews (idle, wind-up, attack, recovery and second-form frames over the arena floor) and test results.
- **Bump the version** per `CLAUDE.md` in the pull request.
