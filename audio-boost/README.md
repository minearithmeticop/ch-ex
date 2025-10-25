# Audio Booster Pro - Chrome Extension

Extension สำหรับเพิ่มความดังของเสียงเกิน 100% พร้อม Equalizer และ Bass Boost 🔊

## ✨ ฟีเจอร์หลัก

- 🔊 **Volume Boost** - เพิ่มเสียงได้ถึง 500% (5 เท่า)
- 🎵 **Bass Boost** - เพิ่มเสียงเบสได้ถึง 20 dB
- ⚙️ **5-Band Equalizer** - ปรับแต่งความถี่ 60Hz, 250Hz, 1kHz, 4kHz, 16kHz
- 🎼 **EQ Presets** - มี 6 presets: Flat, Rock, Pop, Jazz, Classical, Bass Boost
- 💾 **Auto Save** - บันทึกการตั้งค่าอัตโนมัติ
- 🌐 **Universal** - ทำงานกับทุกเว็บไซต์ (YouTube, Netflix, Spotify, etc.)

## 📋 วิธีติดตั้ง

1. ดาวน์โหลดไฟล์ทั้งหมดในโฟลเดอร์นี้
2. เปิด Chrome และไปที่ `chrome://extensions/`
3. เปิด "Developer mode" ที่มุมขวาบน
4. คลิก "Load unpacked"
5. เลือกโฟลเดอร์ `audio-boost`
6. Extension พร้อมใช้งาน! 🎉

## 🎮 วิธีใช้งาน

### เพิ่มเสียง
1. เปิดวิดีโอหรือเพลงที่ต้องการ
2. คลิกไอคอน Extension 🔊
3. เลื่อน "ระดับเสียง" ขึ้นเกิน 100%
4. คลิก "✓ นำไปใช้"
5. เสียงจะดังขึ้นทันที!

### ปรับ Bass
1. เลื่อน "Bass Boost" เพื่อเพิ่มเสียงเบส
2. แนะนำ 8-12 dB สำหรับเสียงเบสที่ลึกและทรงพลัง

### ใช้ Equalizer
1. เลื่อนแท่ง EQ แต่ละช่วงความถี่
2. หรือเลือก Preset ที่ต้องการ:
   - **Rock** - เน้นเบสและ treble
   - **Pop** - เน้น mid และ high
   - **Jazz** - สมดุล เน้น low และ high
   - **Classical** - เน้นรายละเอียด
   - **Bass Boost** - เน้นเบสสูงสุด

### Presets แนะนำ

| Preset | ใช้กับ | 60Hz | 250Hz | 1kHz | 4kHz | 16kHz |
|--------|--------|------|-------|------|------|-------|
| **Rock** | Rock, Metal | +4 | +2 | -1 | -2 | +3 |
| **Pop** | Pop, Dance | -1 | +2 | +4 | +3 | -1 |
| **Jazz** | Jazz, Blues | +3 | +1 | -1 | +1 | +3 |
| **Classical** | Classical, Orchestra | +3 | +2 | -1 | +2 | +4 |
| **Bass Boost** | Hip Hop, EDM | +8 | +6 | 0 | -2 | -2 |

## 🎯 แนะนำการใช้งาน

### สำหรับวิดีโอที่เสียงเบาเกินไป
- ตั้งเสียงที่ 150-250%
- Bass Boost: 3-5 dB
- EQ: Pop preset

### สำหรับดนตรี
- ตั้งเสียงที่ 100-150%
- Bass Boost: 6-10 dB
- EQ: เลือก preset ตามแนวเพลง

### สำหรับ Podcast/การสนทนา
- ตั้งเสียงที่ 150-200%
- Bass Boost: 0-2 dB
- EQ: เพิ่ม 1kHz และ 4kHz เล็กน้อย

## ⚠️ คำเตือน

- **ระวังการตั้งเสียงสูงเกินไป** - อาจทำให้เสียงแตก หรือทำร้ายหูของคุณ
- **แนะนำใช้ไม่เกิน 300%** สำหรับการฟังปกติ
- **ปิด Bass Boost** ถ้าเสียงแตกหรือบูม

## 🔧 เทคโนโลยีที่ใช้

- **Web Audio API** - ประมวลผลเสียงแบบ real-time
- **GainNode** - ควบคุมระดับเสียง
- **BiquadFilterNode** - สร้าง Bass Boost และ EQ
- **MediaElementSource** - เชื่อมต่อกับ audio/video elements

