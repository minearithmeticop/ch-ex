@echo off
echo ========================================
echo YouTube Downloader - Local Server
echo ========================================
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm not found!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python not found!
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

echo [1/4] Checking yt-dlp...
python -c "import yt_dlp" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing yt-dlp...
    pip install yt-dlp
) else (
    echo yt-dlp already installed
)

echo.
echo [2/4] Installing Node packages...
cd server-for-youtube-downloader
if not exist node_modules (
    npm install
) else (
    echo Node modules already installed
)

echo.
echo [3/4] Starting server...
echo.
echo ========================================
echo Server will start at http://localhost:3000
echo Press Ctrl+C to stop the server
echo ========================================
echo.

npm start
