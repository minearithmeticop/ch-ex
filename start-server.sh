#!/bin/bash

echo "========================================"
echo "YouTube Downloader - Local Server"
echo "========================================"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm not found!"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python not found!"
    echo "Please install Python from https://python.org"
    exit 1
fi

echo "[1/4] Checking yt-dlp..."
if ! python3 -c "import yt_dlp" 2>/dev/null; then
    echo "Installing yt-dlp..."
    pip3 install yt-dlp
else
    echo "yt-dlp already installed"
fi

echo ""
echo "[2/4] Installing Node packages..."
cd server-for-youtube-downloader
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "Node modules already installed"
fi

echo ""
echo "[3/4] Starting server..."
echo ""
echo "========================================"
echo "Server will start at http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo "========================================"
echo ""

npm start
