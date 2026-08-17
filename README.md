# Spiritus Shipping & Logistics Management System — Demo

A polished, sales-ready **Shipping & Logistics Management System** for **Horizon Freight & Logistics** ("Moving Business Forward"). Built as a sales demo to convince real shipping, freight, clearing and vehicle-logistics companies to buy a **$750 implementation** with ongoing hosting from **$37/month**.

This is a standalone Next.js application living in its own directory, fully isolated from the sibling Splash Air CRM project.

---

## 1. Architecture Summary

- **Stack:** Next.js 16 (App Router, Server Components + Server Actions), TypeScript, Tailwind CSS 4, Prisma 5 + PostgreSQL (Neon), NextAuth v5 (credentials).
- **Pattern:** Modular monolith. Business logic lives in Server Actions (`src/lib/actions/*`) called by Server Components; client components handle forms, filters, the guided tour and the demo bar.
- **Data isolation:** Runs on the same Neon Postgres server as the Splash Air project but inside its own schema (`shipping`), so the two systems never collide.
- **Mobile-first but desktop-capable:** left sidebar on desktop, bottom navigation on mobile, floating quick-action menu, sticky "Get This System" sales CTA, persistent Demo Mode bar.
- **DECIMAL-SAFE money:** every monetary column is `Decimal(14,2)`; arithmetic goes through `src/lib/money.ts` using integer (BigInt) arithnetic — never floating point.

```
src/
  app/
    login|dashboard|customers|quotes|shipments|invoices|
    payments|expenses|documents|reports|search|activity   ← staff areas
    portal/                                              ← separate customer UI
    api/auth|api/demo/reset                              ← route handlers
  components/  ui/ layout/ auth/ shipments/ customers/ quotes/ payments/
               expenses/ documents/ portal/ search/ reports/ dashboard/ demo/
  lib/
    auth.ts  db.ts  company.ts  dashboard.ts  portal.ts  reports.ts
    constants.ts  money.ts  format.ts  status.tsx
    actions/ (shipments, customers, quotes, expenses-notes)
  proxy.ts                                              ← route protection
```

## 2. Database Schema

All models live in the `shipping` Postgres schema. Key models:

| Model | Purpose |
|-------|---------|
| `User` | Staff accounts with RBAC role (`SUPER_ADMIN`, `OPERATIONS`, `ACCOUNTS`, `SALES`, `CUSTOMER_SUPPORT`, `READ_ONLY`) |
| `Customer` | Customer/business record + country + customer type |
| `PortalUser` | Customer portal credentials (separate from staff) |
| `Quote` | Quotation with line-item fees, deposit, status, convert-to-shipment |
| `Shipment` | Full shipment record (number, type, status pipeline, vehicle/VIN, vessel, container, tracking), financial rollups and assigned staff |
| `Invoice` | Linked to shipment + customer, supports partial payments |
| `Payment` | Separate payment records with method, reference, receipt number |
| `Expense` | Linked to a shipment, categorised |
| `Document` | Linked to a shipment/customer, typed |
| `SupportNote` | Notes/updates (flagged internal vs customer-facing) |
| `ActivityLog` | Full audit trail |
| `Notification` | Email / WhatsApp / internal notification records |
| `CompanySettings` | Single-tenant config: name, tagline, colours, currency, WhatsApp numbers, enabled modules |

## 3. Demo User Credentials

All staff share the password **`#Shipping2026!`**:

| Email | Role |
|-------|------|
| admin@horizonfreight.co.zw | Super Admin |
| ops@horizonfreight.co.zw | Operations |
| accounts@horizonfreight.co.zw | Accounts |
| sales@horizonfreight.co.zw | Sales |
| support@horizonfreight.co.zw | Customer Support |
| readonly@horizonfreight.co.zw | Read Only |

**Customer Portal** (sign in at `/portal/login` with your email + portal code):

| Portal code | Customer |
|-------------|----------|
| `TENDAI2026` | Tendai Moyo (hero record) |
| `MAKONI2026` | Makoni Family Trust |
| `GUMBO2026` | Farai Gumbo |
| `MHLANGA2026` | Knowledge Mhlanga |
| `MUCHENJE2026` | Linda Muchenje |

## 4. Seed Data Summary

- 20 customers · 30 shipments · 8 quotes · 25 invoices · 24 payments · 110 expense records · 10 documents · 5 portal users · 8 support notes · 6 staff · notifications + activity log
- Scenarios covered: fully paid, partially paid, overdue invoice, vehicle in transit, vehicle at port, delivered, delayed, high/low profit, customer with multiple shipments, customer with outstanding balance.
- **Hero record:** **Tendai Moyo — 2018 Toyota Hilux** (VIN `MR0FZ29G101234567`), Birmingham → Harare, **Revenue $1,800 · Expenses $1,150 · Profit $650 · Margin 36.1%**, Deposit $500, Balance $1,300, Status **In Transit**, with VIN, collection document, invoice, payment receipt and Bill of Lading attached.

## 5. Routes Created (17 staff + portal + API)

- `/dashboard` (executive) · `/customers`, `/customers/[id]`, `/customers/new`
- `/quotes`, `/quotes/[id]`, `/quotes/[id]/print`, `/quotes/new`
- `/shipments`, `/shipments/[id]`, `/shipments/new`
- `/invoices` · `/payments`, `/payments/new`
- `/expenses`, `/expenses/new` · `/documents`, `/documents/new`
- `/reports` · `/search` · `/activity`
- `/login` · `/portal/login`, `/portal`, `/portal/shipments/[id]`
- `/api/auth/[...nextauth]`, `/api/demo/reset`

## 6. Components Created

