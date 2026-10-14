# VirtualGenieAI Client Onboarding Portal — Updated Frontend

A responsive front-end prototype for collecting website project details, including repeatable individual team-member profiles.

## Preview
Open `index.html` in a modern browser or publish this folder to GitHub Pages.

## Included
- Premium responsive dark navy / cyan / violet UI
- Six-step onboarding flow
- Business details, services and design preferences
- Repeatable team-member cards with:
  - Individual portrait upload and local image preview
  - Name, qualifications, role/speciality, experience and biography
  - Featured lead/founder toggle
  - Add/remove member controls
- Clinic-wide credentials and social links
- Logo, business photo and design-reference file selection
- Browser-local draft saving
- Review screen and JSON summary download

## Prototype limitations
This is a front-end only prototype:
- Form drafts are saved in the current browser's local storage.
- Browser security prevents selected files from being restored after a refresh; reselect them if needed.
- File selection and image previews are local only. Photos are not uploaded to a server.
- JSON exports contain team member details and photo file metadata, not the actual image bytes.
- Form submissions are not sent to VirtualGenieAI yet.
- No database, private admin dashboard, authentication or payment processing is connected.
- The WhatsApp contact link remains a placeholder.

Do not use this prototype to collect real sensitive client data until the backend and access controls are implemented.

## Next production steps
1. Deploy the frontend to Cloudflare Pages.
2. Create a Cloudflare Worker API with server-side validation and rate limiting.
3. Save client and team-member records in D1; link each team member to the client ID.
4. Store photos in private R2 and save each object's key with the matching team-member record.
5. Add admin authentication, authorised file retrieval, privacy notice and retention controls.
