# ⚡ YouTube Downloader - Quick Start Guide

**ดาวน์โหลด YouTube ได้ทุกความชัด - ง่าย เร็ว ไม่มีข้อจำกัด**

---

## 🚀 3 ขั้นตอน เริ่มใช้งาน

### ✅ ขั้นที่ 1: เริ่ม Server (5 นาที)

**Windows:**
```bash
# Double-click ไฟล์นี้
start-server.bat
```

**macOS/Linux:**
```bash
./start-server.sh
```

**หรือทำเอง:**
```bash
# 1. เข้า folder server
cd server-for-youtube-downloader

# 2. ติดตั้ง
npm install
pip install yt-dlp

# 3. เริ่ม server
npm start
```

ถ้าเห็นข้อความนี้ = สำเร็จ:
```
🚀 YouTube Downloader Server
📡 Server running on http://localhost:3000
```

---

### ✅ ขั้นที่ 2: ติดตั้ง Extension (2 นาที)

1. เปิด Chrome → พิมพ์: `chrome://extensions`
2. เปิด "Developer mode" (สวิตช์ขวาบน)
3. คลิก "Load unpacked"
4. เลือก folder `youtube-download-extension`
5. เสร็จ! 🎉

---

### ✅ ขั้นที่ 3: ดาวน์โหลด! (1 คลิก)

1. เปิด YouTube video ใดๆ
2. คลิกไอคอน Extension
3. เลือกความชัด (360p, 720p, 1080p, 4K)
4. ดาวน์โหลด → เสร็จ!

**ดาวน์โหลด MP3:**
- คลิกปุ่ม "🎵 Download MP3"

---

## 💡 คุณสมบัติ

| ✅ รองรับ | ❌ ไม่รองรับ |
|----------|-------------|
| YouTube Videos | Live Streams |
| YouTube Shorts | Private Videos |
| 4K, 2K, 1080p, 720p, 480p, 360p | Age-restricted (บางคลิป) |
| Download MP3 | - |
| ไม่มีข้อจำกัดจำนวนครั้ง | - |
| 100% ฟรี | - |

---

## 🔧 ความต้องการ

ต้องติดตั้งก่อน:
- ✅ **Node.js** → https://nodejs.org
- ✅ **Python** → https://python.org
- ✅ **Chrome Browser**

---

## ❓ แก้ปัญหา

### 🔴 Extension แสดง "Server ยังไม่เปิด"

**แก้:** เปิด server ก่อน
```bash
cd server-for-youtube-downloader
npm start
```

---

### 🔴 `pip install yt-dlp` ไม่ได้

**แก้:** ลองคำสั่งอื่น
```bash
pip3 install yt-dlp
# หรือ
python -m pip install yt-dlp
```

---

### 🔴 Port 3000 ถูกใช้แล้ว

**แก้ที่ 1:** หา process และปิด
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**แก้ที่ 2:** เปลี่ยนพอร์ต
1. แก้ `server.js` → `const PORT = 4000`
2. แก้ `popup.js` → `const SERVER_URL = 'http://localhost:4000'`

---

### 🔴 ดาวน์โหลดไม่ได้

**แก้:** อัปเดต yt-dlp
```bash
pip install -U yt-dlp
```

---

## 📖 เอกสารเพิ่มเติม

| ไฟล์ | จุดประสงค์ |
|------|-----------|
| `README.md` | คู่มือหลัก |
| `INSTALLATION.md` | คู่มือติดตั้งแบบละเอียด |
| `QUICK_REFERENCE.md` | คำสั่งที่ใช้บ่อย |
| `DESIGN.md` | สถาปัตยกรรมระบบ |

---

## 🎯 คุณภาพวิดีโอ

| ความชัด | ขนาดไฟล์ (ต่อ 10 นาที) | แนะนำสำหรับ |
|---------|------------------------|-------------|
| **4K** | ~500 MB | หน้าจอใหญ่ |
| **1080p** | ~150 MB | คอมพิวเตอร์ |
| **720p** | ~70 MB | ใช้งานทั่วไป |
| **480p** | ~40 MB | มือถือ |
| **360p** | ~25 MB | เน็ตช้า |

---

## 🔒 ความปลอดภัย

- ✅ Server รันแค่ localhost (ไม่เปิดให้ internet)
- ✅ ไม่เก็บประวัติ ไม่เก็บ logs
- ✅ ไฟล์ชั่วคราวถูกลบอัตโนมัติ
- ✅ 100% ส่วนตัว ไม่ส่งข้อมูลไปไหน

---

## 💻 ระบบที่รองรับ

- ✅ Windows 10/11
- ✅ macOS (Intel + Apple Silicon)
- ✅ Linux (Ubuntu, Debian, Fedora, etc.)
- ✅ Chrome, Edge, Brave, Vivaldi (Chromium-based)

---

## 📞 ต้องการความช่วยเหลือ?

1. **ดูคู่มือติดตั้ง**: `INSTALLATION.md`
2. **เช็คคำสั่ง**: `QUICK_REFERENCE.md`
3. **ดู Design**: `DESIGN.md`

---

## ⚡ เริ่มเลย!

```bash
# 1. เริ่ม Server
cd server-for-youtube-downloader
npm start

# 2. Load Extension
# → chrome://extensions → Load unpacked

# 3. Download!
# → Open YouTube → Click Extension
```

**เพียงแค่นี้! 🎉**

---

## 🎓 Tips

1. **อัปเดต yt-dlp** ทุก 1-2 สัปดาห์:
   ```bash
   pip install -U yt-dlp
   ```

2. **รัน Server ตอน Boot** (Optional):
   - Windows: Task Scheduler
   - macOS/Linux: PM2 หรือ systemd

3. **ทดสอบ Server**:
   ```bash
   curl http://localhost:3000/api/health
   ```

---

## ⚖️ ข้อควรระวัง

- ⚠️ ใช้ดาวน์โหลดเพื่อการศึกษาและส่วนบุคคลเท่านั้น
- ⚠️ เคารพลิขสิทธิ์ของเจ้าของคอนเทนต์
- ⚠️ ไม่แจกจ่ายไฟล์ที่มีลิขสิทธิ์

---

## 📊 สรุปข้อดี

| ข้อดี | คำอธิบาย |
|-------|----------|
| ✅ **ไม่มีข้อจำกัด** | ดาวน์โหลดได้ไม่จำกัดครั้ง |
| ✅ **ทุกความชัด** | 144p ถึง 4K |
| ✅ **เร็ว** | ดาวน์โหลดตรง ไม่ผ่าน API |
| ✅ **ปลอดภัย** | localhost เท่านั้น |
| ✅ **ฟรี 100%** | ไม่มีค่าใช้จ่าย |
| ✅ **เสถียร** | ใช้ yt-dlp มาตรฐานอุตสาหกรรม |

---

**🚀 พร้อมแล้ว ลุย!**

```
┌────────────────────────────────────────┐
│   YouTube Downloader - Local Server   │
│   ✅ เร็ว ✅ ง่าย ✅ ปลอดภัย         │
└────────────────────────────────────────┘
```

**Have fun downloading! 🎉**
