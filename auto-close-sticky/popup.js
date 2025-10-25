document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const manualBtn = document.getElementById('manualBtn');
    const status = document.getElementById('status');
    
    // เช็คสถานะเมื่อเปิด popup
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (!tabs[0]) return;
        
        const isGoManga = tabs[0].url.includes('go-manga.com');
        updateSiteStatus(isGoManga);
        
        // ถ้าไม่ใช่หน้า go-manga.com ไม่ต้องส่ง message
        if (!isGoManga) {
            return;
        }
        
        chrome.tabs.sendMessage(tabs[0].id, {action: 'getStatus'}, function(response) {
            // เช็ค runtime error
            if (chrome.runtime.lastError) {
                console.log('Content script not loaded:', chrome.runtime.lastError.message);
                return;
            }
            
            if (response && response.isScanning) {
                updateUI(true, response.count || 0);
            }
        });
    });
    
    // ปุ่มเริ่มสแกน
    startBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (!tabs[0]) return;
            
            chrome.tabs.sendMessage(tabs[0].id, {action: 'startScanning'}, function(response) {
                if (chrome.runtime.lastError) {
                    status.textContent = 'Error: กรุณารีเฟรชหน้าเว็บ';
                    status.className = 'error';
                    return;
                }
                
                if (response && response.success) {
                    updateUI(true, 0);
                    status.textContent = 'เริ่มสแกนแล้ว...';
                }
            });
        });
    });
    
    // ปุ่มหยุดสแกน
    stopBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (!tabs[0]) return;
            
            chrome.tabs.sendMessage(tabs[0].id, {action: 'stopScanning'}, function(response) {
                if (chrome.runtime.lastError) {
                    status.textContent = 'Error: กรุณารีเฟรชหน้าเว็บ';
                    status.className = 'error';
                    return;
                }
                
                if (response && response.success) {
                    updateUI(false, response.totalClicked || 0);
                    status.textContent = `หยุดแล้ว - คลิกรวม ${response.totalClicked} ครั้ง`;
                }
            });
        });
    });
    
    // ปุ่มคลิกครั้งเดียว
    manualBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (!tabs[0]) return;
            
            chrome.tabs.sendMessage(tabs[0].id, {action: 'clickOnce'}, function(response) {
                if (chrome.runtime.lastError) {
                    status.textContent = 'Error: กรุณารีเฟรชหน้าเว็บ';
                    status.className = 'error';
                    return;
                }
                
                if (response) {
                    status.textContent = `พบ ${response.found} รายการ - คลิกแล้ว ${response.clicked} รายการ`;
                    if (response.clicked === 0) {
                        status.textContent += ' (ไม่พบ sticky-close)';
                    }
                }
            });
        });
    });
    
    // ฟังก์ชันอัปเดตสถานะเว็บไซต์
    function updateSiteStatus(isGoManga) {
        const autoStatus = document.getElementById('auto-status');
        const manualStatus = document.getElementById('manual-status');
        
        if (isGoManga) {
            autoStatus.style.display = 'block';
            autoStatus.style.color = '#4CAF50';
            manualStatus.textContent = 'โหมดอัตโนมัติเปิดใช้งาน';
            manualStatus.style.color = '#4CAF50';
        } else {
            autoStatus.style.display = 'none';
            manualStatus.textContent = 'โหมดปกติ (เฉพาะ Go-Manga เท่านั้นที่ออโต้)';
            manualStatus.style.color = '#ffa500';
        }
    }
    
    // ฟังก์ชันอัปเดต UI
    function updateUI(isScanning, count) {
        if (isScanning) {
            startBtn.style.display = 'none';
            stopBtn.style.display = 'block';
            status.classList.remove('error');
            status.classList.add('active');
            status.innerHTML = `<div class="count">กำลังสแกน... พบ ${count} รายการ</div>`;
        } else {
            startBtn.style.display = 'block';
            stopBtn.style.display = 'none';
            status.classList.remove('active');
            status.classList.remove('error');
        }
    }
    
    // อัปเดตสถานะทุก 0.5 วินาที
    setInterval(function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (!tabs[0]) return;
            
            // เช็คว่าเป็นหน้า go-manga.com หรือไม่
            if (!tabs[0].url || !tabs[0].url.includes('go-manga.com')) {
                return;
            }
            
            chrome.tabs.sendMessage(tabs[0].id, {action: 'getStatus'}, function(response) {
                // Ignore error เพราะ content script อาจยังไม่โหลด
                if (chrome.runtime.lastError) {
                    return;
                }
                
                if (response && response.isScanning) {
                    updateUI(true, response.count);
                }
            });
        });
    }, 500);
});