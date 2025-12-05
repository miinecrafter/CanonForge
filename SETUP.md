# CanonForge Setup Guide

This guide will help you get CanonForge running locally in under 10 minutes.

## Quick Start

### 1. Install Prerequisites

Make sure you have:
- **Node.js 20+** (check with `node -v`)
- **MySQL 8+** (check with `mysql --version`)
- **npm** (comes with Node.js)

### 2. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/miinecrafter/CanonForge.git
cd CanonForge
```

### 3. Database Setup

```bash
# Create the database
mysql -u root -p
```

In the MySQL prompt:
```sql
CREATE DATABASE canonforge;
CREATE USER 'canonforge'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON canonforge.* TO 'canonforge'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 4. Backend Setup

```bash
cd packages/backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
DATABASE_URL="mysql://canonforge:your_secure_password@localhost:3306/canonforge"
JWT_SECRET="change-this-to-a-random-string-min-32-chars"
JWT_REFRESH_SECRET="change-this-to-another-random-string-min-32-chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"
```

**Generate secure secrets:**
```bash
# In Node.js (run: node)
require('crypto').randomBytes(32).toString('hex')
```

Run migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

Start backend:
```bash
npm run dev
```

You should see: "🚀 Server running on http://localhost:3001"

### 5. Frontend Setup (New Terminal)

```bash
cd packages/frontend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

The default should work:
```env
VITE_API_URL=http://localhost:3001/api
```

Start frontend:
```bash
npm run dev
```

You should see: "Local: http://localhost:5173"

### 6. Test It Out!

Open http://localhost:5173 in your browser.

1. **Register a new account**
   - Click "Register"
   - Choose "Create my own universe" for Writer role
   - Fill in the form

2. **Create your first project**
   - Click "Create Project"
   - Give it a name and description
   - Submit

3. **Test the submission flow**
   - Go to "Projects" → Select your project
   - Click "Submit Story"
   - Write a story using the rich text editor
   - Submit for review

4. **Review as a writer**
   - Click "Review Submissions"
   - Select a submission
   - Provide feedback and approve/decline
   - Approved stories can be added to canon

## Common Issues

### "Port 3001 already in use"
```bash
# Find and kill the process
lsof -ti:3001 | xargs kill -9
```

### "Cannot connect to MySQL"
- Make sure MySQL is running: `sudo systemctl start mysql` (Linux) or use MySQL Workbench (macOS/Windows)
- Check your credentials in `.env`
- Verify the database exists: `SHOW DATABASES;`

### "Prisma Client not generated"
```bash
cd packages/backend
npx prisma generate
```

### "Module not found" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS errors in browser
- Make sure backend is running
- Check `CORS_ORIGIN` in backend `.env` matches frontend URL
- Clear browser cache

## Verification Checklist

- [ ] MySQL database created
- [ ] Backend `.env` file configured
- [ ] Prisma migrations run successfully
- [ ] Backend running on http://localhost:3001
- [ ] Frontend `.env` file configured
- [ ] Frontend running on http://localhost:5173
- [ ] Can register a new user
- [ ] Can log in
- [ ] Can create a project (as Writer)
- [ ] Can submit a story
- [ ] Can review and approve submissions

## Next Steps

- Read the [API Documentation](README.md#api-endpoints)
- Explore the codebase
- Check out the [Roadmap](README.md#roadmap)
- Try different user roles

## Development Tips

### View Database
```bash
cd packages/backend
npx prisma studio
```
Opens a GUI at http://localhost:5555

### Check Logs
```bash
# Backend logs show in the terminal where you ran npm run dev
# Look for errors in red

# Frontend errors appear in browser console (F12)
```

### Reset Database
```bash
cd packages/backend
npx prisma migrate reset
```

### Hot Reload
Both frontend and backend support hot reload - just save files and see changes!

## Need Help?

Open an issue on GitHub with:
- What you were trying to do
- What error you got
- Your Node.js and MySQL versions
- Relevant logs

Happy building! 🚀
