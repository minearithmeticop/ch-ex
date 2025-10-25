document.addEventListener('DOMContentLoaded', function() {
  const downloadBtn = document.getElementById('downloadBtn');
  const videoUrlInput = document.getElementById('videoUrl');
  const statusDiv = document.getElementById('status');

  // ตรวจสอบว่าอยู่ในหน้า TikTok หรือไม่
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentUrl = tabs[0].url;
    if (currentUrl && currentUrl.includes('tiktok.com')) {
      videoUrlInput.value = currentUrl;
    }
  });

  downloadBtn.addEventListener('click', async function() {
    const url = videoUrlInput.value.trim();
    
    if (!url) {
      showStatus('กรุณาใส่ URL ของวิดีโอ TikTok', 'error');
      return;
    }

    if (!url.includes('tiktok.com')) {
      showStatus('URL ไม่ถูกต้อง กรุณาใช้ URL จาก TikTok', 'error');
      return;
    }

    downloadBtn.disabled = true;
    showStatus('กำลังประมวลผล...', 'info');

    try {
      // วิธีที่ 1: ใช้ API แบบ Proxy
      const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('ไม่สามารถเชื่อมต่อ API ได้');
      }

      const data = await response.json();
      
      if (data.code === 0 && data.data) {
        const videoData = data.data;
        let downloadUrl = null;
        
        // หา URL ที่ไม่มีลายน้ำ
        if (videoData.hdplay) {
          downloadUrl = videoData.hdplay;
        } else if (videoData.play) {
          downloadUrl = videoData.play;
        } else if (videoData.wmplay) {
          downloadUrl = videoData.wmplay;
        }

        if (downloadUrl) {
          showStatus('เริ่มดาวน์โหลด...', 'info');
          
          // สร้างชื่อไฟล์
          const videoTitle = videoData.title || 'tiktok_video';
          const safeTitle = videoTitle.substring(0, 50).replace(/[^a-z0-9ก-๙]/gi, '_');
          const filename = `${safeTitle}_${Date.now()}.mp4`;
          
          // ดาวน์โหลดโดยตรง
          chrome.downloads.download({
            url: downloadUrl,
            filename: filename,
            saveAs: true
          }, function(downloadId) {
            if (chrome.runtime.lastError) {
              showStatus('เกิดข้อผิดพลาด: ' + chrome.runtime.lastError.message, 'error');
              downloadBtn.disabled = false;
            } else if (downloadId) {
              showStatus('เริ่มดาวน์โหลดเรียบร้อย! 🎉', 'success');
              setTimeout(() => {
                downloadBtn.disabled = false;
              }, 2000);
            } else {
              showStatus('ไม่สามารถดาวน์โหลดได้', 'error');
              downloadBtn.disabled = false;
            }
          });
        } else {
          throw new Error('ไม่พบ URL สำหรับดาวน์โหลด');
        }
      } else {
        throw new Error(data.msg || 'ไม่สามารถดึงข้อมูลวิดีโอได้');
      }
    } catch (error) {
      console.error('Error:', error);
      showStatus('กำลังลองวิธีอื่น...', 'info');
      
      // ทางเลือกสำรอง: ใช้ API อื่น
      tryAlternativeAPI(url);
    }
  });

  async function tryAlternativeAPI(url) {
    try {
      // วิธีที่ 2: ใช้ API อื่น
      const apiUrl = `https://tikdownloader.io/api/ajaxSearch`;
      
      const formData = new FormData();
      formData.append('q', url);
      formData.append('lang', 'th');
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.status === 'ok' && data.data) {
        // Parse HTML response เพื่อหา download link
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.data, 'text/html');
        const downloadLink = doc.querySelector('a[href*=".mp4"]');
        
        if (downloadLink) {
          const downloadUrl = downloadLink.href;
          showStatus('พบลิงก์ดาวน์โหลด! กำลังดาวน์โหลด...', 'info');
          
          chrome.downloads.download({
            url: downloadUrl,
            filename: `tiktok_${Date.now()}.mp4`,
            saveAs: true
          }, function(downloadId) {
            if (downloadId) {
              showStatus('เริ่มดาวน์โหลดเรียบร้อย! 🎉', 'success');
            } else {
              showAlternativeMethod(url);
            }
            downloadBtn.disabled = false;
          });
          return;
        }
      }
      
      throw new Error('API ทางเลือกใช้งานไม่ได้');
    } catch (error) {
      console.error('Alternative API Error:', error);
      showAlternativeMethod(url);
      downloadBtn.disabled = false;
    }
  }

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = 'status ' + type;
  }

  function showAlternativeMethod(url) {
    downloadBtn.disabled = false;
    // แสดงวิธีทางเลือก
    statusDiv.innerHTML = `
      <strong>วิธีทางเลือก:</strong><br>
      1. คัดลอก URL แล้วไปที่ <a href="https://snaptik.app" target="_blank" style="color: white; text-decoration: underline;">SnaptikApp</a><br>
      2. หรือ <a href="https://tikmate.app" target="_blank" style="color: white; text-decoration: underline;">TikMate</a><br>
      3. หรือ <a href="https://ssstik.io" target="_blank" style="color: white; text-decoration: underline;">SSSTik</a>
    `;
    statusDiv.className = 'status info';
  }
});
