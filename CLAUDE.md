# ShinobiDungeons: notes for Claude

## Always open a pull request
Whenever work is committed and pushed, open a pull request for it into `main` in the same step. Don't wait to be asked.

## Every pull request bumps the version
Each new pull request gets a new version number, and the PR includes it. Raise the patch number by one, for example 0.7.2 to 0.7.3, unless told otherwise. Update all of these:
- `GAME_VERSION` in `src/00-core.js`: this is the version shown on the title screen.
- The `?v=` cache-busting query on every script tag in `index.html`, for example `sed -i 's/?v=0\.7\.2/?v=0.7.3/g' index.html`.
- `CHANGELOG.md`: a new `## <version>: <short title>` section at the top, listing the PR's changes.
- The PR title, which starts with the version, for example `0.7.3: ...`, and the PR description, which names it.

## Project layout
- **Scripts:** plain JS, loaded in numeric order by the script tags in `index.html` (`src/NNN-*.js`). Later files extend earlier ones by wrapping their functions, for example `{const _x=fn;fn=function(){...}}`.
- **Branches:** work on the session branch and also push to `develop`. PRs go from `develop` into `main`.

## Sprite style
The reduced boss portraits (the boss rush page, guardian echoes) read better than many hand-drawn small sprites. For new sprites, draw a detailed high-resolution version first, then reduce it with nearest-pixel scaling (`imageSmoothingEnabled=false`), and touch up the result. Don't draw small sprites pixel by pixel from scratch. The echo sprites in `src/201-echoes.js` (`GECHO.sprite`) show how.
