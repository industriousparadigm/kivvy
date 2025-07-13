# Kid-Activities Aggregator - Project Instructions Summary

## Mission

Build a production-ready web marketplace that aggregates, curates, and sells seats for children's classes & events, starting with Porto/Matosinhos and architected to scale EU-wide.

## Operating Principles

- Own the end-to-end loop: Analyze → plan → scaffold → implement → test → iterate
- Select up-to-date, widely supported tooling
- Break work into small, verifiable tasks with automated tests after each
- Fail fast & recover - detect ambiguous requirements and propose clarifications
- Surface pull-requests/diff summaries for reviewer approval at milestones

## Functional Scope (MVP)

1. **Browse & Filter Activities** - by age, date, location, language, price
2. **Activity Detail Page** - image gallery, map, real-time availability, provider bio
3. **Secure Checkout** - Stripe + local EU payment (MBWay or equivalent)
4. **Parent Dashboard** - manage children, bookings, saved activities
5. **Provider Dashboard** - CRUD activities & schedules, view bookings, analytics
6. **Transactional Notifications** - email (+ SMS/WhatsApp) on booking success/reminders

## Non-Functional Requirements

- **Accessibility**: WCAG 2.1 AA minimum, keyboard-navigable, screen-reader roles
- **Internationalisation**: English & Portuguese i18n baseline, ready for more locales
- **Performance**: Fast first contentful paint (<1.5s on 4G), edge caching for public pages
- **Security**: OWASP top-10 mitigations, GDPR-compliant data handling, PCI scope minimized
- **Scalability**: Design for >50k listings and burst traffic during school holidays
- **Observability**: Structured logs, error tracking, trace sampling around critical flows

## Data Model (minimum)

Users, providers, child profiles, activities, activity sessions, bookings, payments

- Enforce referential integrity and soft deletes
- Row-level isolation so providers access only their own data

## Technology Stack Decisions

- **Database**: PostgreSQL (reliable, ACID compliant, excellent for relational data)
- **Backend**: Next.js API routes (full-stack, excellent performance, TypeScript support)
- **Frontend**: Next.js with React (SSR/SSG, performance, modern ecosystem)
- **Auth**: NextAuth.js (OAuth + email/password, role-based access)
- **Payments**: Stripe (international) + MBWay integration
- **Styling**: Tailwind CSS (utility-first, responsive, accessible)
- **ORM**: Prisma (type-safe, excellent DevX, migration management)
- **Testing**: Jest + React Testing Library + Playwright (unit + E2E)
- **Deployment**: Docker + docker-compose (local development)

## Key Implementation Notes

- Use structured logging throughout for debugging
- Implement real database with proper migrations, no mocks
- Create realistic seed data for local testing
- Run tests continuously, commit only passing code
- Autonomous execution - make decisions and keep going
- Test functionality locally before proceeding to next task

## Current Progress Status (Updated: 2025-07-13)

### ✅ COMPLETED (High Priority)

1. **Project Architecture & Setup** - Complete system design, Docker PostgreSQL, development tooling
2. **Database Schema** - Prisma ORM with full relational model, migrations, realistic seed data
3. **Authentication & RBAC** - NextAuth.js v5, Google OAuth, credentials auth, role-based middleware
4. **Core API Endpoints** - Activities, sessions, bookings, users, profiles (15+ endpoints)
5. **Payment Integration** - Stripe + MBWay processing, webhooks, refunds, dispute handling
6. **Development Setup** - TypeScript, ESLint, Prettier, Husky hooks, comprehensive tooling
7. **Frontend UX/UI Transformation** - Complete mother-focused design system with warm colors, emotional copy, and nurturing aesthetic

### 🚧 IN PROGRESS

- **Code Quality** - Fix linting issues and improve type safety
- **Frontend Enhancement** - Detail pages, checkout flow, dashboards

### 📋 REMAINING TASKS

- Maps integration and image upload functionality
- Background jobs and worker queue skeleton
- Observability: logging, metrics, error tracking
- Comprehensive tests (unit + E2E) with ≥70% coverage
- Docker setup and local deployment scripts
- Performance and accessibility optimization (Lighthouse ≥90)
- Documentation: README, architecture decisions, setup guide

## Technical Implementation Highlights

- **Database**: PostgreSQL with 12+ tables, referential integrity, soft deletes
- **Authentication**: Role-based access (Parent/Provider/Admin) with session management
- **Payments**: Dual payment processing (Stripe + MBWay) with webhook reconciliation
- **API Design**: RESTful with proper error handling, pagination, filtering
- **Security**: OWASP compliance, GDPR data handling, PCI scope minimization
- **Scalability**: Row-level security, edge caching ready, designed for >50k listings

## Success Criteria

- All functional scope implemented with passing tests
- Local environment spins up via one command
- Complete booking flow works end-to-end
- Core pages score ≥90 on Lighthouse (performance & accessibility)
- Automated CI pipeline green on default branch
- ≥70% test coverage on critical paths

## Architecture Pattern

- Full-stack Next.js application
- PostgreSQL database with Prisma ORM
- RESTful API design with proper error handling
- Component-based frontend with TypeScript
- Role-based authentication and authorization
- Comprehensive logging and error tracking
