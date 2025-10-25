# 📸 Extension Screenshots & Expected UI

## ✅ สิ่งที่คุณควรเห็น

### 1. เมื่อเปิด Extension บน YouTube

```
┌─────────────────────────────────────┐
│            ▶️                        │
│     YouTube Downloader               │
│  เลือกความชัด → ดาวน์โหลดได้เลย    │
├─────────────────────────────────────┤
│                                      │
│  [Video Thumbnail Image]             │
│                                      │
│  Rick Astley - Never Gonna Give...   │
│  Rick Astley                         │
│                                      │
├─────────────────────────────────────┤
│  🎥 คลิกเพื่อดาวน์โหลด              │
│                                      │
│  ┌─────────┐  ┌─────────┐           │
│  │  2160p  │  │  1440p  │           │
│  │   4K    │  │   2K    │           │
│  └─────────┘  └─────────┘           │
│                                      │
│  ┌─────────┐  ┌─────────┐           │
│  │  1080p  │  │  720p   │           │
│  │Full HD  │  │   HD    │           │
│  └─────────┘  └─────────┘           │
│                                      │
│  ┌─────────┐  ┌─────────┐           │
│  │  480p   │  │  360p   │           │
│  │   SD    │  │  Low    │           │
│  └─────────┘  └─────────┘           │
│                                      │
├─────────────────────────────────────┤
│  🎵 ดาวน์โหลดเฉพาะเสียง             │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ 🎧 MP3 Audio (เสียงอย่างเดียว)│ │
│  └────────────────────────────────┘ │
│                                      │
└─────────────────────────────────────┘
```

---

### 2. ถ้า Server ยังไม่เปิด

```
┌─────────────────────────────────────┐
│            ▶️                        │
│     YouTube Downloader               │
│  เลือกความชัด → ดาวน์โหลดได้เลย    │
├─────────────────────────────────────┤
│                                      │
│  ⚠️ Local Server ยังไม่เปิด         │
│                                      │
│  กรุณาเปิด Server ก่อน:             │
│  cd server-for-youtube-downloader    │
│  npm start                           │
│                                      │
│  Server URL: http://localhost:3000   │
│                                      │
└─────────────────────────────────────┘
```

---

### 3. ถ้าไม่ได้อยู่บนหน้า YouTube

```
┌─────────────────────────────────────┐
│            ▶️                        │
│     YouTube Downloader               │
│  เลือกความชัด → ดาวน์โหลดได้เลย    │
├─────────────────────────────────────┤
│                                      │
│            🎬                        │
│                                      │
│      กรุณาเปิดหน้า YouTube          │
│    (รองรับ Videos และ Shorts)       │
│   แล้วเล่นวิดีโอที่ต้องการดาวน์โหลด │
│                                      │
│        ┌───────────┐                 │
│        │ 🔄 รีเฟรช │                 │
│        └───────────┘                 │
│                                      │
└─────────────────────────────────────┘
```

---

### 4. ระหว่างดาวน์โหลด

```
┌─────────────────────────────────────┐
│            ▶️                        │
│     YouTube Downloader               │
│  เลือกความชัด → ดาวน์โหลดได้เลย    │
├─────────────────────────────────────┤
│                                      │
│         [Spinner Animation]          │
│                                      │
│     กำลังดาวน์โหลด 720p...          │
│                                      │
└─────────────────────────────────────┘
```

---

### 5. ดาวน์โหลดสำเร็จ

```
┌─────────────────────────────────────┐
│            ▶️                        │
│     YouTube Downloader               │
│  เลือกความชัด → ดาวน์โหลดได้เลย    │
├─────────────────────────────────────┤
│                                      │
│       ดาวน์โหลดสำเร็จ! 🎉           │
│                                      │
└─────────────────────────────────────┘
```

---

## 🎨 UI Colors

- **Background**: Red gradient (#FF0000 → #CC0000)
- **Text**: White
- **Buttons**: Semi-transparent white with white border
- **Hover**: Brighter white + shadow
- **Premium (4K/1080p)**: Gold gradient

---

## 📐 Dimensions

- **Popup Width**: 400px
- **Popup Min Height**: 300px
- **Button Height**: ~50px
- **Grid**: 2 columns
- **Gap**: 10px

---

## ✅ What You Should See

### When It Works:
1. ✅ Red gradient background
2. ✅ YouTube Downloader logo (▶️)
3. ✅ Video thumbnail (clear image)
4. ✅ Video title (2 lines max)
5. ✅ 6 quality buttons (2x3 grid)
6. ✅ 1 MP3 button (full width)
7. ✅ All text in Thai

### When You Click Download:
1. ✅ Buttons become disabled (semi-transparent)
2. ✅ Status shows "กำลังดาวน์โหลด..."
3. ✅ Chrome Downloads starts
4. ✅ Status shows "ดาวน์โหลดสำเร็จ!"
5. ✅ Buttons re-enabled after 2 seconds

---

## ❌ What You Should NOT See

- ❌ Blank white popup
- ❌ No buttons
- ❌ Error messages (unless server offline)
- ❌ Browser console errors
- ❌ Broken images

---

## 🔧 Debugging Steps

### Step 1: Open Extension
```
1. Go to any YouTube video
2. Click Extension icon
3. Wait 2 seconds
```

### Step 2: Check Console
```
1. Right-click Extension icon
2. Click "Inspect"
3. Go to Console tab
4. Look for errors
```

### Expected Console Output (Success):
```javascript
✅ Server online: {status: "ok", ytdlp: "2025.09.26"}
```

### Expected Console Output (Server Offline):
```javascript
❌ Server offline: Failed to fetch
```

---

## 📱 Responsive Design

Popup จะแสดง:
- ✅ Width: 400px (fixed)
- ✅ Height: Auto (depends on content)
- ✅ Min Height: 300px
- ✅ Max Height: Unlimited (scrollable if needed)

---

## 🎯 Testing Checklist

Test บน:
- [ ] YouTube Video (normal)
- [ ] YouTube Shorts
- [ ] Non-YouTube page (should show "กรุณาเปิดหน้า YouTube")
- [ ] With server offline (should show "Server ยังไม่เปิด")
- [ ] Download 360p (small, fast test)
- [ ] Download MP3

---

## 💡 Common Issues & Fixes

### Issue: Blank Popup
**Fix**: Reload Extension (chrome://extensions → Reload)

### Issue: No Buttons
**Fix**: Check Console for JS errors

### Issue: Can't Click Buttons
**Fix**: Make sure server is running

### Issue: Download Doesn't Start
**Fix**: Check Chrome Downloads settings (chrome://settings/downloads)

---

**📸 หากคุณเห็น UI ตามนี้ แสดงว่าทำงานถูกต้อง!**
