// Content script สำหรับดึงข้อมูลจากหน้า YouTube
(function() {
  'use strict';

  // ฟังก์ชันดึงข้อมูลวิดีโอจากหน้า YouTube
  function getVideoInfo() {
    try {
      const videoId = new URLSearchParams(window.location.search).get('v');
      
      if (!videoId) return null;

      // ดึงข้อมูลจาก YouTube page
      const titleElement = document.querySelector('h1.ytd-video-primary-info-renderer');
      const title = titleElement ? titleElement.textContent.trim() : 'YouTube Video';

      // ดึงความยาววิดีโอ
      const durationElement = document.querySelector('.ytp-time-duration');
      const duration = durationElement ? durationElement.textContent : 'Unknown';

      // ดึง thumbnail
      const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

      return {
        videoId,
        title,
        duration,
        thumbnail,
        url: window.location.href
      };

    } catch (error) {
      console.error('Error getting video info:', error);
      return null;
    }
  }

  // ส่งข้อมูลไปยัง popup เมื่อถูกขอ
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getVideoInfo') {
      const videoInfo = getVideoInfo();
      sendResponse(videoInfo);
    }
    return true;
  });

  console.log('🎥 YouTube Downloader: Content script loaded');
})();
