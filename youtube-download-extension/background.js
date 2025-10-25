// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('🎥 YouTube Downloader installed');
});

// จัดการ downloads
chrome.downloads.onChanged.addListener((delta) => {
  if (delta.state && delta.state.current === 'complete') {
    console.log('Download completed:', delta.id);
    
    // แสดง notification (optional)
    // chrome.notifications.create({
    //   type: 'basic',
    //   iconUrl: 'icon.png',
    //   title: 'ดาวน์โหลดเสร็จสิ้น',
    //   message: 'วิดีโอ YouTube ของคุณดาวน์โหลดเสร็จแล้ว!'
    // });
  }
  
  if (delta.state && delta.state.current === 'interrupted') {
    console.error('Download interrupted:', delta.id);
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'download') {
    // Handle download request
    console.log('Download request:', request);
    sendResponse({ success: true });
  }
  return true;
});
