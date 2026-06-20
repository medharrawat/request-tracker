# Request Tracking Dashboard

## Product Intent

### What this is

A dashboard for tracking document and information requests across legal cases. Users see which cases need attention, drill into a case to manage individual requests, and act on blocked items that require follow-up.

### Who it's for

- **Primary users:** Paralegals, case managers
- **Secondary users:** Admins, operatives

### Problems it solves

- Scattered request status across email/spreadsheets
- Manual effort determining next action to take

---

## Design Goals

These principles should guide every UI decision, especially when a flow or component isn't explicitly specified elsewhere in this doc.

1. **Reduce cognitive load at scale.** Assume users are managing a large volume of cases and requests at once. Default to condensed, scannable information; reveal detail on demand (progressive disclosure) rather than showing everything at once.
2. **Surface urgency before detail.** Blocked or overdue items should be visually and positionally prioritized — both in dashboard grouping and within a case's request list — so users can triage without reading every row.
3. **Prefer relative, actionable framing over raw data.** Where a relative value communicates urgency better than an absolute one (e.g. "3 days overdue" vs. a raw date), prefer the relative framing.
4. **Consistency over novelty.** Reuse existing components and interaction patterns rather than introducing a new pattern for a similar problem. A familiar, slightly less novel UI beats a fragmented one.
5. **Every state is a designed state.** Loading, empty, and zero-result states are not afterthoughts — they should guide the user toward a next action, not just indicate absence of content.

---

## Design System

The UI follows a semantic token architecture defined in `src/app/globals.css`.

**Rule 1:** Never use raw hex, px, or arbitrary Tailwind values in components. Use theme tokens only.

**Rule 2:** Always prioritize reusing components over creating new ones.

### Color tokens

| Token | Use |
| --- | --- |
| `page`, `surface`, `surface-muted`, `surface-hover` | Backgrounds |
| `border`, `border-subtle` | Dividers and outlines |
| `text-primary`, `text-secondary`, `text-tertiary`, `text-inverse` | Copy hierarchy |
| `brand`, `brand-hover`, `brand-muted` | Primary brand actions and accents |
| `pill-default-*`, `pill-action-*` | Status pills and attention states |

Semantic intent (use consistently):

- **primary** — main brand / primary actions
- **secondary** — supporting actions, muted emphasis
- **success** — completed, received, positive outcomes
- **warning** — needs attention, blocked, overdue, on hold, rejected

### Buttons

- **Primary** — one main action per section (e.g. "Add request")
- **Secondary** — supporting action (e.g. "Close case", cancel, filter toggle)

### Spacing

- Use the 4px scale only: `spacing-1` (4px) through `spacing-12` (48px)
- Never use arbitrary values like `p-[13px]` or `gap-5` unless added to the theme

### Typography

| Style | Use |
| --- | --- |
| **H1** (`text-2xl`) | Page titles |
| **H2** (`text-xl` / section headers) | Section titles, table headers |
| **Body** (`text-base`) | Default content |
| **Small** (`text-sm`, `text-xs`) | Metadata, badges, table secondary columns |

### Layout

- Max content width: `--max-width-content` (960px) where applicable
- App shell: fixed top nav + collapsible sidebar

### Components

Reuse existing primitives before adding new ones:

- `FilterBar`, `DashboardFiltersPanel`, `SegmentedControl`
- `StatusBadge`, `RequestRow`, `EmptyState`, `PageLoadingSkeleton`
- `AppShell`, `TopNav`, `Sidebar`

**Note:** `StatusBadge` handles both status pills and case-type pills via an optional `variant` prop (`<StatusBadge status="requested" />` vs. `<StatusBadge variant="case-type" label="Motor Vehicle Accident" />`). There is no separate `CaseTypePill` component — it was consolidated into `StatusBadge` since both use identical pill styling. Do not recreate a separate case-type component; extend the `variant` prop instead if a new pill type is needed.

---

## Coding Standards

### Stack

- **Next.js 16** (App Router) — read `node_modules/next/dist/docs/` before using unfamiliar APIs; this version may differ from older Next.js docs
- **React 19**, **TypeScript**, **Tailwind CSS v4**
- Icons: `lucide-react`

### Project structure

```
src/
  app/              # Routes and page-level server components
  components/
    layout/         # AppShell, TopNav, Sidebar
    dashboard/      # Dashboard-specific composition
    case/           # Case detail views
    request/        # Request rows, activity, manage actions
    ui/             # Shared, reusable UI primitives
  lib/              # Types, formatters, data fetching
```

### Conventions

**Components**

- Server components by default in `app/`; add `"use client"` only when using state, effects, or browser APIs
- Props types named `{ComponentName}Props`
- Colocate feature logic in feature folders; keep `ui/` generic and reusable
- Prefer composition over prop drilling

**Types**

- Domain types live in `src/lib/types.ts` (`Case`, `Request`, `RequestStatus`, etc.)
- Do not duplicate status unions inline — import from `types.ts`

**Styling**

- Tailwind classes must reference theme tokens: `bg-page`, `text-text-secondary`, `px-spacing-6`, `rounded-radius-xl`
- No inline styles except for dynamic layout values (e.g. sidebar width animation in `AppShell`)

**Data**

- Currently mock data via `src/lib/mock-data.ts`
- Server pages fetch data; pass serializable props to client components

**Naming**

- Files: PascalCase for components (`RequestRow.tsx`), camelCase for lib utilities (`format.ts`)
- Routes: kebab-case folders (`/cases/[id]`)
- Status values: snake_case in data (`needs_action`, `in_progress`)

### Quality bar

- Run `npm run lint` before opening a PR
- Keep diffs focused — match existing patterns in neighboring files
- Loading states: use `loading.tsx` and `PageLoadingSkeleton` where routes async-fetch
- Empty states: use `EmptyState` with clear primary/secondary actions
