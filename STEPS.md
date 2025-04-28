# User Flow & Page Requirements

## 1. Landing Page (`/`)
- Hero section, features, CTA
- Links to Sign Up / Sign In
- No user input required

## 2. Sign Up / Sign In Page (`/sign-in`, `/sign-up`)
- Clerk authentication
- Redirect to Dashboard after login
- Collects: Email, password (or social login)

## 3. Dashboard / Add Podcast Page (`/dashboard`)
- Shows past summaries (if any)
- Form to add podcast link or upload audio file
- Collects: Podcast URL or file
- Shows status of current/previous jobs

## 4. Summary Page (`/summary/[id]`)
- Displays summary/results for a podcast
- Download/share options
- Link back to dashboard
- Handles error states (failed jobs, etc)

---

### Optional/Nice-to-Have (for future)
- Settings/Profile page
- FAQ/Help page
- Pricing/Upgrade page
- Contact/Feedback page 