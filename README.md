# Awesome Sauce
A full-stack recipe and personal site built with Next.js, hosted on Vercel, and backed by Supabase for database and storage.


## Features
### Public
* Home page with a image carousel fetched from Supabase storage
* Recipes page with a clean, responsive layout optimized for both desktop and mobile — I use it for following along while cooking
* Basic text about page
### Admin
* Protected admin panel secured via GitHub OAuth through Supabase
* Add, edit, and delete recipes through a UI instead of manually editing files
* Cache revalidation controls to force Vercel to sync with the latest database state
* Built-in security test page to verify auth guards on all protected routes and server actions
Repo For [my website](https://www.awesomesauce.bet)

## Tech Stack
* **Framework:** Next.js (App Router)
* **Database & Storage:** Supabase
* **Auth:** GitHub OAuth via Supabase
* **Hosting:** Vercel
* **Routing:** File-based with dynamic slugs for recipe pages

## Architecture Notes
Admin routes and server actions are protected server-side — not just hidden on the client. The security test page runs auth guard checks against all sensitive endpoints and logs pass/fail results.
Cache revalidation is triggered automatically on recipe mutations and can also be triggered manually from the admin panel, which was added after discovering Vercel was serving stale data after database updates.
