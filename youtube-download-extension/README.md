# YouTube Video Downloader - Chrome Extension

Extension สำหรับดาวน์โหลดวิดีโอ YouTube ได้ทุกความชัด ไม่ต้องเปิดหน้าเว็บใหม่ 🎥

## ✨ ฟีเจอร์

- 🎬 **ดาวน์โหลดทุกความชัด** - 144p, 360p, 480p, 720p, 1080p, 4K
- 🎵 **ดาวน์โหลดเฉพาะเสียง** - แปลงเป็น MP3 ได้
- 🚀 **ใช้งานง่าย** - คลิกเลือกความชัด → ดาวน์โหลดเลย
- 📱 **ไม่ต้องเปิดหน้าใหม่** - ทำงานใน Extension ได้เลย
- 🎨 **UI สวยงาม** - ออกแบบแบบ YouTube สีแดง
- ⚡ **รวดเร็ว** - ใช้ API หลายตัวเพื่อความเสถียร

## 📋 วิธีติดตั้ง

1. ดาวน์โหลดไฟล์ทั้งหมดในโฟลเดอร์นี้
2. เปิด Chrome และไปที่ `chrome://extensions/`
3. เปิด "Developer mode" ที่มุมขวาบน
4. คลิก "Load unpacked"
5. เลือกโฟลเดอร์ `youtube-download-extension`
6. Extension พร้อมใช้งาน! 🎉

## 🎮 วิธีใช้งาน

### ดาวน์โหลดวิดีโอ
1. เปิดวิดีโอ YouTube ที่ต้องการดาวน์โหลด
2. คลิกไอคอน Extension ▶️
3. รอโหลดข้อมูลวิดีโอ (2-3 วินาที)
4. **เลือกความชัดที่ต้องการ**:
   - 🏆 **4K (2160p)** - คุณภาพสูงสุด
   - 💎 **Full HD (1080p)** - คุณภาพสูง
   - ⭐ **HD (720p)** - คุณภาพดี (แนะนำ)
   - 📺 **SD (480p)** - คุณภาพปกติ
   - 📱 **Low (360p)** - ประหยัดพื้นที่
   - 🔋 **Mini (144p)** - ไฟล์เล็กที่สุด
5. คลิกปุ่มความชัดที่ต้องการ
6. เลือกที่จะบันทึกไฟล์
7. เริ่มดาวน์โหลด! 🎊

### ดาวน์โหลดเฉพาะเสียง
1. เปิดวิดีโอ YouTube
2. คลิกไอคอน Extension
3. คลิกปุ่ม **"🎧 MP3 Audio"**
4. ดาวน์โหลดไฟล์เสียง .mp3

## 🎯 ความชัดที่แนะนำ

| ความชัด | ใช้เมื่อ | ขนาดไฟล์ (ประมาณ) |
|---------|----------|-------------------|
| **4K (2160p)** | จอใหญ่, TV 4K | 500-800 MB/10 min |
| **Full HD (1080p)** | คอมพิวเตอร์, แท็บเล็ต | 200-400 MB/10 min |
| **HD (720p)** | ดูทั่วไป (แนะนำ) | 100-200 MB/10 min |
| **SD (480p)** | มือถือ, ประหยัดพื้นที่ | 50-100 MB/10 min |
| **Low (360p)** | เน็ตช้า | 30-50 MB/10 min |
| **Mini (144p)** | ฟังอย่างเดียว | 10-20 MB/10 min |

## 🔧 เทคโนโลยีที่ใช้

### API Services
Extension ใช้หลาย API เพื่อความน่าเชื่อถือ:

1. **Cobalt API** (หลัก)
   - เร็วและเสถียร
   - รองรับหลายความชัด
   - API: `api.cobalt.tools`

2. **Y2Mate API** (สำรอง)
   - ยอดนิยม
   - รองรับทุกความชัด

3. **YouTube oEmbed API**
   - ดึงข้อมูลวิดีโอ (title, thumbnail)
   - ไม่ต้องใช้ API key

### Stack
- Chrome Extension Manifest V3
- Vanilla JavaScript (ไม่ใช้ framework)
- Fetch API สำหรับ HTTP requests
- Chrome Downloads API

## ⚠️ ข้อจำกัด

### ความเร็วดาวน์โหลด
- ขึ้นอยู่กับความเร็วเน็ตและ API server
- วิดีโอยาวหรือความชัดสูงอาจใช้เวลานาน

