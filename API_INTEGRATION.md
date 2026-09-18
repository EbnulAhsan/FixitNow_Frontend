# 📡 FixItNow - API Integration Documentation

This document maps all frontend components, routes, and Server Actions to their respective backend API endpoints for the FixItNow platform.

---

## 1. Authentication & User Management

| Frontend Component / Route | Client / Server Action | Backend Endpoint | HTTP Method | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/login` | `loginAction` | `/api/auth/login` | `POST` | Authenticates user credentials & issues JWT token |
| `/register` | `registerAction` | `/api/auth/register` | `POST` | Registers a new user with a specific role (`CUSTOMER` / `TECHNICIAN`) |
| Global Layout / Middleware | `getCurrentUser` | `/api/auth/me` | `GET` | Validates session token & fetches authenticated user role |

---

## 2. Public Marketplace & Browsing

| Frontend Component / Route | Client / Server Action | Backend Endpoint | HTTP Method | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/` (Home Page) | `getFeaturedServicesAction` | `/api/services?featured=true` | `GET` | Fetches highlighted services & top-rated professionals |
| `/services` | `getAllServicesAction` | `/api/services` | `GET` | Fetches all service listings with search, price, & category filters |
| `/technicians` | `getAllTechniciansAction` | `/api/technicians` | `GET` | Fetches list of background-verified technicians |
| `/technicians/[id]` | `getTechnicianDetailsAction` | `/api/technicians/:id` | `GET` | Fetches technician bio, skills, reviews, & dynamic availability |

---

## 3. Customer Dashboard & Bookings

| Frontend Component / Route | Client / Server Action | Backend Endpoint | HTTP Method | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/technicians/[id]` (Booking Modal) | `createBookingAction` | `/api/bookings` | `POST` | Submits a new booking request for a selected service & slot |
| `/customer-dashboard/bookings` | `getUserBookingsAction` | `/api/bookings/my-bookings` | `GET` | Fetches customer's active & past booking history |
| `/customer-dashboard/bookings` | `cancelBookingAction` | `/api/bookings/:id/cancel` | `PATCH` | Allows customer to cancel booking before it starts |
| `/customer-dashboard/bookings` | `submitReviewAction` | `/api/reviews` | `POST` | Submits rating ($1-5$ stars) and feedback for completed jobs |

---

## 4. Payment Integration (Stripe / Gateway)

| Frontend Component / Route | Client / Server Action | Backend Endpoint | HTTP Method | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/payment` বা `/customer-dashboard/bookings` | `initiatePaymentAction` | `/api/payments/create-checkout-session` | `POST` | Generates a Stripe Checkout session URL for accepted jobs |
| `/payment/success` | `verifyPaymentAction` | `/api/payments/verify-session` | `GET` | Verifies payment status and transitions booking status to `PAID` |
| `/payment/cancel` | Client Handler | N/A | N/A | Handles cancelled transaction and returns customer safely to bookings |

---

## 5. Technician Portal & Availability

| Frontend Component / Route | Client / Server Action | Backend Endpoint | HTTP Method | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/technician-dashboard` | `getTechnicianStatsAction` | `/api/technician/stats` | `GET` | Fetches overview metrics (total jobs, earnings, pending requests) |
| `/technician-dashboard/availability` | `getAvailabilityAction` | `/api/technician/availability` | `GET` | Fetches working hours and blocked-out time slots |
| `/technician-dashboard/availability` | `updateAvailabilityAction`| `/api/technician/availability` | `POST / PUT`| Saves updated time slots and schedule changes |
| `/technician-dashboard/bookings` | `getTechnicianBookingsAction` | `/api/technician/bookings` | `GET` | Fetches incoming booking requests |
| `/technician-dashboard/bookings` | `updateBookingStatusAction` | `/api/technician/bookings/:id/status` | `PATCH` | Updates booking status (`ACCEPTED`, `DECLINED`, `IN_PROGRESS`, `COMPLETED`) |

---

## 6. Admin Moderation & Category Control

| Frontend Component / Route | Client / Server Action | Backend Endpoint | HTTP Method | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/admin-dashboard` | `getAdminMetricsAction` | `/api/admin/overview` | `GET` | Global overview of platform health (users, revenue, active bookings) |
| `/admin-dashboard/users` | `getAllUsersAction` | `/api/admin/users` | `GET` | Lists all platform users with pagination & search |
| `/admin-dashboard/users` | `toggleUserBanAction` | `/api/admin/users/:id/ban` | `PATCH` | Modulates user access (Ban / Unban toggle) |
| `/admin-dashboard/categories` | `getCategoriesAction` | `/api/categories` | `GET` | Fetches all service categories |
| `/admin-dashboard/categories` | `createCategoryAction` | `/api/categories` | `POST` | Creates a new home service category |
| `/admin-dashboard/categories` | `deleteCategoryAction` | `/api/categories/:id` | `DELETE` | Removes an existing service category |

---

## 7. Error Handling Strategy

- **Client Errors:** Inline form validation using React Hook Form / Zod.
- **Server Errors / Network Failures:** Graceful user-friendly Toast notifications (via Sonner / React Hot Toast).
- **Page-Level Crashes:** Caught gracefully via Next.js `error.tsx` boundary with retry capabilities.
- **404 Handling:** Custom `not-found.tsx` with clear redirection back to active services.