# 🚀 Quick Reference - Developer Cheat Sheet

## คำสั่งที่ใช้บ่อย

### Server Commands

```bash
# เริ่ม server
cd server-for-youtube-downloader
npm start

# Development mode (auto-reload)
npm run dev

# ติดตั้ง dependencies
npm install

# ติดตั้ง yt-dlp
pip install yt-dlp

# อัปเดต yt-dlp
pip install -U yt-dlp

# เช็ค yt-dlp version
yt-dlp --version
```

---

## API Endpoints

### Base URL
```
http://localhost:3000
```

### 1. Health Check
```bash
curl http://localhost:3000/api/health
```

### 2. Get Video Info
```bash
curl -X POST http://localhost:3000/api/video-info \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=VIDEO_ID"}'
```

### 3. Download Video
```bash
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=VIDEO_ID","quality":"720"}' \
  --output video.mp4
```

### 4. Download Audio
```bash
curl -X POST http://localhost:3000/api/download-audio \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=VIDEO_ID"}' \
  --output audio.mp3
```

---

## File Locations

```
server-for-youtube-downloader/
├── server.js               # Main server code
├── package.json            # Dependencies
└── temp/                   # Temporary downloads (auto-clean)

youtube-download-extension/
├── manifest.json           # Extension config
├── popup.html              # UI
├── popup.js                # Logic (เชื่อมต่อ server ที่นี่)
├── content.js              # YouTube integration
└── background.js           # Service worker
```

---

## Configuration

### เปลี่ยน Port

**File**: `server-for-youtube-downloader/server.js`
```javascript
const PORT = 3000; // เปลี่ยนตรงนี้
```

**File**: `youtube-download-extension/popup.js`
```javascript
const SERVER_URL = 'http://localhost:3000'; // เปลี่ยนตรงนี้
```

---

## Debugging

### Server Logs
```bash
# Server จะแสดง logs อัตโนมัติ:
📥 Getting video info: https://...
✅ Video info retrieved
📥 Downloading: https://... (720p)
✅ Download complete
🗑️  Temp file deleted
```

### Extension Console
```
1. คลิกขวาที่ Extension popup
2. เลือก "Inspect"
3. ดู Console tab
```

### Check Server Running
```bash
# Windows
netstat -ano | findstr :3000

# macOS/Linux
lsof -i:3000
```

---

## Troubleshooting

### Server ไม่เปิด
```bash
# เช็คว่า yt-dlp ติดตั้งแล้ว
yt-dlp --version

# ติดตั้งถ้ายังไม่มี
pip install yt-dlp
```

### Port ถูกใช้แล้ว
```bash
# Windows - หา process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### yt-dlp Error
```bash
# อัปเดต yt-dlp
pip install -U yt-dlp

# ลองดาวน์โหลดตรง
yt-dlp "https://www.youtube.com/watch?v=VIDEO_ID"
```

---

## yt-dlp Commands

### ดู video info
```bash
yt-dlp --dump-json "URL"
```

### ดาวน์โหลด 720p
```bash
yt-dlp -f "bestvideo[height<=720]+bestaudio" "URL"
```

### ดาวน์โหลด MP3
```bash
yt-dlp -x --audio-format mp3 "URL"
```

### List formats
```bash
yt-dlp -F "URL"
```

---

## Extension Development

### Reload Extension
```
1. ไปที่ chrome://extensions
2. คลิก refresh icon
3. หรือ: Remove → Load unpacked ใหม่
```

### Debug Popup
```javascript
// ใน popup.js
console.log('Debug:', data);
```

### Check Permissions
```json
// ใน manifest.json
"permissions": [
  "activeTab",
  "downloads"
],
"host_permissions": [
  "https://*.youtube.com/*",
  "http://localhost/*"
]
```

---

## Code Snippets

### Server - Add New Endpoint
```javascript
// ใน server.js
app.post('/api/my-endpoint', async (req, res) => {
  try {
    const { param } = req.body;
    // Your logic here
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Extension - Call API
```javascript
// ใน popup.js
async function callAPI() {
  const response = await fetch(`${SERVER_URL}/api/my-endpoint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ param: 'value' })
  });
  const data = await response.json();
  console.log(data);
}
```

---

## Testing

### Test Server
```bash
# Start server
npm start

