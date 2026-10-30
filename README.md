# BJcode website

Static, Persian-language company website and developer portfolio with an RTL layout.

## Pages
- `index.html`: company introduction and website services
- `resume.html`: Behzad Javadian’s education, skills and selected projects
- `contact.html`: contact details and EmailJS form
- `interests.html`: web development, redesign, optimization and support services
- `github.html`: public GitHub profile and repository lookup

## Local development
Install Node.js and run `npm install`, then `npm start`. The server uses `PORT` when supplied and defaults to 8080. No database or build step is required.

## Hosting
The repository has GitHub Pages deployment history. `Procfile` also supports a Node-based host with `npm start`. Confirm the domain’s actual hosting provider before changing deployment settings.

## Integrations
EmailJS uses the existing public key, service and template configured in `assets/js/sendEmail.js`. These are browser identifiers, not private credentials. Restrict allowed origins and configure abuse protection in EmailJS. A successful local check does not verify message delivery; test that separately with the account owner. GitHub lookup uses the public API and can reach its request limit.

## Persian interface
All five pages use `lang="fa"` and `dir="rtl"`. `assets/css/persian.css` is loaded last for typography, RTL layout and isolated Latin contact details. Contact validation and application messages are Persian. GitHub account/repository identifiers retain their original spelling. Existing PDF downloads and project screenshots are unchanged. The Vazirmatn font is loaded from Google Fonts with a Tahoma fallback.

## Maintenance
Shared header and footer markup currently lives in each HTML page. Update all five pages when changing shared content. New sample images should use compressed WebP. Confirm work dates, service qualifications and CV content with the owner before editing factual claims.

## Verification
Check relative links, JavaScript syntax, mobile and desktop layout, keyboard navigation, GitHub lookup errors and contact-form status handling. Sending a real contact message is a separate integration check.
