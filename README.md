# YouTube Downloader - Complete System

ระบบดาวน์โหลด YouTube แบบ Local Server + Chrome Extension

## 📋 System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Architecture                          │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Chrome Extension (Frontend)                             │
│         ↓                                                 │
│  HTTP Request (localhost:3000)                           │
│         ↓                                                 │
│  Node.js Server (Backend)                                │
│         ↓                                                 │
│  yt-dlp (Python CLI)                                     │
│         ↓                                                 │
│  YouTube Video Download                                  │
│         ↓                                                 │
│  Stream to Browser → Chrome Downloads                    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### ขั้นตอนที่ 1: ติดตั้ง Server

```bash
# เข้าไปที่ folder server
cd server-for-youtube-downloader

# ติดตั้ง dependencies
npm install

# ติดตั้ง yt-dlp (Python)
pip install yt-dlp

# เริ่ม server
npm start
```

Server จะรันที่: `http://localhost:3000`

### ขั้นตอนที่ 2: ติดตั้ง Extension

1. เปิด Chrome
2. ไปที่ `chrome://extensions`
3. เปิด "Developer mode"
4. คลิก "Load unpacked"
5. เลือก folder `youtube-download-extension`

### ขั้นตอนที่ 3: ใช้งาน

1. เปิด YouTube video
2. คลิกไอคอน Extension
3. เลือกความชัด
4. ดาวน์โหลด!

---

## 📁 Project Structure

```
ch-ex/
│
├── server-for-youtube-downloader/      # Backend Server
│   ├── server.js                       # Express server
│   ├── package.json                    # Dependencies
│   ├── temp/                           # Temporary downloads
│   └── README.md                       # Server documentation
│
└── youtube-download-extension/         # Chrome Extension
    ├── manifest.json                   # Extension config
    ├── popup.html                      # UI
    ├── popup.js                        # Frontend logic
    ├── content.js                      # YouTube page integration
    ├── background.js                   # Service worker
    └── README.md                       # Extension documentation
```

---

## 🔧 Configuration

### Server Configuration

**File**: `server-for-youtube-downloader/server.js`

```javascript
const PORT = 3000; // เปลี่ยนพอร์ตได้ที่นี่
```

### Extension Configuration

**File**: `youtube-download-extension/popup.js`

```javascript
const SERVER_URL = 'http://localhost:3000'; // เปลี่ยน URL ได้ที่นี่
```

---

## 🎯 Features

### ✅ รองรับ
- ✅ YouTube Videos (ทุกความชัด)
- ✅ YouTube Shorts
- ✅ 4K/2K/1080p/720p/480p/360p
- ✅ ดาวน์โหลด MP3 (audio only)
- ✅ Auto-merge video + audio
- ✅ Real-time progress
- ✅ ไม่มีข้อจำกัดจำนวนครั้ง

### ❌ ไม่รองรับ
- ❌ Live Streams
- ❌ Private Videos
- ❌ Age-restricted Videos (บางคลิป)

---

## 🛠️ Tech Stack

### Server (Backend)
- **Node.js** v16+
- **Express** - Web framework
- **yt-dlp** - YouTube downloader (Python)
- **youtube-dl-exec** - Node.js wrapper

### Extension (Frontend)
- **Chrome Manifest V3**
- **Vanilla JavaScript**
- **Chrome APIs**: downloads, tabs, storage

---

## 📊 API Endpoints

### 1. Health Check
```http
GET /api/health

Response:
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

Body:
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}

Response:
{
  "title": "Video Title",
  "thumbnail": "https://...",
  "duration": 300,
  "channel": "Channel Name",
  "formats": [
    { "quality": "1080p", "format_id": "137", "ext": "mp4", "fps": 30 }
  ]
}
```

### 3. Download Video
```http
POST /api/download
Content-Type: application/json

Body:
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "quality": "720",
  "format": "mp4"
}

Response: Stream (video file)
```

### 4. Download Audio
```http
POST /api/download-audio
Content-Type: application/json

Body:
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}

Response: Stream (mp3 file)
```

---

## 🔍 Troubleshooting

### ❌ Server ไม่เปิด

**สาเหตุ**: yt-dlp ไม่ติดตั้ง

```bash
# ติดตั้ง yt-dlp
pip install yt-dlp

# เช็ค version
yt-dlp --version
```

---

### ❌ Extension ไม่เชื่อมต่อ Server

**สาเหตุ**: Server ไม่ได้เปิด

```bash
# เปิด server
cd server-for-youtube-downloader
npm start
```

ดูที่ console ต้องมี:
```
🚀 YouTube Downloader Server
Server running on http://localhost:3000
```

---

### ❌ Port 3000 ถูกใช้แล้ว

**วิธีแก้**: เปลี่ยนพอร์ต

1. แก้ `server.js`:
```javascript
const PORT = 4000; // เปลี่ยนเป็น 4000
```

2. แก้ `popup.js`:
```javascript
const SERVER_URL = 'http://localhost:4000';
```

3. Restart server และ reload extension

---

### ❌ ดาวน์โหลดไม่ได้

**สาเหตุ**: yt-dlp เวอร์ชันเก่า

```bash
# อัปเดต yt-dlp
pip install -U yt-dlp
```

---

### ❌ Video บางคลิปดาวน์โหลดไม่ได้

