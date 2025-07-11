# KidsHiz - Kid Activities Marketplace 🎯

A production-ready web marketplace that aggregates, curates, and sells seats for children's classes & events in Portugal, architected to scale EU-wide.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker (for PostgreSQL)
- Git

### Setup

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd kidshiz
npm install
```

2. **Start PostgreSQL database**
```bash
docker run --name kidshiz-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_USER=kidshiz \
  -e POSTGRES_DB=kidshiz \
  -p 5432:5432 -d postgres:16
```

3. **Setup database schema and seed data**
```bash
DATABASE_URL="postgresql://kidshiz:password@localhost:5432/kidshiz" npx prisma db push
DATABASE_URL="postgresql://kidshiz:password@localhost:5432/kidshiz" npx tsx prisma/seed.ts
```

4. **Start development server**
```bash
DATABASE_URL="postgresql://kidshiz:password@localhost:5432/kidshiz" npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js v5 (OAuth + credentials)
- **Payments**: Stripe + MBWay integration
- **Testing**: Jest + React Testing Library + Playwright

### Key Features
- 🔐 **Multi-role Authentication** (Parent/Provider/Admin)
- 💳 **Dual Payment Processing** (Stripe + MBWay)
- 🎯 **Activity Discovery** with advanced filtering
- 📅 **Session Management** with real-time availability
- 🔒 **GDPR Compliant** data handling
- 🌍 **Internationalization** ready (PT/EN)

## 📊 Current Status

### ✅ Implemented
- [x] **Database Schema** - 12+ tables with full relationships
- [x] **Authentication System** - NextAuth.js with role-based access
- [x] **Core APIs** - 15+ endpoints for activities, bookings, payments
- [x] **Payment Integration** - Stripe + MBWay with webhooks
- [x] **Development Tooling** - TypeScript, ESLint, Prettier, Husky
- [x] **Seed Data** - Realistic Portuguese marketplace data

### 🚧 In Progress
- [ ] **Frontend Pages** - Browse, detail, checkout, dashboards

### 📋 Planned
- [ ] Maps integration (Google Maps)
- [ ] Image upload functionality
- [ ] Background job processing
- [ ] Comprehensive testing suite
- [ ] Performance optimization
- [ ] Docker deployment setup

## 🎯 Sample Data

The database includes realistic Portuguese activities:
- **Swimming Classes** - Escola de Natação Porto
- **Ballet Lessons** - Academia de Dança Movimento  
- **Programming Courses** - Future Coders
- **Hip-Hop Dance** - Academia de Dança Movimento

### Test Users
- **Parent**: `ana.santos@gmail.com` / `password123`
- **Provider**: `contact@escolanatacao.pt` / `password123`

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run test         # Run Jest tests
npm run test:e2e     # Run Playwright E2E tests
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database
```

### API Endpoints

#### Public APIs
- `GET /api/activities` - Browse activities with filtering
- `GET /api/activities/[id]` - Activity details
- `GET /api/sessions` - Browse sessions

#### Authenticated APIs
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - User's bookings
- `POST /api/payments/create-intent` - Create payment
- `GET /api/users/profile` - User profile

#### Provider APIs
- `GET /api/provider/activities` - Provider's activities
- `POST /api/provider/activities` - Create activity

### Environment Variables
Copy `.env.example` to `.env.local` and configure:
```env
DATABASE_URL="postgresql://kidshiz:password@localhost:5432/kidshiz"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
STRIPE_SECRET_KEY="sk_test_your-key"
STRIPE_PUBLISHABLE_KEY="pk_test_your-key"
```

## 🏢 Business Model

- **Platform Fee**: 10% commission on successful bookings
- **Payment Processing**: Stripe (international) + MBWay (Portugal)
- **Target Market**: Parents in Porto/Matosinhos, expanding EU-wide
- **Scalability**: Designed for >50k activity listings

## 🛡️ Security & Compliance

- **Authentication**: JWT with refresh rotation
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: GDPR compliance with retention policies
- **Payment Security**: PCI DSS via Stripe, MBWay integration
- **Input Validation**: Zod schema validation
- **SQL Injection**: Prisma ORM protection

## 📈 Performance Targets

- **First Contentful Paint**: <1.5s on 4G
- **Lighthouse Score**: ≥90 (Performance & Accessibility)
- **Test Coverage**: ≥70% on critical paths
- **Uptime**: 99.9% availability target

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for Portuguese families seeking amazing activities for their kids.**
