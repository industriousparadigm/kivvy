# API Documentation

KidsHiz provides a comprehensive REST API for managing activities, bookings, payments, and user accounts.

## 🔐 Authentication

### Authentication Methods

1. **Session-based** (Web App)
   - NextAuth.js sessions with cookies
   - CSRF protection enabled

2. **API Token** (Future)
   - Bearer token authentication
   - Rate limiting per token

### Authorization Levels

- **Public**: No authentication required
- **User**: Authenticated user (Parent/Provider/Admin)
- **Provider**: Provider role required
- **Admin**: Admin role required

## 📚 API Endpoints

### Activities

#### Get Activities
```http
GET /api/activities
```

**Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 50)
- `search` (string): Search term
- `category` (string): Activity category
- `ageMin` (number): Minimum age
- `ageMax` (number): Maximum age
- `city` (string): City filter
- `difficulty` (string): Difficulty level

**Response:**
```json
{
  "activities": [
    {
      "id": "cm123...",
      "title": "Swimming Lessons",
      "description": "Learn to swim in a safe environment",
      "category": "SPORTS",
      "ageMin": 4,
      "ageMax": 12,
      "price": 25.00,
      "duration": 60,
      "location": "Porto",
      "imageUrl": "https://...",
      "provider": {
        "id": "cm456...",
        "businessName": "Swim Academy",
        "isVerified": true
      },
      "nextSessions": [
        {
          "id": "cm789...",
          "startTime": "2024-01-15T10:00:00Z",
          "availableSpots": 5
        }
      ],
      "averageRating": 4.5,
      "reviewCount": 12
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Get Activity Details
```http
GET /api/activities/{id}
```

**Response:**
```json
{
  "id": "cm123...",
  "title": "Swimming Lessons",
  "description": "Comprehensive swimming program...",
  "category": "SPORTS",
  "ageMin": 4,
  "ageMax": 12,
  "price": 25.00,
  "duration": 60,
  "capacity": 8,
  "location": "Piscina Municipal do Porto",
  "address": "Rua da Piscina, 123",
  "city": "Porto",
  "requirements": "Swimsuit and towel required",
  "included": "Equipment provided",
  "imageUrls": ["https://..."],
  "provider": {
    "id": "cm456...",
    "businessName": "Swim Academy",
    "description": "Professional swim instruction",
    "isVerified": true,
    "rating": 4.7,
    "totalActivities": 3
  },
  "sessions": [
    {
      "id": "cm789...",
      "startTime": "2024-01-15T10:00:00Z",
      "endTime": "2024-01-15T11:00:00Z",
      "availableSpots": 5,
      "maxParticipants": 8,
      "status": "SCHEDULED"
    }
  ],
  "reviews": [
    {
      "id": "cm101...",
      "rating": 5,
      "comment": "Excellent instructor!",
      "author": {
        "name": "Ana S."
      },
      "createdAt": "2024-01-10T14:30:00Z"
    }
  ]
}
```

### Sessions

#### Get Sessions
```http
GET /api/sessions
```

**Parameters:**
- `activityId` (string): Filter by activity
- `startDate` (string): Start date (YYYY-MM-DD)
- `endDate` (string): End date (YYYY-MM-DD)
- `available` (boolean): Only available sessions

### Bookings

#### Create Booking
```http
POST /api/bookings
Authorization: Required (User)
```

**Request Body:**
```json
{
  "sessionId": "cm789...",
  "childId": "cm321...",
  "quantity": 1,
  "notes": "First time swimming"
}
```

**Response:**
```json
{
  "id": "cm999...",
  "sessionId": "cm789...",
  "childId": "cm321...",
  "quantity": 1,
  "totalAmount": 25.00,
  "currency": "EUR",
  "status": "PENDING",
  "paymentStatus": "PENDING",
  "createdAt": "2024-01-14T09:00:00Z",
  "session": {
    "id": "cm789...",
    "startTime": "2024-01-15T10:00:00Z",
    "activity": {
      "title": "Swimming Lessons",
      "location": "Porto"
    }
  }
}
```

#### Get User Bookings
```http
GET /api/bookings
Authorization: Required (User)
```

**Parameters:**
- `status` (string): Filter by status
- `page` (number): Page number
- `limit` (number): Items per page

### Payments

#### Create Payment Intent
```http
POST /api/payments/create-intent
Authorization: Required (User)
```

**Request Body:**
```json
{
  "bookingId": "cm999...",
  "paymentMethod": "stripe"
}
```

**Response:**
```json
{
  "clientSecret": "pi_..._secret_...",
  "paymentIntentId": "pi_...",
  "amount": 2500,
  "currency": "eur"
}
```

#### Process MBWay Payment
```http
POST /api/payments/mbway
Authorization: Required (User)
```

**Request Body:**
```json
{
  "bookingId": "cm999...",
  "phoneNumber": "+351912345678"
}
```

#### Refund Payment
```http
POST /api/payments/refund
Authorization: Required (User/Admin)
```

**Request Body:**
```json
{
  "bookingId": "cm999...",
  "amount": 25.00,
  "reason": "Customer cancellation"
}
```

### User Management

#### Get User Profile
```http
GET /api/users/profile
Authorization: Required (User)
```

**Response:**
```json
{
  "id": "cm111...",
  "name": "Ana Santos",
  "email": "ana@example.com",
  "role": "PARENT",
  "profile": {
    "phone": "+351912345678",
    "address": "Rua das Flores, 123",
    "city": "Porto",
    "preferences": {
      "language": "pt",
      "notifications": true
    }
  },
  "children": [
    {
      "id": "cm321...",
      "name": "João",
      "birthDate": "2018-05-15",
      "specialNeeds": null
    }
  ]
}
```

#### Update User Profile
```http
PATCH /api/users/profile
Authorization: Required (User)
```

#### Get Children
```http
GET /api/users/children
Authorization: Required (User)
```

#### Add Child
```http
POST /api/users/children
Authorization: Required (User)
```

**Request Body:**
```json
{
  "name": "Maria",
  "birthDate": "2019-03-10",
  "specialNeeds": "Requires allergy medication"
}
```

### Provider APIs

#### Get Provider Activities
```http
GET /api/provider/activities
Authorization: Required (Provider)
```

#### Create Activity
```http
POST /api/provider/activities
Authorization: Required (Provider)
```

**Request Body:**
```json
{
  "title": "Art Workshop",
  "description": "Creative art session for kids",
  "category": "ARTS_CRAFTS",
  "ageMin": 6,
  "ageMax": 10,
  "price": 15.00,
  "duration": 90,
  "capacity": 12,
  "location": "Art Studio Porto",
  "address": "Rua dos Artistas, 45",
  "requirements": "Comfortable clothes",
  "imageUrls": ["https://..."]
}
```

#### Update Activity
```http
PATCH /api/provider/activities/{id}
Authorization: Required (Provider)
```

#### Create Activity Session
```http
POST /api/provider/activities/{id}/sessions
Authorization: Required (Provider)
```

**Request Body:**
```json
{
  "startTime": "2024-01-20T14:00:00Z",
  "endTime": "2024-01-20T15:30:00Z",
  "capacity": 12,
  "price": 15.00
}
```

### Admin APIs

#### Get Admin Statistics
```http
GET /api/admin/stats
Authorization: Required (Admin)
```

#### Get All Users
```http
GET /api/admin/users
Authorization: Required (Admin)
```

#### Get Queue Status
```http
GET /api/admin/queues
Authorization: Required (Admin)
```

#### Manage Queue
```http
POST /api/admin/queues
Authorization: Required (Admin)
```

**Request Body:**
```json
{
  "action": "pause|resume|clean",
  "queueName": "email"
}
```

### Health & Monitoring

#### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-14T10:00:00Z",
  "version": "1.0.0",
  "uptime": 3600,
  "checks": {
    "database": {
      "status": "healthy",
      "responseTime": 5
    },
    "redis": {
      "status": "healthy",
      "responseTime": 2
    }
  }
}
```

