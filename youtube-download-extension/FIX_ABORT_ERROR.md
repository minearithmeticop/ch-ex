# 🔧 Fix - "signal is aborted without reason" Error

## ❌ ปัญหา
```
Server offline: signal is aborted without reason
```

**สาเหตุ**: 
- `AbortController` timeout ใน Extension ตั้งไว้แค่ **3 วินาที**
- Server ตอบช้ากว่านั้น (โดยเฉพาะครั้งแรกที่เปิด)
- yt-dlp ต้องใช้เวลาในการเริ่มต้น
- Timeout → AbortController.abort() → "signal is aborted"

---

## ✅ การแก้ไข

### 1. เพิ่ม Timeout Duration

| Endpoint | เดิม | ใหม่ | เหตุผล |
|----------|------|------|--------|
| `/api/health` | 3s | **10s** | Server อาจเริ่มช้า |
| `/api/video-info` | ไม่มี | **30s** | yt-dlp ต้องดึงข้อมูล |
| `/api/download` | ไม่มี | (ใช้เวลานาน OK) | |

### 2. เพิ่ม Retry Logic

**Health Check**: ลอง **2 ครั้ง** ถ้าครั้งแรกไม่สำเร็จ

```javascript
async function checkServerStatus(retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Try to connect...
    } catch (error) {
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Retry...
      }
    }
  }
}
```

**Timeline:**
```
Attempt 1: 0s → 10s (timeout) → Failed
Wait: 1s
Attempt 2: 11s → 21s (timeout) → Success/Failed
Total: Max 21 seconds
```

### 3. Better Error Messages

**เดิม:**
```
❌ Server offline: signal is aborted without reason
```

**ใหม่:**
```
🔍 Checking server... (attempt 1/2)
❌ Server check failed (attempt 1): Timeout (server took too long to respond)
⏳ Retrying in 1 second...
🔍 Checking server... (attempt 2/2)
✅ Server online: {status: "ok", ...}
```

---

## 🎯 Expected Behavior

### Scenario 1: Server Online (Fast)
```
Time: 0s
🔍 Checking server... (attempt 1/2)
Time: 0.5s
✅ Server online: {status: "ok", ytdlp: "2025.09.26"}
→ Show video info
```

### Scenario 2: Server Starting (Slow)
```
Time: 0s
🔍 Checking server... (attempt 1/2)
Time: 10s (timeout)
❌ Server check failed (attempt 1): Timeout
⏳ Retrying in 1 second...
Time: 11s
🔍 Checking server... (attempt 2/2)
Time: 12s
✅ Server online: {status: "ok", ytdlp: "2025.09.26"}
→ Show video info
```

### Scenario 3: Server Offline
```
Time: 0s
🔍 Checking server... (attempt 1/2)
Time: 10s (timeout)
❌ Server check failed (attempt 1): Timeout
⏳ Retrying in 1 second...
Time: 11s
🔍 Checking server... (attempt 2/2)
Time: 21s (timeout)
❌ Server check failed (attempt 2): Timeout
→ Show "ไม่สามารถเชื่อมต่อ Server" message
```

---

## 🔍 Error Types

| Error | Meaning | Solution |
|-------|---------|----------|
| `AbortError` | Timeout | เพิ่ม timeout หรือ restart server |
| `TypeError: Failed to fetch` | Server ไม่เปิด | เปิด server ด้วย `npm start` |
| `NetworkError` | Firewall/Network | ตรวจสอบ firewall |
| `Status 500` | Server error | ดู server logs |

---

## 📊 Timeout Summary

| Operation | Timeout | Retries | Max Time |
|-----------|---------|---------|----------|
| **Health Check** | 10s | 2 | 21s |
| **Video Info** | 30s | 1 | 30s |
| **Download** | None | 1 | Unlimited |

---

## 🚀 การใช้งาน

### 1. Reload Extension
```
chrome://extensions → หา YouTube Downloader → Reload
```

### 2. ทดสอบ

