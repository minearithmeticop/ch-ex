# 📥 YouTube Downloader - Installation Guide

คู่มือติดตั้งแบบละเอียด สำหรับ Local Server + Chrome Extension

---

## 📋 ความต้องการระบบ (Prerequisites)

### ✅ ต้องติดตั้งก่อน:

1. **Node.js** (v16 หรือสูงกว่า)
   - ดาวน์โหลด: https://nodejs.org
   - เช็ค version: `node --version`

2. **Python** (v3.7 หรือสูงกว่า)
   - ดาวน์โหลด: https://python.org
   - เช็ค version: `python --version` หรือ `python3 --version`

3. **npm** (มากับ Node.js)
   - เช็ค version: `npm --version`

4. **pip** (มากับ Python)
   - เช็ค version: `pip --version` หรือ `pip3 --version`

5. **Google Chrome** หรือ **Chromium-based browser**

---

## 🚀 วิธีติดตั้ง

### วิธีที่ 1: ติดตั้งอัตโนมัติ (แนะนำ)

#### Windows:
```bash
# Double-click หรือรันในโค้ด
start-server.bat
```

#### macOS/Linux:
```bash
# ให้สิทธิ์ execute
chmod +x start-server.sh

# รัน script
./start-server.sh
```

Script จะ:
- ✅ เช็คว่าติดตั้ง Node.js และ Python แล้ว
- ✅ ติดตั้ง yt-dlp อัตโนมัติ
- ✅ ติดตั้ง npm packages
- ✅ เริ่ม server ที่ localhost:3000

---

### วิธีที่ 2: ติดตั้งแบบ Manual

#### Step 1: ติดตั้ง Server Dependencies

```bash
# เข้าไปที่ folder server
cd server-for-youtube-downloader

# ติดตั้ง npm packages
npm install
```

ตัวติดตั้งจะติดตั้ง:
- express (Web server)
- cors (Cross-origin support)
- youtube-dl-exec (yt-dlp wrapper)
- sanitize-filename (ทำ filename ให้ปลอดภัย)
- axios (HTTP client)

#### Step 2: ติดตั้ง yt-dlp

**Windows:**
```bash
pip install yt-dlp
```

**macOS/Linux:**
```bash
pip3 install yt-dlp
```

**หรือใช้ npm script:**
```bash
npm run install-ytdlp
```

#### Step 3: เช็คว่าติดตั้งสำเร็จ

```bash
# เช็ค yt-dlp version
yt-dlp --version

# ควรได้เป็นตัวเลข เช่น: 2024.10.07
```

#### Step 4: เริ่ม Server

```bash
# ใน folder server-for-youtube-downloader
npm start
```

ถ้าสำเร็จ จะเห็น:
```
🚀 YouTube Downloader Server
================================
📡 Server running on http://localhost:3000
📋 Health check: http://localhost:3000/api/health

✨ Ready to accept requests from Extension!
```

---

### Step 5: ติดตั้ง Chrome Extension

1. **เปิด Chrome Extensions Page**
   - พิมพ์ใน address bar: `chrome://extensions`
   - หรือ Menu → More Tools → Extensions

2. **เปิด Developer Mode**
   - Toggle switch ที่มุมขวาบน

3. **Load Extension**
   - คลิก "Load unpacked"
   - เลือก folder `youtube-download-extension`

4. **เช็คว่าติดตั้งสำเร็จ**
   - จะเห็นไอคอน Extension บน toolbar
   - ชื่อ: "YouTube Video Downloader (Local Server)"
   - Version: 2.0.0

---

## ✅ ทดสอบการติดตั้ง

### 1. ทดสอบ Server

**เปิดเบราว์เซอร์** ไปที่:
```
http://localhost:3000/api/health
```

ควรได้:
```json
{
  "status": "ok",
  "ytdlp": "2024.10.07",
  "message": "Server is running"
}
```

**หรือใช้ Terminal:**
```bash
curl http://localhost:3000/api/health
```

### 2. ทดสอบ Extension