### API Limitations
- **Rate Limiting**: API อาจจำกัดจำนวนครั้งในการดาวน์โหลด
- **Video Availability**: บางวิดีโออาจดาวน์โหลดไม่ได้ (ถูกจำกัดสิทธิ์)
- **Live Streams**: ไม่สามารถดาวน์โหลด live stream ได้

### ความชัด 4K และ 1080p
- บางวิดีโออาจไม่มีความชัดนี้
- ต้องใช้ Premium API (บางครั้ง)

## 🐛 แก้ปัญหา

### ดาวน์โหลดไม่ได้
1. **ตรวจสอบว่าเป็นหน้า YouTube** - Extension ทำงานเฉพาะหน้า `youtube.com/watch`
2. **รีเฟรชหน้าเว็บ** - กด F5 แล้วลองใหม่
3. **ลองความชัดต่ำกว่า** - บางวิดีโอไม่มีความชัดสูง
4. **เช็ค Console** - เปิด DevTools (F12) ดู error

### โหลดข้อมูลนาน
1. **รอ 5-10 วินาที** - API อาจช้าในบางช่วงเวลา
2. **รีเฟรช Extension** - ปิดแล้วเปิดใหม่
3. **ลอง API สำรอง** - Extension จะลองหลาย API อัตโนมัติ

### ไฟล์ดาวน์โหลดเสีย
1. **ลองดาวน์โหลดใหม่**
2. **เปลี่ยนความชัด** - ลองความชัดอื่น
3. **ตรวจสอบพื้นที่ฮาร์ดดิสก์**

### Extension ไม่ทำงาน
1. **รีโหลด Extension**:
   ```
   chrome://extensions/ → คลิก 🔄 ที่ YouTube Downloader
   ```
2. **เช็ค permissions** - ตรวจสอบว่า Extension มีสิทธิ์เข้าถึง YouTube
3. **ลบแล้วติดตั้งใหม่**

## 📝 หมายเหตุสำคัญ

### เรื่องลิขสิทธิ์ ⚖️
- Extension นี้สร้างเพื่อการศึกษาและใช้งานส่วนบุคคล
- **กรุณาเคารพลิขสิทธิ์** ของเจ้าของวิดีโอ
- อย่านำวิดีโอที่ดาวน์โหลดไปแจกจ่ายหรือใช้เชิงพาณิชย์
- YouTube ToS ห้ามดาวน์โหลดวิดีโอ (นอกจาก YouTube Premium)

### ความปลอดภัย 🔒
- Extension ไม่เก็บข้อมูลส่วนบุคคล
- ไม่มีการส่งข้อมูลไปยัง server ของผู้พัฒนา
- ใช้ API สาธารณะที่น่าเชื่อถือ

### Google Chrome Web Store 🏪
- Extension นี้อาจไม่ผ่านการตรวจสอบของ Chrome Web Store
- ต้องติดตั้งแบบ "Load unpacked" (Developer mode)
- Google ไม่อนุญาตให้มี YouTube downloader บน Store

## 🎓 สำหรับนักพัฒนา

### Project Structure
```
youtube-download-extension/
├── manifest.json       # Extension configuration
├── popup.html         # UI
├── popup.js          # Main logic
├── content.js        # YouTube page scraper
├── background.js     # Service worker
└── README.md         # Documentation
```

### API Integration
```javascript
// Cobalt API example
fetch('https://api.cobalt.tools/api/json', {
  method: 'POST',
  body: JSON.stringify({
    url: videoUrl,
    vQuality: '1080',
    isAudioOnly: false
  })
})
```

### Development Tips
1. ใช้ `console.log()` ใน background.js ดูได้ที่ `chrome://extensions/`
2. ใช้ DevTools (F12) ดู error ใน popup
3. เทส API ใน Postman ก่อนเขียนโค้ด

## 🚀 Features ในอนาคต (TODO)

- [ ] เพิ่ม subtitle/caption download
- [ ] ดาวน์โหลดหลายวิดีโอพร้อมกัน (batch)
- [ ] เลือก format อื่นๆ (webm, mkv)
- [ ] ดาวน์โหลด playlist ทั้งหมด
- [ ] ประวัติการดาวน์โหลด
- [ ] ตั้งค่าความชัดเริ่มต้น
- [ ] Dark mode UI

## 📄 License

สร้างเพื่อการศึกษาและใช้งานส่วนบุคคล

---

**Happy Downloading! 🎬🎉**

พัฒนาด้วย ❤️ สำหรับผู้ใช้ YouTube
