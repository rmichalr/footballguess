# Football Guess

A football prediction game backend API built with NestJS where users can predict match scores and compete for points.

## Description

The application provides a REST API for managing users, matches, predictions, and results with a scoring system.

## Features

- **User Management**: Secure registration and authentication with JWT
- **Match Management**: Create and manage football matches with teams and dates
- **Prediction System**: Users can submit score predictions for upcoming matches
- **Scoring Algorithm**: Automated point calculation based on prediction accuracy
- **Results Tracking**: Store and manage actual match results
- **Admin Panel**: Administrative features for managing matches and users
- **Database Integration**: Robust data persistence with PostgreSQL and Prisma

## Tech Stack

### Backend
- **Framework**: Nest.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma

### Authentication & Security
- **JWT**
- **Passport**
- **bcrypt**

### Development Tools
- **ESLint**
- **Prettier**

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)

## Installation & Setup

**Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration (see Environment Variables section)

**Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   ```

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/footballguess"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key"

# Application
PORT=3000
NODE_ENV=development
```

## Database Setup

The application uses Prisma as the ORM. The database schema includes:

- **Users**: User accounts with authentication
- **Matches**: Football matches with teams and dates
- **Predictions**: User score predictions for matches
- **MatchResults**: Actual match results for scoring

### Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init

# Reset database (development only)
npx prisma migrate reset
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

The API will be available at `http://localhost:3000` (or your configured PORT).

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/leaderboard` - Get user leaderboard

### Matches
- `GET /matches` - Get all matches
- `GET /matches/:id` - Get specific match
- `POST /matches` - Create new match (admin only)
- `PUT /matches/:id` - Update match (admin only)

### Predictions
- `GET /predictions` - Get user's predictions
- `POST /predictions` - Submit a prediction
- `PUT /predictions/:id` - Update a prediction
- `GET /predictions/match/:matchId` - Get predictions for a match

### Results
- `POST /results` - Submit match result (admin only)
- `GET /results/:matchId` - Get match result

## Project Structure

```
src/
├── auth/           # Authentication module
├── users/          # User management module
├── matches/        # Match management module
├── predictions/    # Prediction module
├── results/        # Results module
├── prisma/         # Prisma service
└── common/         # Shared utilities and guards

prisma/
├── schema.prisma   # Database schema
└── migrations/     # Database migrations

test/
├── unit/           # Unit tests
└── e2e/           # End-to-end tests
```