1. เปิด YouTube video ใดๆ
2. คลิกไอคอน Extension
3. ควรเห็น:
   - ✅ ชื่อวิดีโอ
   - ✅ Thumbnail
   - ✅ ปุ่มเลือกความชัด
   - ✅ ปุ่ม Download MP3

4. ลองคลิกดาวน์โหลด 360p หรือ 480p (ไฟล์เล็ก ทดสอบเร็ว)

---

## ❌ Troubleshooting

### ปัญหา 1: `npm: command not found`

**สาเหตุ**: ยังไม่ติดตั้ง Node.js

**วิธีแก้**:
1. ดาวน์โหลด Node.js: https://nodejs.org
2. ติดตั้ง (เลือก "Add to PATH")
3. Restart Terminal/Command Prompt
4. เช็คอีกครั้ง: `node --version`

---

### ปัญหา 2: `python: command not found`

**สาเหตุ**: ยังไม่ติดตั้ง Python หรือไม่ได้เพิ่มใน PATH

**วิธีแก้**:

**Windows:**
1. ดาวน์โหลด Python: https://python.org
2. ติดตั้ง และ **ติ๊กถูก "Add Python to PATH"**
3. Restart Terminal

**macOS:**
```bash
# ใช้ Homebrew
brew install python3
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install python3 python3-pip

# Fedora/RHEL
sudo dnf install python3 python3-pip
```

---

### ปัญหา 3: `pip install yt-dlp` ติดตั้งไม่ได้

**วิธีแก้ 1**: ใช้ pip3
```bash
pip3 install yt-dlp
```

**วิธีแก้ 2**: ใช้ python -m pip
```bash
python -m pip install yt-dlp
# หรือ
python3 -m pip install yt-dlp
```

**วิธีแก้ 3**: ติดตั้งแบบ user
```bash
pip install --user yt-dlp
```

---

### ปัญหา 4: Port 3000 ถูกใช้แล้ว

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**วิธีแก้ 1**: หา process ที่ใช้ port 3000

**Windows:**
```bash
# หา PID
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# หา PID
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)
```

**วิธีแก้ 2**: เปลี่ยนพอร์ต

1. แก้ `server-for-youtube-downloader/server.js`:
```javascript
const PORT = 4000; // เปลี่ยนเป็น 4000 หรือ port อื่น
```

2. แก้ `youtube-download-extension/popup.js`:
```javascript
const SERVER_URL = 'http://localhost:4000'; // เปลี่ยนตาม
```

3. Restart server และ reload extension

---

### ปัญหา 5: Extension ขึ้น "Server ยังไม่เปิด"

**สาเหตุ**: Server ไม่ได้รัน

**วิธีแก้**:
1. เช็คว่า server รันอยู่:
```bash
curl http://localhost:3000/api/health
```

2. ถ้าไม่มีอะไรขึ้น แสดงว่า server ไม่ได้เปิด
3. รัน server:
```bash
cd server-for-youtube-downloader
npm start
```

---

### ปัญหา 6: `MODULE_NOT_FOUND`

**Error:**
```
Error: Cannot find module 'express'
```

**วิธีแก้**:
```bash
# ลบ node_modules แล้วติดตั้งใหม่
cd server-for-youtube-downloader
rm -rf node_modules package-lock.json
npm install
```

---

### ปัญหา 7: yt-dlp ดาวน์โหลดไม่ได้

**Error:**
```
ERROR: Unable to download video
```

**วิธีแก้ 1**: อัปเดต yt-dlp
```bash
pip install -U yt-dlp
# หรือ
pip3 install -U yt-dlp
```

**วิธีแก้ 2**: ลองดาวน์โหลดด้วย yt-dlp CLI
```bash
yt-dlp "https://www.youtube.com/watch?v=VIDEO_ID"
```

ถ้ายังไม่ได้ อาจเป็น:
- วิดีโอถูกจำกัดสิทธิ์
- วิดีโอ private
- YouTube เปลี่ยน API (รอ yt-dlp อัปเดต)

---

### ปัญหา 8: Extension ไม่แสดงปุ่มดาวน์โหลด

