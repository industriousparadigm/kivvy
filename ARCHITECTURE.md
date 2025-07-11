# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                Frontend                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Browse     │  │  Activity   │  │  Checkout   │  │  Dashboard  │        │
│  │  Activities │  │  Details    │  │  Flow       │  │  (Parent/   │        │
│  │             │  │             │  │             │  │  Provider)  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                        Next.js App Router                              ││
│  │                    (SSR/SSG + Client Components)                       ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API Layer                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Auth API   │  │ Activities  │  │  Bookings   │  │  Payments   │        │
│  │ /api/auth/* │  │ /api/activ* │  │ /api/book*  │  │ /api/pay*   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                        Next.js API Routes                              ││
│  │                  (Serverless Functions + Middleware)                   ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Business Logic                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ User        │  │ Activity    │  │ Booking     │  │ Payment     │        │
│  │ Service     │  │ Service     │  │ Service     │  │ Service     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                           Prisma ORM                                   ││
│  │                      (Type-safe Database Access)                       ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                               Database                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │    Users    │  │ Activities  │  │  Bookings   │  │  Payments   │        │
│  │             │  │             │  │             │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                          PostgreSQL                                     ││
│  │                   (ACID Compliant, Relational)                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

## External Services Integration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           External Services                                │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Stripe    │  │   MBWay     │  │ Google Maps │  │   Email     │        │
│  │  (Payments) │  │ (EU Local   │  │ (Location   │  │ (SendGrid/  │        │
│  │             │  │  Payments)  │  │  Services)  │  │  Resend)    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Sentry    │  │   Winston   │  │   Vercel    │  │   GitHub    │        │
│  │   (Error    │  │  (Logging)  │  │ (Hosting/   │  │  (Source    │        │
│  │  Tracking)  │  │             │  │   CDN)      │  │  Control)   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### User Authentication Flow
1. User visits site → Next.js SSR renders page
2. User clicks login → NextAuth.js handles OAuth/credentials
3. Session stored in JWT/database session
4. Protected routes check authentication middleware
5. Role-based access control (RBAC) enforced

### Activity Booking Flow
1. User browses activities → API fetches from PostgreSQL
2. User selects activity → Real-time availability check
3. User proceeds to checkout → Stripe/MBWay payment intent
4. Payment successful → Booking created in database
5. Email notification sent → User receives confirmation

### Provider Management Flow
1. Provider authenticates with provider role
2. CRUD operations on activities → Row-level security enforced
3. Real-time booking management → WebSocket updates
4. Analytics dashboard → Aggregated data queries

## Technology Stack Justification

### Frontend: Next.js 15 + React 19
- **SSR/SSG**: Excellent SEO and performance for public pages
- **App Router**: Modern routing with layouts and nested components
- **Image Optimization**: Built-in optimization for activity images
- **TypeScript**: Type safety throughout the application
- **Tailwind CSS**: Utility-first CSS for rapid development

### Backend: Next.js API Routes
- **Serverless Functions**: Scalable, cost-effective for variable traffic
- **Middleware**: Authentication and request processing
- **Built-in Optimizations**: Automatic code splitting and caching
- **TypeScript**: Shared types between frontend and backend

### Database: PostgreSQL + Prisma
- **ACID Compliance**: Critical for financial transactions
- **Relational Model**: Perfect for our complex data relationships
- **Prisma ORM**: Type-safe database access with migrations
- **Row-Level Security**: Provider data isolation

### Authentication: NextAuth.js
- **OAuth Integration**: Google, Facebook, Apple sign-in
- **Session Management**: JWT or database sessions
- **Role-Based Access**: Parent, Provider, Admin roles
- **Security**: Built-in CSRF protection and secure defaults

### Payments: Stripe + MBWay
- **International**: Stripe for global card payments
- **Local**: MBWay for Portuguese market
- **PCI Compliance**: Stripe handles sensitive card data
- **Webhooks**: Reliable payment event handling

### Observability: Winston + Sentry
- **Structured Logging**: JSON logs for easy parsing
- **Error Tracking**: Real-time error monitoring
- **Performance Monitoring**: Application performance insights
- **Alerting**: Critical issue notifications

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Production                                     │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Vercel    │  │   Railway   │  │   Stripe    │  │   Sentry    │        │
│  │  (Frontend  │  │ (PostgreSQL │  │ (Payments)  │  │ (Monitoring)│        │
│  │   + API)    │  │  Database)  │  │             │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Resend    │  │   Vercel    │  │   GitHub    │  │   Doppler   │        │
│  │  (Email     │  │   (CDN/     │  │  (CI/CD)    │  │  (Secrets   │        │
│  │   Service)  │  │   Edge)     │  │             │  │  Management)│        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Security Considerations

1. **Authentication**: JWT tokens with refresh rotation
2. **Authorization**: Role-based access control (RBAC)
3. **Data Protection**: GDPR compliance with data retention policies
4. **Payment Security**: PCI DSS compliance via Stripe
5. **Input Validation**: Zod schema validation on all inputs
6. **SQL Injection**: Prisma ORM prevents SQL injection
7. **XSS Protection**: Next.js built-in XSS protection
8. **CSRF Protection**: NextAuth.js CSRF tokens
9. **Rate Limiting**: API rate limiting to prevent abuse
10. **Audit Logging**: All critical actions logged

## Scalability Considerations

1. **Database**: PostgreSQL read replicas for heavy read workloads
2. **Caching**: Redis for session storage and caching
3. **CDN**: Vercel Edge Network for global content delivery
4. **API**: Serverless functions auto-scale with demand
5. **File Storage**: S3-compatible storage for images
6. **Search**: Elasticsearch for advanced activity search
7. **Background Jobs**: Queue system for email notifications
8. **Monitoring**: Comprehensive observability stack