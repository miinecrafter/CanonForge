@echo off
echo Setting up CanonForge...
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js 20+ first.
    exit /b 1
)

echo Node.js detected

REM Check MySQL
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo MySQL not found in PATH. Make sure MySQL is installed and running.
) else (
    echo MySQL detected
)

echo.
echo Installing dependencies...
echo.

REM Install root dependencies
call npm install

REM Install backend dependencies
echo Installing backend dependencies...
cd packages\backend
call npm install

REM Setup backend .env if it doesn't exist
if not exist .env (
    echo Creating backend .env file...
    copy .env.example .env
    echo Please edit packages\backend\.env with your database credentials
)

cd ..\..

REM Install frontend dependencies
echo Installing frontend dependencies...
cd packages\frontend
call npm install

REM Setup frontend .env if it doesn't exist
if not exist .env (
    echo Creating frontend .env file...
    copy .env.example .env
)

cd ..\..

echo.
echo Installation complete!
echo.
echo Next steps:
echo 1. Create MySQL database: CREATE DATABASE canonforge;
echo 2. Edit packages\backend\.env with your database credentials
echo 3. Run migrations: cd packages\backend ^&^& npx prisma migrate dev
echo 4. Start development: npm run dev
echo.
echo Or follow the detailed guide in SETUP.md
