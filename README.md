# 🛠️ FixIt Now — On-Demand Home Service & Booking Platform

**FixIt Now** is a full-stack on-demand home service marketplace connecting customers with verified professional technicians. The platform enables users to browse categories, book repair services, pay securely online, track job lifecycles in real time, and manage dedicated dashboards for **Admins**, **Technicians**, and **Customers**.

[![Frontend CI](https://github.com/EbnulAhsan/FixitNow_Frontend/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/EbnulAhsan/FixitNow_Frontend/actions)
![Status](https://img.shields.io/badge/status-active-success)
![Frontend](https://img.shields.io/badge/frontend-Next.js%2016-black)
![React](https://img.shields.io/badge/react-19-61DAFB)
![Backend](https://img.shields.io/badge/backend-Node.js%20%2F%20Express-green)
![Database](https://img.shields.io/badge/database-PostgreSQL-blue)
![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748)
![Payments](https://img.shields.io/badge/payments-Stripe-635BFF)
![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF)
![Deployment](https://img.shields.io/badge/frontend%20deploy-Vercel-black)
![Deployment](https://img.shields.io/badge/backend%20deploy-Render-46E3B7)

---

## 📑 Table of Contents

- [Project Links](#-project-links)
- [Demo & Testing Credentials](#-demo--testing-credentials)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#️-system-architecture)
- [Route Map & API Reference](#-route-map--api-reference)
- [Local Setup Guide](#️-local-setup-guide)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Project Structure](#-project-structure)
- [Error Handling Strategy](#-error-handling-strategy)
- [Roadmap](#️-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🔗 Project Links

| Resource | Link |
|---|---|
| 🌐 Live Frontend Application | [fixit-now-frontend.vercel.app](https://fixit-now-frontend-kbrdwhvgr-md-ebnul-ahsans-projects.vercel.app) |
| 💻 Frontend Repository | [github.com/EbnulAhsan/FixitNow_Frontend](https://github.com/EbnulAhsan/FixitNow_Frontend) |
| 🧩 Backend Repository | [github.com/EbnulAhsan/FixItNow_Backend](https://github.com/EbnulAhsan/FixItNow_Backend) |
| ⚙️ Live Backend API | [fixitnow-backend-rkod.onrender.com](https://fixitnow-backend-rkod.onrender.com) |
| ⚙️ Backend Service Dashboard | [Render Dashboard](https://dashboard.render.com/web/srv-d9nu40m417fc73e5ls70) |
| 🔄 CI Workflow Runs | [GitHub Actions](https://github.com/EbnulAhsan/FixitNow_Frontend/actions) |
| 🎥 Demo Video Walkthrough | Watch Demo Video |

---

## 🔑 Demo & Testing Credentials

Use these pre-seeded accounts to explore the role-based workflows, permissions, and dashboards.

| Role | Name | Email | Password | Key Permissions & Features |
|---|---|---|---|---|
| 🛡️ **Super Admin** | Super Admin | `admin99@fixitnow.com` | `Admin1721@` | Manage users, view platform-wide bookings, control categories, inspect revenue |
| 🔧 **Technician** | Abir Hasan | `abir@fixitnow.com` | `Technician123!` | View requested service jobs, accept/update booking statuses, manage offerings |
| 👤 **Customer** | Ebnu | `ebnu@example.com` | `Customer123!` | Browse catalog, book services, pay online, track live request status, view payment history |

> ⚠️ **Note:** These are demo credentials for evaluation purposes only. Do not use them in production or reuse these passwords elsewhere.

---

## 🚀 Key Features

- **🔐 Role-Based Access Control (RBAC)** — Fine-grained authorization and guarded routes for Admins, Technicians, and Customers, built with route groups (`admin-dashboard`, `technician-dashboard`, `customer-dashboard`) and middleware session checks.
- **🔍 Service Discovery & Filtering** — Real-time category, search, and price filtering across AC Repair, Electrical, Plumbing, Painting, Cleaning, and Carpentry.
- **📦 End-to-End Booking Lifecycle** — Robust state management handling status progression:
  `REQUESTED ➔ ACCEPTED ➔ IN_PROGRESS ➔ COMPLETED ➔ CANCELLED`
- **💳 Secure Online Payments** — Stripe Checkout integration for accepted jobs, with server-side session verification before marking a booking as `PAID`.
- **⭐ Ratings & Reviews** — Customers can rate and review technicians after job completion.
- **📊 Customized Dashboards** — Actionable analytics, active bookings feed, availability management, and user-specific statistics per role.
- **🧭 Technician Availability Management** — Technicians can define working hours and blocked-out time slots.
- **✅ Robust Request Validation** — Strict client-side and server-side schema validation using **Zod** + **React Hook Form**.
- **🔔 Toast Notifications & Error Boundaries** — Friendly UX feedback via Sonner, with Next.js `error.tsx` and `not-found.tsx` boundaries.
- **🌱 Pre-configured Seeding** — Ready-to-test database state, prepopulated with technicians, services, and demo accounts.
- **🔄 Automated CI & Deployment** — Every push and pull request is linted, type-checked, and built by GitHub Actions, and `main` is deployed automatically to Vercel.

---

## 💻 Tech Stack

### Frontend
| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS 4 |
| Component Primitives | Radix UI + shadcn/ui |
| Icons | Lucide React |
| Animations | Framer Motion |
| Data Fetching & Caching | Axios + TanStack Query |
| Forms & Validation | React Hook Form + Zod |
| Payments (client) | Stripe.js / React Stripe |
| Notifications | Sonner (toast) |
| Auth/Session Storage | cookies-next |
| CI | GitHub Actions |
| Deployment | Vercel |

### Backend
| Category | Technology |
|---|---|
| Runtime & Framework | Node.js, Express.js 5 (TypeScript) |
| ORM & Database | Prisma ORM with PostgreSQL |
| Authentication | JWT (JSON Web Tokens), bcrypt password hashing |
| Validation | Zod |
| Payments (server) | Stripe Checkout Sessions |
| CI/CD | GitHub Actions |
| Deployment | Render |

---

## 🏗️ System Architecture

```
┌──────────────┐        REST API (Axios / TanStack Query)       ┌──────────────┐
│   Frontend   │ ─────────────────────────────────────────────▶│   Backend    │
│  Next.js 16  │ ◀───────────────────────────────────────────── │   Express    │
│  + Tailwind  │            JWT-authenticated requests           │  + Prisma    │
└──────┬───────┘                                                 └──────┬───────┘
       │                                                                 │
       │ Stripe Checkout redirect                                       │
       ▼                                                                 ▼
   Stripe (Payments)                                           PostgreSQL Database
                                                                  (Render / Local)
```

**Roles & Flow:**
1. Customers browse categories, view technicians, and submit a booking request.
2. The booking enters the `REQUESTED` state and becomes visible to Technicians.
3. A Technician accepts/declines and updates the job through `ACCEPTED → IN_PROGRESS → COMPLETED`.
4. On acceptance, the customer completes payment via Stripe Checkout; the backend verifies the session and marks the booking `PAID`.
5. Customers leave a rating/review after job completion.
6. Admins monitor all activity, manage categories and users, and inspect platform-wide revenue.

---

## 🧭 Route Map & API Reference

<details>
<summary><strong>Click to expand full frontend ↔ backend endpoint mapping</strong></summary>

**Authentication & User Management**

| Route | Action | Endpoint | Method |
|---|---|---|---|
| `/login` | `loginAction` | `/api/auth/login` | `POST` |
| `/register` | `registerAction` | `/api/auth/register` | `POST` |
| Global Layout/Middleware | `getCurrentUser` | `/api/auth/me` | `GET` |

**Public Marketplace & Browsing**

| Route | Action | Endpoint | Method |
|---|---|---|---|
| `/` | `getFeaturedServicesAction` | `/api/services?featured=true` | `GET` |
| `/services` | `getAllServicesAction` | `/api/services` | `GET` |
| `/technicians` | `getAllTechniciansAction` | `/api/technicians` | `GET` |
| `/technicians/[id]` | `getTechnicianDetailsAction` | `/api/technicians/:id` | `GET` |

**Customer Dashboard & Bookings**

| Route | Action | Endpoint | Method |
|---|---|---|---|
| `/technicians/[id]` (Booking Modal) | `createBookingAction` | `/api/bookings` | `POST` |
| `/customer-dashboard/bookings` | `getUserBookingsAction` | `/api/bookings/my-bookings` | `GET` |
| `/customer-dashboard/bookings` | `cancelBookingAction` | `/api/bookings/:id/cancel` | `PATCH` |
| `/customer-dashboard/bookings` | `submitReviewAction` | `/api/reviews` | `POST` |

**Payments (Stripe)**

| Route | Action | Endpoint | Method |
|---|---|---|---|
| `/payment` / `/customer-dashboard/bookings` | `initiatePaymentAction` | `/api/payments/create-checkout-session` | `POST` |
| `/payment/success` | `verifyPaymentAction` | `/api/payments/verify-session` | `GET` |
| `/payment/cancel` | Client Handler | — | — |

**Technician Portal & Availability**

| Route | Action | Endpoint | Method |
|---|---|---|---|
| `/technician-dashboard` | `getTechnicianStatsAction` | `/api/technician/stats` | `GET` |
| `/technician-dashboard/availability` | `getAvailabilityAction` | `/api/technician/availability` | `GET` |
| `/technician-dashboard/availability` | `updateAvailabilityAction` | `/api/technician/availability` | `POST / PUT` |
| `/technician-dashboard/bookings` | `getTechnicianBookingsAction` | `/api/technician/bookings` | `GET` |
| `/technician-dashboard/bookings` | `updateBookingStatusAction` | `/api/technician/bookings/:id/status` | `PATCH` |

**Admin Moderation & Category Control**

| Route | Action | Endpoint | Method |
|---|---|---|---|
| `/admin-dashboard` | `getAdminMetricsAction` | `/api/admin/overview` | `GET` |
| `/admin-dashboard/users` | `getAllUsersAction` | `/api/admin/users` | `GET` |
| `/admin-dashboard/users` | `toggleUserBanAction` | `/api/admin/users/:id/ban` | `PATCH` |
| `/admin-dashboard/categories` | `getCategoriesAction` | `/api/categories` | `GET` |
| `/admin-dashboard/categories` | `createCategoryAction` | `/api/categories` | `POST` |
| `/admin-dashboard/categories` | `deleteCategoryAction` | `/api/categories/:id` | `DELETE` |

Full details available in [`API_INTEGRATION.md`](./API_INTEGRATION.md).

</details>

---

## ⚙️ Local Setup Guide

### 1. Clone the Repositories

```bash
# Frontend
git clone https://github.com/EbnulAhsan/FixitNow_Frontend.git
cd FixitNow_Frontend

# Backend
git clone https://github.com/EbnulAhsan/FixItNow_Backend.git
cd FixItNow_Backend
```

### 2. Environment Configuration

Create a `.env` file in the **backend** root:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/fixitnow_db?schema=public"
PORT=5000
JWT_SECRET="your_super_secret_jwt_key"
JWT_EXPIRES_IN="7d"
STRIPE_SECRET_KEY="sk_test_xxxxxxxxxxxx"
```

Create a `.env.local` file in the **frontend** root:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxx"
```

### 3. Database Migration & Seeding

```bash
# Push schema migrations
npx prisma migrate dev --name init

# Populate database with demo users & catalog
npx ts-node seed-data.ts
```

### 4. Run Development Servers

```bash
# Backend
npm run dev

# Frontend
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the application.

---

## 🔄 CI/CD Pipeline

The frontend uses **GitHub Actions** for Continuous Integration and **Vercel** for Continuous Deployment. Every push and pull request is automatically verified, so broken code is caught before it reaches production.

```mermaid
flowchart LR
    A[Push / Pull Request] --> B[Checkout & Setup Node]
    B --> C[npm ci]
    C --> D[Lint]
    D --> E[Type Check]
    E --> F[Next.js Build]
    F -->|main branch| G[Vercel Auto Deploy]
    G --> H[Live Frontend]
```

### 📄 Workflow File

```text
.github/workflows/frontend-ci.yml
```

### ⚡ Triggers

| Event | Branch | Action |
|---|---|---|
| `push` | `main` | Run CI, then Vercel deploys to production |
| `pull_request` | `main` | Run CI only (Vercel creates a preview deployment) |

### 🧪 Pipeline Stages

| Stage | Description |
|---|---|
| **Checkout** | Pulls the latest source code |
| **Setup Node.js** | Installs Node.js with npm dependency caching |
| **Install** | `npm ci` for clean, reproducible installs |
| **Lint** | `npm run lint` enforces code quality rules |
| **Type Check** | `npx tsc --noEmit` catches TypeScript errors |
| **Build** | `npm run build` verifies the Next.js production build succeeds |

If any stage fails, the workflow is marked as failed and the change should not be merged.

### 🚀 Continuous Deployment

Deployment is handled by **Vercel's Git integration**:

1. A push to `main` triggers a **production deployment**.
2. Every pull request gets its own **preview deployment** URL.
3. Vercel runs its own `next build` and publishes the new version to the live frontend.

### 🔐 Environment Variables

The CI build needs the public environment variables used by the app. Add them under **Repository → Settings → Secrets and variables → Actions**, and in the **Vercel project settings** for deployment:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the live backend API |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe **test** publishable key |

> 🔒 Only public (`NEXT_PUBLIC_*`) values belong in the frontend. Never add secret keys such as `STRIPE_SECRET_KEY` to the frontend repository or its CI.

### 🔗 Backend Pipeline

The backend has its own pipeline (`backend-ci-cd.yml`) that tests, builds, and deploys the API to Render. See the [Backend README](https://github.com/EbnulAhsan/FixItNow_Backend#cicd-pipeline) for details.

---

## 📁 Project Structure

```
FixitNow_Frontend/
├── .github/
│   └── workflows/
│       └── frontend-ci.yml          # CI pipeline (lint, type-check, build)
├── src/
│   ├── app/
│   │   ├── (auth-Group)/            # /login, /register
│   │   ├── (public-Group)/          # /, /services, /technicians, /payment
│   │   └── (dashboard-Group)/       # role-guarded dashboards
│   │       ├── admin-dashboard/     # users, categories
│   │       ├── technician-dashboard/# availability, bookings
│   │       └── customer-dashboard/  # bookings, payments
│   ├── components/                  # Shared UI (shadcn/Radix-based)
│   ├── service/                     # API client & server actions
│   └── lib/                         # Utilities & helpers
├── public/
├── API_INTEGRATION.md               # Full frontend ↔ backend endpoint map
└── package.json
```

---

## 🧯 Error Handling Strategy

- **Client Errors:** Inline form validation via React Hook Form + Zod.
- **Server Errors / Network Failures:** Friendly toast notifications via Sonner.
- **Page-Level Crashes:** Caught gracefully by Next.js `error.tsx` boundaries with retry support.
- **404 Handling:** Custom `not-found.tsx` redirecting users back to active services.

---

## 🗺️ Roadmap

- [ ] Real-time notifications (WebSockets) for booking status updates
- [ ] In-app chat between customers and technicians
- [ ] Technician earnings payout automation
- [ ] Mobile application (React Native)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

> Pull requests are checked automatically by the CI pipeline. Please make sure lint, type-check, and build pass before requesting a review.

---

## 📄 License

This project was created for educational and assignment purposes.

---

## 👤 Author

**Md. Ebnul Ahsan**
- GitHub: [@EbnulAhsan](https://github.com/EbnulAhsan)

---

<p align="center">Made with ❤️ for making home repairs simpler.</p>
