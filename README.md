# 3ro.io — landing v2

Static site for GitHub Pages (`AlessioGarofalo/3ro-website` → 3ro.io). No build step.

**3RO — Enhanced Robotic Organism · Restore. Reinforce. Reimagine.**

## Sections
Hero + inline waitlist → what E·R·O stands for → the three Rs → the first course (Beyond Baseline) → Parrot → Learn/Build/Wear → founding-member waitlist → FAQ → footer.

## Waitlist — one setting to change
Open `waitlist-config.js` and paste your provider's form URL into `action`.

- **Brevo (recommended, EU):** Contacts → Forms → Subscription form. Turn on double opt-in, set the sender to info@3ro.io, and add the text attributes `FIRSTNAME` and `INTEREST`. Then go to Share → Embed → HTML and copy the `<form action="…">` URL.
- **Buttondown:** set `provider: 'buttondown'` and `action: 'https://buttondown.com/api/emails/embed-subscribe/<username>'`.

Until `action` is set, sign-ups open a pre-filled email to info@3ro.io, so nobody is lost.

## Learner entrance (kept)
- Desktop: hold **3 + R + O** together.
- Phone: knock **3-2-2** on the hero portrait.
- The footer also has a "Learner sign-in" link.
- All three go to `learn.3ro.io` (Cloudflare Access). These are entrance gestures, not authentication.

## Run and test
```
python -m http.server 8790 --bind 127.0.0.1
node --test *.test.cjs
```

## Deploy
Copy these files over the repo root, keeping the existing `CNAME` if there is one, then commit and push. The `noindex` tag from v1 has been removed so search engines can find the waitlist.
