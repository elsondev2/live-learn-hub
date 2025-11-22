@echo off
echo ========================================
echo Fixing Local Development Environment
echo ========================================
echo.

echo Step 1: Clearing dist folder...
if exist dist rmdir /s /q dist
echo Done!
echo.

echo Step 2: Clearing Vite cache...
if exist node_modules\.vite rmdir /s /q node_modules\.vite
echo Done!
echo.

echo ========================================
echo Environment Fixed!
echo ========================================
echo.
echo Now run these commands in separate terminals:
echo.
echo Terminal 1: npm run server
echo Terminal 2: npm run dev
echo.
echo Then open: http://localhost:5173
echo ========================================
pause
