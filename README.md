# Request Tracking Dashboard

A dashboard for tracking document and information requests across legal cases. Paralegals and case managers can see which cases need attention, drill into a case to manage individual requests, and act on blocked items that require follow-up.

**Live app:** [https://request-tracking-dashboard.vercel.app](https://request-tracking-dashboard.vercel.app)

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
