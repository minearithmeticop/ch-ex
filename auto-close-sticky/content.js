// ตัวแปรสถานะ
let isScanning = false;
let scanInterval = null;
let totalClicked = 0;
let scanCount = 0;

// ฟังก์ชันหลักในการสแกนและคลิก
function scanAndClick() {
    // หา elements ที่มี class sticky-close
    const stickyCloseElements = document.querySelectorAll('.sticky-close');
    
    if (scanCount === 2) {
        console.log('ไม่พบ sticky-close elements');
        stopScanning();
        showNotification('เสร็จแล้ว! ไม่พบ sticky-close elements อีกแล้ว', 'success');
        return;
    }
    
    let clickedCount = 0;
    
    // คลิกทุก element ที่พบ
    stickyCloseElements.forEach((element, index) => {
        // เช็คว่า element ยังมองเห็นได้อยู่หรือไม่
        if (element.offsetParent !== null || getComputedStyle(element).display !== 'none') {
            setTimeout(() => {
                try {
                    // ลองใช้วิธีการคลิกหลายแบบ
                    element.click();
                    
                    // หากไม่ได้ผลลองใช้ MouseEvent
                    if (element.offsetParent !== null) {
                        const clickEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        element.dispatchEvent(clickEvent);
                    }
                    
                    clickedCount++;
                    totalClicked++;
                    console.log(`คลิก sticky-close element ${index + 1}/${stickyCloseElements.length}`);
                    
                    // เพิ่มเอฟเฟกต์เมื่อคลิก
                    highlightElement(element);
                    
                } catch (error) {
                    console.error('Error clicking element:', error);
                }
            }, index * 200); // หน่วงเวลาระหว่างการคลิก 200ms
        }
    });
    
    console.log(`รอบที่ ${++scanCount}: พบ ${stickyCloseElements.length} elements, คลิกได้ ${clickedCount} elements`);
    
    // อัปเดตการแสดงผล
    updateScanDisplay(stickyCloseElements.length, totalClicked);
}

// ฟังก์ชันเริ่มสแกน
function startScanning() {
    if (isScanning) return;
    
    isScanning = true;
    totalClicked = 0;
    scanCount = 0;
    
    console.log('เริ่มสแกน sticky-close elements...');
    showNotification('เริ่มสแกนแล้ว!', 'info');
    
    // สแกนทันทีครั้งแรก
    scanAndClick();

    // ตั้งเวลาสแกนทุก 0.5 วินาที
    scanInterval = setInterval(scanAndClick, 500);
}

// ฟังก์ชันหยุดสแกน
function stopScanning() {
    if (!isScanning) return;
    
    isScanning = false;
    
    if (scanInterval) {
        clearInterval(scanInterval);
        scanInterval = null;
    }
    
    console.log(`หยุดสแกนแล้ว - คลิกรวม ${totalClicked} ครั้ง`);
    showNotification(`หยุดสแกนแล้ว - คลิกรวม ${totalClicked} ครั้ง`, 'success');
    
    // ลบการแสดงผลสถานะ
    removeScanDisplay();
}

// ฟังก์ชันคลิกเพียงครั้งเดียว
function clickOnce() {
    const stickyCloseElements = document.querySelectorAll('.sticky-close');
    
    if (stickyCloseElements.length === 0) {
        showNotification('ไม่พบ sticky-close elements', 'warning');
        return { found: 0, clicked: 0 };
    }
    
    let clickedCount = 0;
    
    stickyCloseElements.forEach((element, index) => {
        if (element.offsetParent !== null || getComputedStyle(element).display !== 'none') {
            setTimeout(() => {
                try {
                    element.click();
                    clickedCount++;
                    highlightElement(element);
                } catch (error) {
                    console.error('Error clicking element:', error);
                }
            }, index * 100);
        }
    });
    
    showNotification(`พบ ${stickyCloseElements.length} รายการ - คลิกแล้ว ${clickedCount} รายการ`, 'info');
    
    return { 
        found: stickyCloseElements.length, 
        clicked: clickedCount 
    };
}

