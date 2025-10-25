// Popup controller - Local Server Version
let currentVideoId = null;
let currentVideoUrl = null;
let videoData = null;

// Local server configuration
const SERVER_URL = 'http://localhost:3000';
let serverStatus = 'checking';

const elements = {
  status: document.getElementById('status'),
  statusText: document.getElementById('statusText'),
  notYoutube: document.getElementById('notYoutube'),
  videoInfo: document.getElementById('videoInfo'),
  qualitySection: document.getElementById('qualitySection'),
  thumbnail: document.getElementById('thumbnail'),
  videoTitle: document.getElementById('videoTitle'),
  videoDuration: document.getElementById('videoDuration'),
  qualityGrid: document.getElementById('qualityGrid'),
  audioBtn: document.getElementById('audioBtn'),
  refreshBtn: document.getElementById('refreshBtn')
};

// Initialize
document.addEventListener('DOMContentLoaded', async function() {
  try {
    // Check server status first
    showLoading('กำลังเชื่อมต่อ Local Server...');
    const isServerOnline = await checkServerStatus();

    if (!isServerOnline) {
      showServerOffline();
      return;
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // รองรับทั้ง /watch และ /shorts
    if (!tab.url || !(tab.url.includes('youtube.com/watch') || tab.url.includes('youtube.com/shorts'))) {
      showNotYouTube();
      return;
    }

    currentVideoUrl = tab.url;
    currentVideoId = extractVideoId(tab.url);

    if (!currentVideoId) {
      showError('ไม่พบ Video ID');
      return;
    }

    showLoading('กำลังโหลดข้อมูลวิดีโอ...');
    await loadVideoInfo();

  } catch (error) {
    console.error('Initialization error:', error);
    showError('เกิดข้อผิดพลาด: ' + error.message);
  }
});

// Check if local server is running (with retry)
async function checkServerStatus(retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔍 Checking server... (attempt ${attempt}/${retries})`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds

      const response = await fetch(`${SERVER_URL}/api/health`, {
        signal: controller.signal,
        cache: 'no-cache'
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        serverStatus = 'online';
        console.log('✅ Server online:', data);
        return true;
      }
      
      // Server responded but not OK
      console.warn(`⚠️ Server responded with status: ${response.status}`);
      
    } catch (error) {
      const errorMsg = error.name === 'AbortError' 
        ? 'Timeout (server took too long to respond)'
        : error.message;
      
      console.error(`❌ Server check failed (attempt ${attempt}):`, errorMsg);
      
      // Wait before retry (except on last attempt)
      if (attempt < retries) {
        console.log('⏳ Retrying in 1 second...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  // All attempts failed
  serverStatus = 'offline';
  return false;
}

// Extract YouTube Video ID (รองรับ Shorts ด้วย)
function extractVideoId(url) {
  const patterns = [
    /[?&]v=([^&]+)/,                    // youtube.com/watch?v=ID
    /youtu\.be\/([^?]+)/,               // youtu.be/ID
    /embed\/([^?]+)/,                   // youtube.com/embed/ID
    /shorts\/([^?]+)/                   // youtube.com/shorts/ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Load video information from local server
async function loadVideoInfo() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds for video info

    const response = await fetch(`${SERVER_URL}/api/video-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: currentVideoUrl
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'ไม่สามารถโหลดข้อมูลวิดีโอได้');
    }

    const data = await response.json();
    
    if (!data || !data.title) {
      throw new Error('ข้อมูลวิดีโอไม่ครบถ้วน');
    }

    videoData = data;
    displayVideoInfo(data);

  } catch (error) {
    console.error('Load video info error:', error);
    
    if (error.name === 'AbortError') {
      showError('⏱️ Timeout: Server ใช้เวลานานเกินไป กรุณาลองใหม่');
    } else {
      showError(error.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
  }
}

// Display video information
function displayVideoInfo(data) {
  elements.thumbnail.src = data.thumbnail;
  elements.thumbnail.alt = data.title;
  elements.videoTitle.textContent = data.title;
  elements.videoDuration.textContent = data.channel || 'YouTube';

  // Generate quality buttons from server response
  elements.qualityGrid.innerHTML = '';
  
  if (data.formats && data.formats.length > 0) {
    data.formats.forEach(format => {
      const button = createQualityButton(format.quality, format);
      elements.qualityGrid.appendChild(button);
    });
  } else {
    // Fallback: generate standard quality options
    const standardQualities = ['2160p', '1440p', '1080p', '720p', '480p', '360p'];
    const isShorts = currentVideoUrl.includes('/shorts/');
    const maxQuality = isShorts ? '720p' : '2160p';
    const maxQualityIndex = standardQualities.indexOf(maxQuality);
    
    const availableQualities = standardQualities.slice(maxQualityIndex);
    
    availableQualities.forEach(quality => {
      const button = createQualityButton(quality);
      elements.qualityGrid.appendChild(button);
    });
  }

  // Show video info section
  elements.status.classList.add('hidden');
  elements.videoInfo.classList.remove('hidden');
  elements.qualitySection.classList.remove('hidden');
}

// Create quality button
function createQualityButton(quality, formatData = null) {
  const button = document.createElement('button');
  button.className = 'quality-btn';
  button.innerHTML = `
    <div class="quality-label">${quality}</div>
    ${formatData && formatData.fps ? `<div class="quality-fps">${formatData.fps}fps</div>` : ''}
  `;
  
  button.addEventListener('click', () => {
    downloadVideo(quality, formatData);
  });

  return button;
}

// Download video from local server
async function downloadVideo(quality, formatData = null) {
  try {
    // Disable all buttons
    document.querySelectorAll('.quality-btn, .audio-btn').forEach(btn => {
      btn.disabled = true;
    });

    showLoading(`กำลังดาวน์โหลด ${quality}...`);

    const response = await fetch(`${SERVER_URL}/api/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: currentVideoUrl,
        quality: quality.replace('p', ''), // Remove 'p' (720p → 720)
        format: 'mp4'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'ดาวน์โหลดไม่สำเร็จ');
    }

    // Get blob from response
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = `video_${quality}.mp4`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Trigger download
    await chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    });

    showSuccess('ดาวน์โหลดสำเร็จ!');

    // Re-enable buttons after 2 seconds
    setTimeout(() => {
      document.querySelectorAll('.quality-btn, .audio-btn').forEach(btn => {
        btn.disabled = false;
      });
      
      // Show video info again
      elements.status.classList.add('hidden');
      elements.videoInfo.classList.remove('hidden');
      elements.qualitySection.classList.remove('hidden');
    }, 2000);

  } catch (error) {
    console.error('Download error:', error);
    showError('ดาวน์โหลดล้มเหลว: ' + error.message);
    
    // Re-enable buttons
    setTimeout(() => {
      document.querySelectorAll('.quality-btn, .audio-btn').forEach(btn => {
        btn.disabled = false;
      });
    }, 2000);
  }
}

// Download audio (MP3)
async function downloadAudio() {
  try {
    document.querySelectorAll('.quality-btn, .audio-btn').forEach(btn => {
      btn.disabled = true;
    });

    showLoading('กำลังดาวน์โหลด MP3...');

    const response = await fetch(`${SERVER_URL}/api/download-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: currentVideoUrl
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'ดาวน์โหลดเสียงไม่สำเร็จ');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = `audio.mp3`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    await chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    });

    showSuccess('ดาวน์โหลด MP3 สำเร็จ!');

    setTimeout(() => {
      document.querySelectorAll('.quality-btn, .audio-btn').forEach(btn => {
        btn.disabled = false;
      });
      
      elements.status.classList.add('hidden');
      elements.videoInfo.classList.remove('hidden');
      elements.qualitySection.classList.remove('hidden');
    }, 2000);

  } catch (error) {
    console.error('Audio download error:', error);
    showError('ดาวน์โหลด MP3 ล้มเหลว: ' + error.message);
    
    setTimeout(() => {
      document.querySelectorAll('.quality-btn, .audio-btn').forEach(btn => {
        btn.disabled = false;
      });
    }, 2000);
  }
}

