# Dwell Backend API

A RESTful API for the Dwell room booking platform built with Express, Prisma, and PostgreSQL.

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # Prisma client
│   │   └── env.ts       # Environment variables
│   ├── controllers/     # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── room.controller.ts
│   │   └── booking.controller.ts
│   ├── middleware/      # Express middleware
│   │   ├── auth.ts      # Authentication & authorization
│   │   ├── errorHandler.ts
│   │   └── validator.ts
│   ├── routes/          # API routes
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── room.routes.ts
│   │   ├── booking.routes.ts
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   ├── errors.ts    # Custom error classes
│   │   └── jwt.ts       # JWT utilities
│   └── server.ts        # Express app entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── package.json
├── tsconfig.json
└── .env.example
```

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dwell"
JWT_SECRET="your-secret-key"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

### 4. Start Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users

- `PATCH /api/users/role` - Update user role (protected)
- `PATCH /api/users/profile` - Update user profile (protected)

### Rooms

- `GET /api/rooms` - Get all rooms (public)
- `GET /api/rooms/:id` - Get room by ID (public)
- `GET /api/rooms/my/rooms` - Get owner's rooms (owner only)
- `POST /api/rooms` - Create room (owner only)
- `PATCH /api/rooms/:id` - Update room (owner only)
- `DELETE /api/rooms/:id` - Delete room (owner only)

### Bookings

- `GET /api/bookings/my-bookings` - Get user's bookings (protected)
- `GET /api/bookings/owner-bookings` - Get owner's bookings (owner only)
- `GET /api/bookings/:id` - Get booking by ID (protected)
- `GET /api/bookings/room/:roomId/availability` - Get room availability (protected)
- `POST /api/bookings` - Create booking (protected)
- `PATCH /api/bookings/:id` - Update booking status (protected)
- `DELETE /api/bookings/:id` - Cancel booking (protected)

### Health Check

- `GET /api/health` - Server health check

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message"
}
```

## Error Codes

- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Run in Watch Mode

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Database Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

## Technologies

- **Express** - Web framework
- **Prisma** - ORM
- **PostgreSQL** - Database
- **TypeScript** - Type safety
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Request validation
