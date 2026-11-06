# 3ro landing

This directory is the standalone static landing site published from `AlessioGarofalo/3ro-website` through GitHub Pages at `3ro.io`. It contains no course source, progress, credentials or learner data. The production entrance targets `https://learn.3ro.io`, the Cloudflare Access address for the course running on the owner's PC.

Run from the project root:

```text
python -m http.server 8790 --bind 127.0.0.1 --directory website
```

Open http://127.0.0.1:8790. The screen starts completely black. Move the pointer or drag a finger across it to assemble the suit and the approved 3ro logo (without website lettering) beneath it as white/grey particles. The suit cloud uses roughly 44% fewer dots than the initial preview. Revealed points dissolve within about two seconds after leaving the pointer field. Click or tap to toggle a full-colour suit portrait and solid white logo; dragging continues to reveal particles. Reduced-motion preferences disable particle drift and background scanning.

Hold **3**, **R** and **O** together: the entire suit and logo resolve, hold briefly, then burst outward in a cloud of particles that flies off the screen. The sequence lasts approximately 3.8 seconds, followed by a dark fade into the existing local course at http://127.0.0.1:8765. The entrance sets dark mode before the course's first paint; study progress is unchanged. Reduced motion substitutes a short reveal/fade. Typing the characters one after another does not open it. This chord is an entrance gesture, not authentication. Production needs a separately authenticated course endpoint; do not put private course files or credentials in a public Pages deployment. Browser progress is scoped to its origin and requires an explicit migration/export when moving hosts.

The portrait is an isolated image-generation edit of the user-supplied reference. Its alpha mask and sampled brightness render the point cloud; the same isolated portrait supplies colour mode. The original collage is not served. The approved logo is copied unchanged from the original icon asset.

On a phone, tap **three times quickly, pause, twice quickly, pause, twice quickly** anywhere on the screen. Aim for roughly 0.2 seconds between quick taps and 0.7 seconds for each pause. The same explosion/course entrance follows. Quick gaps accept 60–420ms and pauses 550–1300ms. A single tap waits briefly before toggling colour; a recognized knock sequence does not flash colour mode. Dragging, long presses, cancelled touches and focus loss reset a pending rhythm. There is no visible prompt and no microphone permission is needed.

The deployment repository has a `CNAME` for `3ro.io`. The private course source remains in `AlessioGarofalo/3ro`; do not copy it into this public landing. See the private course's `REMOTE_ACCESS.md` for host setup and verification.