#### Test 1: Server Online
1. เปิด server: `npm start`
2. รอจนเห็น "Server running..."
3. เปิด YouTube video
4. คลิก Extension
5. ควรเห็นข้อมูลวิดีโอภายใน 2-3 วินาที ✅

#### Test 2: Server Starting (Slow)
1. ปิด server (Ctrl+C)
2. เปิด YouTube video
3. คลิก Extension
4. เปิด server: `npm start` (ทันที!)
5. Extension จะลองใหม่และเชื่อมต่อได้ ✅

#### Test 3: Server Offline
1. ปิด server (Ctrl+C)
2. เปิด YouTube video
3. คลิก Extension
4. จะเห็นข้อความ "ไม่สามารถเชื่อมต่อ Server" พร้อมวิธีแก้ ✅

---

## 💡 Tips

### 1. เช็ค Console Logs
เปิด Console (คลิกขวา Extension → Inspect) ดู logs:

```javascript
// Good
🔍 Checking server... (attempt 1/2)
✅ Server online: {status: "ok", ...}

// Slow but OK
🔍 Checking server... (attempt 1/2)
❌ Server check failed (attempt 1): Timeout
⏳ Retrying in 1 second...
🔍 Checking server... (attempt 2/2)
✅ Server online: {status: "ok", ...}

// Really offline
🔍 Checking server... (attempt 1/2)
❌ Server check failed (attempt 1): Timeout
⏳ Retrying in 1 second...
🔍 Checking server... (attempt 2/2)
❌ Server check failed (attempt 2): Timeout
```

### 2. Start Server First
แนะนำให้เปิด server ก่อนใช้ Extension:
```bash
cd server-for-youtube-downloader
npm start
# รอจนเห็น "Server running..."
# แล้วค่อยใช้ Extension
```

### 3. Keep Server Running
ใช้ PM2 เพื่อให้ server รันตลอดเวลา:
```bash
npm install -g pm2
pm2 start server.js --name youtube-server
pm2 startup
pm2 save
```

---

## 🐛 Debugging

### ถ้ายังเจอ Timeout:

1. **เช็คว่า server รันจริง**:
```bash
curl http://localhost:3000/api/health
```

2. **เช็ค server logs**:
ดู Terminal ที่รัน `npm start` มี error ไหม?

3. **เช็คว่า port 3000 ถูกใช้**:
```bash
# Windows
netstat -ano | findstr :3000

# macOS/Linux
lsof -i:3000
```

4. **ลอง request ด้วย browser**:
เปิด: http://localhost:3000/api/health
ถ้าเห็น JSON → server ทำงาน

5. **ตรวจสอบ Firewall**:
อาจบล็อค localhost:3000

---

## 📝 Changes Made

| File | Changes |
|------|---------|
| `popup.js` | ✅ เพิ่ม timeout 10s สำหรับ health check |
| | ✅ เพิ่ม retry logic (2 attempts) |
| | ✅ เพิ่ม timeout 30s สำหรับ video-info |
| | ✅ Better error messages |
| `FIX_ABORT_ERROR.md` | ✅ เอกสารนี้ |

---

## ✅ Expected Results

หลัง reload Extension:
- ✅ ไม่มี "signal is aborted" error
- ✅ รอ server นานขึ้น (10s แทน 3s)
- ✅ Retry อัตโนมัติ (2 ครั้ง)
- ✅ Error message ชัดเจนกว่า
- ✅ ทำงานได้แม้ server start ช้า

---

## 🎯 Performance

| Scenario | Time | User Experience |
|----------|------|-----------------|
| Server online (fast) | 0.5s | ⚡ Instant |
| Server online (slow) | 5-10s | 🕐 Acceptable |
| Server starting | 10-15s | 🔄 Retry → Success |
| Server offline | 21s | ❌ Clear error message |

---

**✅ Reload Extension แล้วทดสอบได้เลย! 🚀**

**Pro Tip**: เปิด server ก่อนใช้ Extension จะได้ไม่ต้องรอ! 😊
