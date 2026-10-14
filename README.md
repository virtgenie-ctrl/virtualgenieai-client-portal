# VirtualGenieAI Client Onboarding Portal

A responsive front-end prototype for collecting website project details.

## Preview locally
Open `index.html` in a modern browser, or publish this folder to GitHub Pages.

## Included
- Six-step onboarding flow
- Responsive dark navy / cyan / violet design
- Business details, services, team, file selection and design preferences
- Browser-local draft saving
- Review screen and JSON summary download
- VirtualGenieAI logo asset

## Important prototype limitations
This is a front-end prototype, not yet connected to a server:
- Form data is saved only in the current browser's local storage.
- Selected files are not uploaded or permanently stored.
- Downloading the JSON summary is local and does not notify VirtualGenieAI.
- WhatsApp contact link is a placeholder (`https://wa.me/`).
- No database, authentication, admin dashboard, payment processing or server-side validation is connected.

## Next production steps
1. Deploy the front end (GitHub Pages or Cloudflare Pages).
2. Add a Cloudflare Worker endpoint with server-side validation and rate limiting.
3. Store client records in Cloudflare D1.
4. Upload files to private Cloudflare R2 storage using short-lived upload authorization.
5. Add a private admin dashboard and per-client access controls.
6. Add privacy notice, retention policy, file size/type limits, and real WhatsApp contact details.
7. Configure payment links only after deciding the payment provider and verification method.

Do not use this prototype to collect real sensitive client data until the backend and access controls are implemented.