# In another terminal:
curl http://localhost:3000/api/health
```

### Test Extension
```
1. เปิด YouTube
2. คลิก Extension
3. ดู Console (F12)
4. ทดสอบดาวน์โหลด
```

---

## Production

### Run with PM2
```bash
npm install -g pm2
pm2 start server.js --name youtube-server
pm2 startup
pm2 save
```

### Monitor
```bash
pm2 logs youtube-server
pm2 status
```

### Stop
```bash
pm2 stop youtube-server
pm2 delete youtube-server
```

---

## Dependencies

### Server
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "youtube-dl-exec": "^2.4.17",
  "sanitize-filename": "^1.6.3",
  "axios": "^1.6.0"
}
```

### Extension
```
None (Vanilla JavaScript)
```

---

## Quality Reference

| Quality | Resolution | Size (per 10 min) |
|---------|------------|-------------------|
| 4K      | 3840x2160  | ~500 MB          |
| 2K      | 2560x1440  | ~300 MB          |
| 1080p   | 1920x1080  | ~150 MB          |
| 720p    | 1280x720   | ~70 MB           |
| 480p    | 854x480    | ~40 MB           |
| 360p    | 640x360    | ~25 MB           |

---

## Useful Links

- **yt-dlp**: https://github.com/yt-dlp/yt-dlp
- **Express**: https://expressjs.com
- **Chrome Extensions**: https://developer.chrome.com/docs/extensions
- **Node.js**: https://nodejs.org

---

## Environment Variables (Optional)

```bash
# .env file (create if needed)
PORT=3000
TEMP_DIR=./temp
CLEANUP_INTERVAL=3600000  # 1 hour in ms
```

```javascript
// Load in server.js
require('dotenv').config();
const PORT = process.env.PORT || 3000;
```

---

## Git Commands

```bash
# Initialize
git init
git add .
git commit -m "Initial commit"

# Ignore
echo "node_modules/" >> .gitignore
echo "temp/" >> .gitignore
echo "*.mp4" >> .gitignore
echo "*.mp3" >> .gitignore
```

---

## Performance Tips

1. **อัปเดต yt-dlp บ่อยๆ** (ทุก 1-2 สัปดาห์)
2. **ใช้ SSD** สำหรับ temp directory
3. **ปิด antivirus** scanning สำหรับ temp directory
4. **ใช้ PM2** สำหรับ production
5. **Monitor disk space** (temp files)

---

## Security Checklist

- ✅ Server runs on localhost only
- ✅ No sensitive data stored
- ✅ Temp files auto-deleted
- ✅ Filename sanitization enabled
- ✅ CORS configured properly
- ✅ Extension permissions minimal

---

## Common Issues

| Issue | Solution |
|-------|----------|
| `EADDRINUSE` | Port ถูกใช้แล้ว → เปลี่ยน port |
| `yt-dlp not found` | ติดตั้ง: `pip install yt-dlp` |
| `Extension error` | Reload extension |
| `Download failed` | อัปเดต yt-dlp |
| `Temp files not deleted` | เช็ค permissions |

---

## Quick Start (1 Minute)

```bash
# 1. Install dependencies
cd server-for-youtube-downloader
npm install
pip install yt-dlp

# 2. Start server
npm start

# 3. Load extension (Chrome)
# → chrome://extensions
# → Load unpacked
# → Select youtube-download-extension folder

# 4. Test
# → Open YouTube
# → Click extension
# → Download!
```

---

**That's it! 🚀**
