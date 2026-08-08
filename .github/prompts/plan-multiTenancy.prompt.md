# Plan: Multi-Tenancy for Club Compass

## TL;DR

Add a `clubs` table as the top-level tenant boundary. Scope all core entities (`staff`, `parents`, `children`, `club_years`, `awards`) to a club via `club_id`. Replace the `ALLOWED_EMAILS` env-var whitelist with per-club access control derived from `clubs.admin_email` and `staff.app_access`. Propagate `club_id` transparently through the middleware → `X-Club-Id` header → service layer, with no frontend awareness required. Add an "Edit Club" settings page accessible from the header dropdown.

---

## Decisions

- `church_name` removed from `club_years`, lives only on `clubs`
- One user = one club (no multi-club support yet)
- `club_id` stored in Better Auth `user` record via `additionalFields`; middleware reads from session response, sets `X-Club-Id` header (always overwrites client value — cannot be spoofed)
- Initial club for existing data: migration creates placeholder club, `admin_email` configured afterwards via Edit Club page
- Logo upload uses existing storage adapter (R2/local)

## Tables that get `club_id`

- `clubs` — new table (is the root)
- `staff` — add `club_id NOT NULL`
- `parents` — add `club_id NOT NULL`
- `children` — add `club_id NOT NULL`
- `club_years` — add `club_id NOT NULL`
- `awards` — add `club_id NULL` (NULL = global/seeded)
- Better Auth `user` table — add `club_id NULL` via additionalFields

## Tables that do NOT need `club_id` (scoped by FK chain)

- `club_years_staff`, `classes`, `classes_children`, `events`, `events_children`, `events_awards`, `awards_children`, `parents_children`, `session`, `account`, `verification`

---

## Phase 1: Database Schema

1. **New migration**: Create `clubs` table:
   - New enum: `CREATE TYPE club_type AS ENUM ('ADVENTURERS', 'PATHFINDERS')`
   - `id` (IDENTITY PK), `club_name` (varchar NOT NULL), `club_logo_url` (varchar NULL), `church_name` (varchar NULL), `admin_email` (varchar NOT NULL), `type` (club_type NOT NULL DEFAULT 'ADVENTURERS'), `created_at` (timestamptz)

2. **New migration**: Add `club_id` columns and `app_access` to core tables:
   - `ALTER TABLE staff ADD COLUMN club_id integer REFERENCES clubs(id), ADD COLUMN app_access boolean NOT NULL DEFAULT false`
   - `ALTER TABLE parents ADD COLUMN club_id integer REFERENCES clubs(id)`
   - `ALTER TABLE children ADD COLUMN club_id integer REFERENCES clubs(id)`
   - `ALTER TABLE club_years ADD COLUMN club_id integer REFERENCES clubs(id)`
   - `ALTER TABLE awards ADD COLUMN club_id integer REFERENCES clubs(id)` (nullable)

3. **New migration**: Remove `church_name` from `club_years`:
   - `ALTER TABLE club_years DROP COLUMN church_name`

4. **Backfill migration**: Insert placeholder club and set `club_id` on all existing rows:
   - `INSERT INTO clubs (club_name, church_name, admin_email, type) SELECT club_name, church_name, '', 'ADVENTURERS' FROM club_years ORDER BY start_date LIMIT 1`
   - `UPDATE staff SET club_id = 1 WHERE club_id IS NULL`
   - `UPDATE parents SET club_id = 1 WHERE club_id IS NULL`
   - `UPDATE children SET club_id = 1 WHERE club_id IS NULL`
   - `UPDATE club_years SET club_id = 1 WHERE club_id IS NULL`
   - Then `ALTER TABLE ... ALTER COLUMN club_id SET NOT NULL` (except awards)

5. **Add NOT NULL constraints** after backfill (as separate ALTER TABLE statements)

6. **Update `db/schema.sql`** to reflect final state (add clubs table, new columns, remove church_name from club_years, add app_access to staff)

---

## Phase 2: Authentication & Access Control

7. **`src/lib/auth.js`**:
   - Add `additionalFields` to user model: `clubId: { type: 'number', nullable: true, input: false }`
   - Update `databaseHooks.user.create.before`: replace `isEmailAllowed()` call with DB lookup:
     - Check `clubs` table: `SELECT id FROM clubs WHERE admin_email = $email LIMIT 1`
     - If not found, check `staff`: `SELECT club_id FROM staff WHERE email = $email AND app_access = true LIMIT 1`
     - If neither found → throw `APIError("FORBIDDEN")`
     - If found → set `data.clubId = club_id` on the user record being created

8. **`src/utils/authUtils.js`**:
   - Replace `isEmailAllowed()` with `isEmailAllowedForClub(email, sql)`:
     - Runs the same two queries as above
     - Returns `{ allowed: boolean, clubId: number | null }`

