// Background script สำหรับจัดการ CORS และ API calls

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'downloadVideo') {
    downloadVideo(request.url)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ error: error.message }));
    return true; // จะตอบกลับแบบ async
  }
});

async function downloadVideo(tiktokUrl) {
  try {
    // ลองใช้ API หลายตัว
    const apis = [
      {
        name: 'tikwm',
        fetch: async () => {
          const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(tiktokUrl)}`);
          const data = await response.json();
          if (data.code === 0 && data.data) {
            return {
              url: data.data.hdplay || data.data.play || data.data.wmplay,
              title: data.data.title
            };
          }
          throw new Error('No video found');
        }
      },
      {
        name: 'tikmate',
        fetch: async () => {
          const response = await fetch('https://api.tikmate.app/api/lookup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `url=${encodeURIComponent(tiktokUrl)}`
          });
          const data = await response.json();
          if (data.token) {
            return {
              url: `https://tikmate.app/download/${data.token}/${data.id}.mp4`,
              title: data.title || 'tiktok_video'
            };
          }
          throw new Error('No video found');
        }
      }
    ];

    // ลอง API ทีละตัว
    for (const api of apis) {
      try {
        console.log(`Trying ${api.name}...`);
        const result = await api.fetch();
        if (result.url) {
          return { success: true, ...result };
        }
      } catch (error) {
        console.log(`${api.name} failed:`, error);
        continue;
      }
    }

    throw new Error('All APIs failed');
  } catch (error) {
    console.error('Download error:', error);
    return { success: false, error: error.message };
  }
}

// จัดการ download completed
chrome.downloads.onChanged.addListener((delta) => {
  if (delta.state && delta.state.current === 'complete') {
    console.log('Download completed:', delta.id);
  }
});
