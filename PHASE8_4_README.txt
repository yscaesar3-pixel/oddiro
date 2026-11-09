ODDIRO PHASE 8.4 - SPLASH DISPLAY FIX
Baseline: PHASE 8.3 already applied.

Changes:
- Web branded splash displayed for at least ~1.7 seconds after launch and dismissed automatically.
- Visual is the approved portrait ODDIRO splash design, bundled locally (no network needed).
- Existing native LaunchScreen storyboard kept, with fallback background changed to navy.
- Cache key bumped and splash asset registered for offline use.
- No changes to gameplay, AdMob, XP, Haptics, audio, code signing or save data.

Copy this ZIP's directory structure into the project root, overwriting matching files.
Then commit and push with GitHub Desktop, rebuild in Codemagic and test through TestFlight.
Test by fully closing and relaunching the app (not just returning from background).
The branded splash is designed for each cold start of the web view, not for every app resume.
