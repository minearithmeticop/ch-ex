# 🎬 ติดตั้ง ffmpeg สำหรับแปลง MP3

## ทำไมต้องมี ffmpeg?
- ✅ **แปลง M4A/WebM → MP3** ได้อัตโนมัติ
- ✅ **คุณภาพสูง**: 192kbps, 44.1kHz, Stereo
- ✅ **รวดเร็ว**: ใช้ hardware acceleration
- ✅ **มาตรฐานอุตสาหกรรม**: ใช้ทั่วโลก

---

## 🪟 Windows Installation

### **Method 1: Chocolatey (แนะนำ - ง่ายสุด)**

#### 1. เปิด PowerShell แบบ Administrator
```powershell
# คลิกขวา Start Menu → Windows PowerShell (Admin)
```

#### 2. ติดตั้ง Chocolatey (ถ้ายังไม่มี)
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

#### 3. ติดตั้ง ffmpeg
```powershell
choco install ffmpeg -y
```

#### 4. เช็คว่าติดตั้งสำเร็จ
```powershell
ffmpeg -version
```

**ผลลัพธ์ควรเห็น:**
```
ffmpeg version 7.x.x
built with gcc 14.2.0
```

✅ **เสร็จแล้ว!**

---

### **Method 2: Manual Installation**

#### 1. ดาวน์โหลด ffmpeg
- ไปที่: https://github.com/BtbN/FFmpeg-Builds/releases
- ดาวน์โหลด: `ffmpeg-master-latest-win64-gpl.zip`

#### 2. แตกไฟล์
```
C:\ffmpeg\
  └── bin\
      ├── ffmpeg.exe
      ├── ffplay.exe
      └── ffprobe.exe
```

#### 3. เพิ่มใน PATH
1. กด `Win + R` → พิมพ์ `sysdm.cpl` → Enter
2. Tab **Advanced** → **Environment Variables**
3. ใน **System variables** → เลือก `Path` → **Edit**
4. **New** → เพิ่ม: `C:\ffmpeg\bin`
5. **OK** ทุกหน้าต่าง

#### 4. เปิด Terminal ใหม่ แล้วเช็ค
```bash
ffmpeg -version
```

✅ **เสร็จแล้ว!**

---

### **Method 3: Scoop (สำหรับ Developer)**

```powershell
# ติดตั้ง Scoop
iwr -useb get.scoop.sh | iex

# ติดตั้ง ffmpeg
scoop install ffmpeg
```

---

## 🍎 macOS Installation

```bash
# ใช้ Homebrew
brew install ffmpeg
```

---

## 🐧 Linux Installation

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install ffmpeg -y

# Fedora
sudo dnf install ffmpeg -y

# Arch Linux
sudo pacman -S ffmpeg
```

---

## ✅ ทดสอบว่าติดตั้งสำเร็จ

### 1. เช็ค Version
```bash
ffmpeg -version
```

### 2. ทดสอบแปลงไฟล์
```bash
# ดาวน์โหลด sample audio
curl -o test.m4a "https://download.samplelib.com/m4a/sample-3s.m4a"

# แปลงเป็น MP3
ffmpeg -i test.m4a -ar 44100 -ac 2 -b:a 192k test.mp3

# เช็คว่าได้ MP3
ls -lh test.mp3
```

ถ้าเห็นไฟล์ `test.mp3` → **ติดตั้งสำเร็จ!** ✅

---

## 🚀 หลังติดตั้ง ffmpeg

### 1. Restart Terminal
ปิดและเปิด Terminal ใหม่เพื่อให้รู้จัก `ffmpeg` command

### 2. Restart Server
```bash
cd server-for-youtube-downloader
npm start
```

### 3. ทดสอบดาวน์โหลด Audio
- เปิด YouTube video
- คลิก Extension
- กด "🎵 Download Audio (MP3)"
- **ตอนนี้ต้องได้ไฟล์ .mp3 จริงๆ!** ✅

---

## 🔍 ตรวจสอบ Server Logs

หลังติดตั้ง ffmpeg ควรเห็น logs แบบนี้:

```bash
📥 Downloading and converting to MP3...
[ffmpeg] Destination: BABYMONSTER - 'PSYCHO' (Official Audio).mp3
[ffmpeg] Post-processing audio...
✅ Audio download complete
📁 MP3 file ready: BABYMONSTER - 'PSYCHO' (Official Audio).mp3
```

---

## 📊 เปรียบเทียบคุณภาพ

| Format | Bitrate | Size (3 min) | Quality |
|--------|---------|--------------|---------|
| **MP3** | 192kbps | ~4.3 MB | ⭐⭐⭐⭐⭐ Excellent |
| M4A | ~128kbps | ~2.9 MB | ⭐⭐⭐⭐ Very Good |
| WebM | ~128kbps | ~2.9 MB | ⭐⭐⭐⭐ Very Good |
| Opus | ~128kbps | ~2.9 MB | ⭐⭐⭐⭐ Very Good |

**MP3 192kbps** = คุณภาพสูงสุด + รองรับทุกอุปกรณ์ 🎵

---

## 🐛 Troubleshooting

### ปัญหา: `ffmpeg: command not found`
**แก้ไข:**
1. ติดตั้งใหม่ตาม Method 1
2. ปิด Terminal แล้วเปิดใหม่
3. ลอง: `where ffmpeg` (Windows) หรือ `which ffmpeg` (macOS/Linux)

### ปัญหา: `'choco' is not recognized`
**แก้ไข:**
- ติดตั้ง Chocolatey ก่อน (ดู Method 1 ข้อ 2)
- หรือใช้ Method 2 (Manual) แทน

### ปัญหา: Server ยัง error
**แก้ไข:**
1. Restart Terminal
2. Restart Server: `npm start`
3. ลอง download audio ใหม่

---

## 💡 Tips

### 1. เช็คว่า ffmpeg ทำงาน
```bash
ffmpeg -encoders | grep mp3
```

### 2. ดู ffmpeg Logs
Server จะแสดง ffmpeg progress:
```
[ffmpeg] Destination: song.mp3
[ffmpeg] Post-processing: Correcting container
[ffmpeg] Post-processing audio...
[ffmpeg] Deleting original file...
```

### 3. ปรับคุณภาพ MP3
แก้ใน `server.js`:
```javascript
postprocessorArgs: [
  '-ar', '48000',    // 48kHz (สูงกว่า)
  '-ac', '2',        // Stereo
  '-b:a', '320k'     // 320kbps (สูงสุด!)
]
```

---

## ✅ สรุป

| ขั้นตอน | คำสั่ง |
|---------|--------|
| 1. ติดตั้ง Chocolatey | `iex ((New-Object...).DownloadString(...))` |
| 2. ติดตั้ง ffmpeg | `choco install ffmpeg -y` |
| 3. เช็ค | `ffmpeg -version` |
| 4. Restart | ปิด/เปิด Terminal ใหม่ |
| 5. Test | Download audio จาก Extension |

---

**📥 ติดตั้ง ffmpeg แล้วจะได้ MP3 คุณภาพสูง 192kbps! 🎵✅**

**คำสั่งเดียว (PowerShell Admin):**
```powershell
choco install ffmpeg -y
```

**แล้วก็ `npm start` ใหม่! 🚀**
