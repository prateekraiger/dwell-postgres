# Dwell - Room Booking Platform

A modern room booking platform with a separate Express backend and Next.js frontend.

## Features

- User authentication with JWT
- Role-based access control (Guest, Owner, Admin)
- Room listings with search and filters
- Booking management
- Owner dashboard for managing rooms and bookings
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Express.js with TypeScript (MVC architecture)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **UI Components**: Radix UI, shadcn/ui

## Project Structure

```
dwell/
├── backend/              # Express.js API server
│   ├── src/
│   │   ├── config/      # Configuration
│   │   ├── controllers/ # Business logic
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth, validation, errors
│   │   ├── utils/       # Helper functions
│   │   └── server.ts    # Entry point
│   ├── prisma/          # Database schema
│   └── package.json
├── app/                  # Next.js frontend
├── components/           # React components
└── lib/                  # Frontend utilities
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm/pnpm/yarn

### Backend Setup

1. Navigate to backend directory

```bash
cd backend
npm install
```

2. Set up environment variables

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dwell"
JWT_SECRET="your-secret-key-here"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

Generate JWT secret:

```bash
openssl rand -base64 32
```

3. Set up the database

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Start backend server

```bash
npm run dev
```

Backend runs on [http://localhost:5000](http://localhost:5000)

### Frontend Setup

1. Navigate to root directory

```bash
cd ..
npm install
```

2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

3. Start frontend

```bash
npm run dev
```

Frontend runs on [http://localhost:3000](http://localhost:3000)

📖 **See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for detailed backend documentation**

## Database Schema

The application uses the following main models:

- **User**: User accounts with roles (GUEST, OWNER, ADMIN, PENDING)
- **Room**: Room listings with details, photos, and pricing
- **Booking**: Booking records with check-in/out dates and status
- **Payment**: Payment records linked to bookings

## API Endpoints

All API endpoints are served from the Express backend at `http://localhost:5000/api`

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users

- `PATCH /api/users/role` - Update user role (protected)
- `PATCH /api/users/profile` - Update profile (protected)

### Rooms

- `GET /api/rooms` - Get all rooms (public)
- `GET /api/rooms/:id` - Get room details (public)
- `GET /api/rooms/my/rooms` - Get owner's rooms (owner only)
- `POST /api/rooms` - Create room (owner only)
- `PATCH /api/rooms/:id` - Update room (owner only)
- `DELETE /api/rooms/:id` - Delete room (owner only)

### Bookings

- `GET /api/bookings/my-bookings` - Get user's bookings (protected)
- `GET /api/bookings/owner-bookings` - Get owner's bookings (owner only)
- `GET /api/bookings/:id` - Get booking details (protected)
- `GET /api/bookings/room/:roomId/availability` - Check availability (protected)
- `POST /api/bookings` - Create booking (protected)
- `PATCH /api/bookings/:id` - Update booking (protected)
- `DELETE /api/bookings/:id` - Cancel booking (protected)

Protected routes require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

## Detailed Project Structure

### Backend (`/backend`)

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # Prisma client
│   │   └── env.ts           # Environment config
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── room.controller.ts
│   │   └── booking.controller.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── room.routes.ts
│   │   ├── booking.routes.ts
│   │   └── index.ts
│   ├── middleware/
│   │   ├── auth.ts          # JWT authentication
│   │   ├── errorHandler.ts
│   │   └── validator.ts
│   ├── utils/
│   │   ├── errors.ts        # Custom error classes
│   │   └── jwt.ts           # JWT utilities
│   └── server.ts            # Express app
├── prisma/
│   └── schema.prisma        # Database schema
└── package.json
```

### Frontend (`/`)

```
├── app/
│   ├── auth/             # Auth pages (signin, signup)
│   ├── dashboard/        # Owner dashboard
│   ├── rooms/            # Room listings and details
│   └── my-bookings/      # User bookings
├── components/
│   ├── auth/             # Auth-related components
│   ├── common/           # Shared components (Navbar, Footer)
│   ├── providers/        # Context providers
│   └── ui/               # UI components (shadcn/ui)
├── lib/
│   └── api.ts            # API client (to be created)
└── types/                # TypeScript type definitions
```

## Development Workflow

1. **Start Backend**: `cd backend && npm run dev` (Port 5000)
2. **Start Frontend**: `npm run dev` (Port 3000)
3. **View Database**: `cd backend && npm run prisma:studio`

## Deployment

### Backend Deployment (Railway, Render, Heroku, etc.)

1. Set environment variables on your hosting platform
2. Build: `npm run build`
3. Start: `npm start`

### Frontend Deployment (Vercel, Netlify, etc.)

1. Set `NEXT_PUBLIC_API_URL` to your backend URL
2. Deploy as usual

### Database Setup

1. Create PostgreSQL database on your hosting provider
2. Update `DATABASE_URL` environment variable
3. Run migrations: `npm run prisma:migrate`

## Next Steps

- [ ] Update frontend components to use backend API
- [ ] Replace NextAuth with JWT token management
- [ ] Implement token storage (localStorage/cookies)
- [ ] Update all API calls in components
- [ ] Test authentication flow
- [ ] Test all CRUD operations

## License

MIT
