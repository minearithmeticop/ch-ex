// Content script สำหรับเพิ่มปุ่มดาวน์โหลดบนหน้า TikTok

(function() {
  'use strict';

  // รอให้หน้าเว็บโหลดเสร็จ
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // สังเกตการเปลี่ยนแปลงในหน้าเว็บ (สำหรับ Single Page Application)
    const observer = new MutationObserver(function(mutations) {
      addDownloadButtons();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // เพิ่มปุ่มครั้งแรก
    setTimeout(addDownloadButtons, 2000);
  }

  function addDownloadButtons() {
    // หาวิดีโอทั้งหมดในหน้า
    const videoContainers = document.querySelectorAll('[data-e2e="user-post-item"]');
    
    videoContainers.forEach(container => {
      // ตรวจสอบว่ามีปุ่มดาวน์โหลดแล้วหรือยัง
      if (container.querySelector('.custom-download-btn')) {
        return;
      }

      // สร้างปุ่มดาวน์โหลด
      const downloadBtn = createDownloadButton();
      
      // หาตำแหน่งที่เหมาะสมในการวางปุ่ม
      const actionBar = container.querySelector('[class*="action"]');
      if (actionBar) {
        actionBar.appendChild(downloadBtn);
      }
    });
  }

  function createDownloadButton() {
    const button = document.createElement('button');
    button.className = 'custom-download-btn';
    button.innerHTML = '⬇️ ดาวน์โหลด';
    button.style.cssText = `
      padding: 8px 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      margin: 8px;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;

    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 6px 8px rgba(0,0,0,0.15)';
    });

    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    });

    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const currentUrl = window.location.href;
      
      // เปิด popup หรือดาวน์โหลดโดยตรง
      chrome.runtime.sendMessage({
        action: 'download',
        url: currentUrl
      });
      
      // แสดงการแจ้งเตือน
      showNotification('กำลังเตรียมดาวน์โหลด...');
    });

    return button;
  }

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #323232;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      font-size: 14px;
      animation: slideIn 0.3s ease-out;
    `;

    // เพิ่ม animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transition = 'opacity 0.3s';
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // รับข้อความจาก background script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'downloadComplete') {
      showNotification('ดาวน์โหลดเสร็จสิ้น! ✅');
    } else if (request.action === 'downloadError') {
      showNotification('เกิดข้อผิดพลาดในการดาวน์โหลด ❌');
    }
  });
})();