// UI Helper functions
function showLoading(message) {
  elements.statusText.textContent = message;
  elements.status.classList.remove('hidden');
  elements.status.classList.remove('error');
  elements.videoInfo.classList.add('hidden');
  elements.qualitySection.classList.add('hidden');
  elements.notYoutube.classList.add('hidden');
}

function showError(message) {
  elements.statusText.textContent = message;
  elements.status.classList.remove('hidden');
  elements.status.classList.add('error');
  elements.videoInfo.classList.add('hidden');
  elements.qualitySection.classList.add('hidden');
}

function showSuccess(message) {
  elements.statusText.textContent = message;
  elements.status.classList.remove('hidden');
  elements.status.classList.remove('error');
  elements.videoInfo.classList.add('hidden');
  elements.qualitySection.classList.add('hidden');
}

function showNotYouTube() {
  elements.status.classList.add('hidden');
  elements.notYoutube.classList.remove('hidden');
  elements.videoInfo.classList.add('hidden');
  elements.qualitySection.classList.add('hidden');
}

function showServerOffline() {
  elements.statusText.innerHTML = `
    <strong>⚠️ ไม่สามารถเชื่อมต่อ Server</strong><br><br>
    <strong>วิธีแก้:</strong><br>
    1. เปิด Terminal/Command Prompt<br>
    2. รันคำสั่ง:<br>
    <code style="display:block;margin:8px 0;padding:8px;background:rgba(0,0,0,0.3);border-radius:4px;">
    cd server-for-youtube-downloader<br>
    npm start
    </code>
    3. รอจนเห็น "Server running on http://localhost:3000"<br>
    4. Refresh Extension นี้<br><br>
    <small>หรือตรวจสอบว่า port 3000 ถูกใช้งานแล้ว</small>
  `;
  elements.status.classList.remove('hidden');
  elements.status.classList.add('error');
  elements.videoInfo.classList.add('hidden');
  elements.qualitySection.classList.add('hidden');
  elements.notYoutube.classList.add('hidden');
}

// Event listeners
elements.audioBtn.addEventListener('click', downloadAudio);
elements.refreshBtn.addEventListener('click', () => {
  location.reload();
});
