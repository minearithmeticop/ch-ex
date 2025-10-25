# YouTube Downloader - Local Server

Local server สำหรับ YouTube Downloader Extension ใช้ yt-dlp ดาวน์โหลดวิดีโอ YouTube

## 🚀 Quick Start

### 1. ติดตั้ง Dependencies

```bash
# ติดตั้ง Node.js packages
npm install

# ติดตั้ง yt-dlp (Python)
pip install yt-dlp

# หรือใช้ npm script
npm run install-ytdlp
```

### 2. เริ่ม Server

```bash
# Production
npm start

# Development (auto-reload)
npm run dev
```

Server จะรันที่ `http://localhost:3000`

### 3. ทดสอบ Server

```bash
# เช็คว่า server ทำงาน
curl http://localhost:3000/api/health
```

ควรได้:
```json
{
  "status": "ok",
  "ytdlp": "2024.xx.xx",
  "message": "Server is running"
}
```

---

## 📡 API Endpoints

### 1. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "ytdlp": "2024.10.07",
  "message": "Server is running"
}
```

### 2. Get Video Info
```http
POST /api/video-info
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "title": "Video Title",
  "thumbnail": "https://...",
  "duration": 300,
  "channel": "Channel Name",
  "formats": [
    {
      "quality": "1080p",
      "format_id": "137",
      "ext": "mp4",
      "filesize": 123456789
    },
    {
      "quality": "720p",
      "format_id": "136",
      "ext": "mp4",
      "filesize": 67890123
    }
  ],
  "video_id": "VIDEO_ID"
}
```

### 3. Download Video
```http
POST /api/download
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "quality": "720p",
  "format": "mp4"
}
```

**Response:** Stream (video file)

### 4. Download Audio (MP3)
```http
POST /api/download-audio
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:** Stream (mp3 file)

---

## 🛠️ Tech Stack

- **Node.js** + **Express** - Web server
- **yt-dlp** - YouTube downloader (Python)
- **youtube-dl-exec** - Node.js wrapper for yt-dlp
- **CORS** - Allow Extension requests

---

## 📁 Project Structure

```
server-for-youtube-downloader/
├── server.js           # Main Express server
├── package.json        # Dependencies
├── temp/              # Temporary downloads (auto-clean)
└── README.md          # This file
```

---

## ⚙️ Configuration

### Port
Default: `3000`

เปลี่ยนได้ใน `server.js`:
```javascript
const PORT = 3000; // เปลี่ยนเป็นพอร์ตที่ต้องการ
```

### Temp Directory
ไฟล์ชั่วคราวจะถูกลบอัตโนมัติหลัง:
- ส่งไฟล์ให้ client แล้ว (1 วินาที)
- หรือเก่ากว่า 1 ชั่วโมง

---

## 🔧 Troubleshooting

### yt-dlp not installed
```bash
pip install yt-dlp

# หรือ
python3 -m pip install yt-dlp

# เช็ค version
yt-dlp --version
```

### Port already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### CORS Error
Server มี CORS enabled แล้ว แต่ถ้ายังมีปัญหา ตรวจสอบว่า:
1. Extension เรียก `http://localhost:3000` (ไม่ใช่ `https`)
2. Server รันอยู่
3. ไม่มี Firewall block

### Download Failed
1. เช็คว่า URL ถูกต้อง
2. อัปเดต yt-dlp: `pip install -U yt-dlp`
3. ลองดาวน์โหลดด้วย yt-dlp CLI: `yt-dlp <URL>`

---

## 📊 Performance

- **Download Speed**: ขึ้นอยู่กับความเร็วเน็ต
- **Memory Usage**: ~50-100 MB
- **CPU Usage**: สูงเฉพาะตอนดาวน์โหลด + merge

---

## 🔒 Security

- Server รันแค่ `localhost` (ไม่เปิดให้ internet เข้าถึง)
- ไฟล์ชั่วคราวถูกลบอัตโนมัติ
- ไม่เก็บ logs หรือประวัติการดาวน์โหลด

---

## 🚀 Production Tips

### 1. ใช้ PM2 (Auto-restart)
```bash
npm install -g pm2
pm2 start server.js --name youtube-server
pm2 startup
pm2 save
```

### 2. Update yt-dlp ให้ล่าสุด
```bash
pip install -U yt-dlp
```

### 3. Monitor Logs
```bash
pm2 logs youtube-server
```

---

## 📝 Development

### Run with nodemon (auto-reload)
```bash
npm run dev
```

### Test API with curl
```bash
# Health check
curl http://localhost:3000/api/health

# Get video info
curl -X POST http://localhost:3000/api/video-info \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'

# Download video
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ","quality":"720p"}' \
  --output video.mp4
```

---

## 🐛 Known Issues

1. **Shorts**: รองรับแล้ว แต่บางคลิปอาจมีแค่ 720p
2. **4K/1080p**: บางวิดีโอต้อง merge video+audio (yt-dlp ทำให้อัตโนมัติ)
3. **Live Streams**: ดาวน์โหลดไม่ได้

---

## 📄 License

MIT License - ใช้งานเพื่อการศึกษาและส่วนบุคคล

---

## 🎯 Next Steps

1. เริ่ม server: `npm start`
2. ติดตั้ง Extension
3. เปิด YouTube → คลิก Extension → ดาวน์โหลด!

**Server พร้อมใช้งาน! 🎉**
