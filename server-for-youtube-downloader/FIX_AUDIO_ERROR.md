# 🔧 Fix Applied - Audio Download Error

## ❌ ปัญหาเดิม
```
Audio download error: Invalid character in header content ["Content-Disposition"]
```

**สาเหตุ**: Filename มีตัวอักษรพิเศษ (เช่น `'`, `"`, emoji, อักขระไทย) ที่ HTTP header ไม่รองรับ

---

## ✅ การแก้ไข

เพิ่มฟังก์ชัน 2 ตัวใน `server.js`:

### 1. `encodeFilename(filename)`
ทำ filename ให้ปลอดภัยโดย:
- ✅ ลบ quotes (`'`, `"`)
- ✅ ลบ backslashes (`\`)
- ✅ แปลงตัวอักษรพิเศษเป็น underscore (`_`)
- ✅ แปลง space เป็น underscore
- ✅ จำกัดความยาว 200 ตัวอักษร

### 2. `createContentDisposition(filename)`
สร้าง Content-Disposition header ที่รองรับ UTF-8:
- ✅ ใช้ `filename` สำหรับ browser เก่า (ASCII only)
- ✅ ใช้ `filename*` สำหรับ browser ใหม่ (UTF-8, RFC 5987)

**ตัวอย่าง:**
```javascript
// Input
"BABYMONSTER - 'PSYCHO' (Official Audio).mp3"

// Output header
"attachment; filename=\"BABYMONSTER_-_PSYCHO_Official_Audio.mp3\"; filename*=UTF-8''BABYMONSTER%20-%20'PSYCHO'%20(Official%20Audio).mp3"
```

---

## 🚀 วิธีใช้งานใหม่

### 1. Restart Server
```bash
# หยุด server เดิม (Ctrl+C ใน terminal)
# จากนั้นเริ่มใหม่:
cd server-for-youtube-downloader
npm start
```

### 2. ทดสอบอีกครั้ง
1. Reload Extension (`chrome://extensions` → Reload)
2. เปิด YouTube video
3. คลิก Extension
4. คลิก **"🎵 Download MP3"**
5. ควรดาวน์โหลดได้โดยไม่มี error!

---

## 📝 ตัวอย่าง Filename Conversion

| Original | Safe Filename | UTF-8 Encoded |
|----------|--------------|---------------|
| `BABYMONSTER - 'PSYCHO'.mp3` | `BABYMONSTER_-_PSYCHO.mp3` | `BABYMONSTER%20-%20'PSYCHO'.mp3` |
| `สวัสดี World!.mp3` | `_World.mp3` | `%E0%B8%AA%E0%B8%A7%E0%B8%B1%E0%B8%AA%E0%B8%94%E0%B8%B5%20World!.mp3` |
| `Song "Title" (2024).mp3` | `Song_Title_2024.mp3` | `Song%20%22Title%22%20(2024).mp3` |

---

## ✅ Expected Behavior

### Video Download
```javascript
// Request
POST /api/download
{ "url": "...", "quality": "720", "format": "mp4" }

// Response Headers
Content-Type: video/mp4
Content-Disposition: attachment; filename="Video_Title_720.mp4"; filename*=UTF-8''Video%20Title%20720.mp4
Content-Length: 12345678
```

### Audio Download
```javascript
// Request
POST /api/download-audio
{ "url": "..." }

// Response Headers
Content-Type: audio/mpeg
Content-Disposition: attachment; filename="Audio_Title.mp3"; filename*=UTF-8''Audio%20Title.mp3
Content-Length: 5123456
```

---

## 🧪 Test Cases

### Test 1: Normal ASCII
```bash
curl -X POST http://localhost:3000/api/download-audio \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}' \
  --output test.mp3
```
Expected: ✅ Download successful

### Test 2: Special Characters
Video with title: `"Song 'Title' (2024)"`
Expected: ✅ Filename: `Song_Title_2024.mp3`

### Test 3: Unicode
Video with Thai title: `เพลงไทย`
Expected: ✅ Filename: `___.mp3` (safe) + UTF-8 encoding in header

---

## 🔍 Debug

### Check Server Logs
```
📥 Downloading audio: https://...
✅ Audio download complete
🗑️  Temp audio file deleted
```

### Check Response Headers (Browser DevTools)
```
Network → Response Headers → Content-Disposition
Should see: attachment; filename="..."; filename*=UTF-8''...
```

---

## 📚 Related Standards

- **RFC 2183**: Content-Disposition header
- **RFC 5987**: UTF-8 encoding in HTTP headers
- **RFC 6266**: Use of filename and filename* parameters

---

## ✅ ที่แก้แล้ว

- ✅ `encodeFilename()` function
- ✅ `createContentDisposition()` function
- ✅ Updated `/api/download` endpoint
- ✅ Updated `/api/download-audio` endpoint

---

## 🎯 Next Steps

1. **Restart Server**: `npm start`
2. **Test Download**: ลองดาวน์โหลด MP3 อีกครั้ง
3. **Verify**: ตรวจสอบว่าไฟล์ดาวน์โหลดสำเร็จ

---

**✅ แก้เรียบร้อยแล้ว! Restart server แล้วลองใหม่ได้เลย! 🎉**
