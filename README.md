# 🛠️ FixIt Now — On-Demand Home Service & Booking Platform

**FixIt Now** is a full-stack on-demand home service marketplace connecting customers with verified professional technicians. The platform enables users to browse categories, book repair services, pay securely online, track job lifecycles in real time, and manage dedicated dashboards for **Admins**, **Technicians**, and **Customers**.

![Status](https://img.shields.io/badge/status-active-success)
![Frontend](https://img.shields.io/badge/frontend-Next.js%2016-black)
![React](https://img.shields.io/badge/react-19-61DAFB)
![Backend](https://img.shields.io/badge/backend-Node.js%20%2F%20Express-green)
![Database](https://img.shields.io/badge/database-PostgreSQL-blue)
![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748)
![Payments](https://img.shields.io/badge/payments-Stripe-635BFF)
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
| ⚙️ Backend Service Dashboard | [Render Dashboard](https://dashboard.render.com/web/srv-d9nu40m417fc73e5ls70) |
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
| Deployment | Vercel |

### Backend
| Category | Technology |
|---|---|
| Runtime & Framework | Node.js, Express.js / NestJS (TypeScript) |
| ORM & Database | Prisma ORM with PostgreSQL |
| Authentication | JWT (JSON Web Tokens), bcrypt password hashing |
| Validation | Zod |
| Payments (server) | Stripe Checkout Sessions |
| Deployment | Render |

---

## 🏗️ System Architecture

```
┌──────────────┐        REST API (Axios / TanStack Query)       ┌──────────────┐
│   Frontend   │ ─────────────────────────────────────────────▶│   Backend    │
│  Next.js 16  │ ◀───────────────────────────────────────────── │ Express/Nest │
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
git clone <your-backend-repo-url>
cd <backend-folder>
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
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
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

## 📁 Project Structure

```
FixitNow_Frontend/
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

---

## 👤 Author

**Md. Ebnul Ahsan**
- GitHub: [@EbnulAhsan](https://github.com/EbnulAhsan)

---

<p align="center">Made with ❤️ for making home repairs simpler.</p>
