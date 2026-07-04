This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```
pgti-proyecto-crm-frontend
├─ AGENTS.md
├─ app
│  ├─ cliente
│  │  ├─ dashboard
│  │  │  └─ page.tsx
│  │  └─ layout.tsx
│  ├─ components
│  │  ├─ clientedashboard
│  │  │  ├─ ClienteDashboardHeader.css
│  │  │  ├─ ClienteDashboardHeader.tsx
│  │  │  ├─ ClienteTicketCard.css
│  │  │  └─ ClienteTicketCard.tsx
│  │  ├─ clientes
│  │  │  ├─ ActivityTimeline.css
│  │  │  ├─ ActivityTimeline.tsx
│  │  │  ├─ ClienteHeader.css
│  │  │  ├─ ClienteHeader.tsx
│  │  │  ├─ ClienteMetrics.css
│  │  │  ├─ ClienteMetrics.tsx
│  │  │  ├─ DealsList.css
│  │  │  ├─ DealsList.tsx
│  │  │  ├─ TicketsList.css
│  │  │  └─ TicketsList.tsx
│  │  ├─ dashboard
│  │  │  ├─ Kpicard.css
│  │  │  ├─ Kpicard.tsx
│  │  │  ├─ TicketsTable.css
│  │  │  ├─ TicketsTable.tsx
│  │  │  ├─ WeeklyChart.css
│  │  │  └─ WeeklyChart.tsx
│  │  ├─ duplicados
│  │  │  ├─ ComparisonView.css
│  │  │  ├─ ComparisonView.tsx
│  │  │  ├─ DuplicatesList.css
│  │  │  └─ DuplicatesList.tsx
│  │  ├─ layout
│  │  │  ├─ Sidebar.css
│  │  │  ├─ Sidebar.tsx
│  │  │  ├─ Topbar.css
│  │  │  └─ Topbar.tsx
│  │  ├─ soporte
│  │  │  ├─ AgentTable.css
│  │  │  ├─ AgentTable.tsx
│  │  │  ├─ MetricCard.css
│  │  │  ├─ MetricCard.tsx
│  │  │  ├─ PriorityChart.css
│  │  │  ├─ PriorityChart.tsx
│  │  │  ├─ SourceChart.css
│  │  │  ├─ SourceChart.tsx
│  │  │  ├─ TrendChart.css
│  │  │  └─ TrendChart.tsx
│  │  ├─ tickets
│  │  │  ├─ ActivityPanel.css
│  │  │  ├─ ActivityPanel.tsx
│  │  │  ├─ CrearTicketModal.css
│  │  │  ├─ CrearTicketModal.tsx
│  │  │  ├─ MessageThread.css
│  │  │  ├─ MessageThread.tsx
│  │  │  ├─ TicketDetail.css
│  │  │  └─ TicketDetail.tsx
│  │  └─ ui
│  │     ├─ avatar.tsx
│  │     ├─ badge.tsx
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ dropdown-menu.tsx
│  │     ├─ EmptyState.css
│  │     ├─ EmptyState.tsx
│  │     ├─ input.tsx
│  │     ├─ scroll-area.tsx
│  │     ├─ select.tsx
│  │     ├─ separator.tsx
│  │     ├─ Skeleton.css
│  │     ├─ Skeleton.tsx
│  │     ├─ table.tsx
│  │     ├─ tabs.tsx
│  │     └─ textarea.tsx
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ lib
│  │  ├─ api
│  │  │  ├─ clientes.api.ts
│  │  │  ├─ config.ts
│  │  │  ├─ interacciones.api.ts
│  │  │  ├─ reportes.api.ts
│  │  │  └─ tickets.api.ts
│  │  ├─ mocks
│  │  │  ├─ agentes
│  │  │  ├─ clientes.mock.ts
│  │  │  ├─ soporte.mock.ts
│  │  │  └─ tickets.mock.ts
│  │  ├─ types
│  │  │  ├─ cliente.types.ts
│  │  │  └─ ticket.types.ts
│  │  └─ utils.ts
│  ├─ page.tsx
│  └─ pages
│     ├─ clientes
│     │  └─ page.tsx
│     ├─ dashboard
│     │  └─ page.tsx
│     ├─ duplicados
│     │  └─ page.tsx
│     ├─ layout.tsx
│     ├─ soporte
│     │  └─ page.tsx
│     └─ tickets
│        └─ page.tsx
├─ CLAUDE.md
├─ components.json
├─ docker-compose.yml
├─ Dockerfile
├─ eslint.config.mjs
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
└─ tsconfig.json

```