9. **`src/middleware.js`**:
   - After fetching session, read `session.user.clubId`
   - If `clubId` is null/undefined → redirect to `/login?error=not_whitelisted` (covers case where user pre-dates multi-tenancy)
   - Set `X-Club-Id` header by constructing new `Headers` from request and overwriting: `requestHeaders.set('x-club-id', String(session.user.clubId))`
   - Pass to `NextResponse.next({ request: { headers: requestHeaders } })`
   - Update whitelist check to use new `isEmailAllowedForClub()` logic (or inline it)

   > Security note: middleware _always_ overwrites `x-club-id` regardless of what the client sent, so spoofing is not possible.

---

## Phase 3: Service Layer

All service updates follow the same pattern: accept `clubId` as a new parameter and add `WHERE ... AND table.club_id = $clubId` (or `AND (club_id IS NULL OR club_id = $clubId)` for awards).

10. **`awardsService.js`** (`list`, `getById`, `create`):
    - `list(clubYearLabel, search, clubId)`: add `AND (a.club_id IS NULL OR a.club_id = ${clubId})`
    - `getById(id, clubYearLabel, clubId)`: same filter on awards
    - `create({ name, level, type, link, clubId })`: include `club_id` in INSERT

11. **`childrenService.js`** (`list`, `listByClubYear`, `getById`, `create`, `update`):
    - `list(search, clubId)`: add `WHERE ch.club_id = ${clubId}`
    - `listByClubYear(clubYearLabel, search, clubId)`: add `AND ch.club_id = ${clubId}`
    - `getById(id, clubYearLabel, clubId)`: add `AND ch.club_id = ${clubId}`
    - `create(data, clubId)`: include `club_id` in INSERT

12. **`parentsService.js`** (`list`, `getById`):
    - `list(search, clubId)`: add `WHERE p.club_id = ${clubId}`
    - `getById(id, clubId)`: add `AND p.club_id = ${clubId}`

13. **`staffService.js`** (`list`, `listByClubYear`, `getById`, `getByIdForClubYear`, `enroll`, `getByRole`):
    - All query functions: add `AND sf.club_id = ${clubId}`
    - `enroll(clubYearLabel, staffMembers, clubId)`: include `club_id` in INSERT for new staff records

14. **`clubYearsService.js`** (`list`, `getByLabel`, `create`, `update`):
    - `list(clubId)`: add `WHERE cy.club_id = ${clubId}`
    - `getByLabel(label, clubId)`: add `AND cy.club_id = ${clubId}`
    - `create(data, clubId)`: include `club_id` in INSERT; remove `churchName` from params
    - `update(currentLabel, data, clubId)`: remove `churchName` from UPDATE; add `AND cy.club_id = ${clubId}`

15. **`familiesService.js`** (`list`, `getByMember`, `enroll`):
    - All functions: add `clubId` param, filter parents and children by `club_id`
    - `enroll(clubYearLabel, data, clubId)`: include `club_id` in INSERT for parents and children

16. **`eventsService.js`** (`list`, `listByClubYear`, `getById`, `create`, `update`):
    - Events are scoped through `club_year_id` which has `club_id`; verify queries already join through `club_years` and add `AND cy.club_id = ${clubId}` as defense-in-depth

17. **`classesService.js`** (`listByClubYear`, `getByName`):
    - Same as events — already scoped through club_year; add `AND cy.club_id = ${clubId}` for safety

18. **New `clubsService.js`**:
    - `getById(clubId)`: `SELECT * FROM clubs WHERE id = ${clubId}`
    - `update(clubId, { clubName, churchName, adminEmail, type })`: UPDATE clubs SET ... WHERE id = ${clubId}
    - `updateLogoUrl(clubId, url)`: UPDATE clubs SET club_logo_url = ${url} WHERE id = ${clubId}

---

## Phase 4: API Routes

19. **All existing API routes** — add `clubId` extraction at the top of each handler:

    ```js
    const clubId = parseInt(request.headers.get('x-club-id'), 10)
    ```

    Then pass `clubId` to the relevant service call. No auth logic needed in routes (middleware guarantees it).
    Files to update: all routes under `src/app/api/` except `api/auth/**`.

    > **Cross-club access → 404**: `getById` queries include `AND club_id = ${clubId}`, so a record belonging to another club returns `null` — same as not found. Existing null → 404 handling in route handlers covers this with no information leakage about whether the ID exists in another club.

20. **New `/api/club/route.js`**:
    - `GET`: `clubsService.getById(clubId)` → return club data
    - `PATCH`: `clubsService.update(clubId, body)` → return updated club

