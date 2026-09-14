# WD-301 Assignment: Multi-Step Form + Prisma

**Individual assignment.** You will continue from your team's midterm booking app, but this time you work alone on your own copy.

Your midterm booking app works, but the data layer was built without an ORM. Now the "owner" wants two things: a safer, well-documented database layer, and a booking form that collects more information.

## Starting point

Fork or copy your team's midterm repo into your **own personal repo**. From this point on, all work, commits, and deployment are yours alone.

Midterm repos:

- Team Help Me AI: https://github.com/Cornerstone-CICCC/booking-app-midterm-help-me-ai
- Trim Team: https://github.com/Cornerstone-CICCC/booking-app-midterm-trim-team

## What you must do

### 1. Integrate Prisma

- You don't have to rewrite your schema from scratch. Pull it from your existing database with **introspection** (`prisma db pull`), which generates `schema.prisma` from the tables you already have. Then create a **baseline migration** so migration history starts from your current schema.
- Replace all raw SQL access (`pg`, query strings, anything you'd run through `psql`) with **Prisma Client queries** (`findMany`, `create`, `update`, `delete`, etc.). By the end, Prisma is the only way your app talks to the database.
- Your app should end up working exactly as it did before, just through Prisma.
- From the baseline onward, every schema change must be a **migration** (`prisma migrate dev`), not `db push`. As you build the 2 new form steps, make your schema changes and document them in migrations and commits as you go, not all at once at the end.

### 2. Document your changes

Your work must be traceable:

- **Migrations**: each schema change is its own migration with a descriptive name (e.g. `add_pet_fields_to_booking`, not `update2`).
- **Commits**: small, focused commits with clear messages. One giant "added prisma" commit will lose marks. We will read your git history.

### 3. Extend the multi-step form (+2 steps)

Add **two new steps** to your public booking form to collect more information. What you collect is up to you, as long as it fits your business. Examples:

- A pet grooming app might add a *pet details* step (breed, size, temperament) and a *special requests* step.
- A restaurant might add a *party details* step (occasion, dietary restrictions) and a *seating preference* step.

Requirements for the new steps:

- The new fields must be **saved to the database**, which means new columns/models, which means new **migrations**.
- Server-side validation with visible error messages, same standard as the midterm.
- The new data must be **visible in the staff dashboard**.

### 4. Deploy

- Push your database to your **own personal Neon instance** (not the team one from the midterm).
- Deploy the app so it is publicly reachable. One deployment per student.

## Hard requirements

- Prisma is the only way your app talks to the database.
- Migration history in the repo tells the story of your schema changes.
- Git history tells the story of your code changes.
- Live personal Neon database. Demoing against localhost will heavily impact your marks.
- Live, publicly reachable deployment.

## Submission

Submit your **hosted URL** via the Google Form: **https://forms.gle/gvXuBaG2jjGMJnBi9**

In your repo's README, you may optionally write more about what you did: what your two new steps collect and why, decisions you made while integrating Prisma, anything you're proud of. This is optional but a good habit (and a good tiebreaker).

Good luck. Same rule as the midterm: build it like the owner is paying you.
