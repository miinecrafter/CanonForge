# ⚡ CanonForge Quick Start

Get CanonForge running in 5 minutes!

## Prerequisites
- Node.js 20+
- MySQL 8+

## Setup

### 1. Database
```bash
mysql -u root -p
CREATE DATABASE canonforge;
EXIT;
```

### 2. Install Dependencies
```bash
# Backend
cd packages/backend
npm install
cp .env.example .env
# Edit .env with your database credentials

# Frontend
cd ../frontend
npm install
```

### 3. Run Migrations
```bash
cd packages/backend
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Start Servers
```bash
# Terminal 1 - Backend
cd packages/backend
npm run dev

# Terminal 2 - Frontend
cd packages/frontend
npm run dev
```

### 5. Open App
Visit http://localhost:5173

## First Use

1. **Register** - Choose "Create my own universe" for Writer role
2. **Create Project** - Click "Create Project" button
3. **Submit Story** - Go to your project, click "Submit Story"
4. **Review** - Click "Review Submissions" to approve stories
5. **Canon** - Approved stories become part of the canon

## Troubleshooting

**Port in use?**
```bash
lsof -ti:3001 | xargs kill -9  # Kill backend
lsof -ti:5173 | xargs kill -9  # Kill frontend
```

**Database connection failed?**
- Check MySQL is running
- Verify credentials in `packages/backend/.env`

**Prisma errors?**
```bash
cd packages/backend
npx prisma generate
```

## File Locations

- **Backend .env**: `packages/backend/.env`
- **Frontend .env**: `packages/frontend/.env`
- **Database schema**: `packages/backend/prisma/schema.prisma`

## Default Ports

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Prisma Studio: http://localhost:5555 (run `npx prisma studio`)

## Need Help?

See [SETUP.md](SETUP.md) for detailed instructions or [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for what's been built.
