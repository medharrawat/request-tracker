# Request Tracking Dashboard

A dashboard for tracking document and information requests across legal cases. Paralegals and case managers can see which cases need attention, drill into a case to manage individual requests, and act on blocked items that require follow-up.

**Live app:** [https://request-tracking-dashboard.vercel.app](https://request-tracking-dashboard.vercel.app)

## Write-up
### Decisions and Tradeoffs
I designed the [Case Page](https://request-tracking-dashboard.vercel.app/cases/case_8f2a) around the assumption that users manage a large volume of cases and requests, so the priority was reducing cognitive load at scale. Each row uses progressive disclosure: condensed by default, expandable to show the activity log combined with last-updated and requested dates. I'd like to validate that condensing additional detail impacts user engagement, by measuring time to first action.

I prioritized a low friction experience for users determining their next action, and showed "days until due" instead of the deadline, to make urgency scannable at a glance. I’m assuming users value speed and simplicity here and would want to validate whether reducing steps impacts user confidence and time to completion. My main tradeoff was time: more went into visual hierarchy than into more features and considering additional edge cases. 
 
### AI Tooling
I started with Claude to surface a few common pain points and Lovable to save time and get quick prototyping ideas. Then, I built out core design system elements in Figma myself: I've found heavily AI-generated screens tend to have repetitive similar patterns, and I assumed the design should be intuitive and delightful to stand out from competitors. I wrote a rough PRD and used Cursor with the Figma MCP to implement the design, building a design.md file for consistent agentic output. Initial explorations emphasized status color to help users prioritize their next action, but I overrode the decision and placed the emphasis to due date instead, assuming that a single metric over varying status colors would enhance simplicity.

Rough Token Total: 5M tokens across exploration and implementation

## Next Steps
I'd conduct usability testing to validate the scannability of the table formatting, and check whether the current filters and sort order actually match users' real prioritization habits, iterating from there. I want to explore whether displaying case metrics provides additional value for users quickly determining progress on a case (ex: 20 cases are In Progress). For large datasets, I'd explore simplifying the view based on a user's own assignments. I'd want to test the UI against real datasets to see where it breaks or needs adjustment.


## Getting started

### Prerequisites

- Node.js 20+
- npm

### Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other commands

```bash
npm run build   # production build
npm run start   # run production server
npm run lint    # ESLint
```

## Project structure

- `src/app/` — Next.js App Router pages
- `src/components/` — UI components (dashboard, case views, request rows)
- `src/lib/` — types, filters, mock data, status helpers
- `case-documents.json` — sample case and request data
- `design.md` — product intent and design system notes

## Deployment

The app is deployed on [Vercel](https://vercel.com). Pushes to `main` trigger automatic deployments.

- **Production:** [https://request-tracking-dashboard.vercel.app](https://request-tracking-dashboard.vercel.app)
- **Repository:** [github.com/medharrawat/request-tracker](https://github.com/medharrawat/request-tracker)

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- TypeScript