**สาเหตุ**: YouTube เปลี่ยน API หรือวิดีโอถูกจำกัด

**วิธีแก้**:
1. อัปเดต yt-dlp: `pip install -U yt-dlp`
2. ลองความชัดต่ำลง (เช่น 720p แทน 1080p)
3. ลองดาวน์โหลดผ่าน yt-dlp CLI โดยตรง:
```bash
yt-dlp "https://www.youtube.com/watch?v=VIDEO_ID"
```

---

## 🎨 Customization

### เปลี่ยนสี Extension

**File**: `youtube-download-extension/popup.html`

```css
<style>
  :root {
    --primary: #ff0000;     /* สีหลัก */
    --secondary: #282828;   /* สีพื้นหลัง */
    --accent: #3ea6ff;      /* สีเน้น */
  }
</style>
```

### เพิ่มความชัดใหม่

**File**: `youtube-download-extension/popup.js`

```javascript
const standardQualities = [
  '4320p', // 8K (เพิ่มใหม่)
  '2160p', // 4K
  '1440p', // 2K
  '1080p', // Full HD
  '720p',  // HD
  '480p',  // SD
  '360p',  // Low
  '144p'   // Mini
];
```

---

## 🚦 Performance

### Download Speed
- ขึ้นอยู่กับความเร็วเน็ต
- ไม่มีข้อจำกัดจาก Server
- yt-dlp รองรับ Multi-threading

### Server Resource
- **RAM**: ~50-100 MB
- **CPU**: สูงเฉพาะตอนดาวน์โหลด
- **Disk**: ไฟล์ชั่วคราว (ลบอัตโนมัติ)

### Temp Files
- เก็บใน `server-for-youtube-downloader/temp/`
- ลบอัตโนมัติหลังส่งไฟล์ (1 วินาที)
- ลบไฟล์เก่ากว่า 1 ชั่วโมงทุก 1 ชั่วโมง

---

## 🔒 Security & Privacy

### ✅ ความปลอดภัย
- Server รันแค่ localhost (ไม่เปิดให้ internet)
- ไม่เก็บประวัติการดาวน์โหลด
- ไม่ส่งข้อมูลไปเซิร์ฟเวอร์ภายนอก
- ไฟล์ชั่วคราวถูกลบอัตโนมัติ

### ⚠️ ข้อควรระวัง
- ใช้ดาวน์โหลดเพื่อการศึกษาและส่วนบุคคลเท่านั้น
- เคารพลิขสิทธิ์ของเจ้าของคอนเทนต์
- ไม่แจกจ่ายไฟล์ที่มีลิขสิทธิ์

---

## 🎯 Development

### Run Server in Dev Mode
```bash
cd server-for-youtube-downloader
npm run dev
```

Server จะ restart อัตโนมัติเมื่อแก้ไขโค้ด (nodemon)

### Debug Extension
1. เปิด `chrome://extensions`
2. คลิก "Inspect views: popup.html"
3. ดู Console logs

### Test API
```bash
# Health check
curl http://localhost:3000/api/health

# Get video info
curl -X POST http://localhost:3000/api/video-info \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

---

## 🚀 Production Deployment

### Option 1: Run with PM2 (แนะนำ)
```bash
npm install -g pm2

# Start
pm2 start server.js --name youtube-server

# Auto-start on boot
pm2 startup
pm2 save

# Logs
pm2 logs youtube-server

# Stop
pm2 stop youtube-server
```

### Option 2: Run as Windows Service
ใช้ `node-windows`:
```bash
npm install -g node-windows
```

---

## 📝 Changelog

### Version 2.0.0 (Local Server)
- ✅ เพิ่ม Local Server ด้วย Node.js + yt-dlp
- ✅ ดาวน์โหลดได้โดยตรงผ่าน Extension
- ✅ รองรับทุกความชัด (4K/2K/1080p/720p/480p/360p)
- ✅ ดาวน์โหลด MP3 (audio only)
- ✅ ไม่ต้องพึ่ง External APIs
- ✅ ไม่มีข้อจำกัดจำนวนครั้ง
- ✅ เสถียร ไม่มีปัญหา API down

### Version 1.0.0 (API Version)
- ❌ ใช้ External APIs (Cobalt, Y2Mate)
- ❌ API บางตัว down
- ❌ มีข้อจำกัดจำนวนครั้ง

---

## 🤝 Support

### ปัญหาทั่วไป
- **Server ไม่เปิด**: ติดตั้ง yt-dlp ด้วย `pip install yt-dlp`
- **Extension error**: Reload extension ใน `chrome://extensions`
- **ดาวน์โหลดไม่ได้**: อัปเดต yt-dlp ด้วย `pip install -U yt-dlp`

### การอัปเดต
```bash
# อัปเดต yt-dlp
pip install -U yt-dlp

# อัปเดต Node packages
cd server-for-youtube-downloader
npm update
```

---

## 📄 License

MIT License - ใช้งานฟรีเพื่อการศึกษาและส่วนบุคคล

---

## ✨ Next Steps

1. **เริ่ม Server**: `cd server-for-youtube-downloader && npm start`
2. **ติดตั้ง Extension**: Load unpacked จาก `chrome://extensions`
3. **ทดสอบ**: เปิด YouTube → คลิก Extension → ดาวน์โหลด!

**ระบบพร้อมใช้งาน! 🎉**