## 🌟 ทำงานกับเว็บไซต์

✅ YouTube  
✅ Netflix  
✅ Spotify Web Player  
✅ Twitch  
✅ SoundCloud  
✅ Facebook Video  
✅ Twitter Video  
✅ และเว็บไซต์อื่นๆ ที่มีวิดีโอ/เสียง

## 🐛 แก้ปัญหา

### เสียงไม่ดังขึ้นเมื่อเปิดแท็บใหม่
1. **รีเฟรชหน้าเว็บ** (F5) - Extension จะทำงานอัตโนมัติ
2. **เล่นวิดีโอ/เพลง** - Extension จะ activate เมื่อมี media element
3. **คลิกไอคอน Extension** แล้วคลิก "✓ นำไปใช้" อีกครั้ง
4. **รอ 1-2 วินาที** หลังโหลดหน้าเว็บ - Extension ต้องเวลาในการ initialize

### เสียงไม่ดังขึ้นเลย
1. ตรวจสอบว่า **"เปิดใช้งาน Audio Boost"** เปิดอยู่ (toggle สีเขียว)
2. ลองตั้งเสียงสูงกว่า 100% (เช่น 200%)
3. เล่นวิดีโอ/เพลง - คลิกปุ่ม Play
4. เปิด Console (F12) และดู log ที่ขึ้นต้นด้วย 🔊
5. ใน Console ถ้าเห็น "Audio Booster: Initialized" แสดงว่าทำงาน

### Extension ทำงานแต่เสียงแตก
1. **ลดระดับเสียง** - ลองใช้ 150-250% แทน 500%
2. **ลด Bass Boost** - ลดเหลือ 5-8 dB
3. **ลด EQ** - ตั้งค่า EQ ต่ำกว่า +6 dB
4. **ใช้ Preset Flat** - กดปุ่ม "Flat" เพื่อรีเซ็ต EQ

### Extension ไม่ทำงานเลย
1. **รีโหลด Extension**:
   - ไปที่ `chrome://extensions/`
   - คลิกปุ่มรีโหลด (🔄) ที่ Audio Booster Pro
   - รีเฟรชแท็บทั้งหมด
2. **ตรวจสอบการติดตั้ง**:
   - ตรวจสอบว่า Developer mode เปิดอยู่
   - ตรวจสอบว่าไม่มี error ใน extension
3. **ดู Console logs**:
   - เปิด DevTools (F12) ในแท็บที่ต้องการใช้
   - ดู Console ควรเห็นข้อความ "🔊 Audio Booster Pro: Initialized"
   - ถ้าไม่เห็น ให้รีเฟรชหน้าเว็บ

### Extension ไม่ทำงานกับเว็บไซต์บางเว็บ
- **Chrome Web Store, Chrome Settings** - ไม่สามารถใช้ได้ (ข้อจำกัดของ Chrome)
- **บางเว็บที่มี Content Security Policy** - อาจบล็อก Extension
- **วิธีแก้**: ลองเปิดวิดีโอในแท็บใหม่หรือดาวน์โหลดดู

### Debug Mode
เปิด Console (F12) แล้วดูข้อความเหล่านี้:
- ✅ `🔊 Audio Booster Pro: Initialized` - Extension โหลดสำเร็จ
- ✅ `🔊 Audio Booster: Injected script ready` - พร้อมใช้งาน
- ✅ `🔊 Audio Booster: Processing media element` - กำลังประมวลผลเสียง
- ✅ `🔊 Audio Booster: Applying saved settings` - กำลัง apply การตั้งค่า

ถ้าไม่เห็นข้อความเหล่านี้ แสดงว่า Extension ไม่ได้โหลด - ให้รีเฟรชหน้าเว็บ

## 📝 หมายเหตุ

- การตั้งค่าจะถูกบันทึกอัตโนมัติสำหรับแต่ละแท็บ
- Extension ใช้ RAM น้อยมาก (~10-20 MB)
- ไม่มีการเก็บข้อมูลส่วนตัว

## 🎓 สำหรับนักพัฒนา

Extension นี้ใช้:
- Manifest V3
- Web Audio API
- Content Scripts + Injected Scripts
- Chrome Storage API
- MutationObserver สำหรับ dynamic content

## 📄 License

สร้างเพื่อการศึกษาและใช้งานส่วนบุคคล

---

**สนุกกับเสียงที่ดังและคุณภาพดีขึ้น! 🎵🔊**