21. **New `/api/club/logo/route.js`**:
    - `POST`: accept multipart upload, store via storage adapter, call `clubsService.updateLogoUrl(clubId, url)`
    - Pattern: identical to `/api/awards/[id]/photo/route.js` and `/api/children/[id]/photo/route.js`

---

## Phase 5: Frontend

22. **`src/components/AppHeader.jsx`**:
    - Add "Edit Club" `MenuItem` to the user dropdown (above Settings)
    - Links to `/club`

23. **New `/club` page** (`src/app/club/page.jsx` + `view.jsx`):
    - `view.jsx`: FormPage with ClubForm
    - Fetches existing club data via `GET /api/club` on mount
    - Submits via `PATCH /api/club` (text fields) and `POST /api/club/logo` (if logo changed)
    - Breadcrumb: `[{ label: 'Edit Club' }]`

24. **New `src/components/forms/ClubForm.jsx`**:
    - Fields: Club Name (required), Church Name, Admin Email (required), Type (dropdown: ADVENTURERS / PATHFINDERS), Logo (file upload with preview)
    - Pattern: mirror `ClubYearForm.jsx` (Field.Root, Input, file input with preview)

25. **`src/components/forms/ClubYearForm.jsx`**:
    - Remove `churchName` field entirely

26. **`clubYearsService.js` + all club year views/hooks**:
    - Remove `churchName` from `create`/`update` service params
    - Remove `churchName` from club year list/detail display (`club-years/view.jsx`, `club-years/[label]/view.jsx`)
    - Remove from `useClubYear.js` / `useClubYears.js` transform if present

27. **Staff `app_access` toggle**:
    - `src/app/staff/[id]/view.jsx`: Add an `app_access` Switch toggle in the staff detail fields
    - Needs a new API route `PATCH /api/staff/[id]` (if it doesn't exist) or update the existing `POST /api/staff/[id]`
    - `staffService.js`: Add `updateAppAccess(id, appAccess, clubId)` function

---

## Relevant Files

- `db/schema.sql` — add clubs table, update all affected tables, remove church_name from club_years
- `db/migrations/` — 3–4 new migration files (clubs table, add columns, backfill, drop church_name)
- `club-compass/src/lib/auth.js` — additionalFields, updated databaseHooks
- `club-compass/src/utils/authUtils.js` — replace isEmailAllowed with club-aware version
- `club-compass/src/middleware.js` — read clubId from session, set X-Club-Id header
- `club-compass/src/services/awardsService.js` — add clubId param
- `club-compass/src/services/childrenService.js` — add clubId param
- `club-compass/src/services/parentsService.js` — add clubId param
- `club-compass/src/services/staffService.js` — add clubId param + updateAppAccess
- `club-compass/src/services/clubYearsService.js` — add clubId param, remove churchName
- `club-compass/src/services/familiesService.js` — add clubId param
- `club-compass/src/services/eventsService.js` — add clubId param (defense-in-depth)
- `club-compass/src/services/classesService.js` — add clubId param (defense-in-depth)
- `club-compass/src/services/clubsService.js` — NEW
- `club-compass/src/app/api/club/route.js` — NEW
- `club-compass/src/app/api/club/logo/route.js` — NEW
- All existing `src/app/api/**/route.js` files — read X-Club-Id header
- `club-compass/src/components/AppHeader.jsx` — add Edit Club menu item
- `club-compass/src/app/club/page.jsx` + `view.jsx` — NEW
- `club-compass/src/components/forms/ClubForm.jsx` — NEW
- `club-compass/src/components/forms/ClubYearForm.jsx` — remove churchName
- `club-compass/src/app/club-years/view.jsx` — remove church_name column
- `club-compass/src/app/club-years/[club_year_label]/view.jsx` — remove church_name field (dropped entirely, not re-sourced from club)
- `club-compass/src/app/staff/[id]/view.jsx` — add app_access toggle

---

## Verification

1. Run `./dev.sh` — confirm app starts with no migration errors
2. Visit `/login` — confirm login with `clubs.admin_email` works; non-listed email is rejected
3. Confirm `X-Club-Id` header is present in API requests (Network tab DevTools)
4. Manually set `X-Club-Id: 9999` in a browser request — confirm middleware overwrites it with correct value (API returns correct data, not error for wrong ID)
5. Create staff member, toggle `app_access = true`, log out, log back in with staff email — confirm access granted
6. Create a second club via psql, add a child to it — confirm child is NOT visible when logged in as first club's admin
7. Edit Club page: update club name, upload logo, change admin email — confirm changes persist
8. Create new club year — confirm church_name is gone from the form; new year correctly scoped to club
9. Awards: confirm seeded awards (club_id IS NULL) are visible to all clubs; club-created awards only visible to their club
