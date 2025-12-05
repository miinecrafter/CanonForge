#!/bin/bash

# CanonForge Setup Script
echo "🚀 Setting up CanonForge..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check MySQL
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL not found in PATH. Make sure MySQL is installed and running."
else
    echo "✅ MySQL detected"
fi

echo ""
echo "📦 Installing dependencies..."
echo ""

# Install root dependencies
npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd packages/backend
npm install

# Setup backend .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating backend .env file..."
    cp .env.example .env
    echo "⚠️  Please edit packages/backend/.env with your database credentials"
fi

cd ../..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd packages/frontend
npm install

# Setup frontend .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating frontend .env file..."
    cp .env.example .env
fi

cd ../..

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Create MySQL database: CREATE DATABASE canonforge;"
echo "2. Edit packages/backend/.env with your database credentials"
echo "3. Run migrations: cd packages/backend && npx prisma migrate dev"
echo "4. Start development: npm run dev"
echo ""
echo "Or follow the detailed guide in SETUP.md"
