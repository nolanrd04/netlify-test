# Acme Digital — Netlify CMS Demo Site

A 3-page brochure site (Home, About, Contact) with a fully working content management
system powered by Decap CMS (the open-source continuation of Netlify CMS).

## File Structure

```
NetlifyTest/
├── netlify.toml                    # Netlify build & redirect config
├── public/                         # Everything Netlify serves
│   ├── index.html                  # Home page
│   ├── about.html                  # About page
│   ├── contact.html                # Contact page (Netlify Forms)
│   ├── css/styles.css              # Shared styles
│   ├── js/main.js                  # Content loader + nav + form handler
│   ├── admin/
│   │   ├── index.html              # CMS admin panel (login here)
│   │   └── config.yml              # CMS field definitions
│   └── content/
│       ├── pages/
│       │   ├── home.json           # Home page content
│       │   ├── about.json          # About page content
│       │   └── contact.json        # Contact page content
│       └── settings/
│           └── general.json        # Site title, footer text
```

---

## 1. Deploy to Netlify

### Option A — Drag & drop (fastest for a demo)

1. Go to [app.netlify.com](https://app.netlify.com) and log in.
2. On the **Sites** page, drag the `public/` folder into the drop zone.
3. Netlify gives you a random URL like `https://quirky-banach-abc123.netlify.app`.

> **Note:** drag-and-drop deploys don't connect to a Git repo, so the CMS
> can't save edits back to files. Use Option B to get a fully working CMS.

### Option B — Git-connected deploy (recommended)

1. Push this folder to a GitHub (or GitLab/Bitbucket) repo.
2. In Netlify, click **Add new site → Import an existing project**.
3. Pick your repo and set:
   - **Publish directory:** `public`
   - Build command: *(leave blank — no build step needed)*
4. Click **Deploy site**.

---

## 2. Enable Netlify Identity (required for CMS login)

After deploying:

1. In your Netlify site dashboard, go to **Site settings → Identity**.
2. Click **Enable Identity**.
3. Under **Registration preferences**, choose **Invite only** (so only people
   you invite can log in).
4. Scroll to **Services → Git Gateway** and click **Enable Git Gateway**.
   This is what lets the CMS commit content changes back to your repo.

---

## 3. Invite your coworker

1. In **Identity → Users**, click **Invite users**.
2. Enter their email address and send the invite.
3. They'll get an email with a link. Clicking it opens your site and lets
   them set a password.

---

## 4. Logging in and editing content

### To log in

Navigate to:

```
https://your-site-name.netlify.app/admin/
```

A login dialog appears. Use the email and password from the invite.

### To edit content

After logging in you'll see the CMS dashboard with two sections:

| Section  | What you can edit |
|----------|-------------------|
| **Pages → Home** | Hero title, tagline, description, button text |
| **Pages → About** | Title, description, mission statement, body text (Markdown) |
| **Pages → Contact** | Title, description, email, phone, address |
| **Settings → General** | Site title (shown in logo & browser tab), footer text |

1. Click the item you want to edit.
2. Make your changes in the form on the left — a live preview appears on the right.
3. Click **Save** (saves a draft) or **Publish** (commits to the repo and
   triggers a Netlify redeploy, usually done in ~30 seconds).

---

## 5. Contact form

The contact page uses **Netlify Forms** — no backend required. Submissions
appear under **Site → Forms** in the Netlify dashboard. You can set up email
notifications from there.

---

## 6. Local preview

Open a local HTTP server to preview the site (required because the content
is loaded via `fetch`, which doesn't work on `file://`):

```bash
# Python
cd public && python -m http.server 8000

# Node (npx)
cd public && npx serve .
```

Then open `http://localhost:8000`.

The CMS admin (`/admin/`) will not be functional locally because it needs
Netlify Identity and Git Gateway. Everything else works.

---

## 7. Customising the CMS fields

Edit `public/admin/config.yml` to add or rename fields. Each field maps
directly to a JSON key in the corresponding file under `public/content/`.
The site's JavaScript reads those JSON files on every page load.