- **ui:** `button`, `card`, `badge`, `field` (input/select/textarea), `table`, `modal`, `empty-state`, `stat`, `page-header`, `whatsapp`, `demo-flag`, `status.tsx` (status badges)
- **layout:** `sidebar`, `top-bar`, `bottom-nav`, `quick-actions`, `sign-out-button`
- **sales:** `sales-cta` (persistent Get-This-System modal → WhatsApp)
- **dashboard:** `profitability-card`, `revenue-chart`
- **shipments:** `shipments-filter`, `shipment-form`, `status-timeline`, `status-update`, `record-payment-form`, `add-expense-form`, `add-note-form`, `add-document-form`
- **demo:** `demo-bar`, `demo-tour` (9-step guided tour), `demo-reset-button`
- plus customers, quotes, payments, expenses, documents, portal, search, reports form/filter components.

## 7. Demo Tour Flow ("Start Demo")

Guided 9-step tour (~5 minutes): **Dashboard → Customer → Quote → Shipment → Payment → Expenses → Profit → Customer Portal → Reports**. Each step navigates to the relevant page and explains the value. Launches from the persistent **Start Demo** button in the Demo Mode bar.

## 8. Customer Portal Flow

- Customer logs in with email + portal code (separate `PortalUser` table, hidden from staff auth).
- Home shows **My Active Shipments**, **My Delivered**, **Outstanding Balance**, latest updates, documents, invoices.
- Shipment page shows status timeline, ETA, amount paid, outstanding balance, receipts, original documents and customer-facing updates.
- **Never exposes:** internal expenses, profitability, staff data, internal notes, or other customers (verified: a portal page contains no profit/expense/staff figures).

## 9. Financial Calculation Logic

- Money stored as `Decimal`; all sums use integer (BigInt) arithmetic in `src/lib/money.ts`.
- **Profitability per shipment** is deterministic: `Revenue = confirmed invoice total`, `Expenses = Σ expense records`, `Profit = Revenue − Expenses`, `Margin = Profit / Revenue`. Payments/balances are tracked *separately* — unpaid invoices are never counted as cash received.
- Recording a **payment** atomically updates the Shipment `amountPaid`/`outstanding`/`paymentStatus`, the linked Invoice `amountPaid`/`balance`/`status`, generates a receipt number, and writes an Activity Log entry.
- Adding an **expense** recomputes the shipment's `expensesTotal`, `profit` and `profitMargin`.
- Converting a **quote → shipment** creates the shipment (Booked) + invoice and marks the quote Converted.

## 10. Security Review

- **Auth:** NextAuth v5 credentials for staff and portal; JWT sessions; roles enforced server-side in every action; route protection via proxy.
- **RBAC:** Demo reset is restricted to `SUPER_ADMIN` (verified: non-admin gets 403). Roles are refreshed from the DB each request.
- **Portal isolation:** portal queries filter by the caller's customer id; internal financial/staff fields are excluded from portal queries (verified).
- **Input validation:** all server actions parse and coerce `FormData`; money uses validated decimal-safe helpers.
- **Headers:** CSP-friendly default headers set (frame-denial, nosniff, referrer policy).
- **No secrets in code:** WhatsApp numbers and company details come from `CompanySettings` config, not hardcoded.

## 11. Testing Checklist (verified)

- [x] `next build` passes TypeScript + production build.
- [x] Staff login, dashboard, and all 17 staff routes return 200.
- [x] Hero profitability card matches spec exactly ($1,800 / $1,150 / $650 / 36.1% / $500 / $1,300).
- [x] Customer portal login (portal code) and portal home/shipment render; internal data hidden.
- [x] Server actions verified via real UI: **status update** persisted, **record payment** correctly moved paid $500→$1,100 and invoice balance $1,300→$700.
- [x] Demo reset API works for super admin, denied for read-only.

Run locally:
```bash
cp .env.example .env        # set DATABASE_URL (schema=shipping)
npm install
npm run db:seed             # or: prisma db push && prisma db seed
npm run dev                 # http://localhost:3001
```

## 12. Deployment Checklist

- [x] Production `Dockerfile` with a non-root runtime user and health check.
- [x] Dokploy-ready `compose.dokploy.yml` with a persistent PostgreSQL 16 volume.
- [x] First boot applies the Prisma schema and seeds demo data only when the database is empty.
- [ ] In Dokploy, set `POSTGRES_PASSWORD`, `AUTH_SECRET`, and the public `APP_URL`.
- [ ] Point the Dokploy domain at the `app` service on port `3000`.
- [ ] Point `CompanySettings` WhatsApp/support numbers at the real sales line.
- [ ] Disable/small-print the Demo Mode bar before production; keep **Get This System** CTA.

For the Dokploy Compose deployment, use `compose.dokploy.yml`. Generate secrets with:

```bash
openssl rand -hex 32    # POSTGRES_PASSWORD (URL-safe)
openssl rand -base64 32 # AUTH_SECRET
```

The `/api/health` endpoint checks both the web app and its database connection. Database data lives in the named `shippingos_postgres_data` volume and survives application redeploys. Set `SEED_DEMO_DATA_IF_EMPTY=false` after the initial demo boot if automatic empty-database seeding is no longer desired.

## 13. Future SaaS Migration Plan

Single-tenant by design (`CompanySettings`). To multi-tenant:
- add `tenantId` to all business models + indexes;
- namespace `CompanySettings` per tenant and load it from a subdomain/header;
- scope every query and Server Action by `tenantId`; keep the existing action structure so only the scoping layer changes.

## 14. Recommended Next Features

- Real file upload/storage for documents (S3/Neon storage) with preview/download.
- WhatsApp cloud API + email sending for notifications.
- PDF receipts/invoices (already have a printable quote layout to extend).
- Presentation Mode (hide admin controls, larger type, next/prev workflow highlight).
- Multi-currency conversion and a bank reconciliation tab.
