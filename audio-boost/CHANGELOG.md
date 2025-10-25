# Changelog - Audio Booster Pro

## Version 1.0.1 (2025-10-13) - Bug Fixes 🐛

### แก้ไข
- ✅ แก้ปัญหา Extension ไม่ทำงานอัตโนมัติเมื่อเปิดแท็บใหม่
- ✅ เพิ่ม Ready Signal เพื่อให้แน่ใจว่า injected script โหลดเสร็จก่อน apply settings
- ✅ เพิ่ม Retry mechanism เมื่อ content script ยังไม่พร้อม
- ✅ เพิ่ม Auto-apply settings หลังโหลดหน้าเว็บ (พร้อม retry ที่ 0.5s, 1s, 3s)
- ✅ จัดการ Race Condition ระหว่าง script injection และ settings loading
- ✅ เพิ่ม Error handling สำหรับ media elements ที่ถูกเชื่อมต่อแล้ว
- ✅ เพิ่ม Console logging เพื่อ debug ง่ายขึ้น

### ปรับปรุง
- 🔧 เพิ่ม `resumeAudioContext()` เมื่อมี user interaction
- 🔧 เพิ่ม listener สำหรับ 'play' event เพื่อจับ media ที่โหลดแบบ lazy
- 🔧 ปรับปรุง MutationObserver ให้ตรวจจับ media elements ได้ดีขึ้น
- 🔧 เพิ่มการ process media หลาย ๆ รอบเพื่อจับ dynamic content
- 🔧 Background script ไม่ overwrite settings ที่มีอยู่แล้ว

### Technical Details

#### ปัญหาเดิม:
1. **Race Condition**: `injected.js` ยังโหลดไม่เสร็จแต่ `content.js` ส่ง settings ไปแล้ว
2. **No Ready Signal**: ไม่มีการยืนยันว่า injected script พร้อมใช้งาน
3. **No Retry**: ถ้าส่ง message ไม่สำเร็จจะไม่ลองใหม่
4. **Timing Issues**: Media elements โหลดหลัง Extension initialize

#### แก้ไขอย่างไร:
1. **เพิ่ม Ready Signal**: 
   - `injected.js` ส่ง `AUDIO_BOOST_READY` message เมื่อพร้อม
   - `content.js` รอรับ signal ก่อนส่ง settings

2. **Pending Settings Queue**:
   - เก็บ settings ไว้ใน `pendingSettings` ถ้า injected script ยังไม่พร้อม
   - ส่งทันทีเมื่อได้รับ ready signal

3. **Multi-retry Strategy**:
   - Process media ทันทีเมื่อโหลดหน้าเว็บ
   - Retry ที่ 0.5s, 1s, และ 3s หลังโหลด
   - Retry เมื่อมี user interaction (click, play)

4. **Better Error Handling**:
   - จับ `InvalidStateError` สำหรับ media ที่ถูกเชื่อมต่อแล้ว
   - Log errors แต่ไม่ throw เพื่อไม่ให้ Extension หยุดทำงาน

5. **Audio Context Resume**:
   - Resume audio context เมื่อมี user interaction
   - Reprocess media เมื่อ context กลับมาทำงาน

## Version 1.0 (2025-10-13) - Initial Release 🎉

### ฟีเจอร์
- 🔊 Volume Boost ถึง 500%
- 🎵 Bass Boost ถึง 20 dB
- ⚙️ 5-Band Equalizer (60Hz, 250Hz, 1kHz, 4kHz, 16kHz)
- 🎼 6 EQ Presets (Flat, Rock, Pop, Jazz, Classical, Bass Boost)
- 💾 Auto-save settings
- 🌐 ทำงานกับทุกเว็บไซต์
- 🎨 UI สวยงามพร้อม gradient design
- ⚡ Real-time audio processing