**วิธีแก้**:
1. Reload Extension:
   - ไปที่ `chrome://extensions`
   - คลิกปุ่ม refresh Extension

2. เช็ค Console:
   - คลิกขวาที่ Extension popup
   - เลือก "Inspect"
   - ดู Console ว่ามี error อะไร

3. Reload หน้า YouTube

---

## 🎯 การใช้งานครั้งต่อไป

หลังจากติดตั้งครั้งแรกเสร็จแล้ว การใช้งานครั้งถัดไปง่ายมาก:

### แบบสั้น (Windows):
```bash
# Double-click
start-server.bat
```

### แบบสั้น (macOS/Linux):
```bash
./start-server.sh
```

### แบบยาว:
```bash
cd server-for-youtube-downloader
npm start
```

**แค่นี้เอง!** Extension จะทำงานโดยอัตโนมัติ

---

## 🔄 การอัปเดต

### อัปเดต yt-dlp (แนะนำทำทุก 1-2 สัปดาห์)
```bash
pip install -U yt-dlp
```

### อัปเดต Node packages
```bash
cd server-for-youtube-downloader
npm update
```

### อัปเดต Extension
1. Download version ใหม่
2. ไปที่ `chrome://extensions`
3. คลิก "Remove" Extension เก่า
4. Load unpacked Extension ใหม่

---

## 🎓 Tips & Best Practices

### 1. เปิด Server ตอน Boot (Optional)

**Windows** - ใช้ Task Scheduler:
1. เปิด Task Scheduler
2. Create Basic Task
3. Trigger: At startup
4. Action: Start a program
5. Program: `npm`
6. Arguments: `start`
7. Start in: `C:\path\to\server-for-youtube-downloader`

**macOS/Linux** - ใช้ PM2:
```bash
npm install -g pm2
cd server-for-youtube-downloader
pm2 start server.js --name youtube-server
pm2 startup
pm2 save
```

### 2. Monitor Server Logs

**ดู logs แบบ realtime:**
```bash
# ใน Terminal ที่รัน server จะเห็น:
📥 Getting video info: https://...
✅ Video info retrieved
📥 Downloading: https://... (720p)
✅ Download complete
🗑️  Temp file deleted
```

### 3. เช็ค Server ทำงานอยู่หรือเปล่า

**Windows:**
```bash
netstat -ano | findstr :3000
```

**macOS/Linux:**
```bash
lsof -i:3000
```

---

## 📊 การใช้งาน

### ดาวน์โหลด Video
1. เปิด YouTube video
2. คลิก Extension
3. เลือกความชัด (360p, 720p, 1080p, etc.)
4. คลิก → รอดาวน์โหลด → เสร็จ!

### ดาวน์โหลด Audio (MP3)
1. เปิด YouTube video
2. คลิก Extension
3. คลิกปุ่ม "🎵 Download MP3"
4. รอดาวน์โหลด → เสร็จ!

### YouTube Shorts
- รองรับเหมือนวิดีโอปกติ
- แต่ความชัดสูงสุดมักจะ 720p

---

## ✨ คุณภาพวิดีโอที่รองรับ

- **4K (2160p)** - คุณภาพสูงสุด (~500MB ต่อ 10 นาที)
- **2K (1440p)** - คุณภาพสูง (~300MB ต่อ 10 นาที)
- **Full HD (1080p)** - คุณภาพปกติ (~150MB ต่อ 10 นาที)
- **HD (720p)** - คุณภาพมาตรฐาน (~70MB ต่อ 10 นาที)
- **SD (480p)** - ประหยัดข้อมูล (~40MB ต่อ 10 นาที)
- **Low (360p)** - เน็ตช้า (~25MB ต่อ 10 นาที)

---

## 🎉 เสร็จแล้ว!

ตอนนี้คุณติดตั้งเรียบร้อยแล้ว พร้อมใช้งาน!

**ขั้นตอนถัดไป:**
1. ✅ เปิด Server: `npm start`
2. ✅ เปิด YouTube
3. ✅ คลิก Extension
4. ✅ ดาวน์โหลด!

**Have fun! 🚀**
