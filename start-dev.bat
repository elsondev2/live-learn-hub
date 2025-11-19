@echo off
echo Starting Live Learn Hub Development Servers...
echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "npm run server"
timeout /t 3 /nobreak > nul
echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "npm run dev"
echo.
echo Both servers are starting in separate windows!
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
pause