// ฟังก์ชันแสดงการแจ้งเตือน
function showNotification(message, type = 'info') {
    // ลบการแจ้งเตือนเก่าก่อน
    const existingNotification = document.querySelector('.sticky-close-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'sticky-close-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999999;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-family: Arial, sans-serif;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        backdrop-filter: blur(10px);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // สีตามประเภท
    const colors = {
        info: 'background: linear-gradient(135deg, #3498db, #2980b9);',
        success: 'background: linear-gradient(135deg, #27ae60, #229954);',
        warning: 'background: linear-gradient(135deg, #f39c12, #e67e22);',
        error: 'background: linear-gradient(135deg, #e74c3c, #c0392b);'
    };
    
    notification.style.cssText += colors[type] || colors.info;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // แสดงการแจ้งเตือน
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // ซ่อนการแจ้งเตือนหลัง 3 วินาที
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// ฟังก์ชันเน้น element ที่ถูกคลิก
function highlightElement(element) {
    const originalStyle = element.style.cssText;
    
    element.style.cssText += `
        outline: 3px solid #ff4444 !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 10px rgba(255, 68, 68, 0.5) !important;
        transition: all 0.3s ease !important;
    `;
    
    setTimeout(() => {
        element.style.cssText = originalStyle;
    }, 1000);
}

// ฟังก์ชันแสดงสถานะการสแกน
function updateScanDisplay(found, totalClicked) {
    let display = document.querySelector('.sticky-close-scan-display');
    
    if (!display) {
        display = document.createElement('div');
        display.className = 'sticky-close-scan-display';
        display.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            z-index: 999998;
            padding: 10px 16px;
            background: linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.9));
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 6px;
            color: #fff;
            font-family: monospace;
            font-size: 12px;
            backdrop-filter: blur(5px);
        `;
        document.body.appendChild(display);
    }
    
    display.innerHTML = `
        <div>🎯 กำลังสแกน...</div>
        <div>📍 พบ: ${found} รายการ</div>
        <div>👆 คลิกแล้ว: ${totalClicked} ครั้ง</div>
        <div>🔄 รอบที่: ${scanCount}</div>
    `;
}

// ฟังก์ชันลบการแสดงสถานะ
function removeScanDisplay() {
    const display = document.querySelector('.sticky-close-scan-display');
    if (display) {
        display.remove();
    }
}

// รับ message จาก popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'startScanning':
            startScanning();
            sendResponse({ success: true });
            break;
            
        case 'stopScanning':
            stopScanning();
            sendResponse({ success: true, totalClicked: totalClicked });
            break;
            
        case 'clickOnce':
            const result = clickOnce();
            sendResponse(result);
            break;
            
        case 'getStatus':
            sendResponse({
                isScanning: isScanning,
                count: totalClicked
            });
            break;
    }
    
    return true; // เพื่อให้ sendResponse ทำงานแบบ async
});

// ตรวจสอบว่าอยู่ในเว็บ go-manga.com หรือไม่
const isGoMangaSite = window.location.hostname.includes('go-manga.com');

// เริ่มทำงานอัตโนมัติเมื่อโหลดหน้าเสร็จ
if (isGoMangaSite) {
    console.log('Go-Manga Auto Sticky Close Scanner loaded!');
    
    // รอให้หน้าเว็บโหลดเสร็จสมบูรณ์
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAutoScanner);
    } else {
        initAutoScanner();
    }
    
    // เริ่มทำงานหลังจากหน้าเว็บโหลดเสร็จ 1 วินาที
    setTimeout(() => {
        autoStartScanning();
    }, 1000);
} else {
    console.log('Auto Sticky Close Scanner loaded (manual mode only)');
}

// ฟังก์ชันเริ่มต้นระบบอัตโนมัติ
function initAutoScanner() {
    console.log('Initializing auto scanner for Go-Manga...');
    
    // แสดงการแจ้งเตือนว่าระบบพร้อมทำงาน
    showNotification('🎯 Go-Manga Auto Scanner พร้อมทำงาน!', 'info');
    
    // ตรวจสอบการเปลี่ยนแปลงใน DOM (สำหรับ dynamic content)
    observePageChanges();
}

// ฟังก์ชันเริ่มสแกนอัตโนมัติ
function autoStartScanning() {
    if (isScanning) return;
    
    // ตรวจสอบว่ามี sticky-close elements หรือไม่
    const initialElements = document.querySelectorAll('.sticky-close');
    
    if (initialElements.length > 0) {
        console.log(`พบ ${initialElements.length} sticky-close elements - เริ่มสแกนอัตโนมัติ`);
        showNotification(`พบ ${initialElements.length} รายการ - เริ่มสแกนอัตโนมัติ!`, 'success');
        startScanning();
    } else {
        console.log('ไม่พบ sticky-close elements - รอตรวจสอบใหม่');
        showNotification('ไม่พบรายการ - กำลังตรวจสอบ...', 'info');
        
        // ตรวจสอบทุก 3 วินาที หากยังไม่พบ
        const checkInterval = setInterval(() => {
            const elements = document.querySelectorAll('.sticky-close');
            if (elements.length > 0) {
                clearInterval(checkInterval);
                console.log(`พบ ${elements.length} sticky-close elements - เริ่มสแกนอัตโนมัติ`);
                showNotification(`พบ ${elements.length} รายการ - เริ่มสแกนอัตโนมัติ!`, 'success');
                startScanning();
            }
        }, 3000);
        
        // หยุดการตรวจสอบหลัง 30 วินาที
        setTimeout(() => {
            clearInterval(checkInterval);
            console.log('หมดเวลาการตรวจสอบอัตโนมัติ');
        }, 30000);
    }
}

// ฟังก์ชันตรวจสอบการเปลี่ยนแปลงในหน้าเว็บ
function observePageChanges() {
    const observer = new MutationObserver((mutations) => {
        let hasNewStickyClose = false;
        
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // ตรวจสอบว่า element ใหม่มี sticky-close class หรือไม่
                        if (node.classList && node.classList.contains('sticky-close')) {
                            hasNewStickyClose = true;
                        }
                        
                        // ตรวจสอบใน child elements
                        const childStickyElements = node.querySelectorAll && node.querySelectorAll('.sticky-close');
                        if (childStickyElements && childStickyElements.length > 0) {
                            hasNewStickyClose = true;
                        }
                    }
                });
            }
        });
        
        // หากพบ sticky-close elements ใหม่และยังไม่ได้สแกน
        if (hasNewStickyClose && !isScanning) {
            console.log('พบ sticky-close elements ใหม่ - เริ่มสแกนอัตโนมัติ');
            showNotification('พบรายการใหม่ - เริ่มสแกน!', 'info');
            setTimeout(autoStartScanning, 1000);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// เพิ่มการตรวจสอบเมื่อมีการนำทาง (navigation)
window.addEventListener('popstate', () => {
    if (isGoMangaSite && !isScanning) {
        setTimeout(autoStartScanning, 500);
    }
});

// ตรวจสอบการเปลี่ยน URL (สำหรับ SPA)
let currentUrl = window.location.href;
setInterval(() => {
    if (currentUrl !== window.location.href) {
        currentUrl = window.location.href;
        if (isGoMangaSite && !isScanning) {
            console.log('URL เปลี่ยน - ตรวจสอบ sticky-close elements ใหม่');
            setTimeout(autoStartScanning, 500);
        }
    }
}, 500);