#### Metrics
```http
GET /api/metrics
Authorization: Required (Admin)
```

**Parameters:**
- `period` (string): Time period (1h, 24h, 7d, 30d)
- `format` (string): Response format (json, prometheus)

#### Performance Report
```http
GET /api/performance
Authorization: Required (Admin)
```

### File Upload

#### Upload Image
```http
POST /api/upload
Authorization: Required (User)
Content-Type: multipart/form-data
```

**Request:**
```
FormData:
- file: [Image file]
```

**Response:**
```json
{
  "url": "/uploads/image.jpg",
  "filename": "uuid.jpg",
  "size": 1024000,
  "type": "image/jpeg"
}
```

## 🔒 Security

### Rate Limiting

- **General API**: 100 requests/minute per IP
- **Authentication**: 5 requests/minute per IP
- **Payment**: 10 requests/minute per user

### Input Validation

All inputs are validated using Zod schemas:
- Required fields validation
- Type checking
- Format validation (email, phone, etc.)
- Length limits
- SQL injection prevention

### Error Handling

**Standard Error Response:**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "timestamp": "2024-01-14T10:00:00Z"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## 📊 Performance

### Response Times
- **GET requests**: < 100ms
- **POST requests**: < 200ms
- **File uploads**: < 2s
- **Payment processing**: < 5s

### Caching
- **Static content**: CDN cached
- **API responses**: Redis cached (5-60 minutes)
- **Database queries**: Connection pooling

### Pagination
- Default limit: 10 items
- Maximum limit: 50 items
- Total count included in response

---

For integration examples and SDKs, see the [Integration Guide](INTEGRATION.md).