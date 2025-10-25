# 🔍 Extension Troubleshooting Guide

## ตรวจสอบว่า Extension ทำงานหรือไม่

### ✅ ขั้นตอนที่ 1: ตรวจสอบ Server
```bash
# ต้องเห็น: {"status":"ok","ytdlp":"..."}
curl http://localhost:3000/api/health
```

### ✅ ขั้นตอนที่ 2: Reload Extension
1. ไปที่ `chrome://extensions`
2. หา "YouTube Video Downloader (Local Server)"
3. คลิกปุ่ม **🔄 Reload** (หรือ refresh icon)

### ✅ ขั้นตอนที่ 3: เปิด Console
1. คลิกขวาที่ไอคอน Extension
2. เลือก **"Inspect"** (หรือ "ตรวจสอบ")
3. ดูที่ **Console tab**

### ✅ ขั้นตอนที่ 4: ทดสอบ
1. เปิด YouTube video ใดๆ (เช่น: https://www.youtube.com/watch?v=dQw4w9WgXcQ)
2. คลิกไอคอน Extension
3. ควรเห็น:
   - ข้อความ "กำลังเชื่อมต่อ Local Server..."
   - จากนั้นแสดงข้อมูลวิดีโอ + ปุ่มความชัด

---

## 🐛 ถ้ามีปัญหา

### Problem 1: "Server ยังไม่เปิด"
**สาเหตุ**: Server ไม่ได้รัน

**แก้:**
```bash
cd server-for-youtube-downloader
npm start
```

---

### Problem 2: Extension ไม่แสดงอะไร (Popup เปล่า)
**สาเหตุ**: JavaScript error

**แก้:**
1. เปิด Console (คลิกขวา Extension → Inspect)
2. ดู error ใน Console
3. Reload Extension

---

### Problem 3: ปุ่มความชัดไม่แสดง
**สาเหตุ**: CSS หรือ JS ไม่โหลด

**แก้:**
1. ตรวจสอบว่าไฟล์ครบ:
   - ✅ popup.html
   - ✅ popup.js
   - ✅ manifest.json
2. Reload Extension

---

### Problem 4: คลิกดาวน์โหลดแล้วไม่มีอะไรเกิดขึ้น
**สาเหตุ**: Server error

**แก้:**
1. ดู Console ของ Server (Terminal ที่รัน npm start)
2. ดู Console ของ Extension
3. ลอง curl ทดสอบ:
```bash
curl -X POST http://localhost:3000/api/video-info \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

---

## 📋 Checklist

ก่อนใช้งาน ตรวจสอบ:

- [ ] ติดตั้ง Node.js แล้ว (`node --version`)
- [ ] ติดตั้ง Python แล้ว (`python --version`)
- [ ] ติดตั้ง yt-dlp แล้ว (`yt-dlp --version`)
- [ ] รัน `npm install` ใน folder server แล้ว
- [ ] Server รันอยู่ (`npm start` ใน terminal)
- [ ] Server ตอบ health check (`curl http://localhost:3000/api/health`)
- [ ] Load Extension แล้ว (chrome://extensions)
- [ ] Reload Extension แล้ว (หลังแก้ไขโค้ด)

---

## 🔧 Debug Commands

### ทดสอบ Server
```bash
# Health check
curl http://localhost:3000/api/health

# Get video info
curl -X POST http://localhost:3000/api/video-info \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'

# ต้องเห็น JSON กับ title, thumbnail, formats
```

### เช็ค Server Logs
ใน Terminal ที่รัน `npm start` จะเห็น:
```
📥 Getting video info: https://...
✅ Video info retrieved
```

### เช็ค Extension Logs
1. คลิกขวา Extension → Inspect
2. ดู Console tab
3. ต้องเห็น:
```javascript
✅ Server online: {status: "ok", ytdlp: "..."}
```

---

## 💡 Expected Behavior

### เมื่อเปิด Extension บน YouTube:
1. แสดง "กำลังเชื่อมต่อ Local Server..." (1-2 วินาที)
2. แสดง thumbnail + ชื่อวิดีโอ
3. แสดงปุ่มความชัด (2160p, 1080p, 720p, 480p, 360p)
4. แสดงปุ่ม "🎵 Download MP3"

### เมื่อคลิกดาวน์โหลด:
1. ปุ่มถูก disable
2. แสดง "กำลังดาวน์โหลด 720p..."
3. Chrome Downloads เริ่มดาวน์โหลดไฟล์
4. แสดง "ดาวน์โหลดสำเร็จ!"
5. ปุ่มกลับมาใช้งานได้อีกครั้ง

---

## 🎯 Quick Fix

ถ้ายังไม่ได้ ลอง:

1. **Hard Reload Extension**:
   ```
   chrome://extensions
   → Remove Extension
   → Load unpacked ใหม่
   ```

2. **Restart Server**:
   ```bash
   # กด Ctrl+C หยุด server
   npm start
   ```

3. **Update yt-dlp**:
   ```bash
   pip install -U yt-dlp
   ```

4. **Clear Browser Cache**:
   - Ctrl+Shift+Delete
   - Clear cached images and files

---

## ✅ ถ้าทำงานแล้ว

คุณจะเห็น:
- ✅ Popup แสดงข้อมูลวิดีโอ
- ✅ มีปุ่มความชัดให้เลือก (6 ปุ่ม)
- ✅ มีปุ่ม Download MP3
- ✅ คลิกแล้วดาวน์โหลดได้

---

**🚀 Good luck!**
