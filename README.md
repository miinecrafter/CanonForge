# CanonForge

A platform where writers create intellectual universes and readers contribute stories that become part of the official canon.

## Project Structure

```
canonforge/
├── packages/
│   ├── backend/          # Node.js + Express + Prisma backend
│   └── frontend/         # React + Vite frontend
└── README.md
```

## Features (MVP)

- **User Authentication**: JWT-based auth with refresh tokens
- **Project Management**: Writers can create and manage story universes
- **Story Submissions**: Readers can submit stories with rich text editor (TipTap)
- **Review Workflow**: Writers review, approve, or request changes
- **Canon System**: Approved stories become part of the official canon
- **Role-Based Access**: Different permissions for Readers, Writers, and Admins

## Tech Stack

### Backend
- Node.js 20 LTS
- Express.js
- TypeScript
- Prisma ORM
- MySQL
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- TipTap (Rich Text Editor)
- Axios

## Getting Started

### Prerequisites

- Node.js 20+ LTS
- MySQL 8+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd packages/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
DATABASE_URL="mysql://user:password@localhost:3306/canonforge"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
PORT=3001
```

5. Create the database:
```bash
mysql -u root -p
CREATE DATABASE canonforge;
exit
```

6. Run Prisma migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```

7. Start the development server:
```bash
npm run dev
```

Backend will be running on http://localhost:3001

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd packages/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

Frontend will be running on http://localhost:5173

## Usage

### First Time Setup

1. Open http://localhost:5173 in your browser
2. Register a new account (choose "Create my own universe" for Writer role)
3. Log in with your credentials
4. Create your first project
5. Start accepting submissions!

### User Roles

- **READER**: Can browse projects, submit stories, track submission status
- **WRITER**: Can create projects, review submissions, approve stories to canon
- **MODERATOR**: Can moderate content across the platform
- **ADMIN**: Full access to all features

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Projects
- `POST /api/projects` - Create project (Writer only)
- `GET /api/projects` - List all projects
- `GET /api/projects/:slug` - Get project details
- `PATCH /api/projects/:id` - Update project
- `POST /api/projects/:id/owners` - Add collaborator

### Submissions
- `POST /api/projects/:projectId/submissions` - Create submission
- `GET /api/projects/:projectId/submissions` - List submissions
- `GET /api/submissions/:id` - Get submission
- `PATCH /api/submissions/:id` - Update submission
- `POST /api/submissions/:id/submit` - Submit for review

### Reviews & Canon
- `POST /api/submissions/:id/reviews` - Create review
- `POST /api/submissions/:id/canonize` - Add to canon

## Database Schema

Key models:
- **User**: User accounts with roles
- **Project**: Story universes created by writers
- **ProjectOwners**: Many-to-many relationship for project collaborators
- **Submission**: Stories submitted by readers
- **Review**: Feedback and decisions from writers
- **CanonEntry**: Approved submissions that are part of canon
- **Attachment**: File attachments for submissions

## Development

### Running Tests
```bash
# Backend
cd packages/backend
npm test

# Frontend
cd packages/frontend
npm test
```

### Building for Production
```bash
# Backend
cd packages/backend
npm run build
npm start

# Frontend
cd packages/frontend
npm run build
npm run preview
```

### Database Management

```bash
# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

## Roadmap

### Phase 1 (MVP) ✅
- User authentication
- Project creation
- Submission workflow
- Review system
- Canon management

### Phase 2 (Coming Soon)
- Email notifications
- In-app notifications
- Submission versioning
- Advanced search
- User analytics

### Phase 3 (Future)
- Collaborative writing
- Media attachments (images)
- OAuth integration
- Monetization features
- Recommendation engine

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.
