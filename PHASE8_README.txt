ODDIRO Ver.2.0 — PHASE 8.1 (iPhone UI & TestFlight preparation)

Applicable baseline: PHASE 7.4 already installed.

Install files maintaining relative folders:
  www/index.html
  www/css/phase2-ui.css
  www/sw.js
  codemagic.yaml
  ios/App/App.xcodeproj/project.pbxproj

Not changed: BGM, reward behavior, save migration, gameplay difficulty, and ad unit IDs.

IMPORTANT: Before building, confirm in Codemagic Code signing identities that the
App Store profile for com.yutaXXX.oddiro has a matching uploaded distribution
certificate (green checkmark). This YAML uses automatic matching among the
*uploaded* signing files, not creation/fetching from Apple Developer.

Test before TestFlight release:
- Existing save: points, inventory, stage, checkpoints, ranks, cosmetics retained.
- iPhone smaller screen & large screen: no clipped grid, button, banner.
- All themes including rainbow, light: text legible.
- All three modes, daily retry reward, rewarded ads and banner.
- BGM / sound and app background return.
- Codemagic build succeeds with matching signing pair.

Release metadata and App Store review submission still require manual verification.
Do not upload this project to App Store before a TestFlight verification run.
