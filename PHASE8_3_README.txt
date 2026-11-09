ODDIRO Ver.2.0 / PHASE 8.3 – App Icon, Launch Screen, Native Haptics
====================================================================
APPLY: Unzip at C:\dev\oddiro (repository root). Preserve folder hierarchy.

CHANGED:
- iOS universal AppIcon (1024x1024, RGB), in existing Xcode assets path.
- iOS Splash.imageset 3 PNG resources (2732x2732) preserving the approved portrait design.
- Browser/PWA icons (192/512/maskable/apple-touch-icon) visually matched.
- package.json and package-lock.json: add @capacitor/haptics 8.0.2.
- www/index.html: native Capacitor Haptics API, respecting stored ON/OFF settings.
- www/sw.js: bumped service-worker cache name.

IMPORTANT BUILD NOTES:
1. Keep codemagic.yaml and the signing settings from PHASE 8.1 unchanged.
2. Push changed files to GitHub Desktop; Codemagic runs npm install and npx cap sync ios.
3. Native plugin availability is determined only by the new TestFlight build. Browser vibration is not expected.
4. Test success/correct, wrong, five-combo, and settings toggle on a physical iPhone.
5. Do not delete/recreate the app. Install this TestFlight build as an update to preserve saved data.
6. The launch screen uses the existing LaunchScreen.storyboard and Splash.imageset; it does not require an additional JS splash plugin.
7. If Codemagic shows package lock sync warnings, run `npm install` from the repository root and commit the resulting lockfile.
8. Optional obsolete feature-graphic-1024x500.png is intentionally not included.
