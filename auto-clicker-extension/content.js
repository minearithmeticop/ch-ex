// content.js - Runs on web pages

let selectedElement = null;
let isSelecting = false;
let isRunning = false;
let clickInterval = null;
let clickCount = 0;
let startTime = null;
let config = null;

// Overlay for element selection
let overlay = null;
let highlightBox = null;

// Initialize
console.log('🖱️ Smart Auto Clicker loaded');

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'startSelection':
      startSelectionMode();
      sendResponse({ success: true });
      break;
      
    case 'startClicking':
      config = message.config;
      startAutoClicking();
      sendResponse({ success: true });
      break;
      
    case 'stopClicking':
      stopAutoClicking();
      sendResponse({ success: true });
      break;
      
    case 'reset':
      reset();
      sendResponse({ success: true });
      break;
      
    case 'getStatus':
      sendResponse({
        hasElement: !!selectedElement,
        element: selectedElement,
        isRunning: isRunning,
        stats: {
          clickCount: clickCount,
          runningTime: startTime ? Date.now() - startTime : 0
        }
      });
      break;
      
    case 'getStats':
      sendResponse({
        clickCount: clickCount,
        runningTime: startTime ? Date.now() - startTime : 0
      });
      break;
  }
  return true;
});

// Start selection mode
function startSelectionMode() {
  isSelecting = true;
  document.body.style.cursor = 'crosshair';
  
  // Create overlay
  createOverlay();
  
  // Add event listeners
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('click', handleElementClick, true);
  document.addEventListener('keydown', handleEscapeKey);
  
  console.log('🎯 Selection mode activated. Click on an element to select it.');
}

// Create overlay for visual feedback
function createOverlay() {
  // Create semi-transparent overlay
  overlay = document.createElement('div');
  overlay.id = 'auto-clicker-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999998;
    pointer-events: none;
  `;
  
  // Create highlight box
  highlightBox = document.createElement('div');
  highlightBox.id = 'auto-clicker-highlight';
  highlightBox.style.cssText = `
    position: absolute;
    border: 3px solid #ffd700;
    background: rgba(255, 215, 0, 0.2);
    pointer-events: none;
    z-index: 999999;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
    transition: all 0.1s ease;
  `;
  
  // Create info label
  const infoLabel = document.createElement('div');
  infoLabel.id = 'auto-clicker-info';
  infoLabel.textContent = '🎯 Click on any element to select it | Press ESC to cancel';
  infoLabel.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px 30px;
    border-radius: 10px;
    font-family: 'Segoe UI', sans-serif;
    font-size: 14px;
    font-weight: 600;
    z-index: 1000000;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    pointer-events: none;
  `;
  
  document.body.appendChild(overlay);
  document.body.appendChild(highlightBox);
  document.body.appendChild(infoLabel);
}

// Handle mouse move to highlight element
function handleMouseMove(e) {
  if (!isSelecting) return;
  
  const element = document.elementFromPoint(e.clientX, e.clientY);
  if (!element || element === overlay || element === highlightBox) return;
  
  const rect = element.getBoundingClientRect();
  highlightBox.style.left = rect.left + window.scrollX + 'px';
  highlightBox.style.top = rect.top + window.scrollY + 'px';
  highlightBox.style.width = rect.width + 'px';
  highlightBox.style.height = rect.height + 'px';
}

// Handle element click
function handleElementClick(e) {
  if (!isSelecting) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  const element = e.target;
  
  // Store element information
  selectedElement = {
    tagName: element.tagName,
    id: element.id,
    className: element.className,
    textContent: element.textContent.substring(0, 50),
    selector: generateSelector(element),
    xpath: generateXPath(element)
  };
  
  console.log('✅ Element selected:', selectedElement);
  
  // Clean up selection mode
  cleanupSelectionMode();
  
  // Show confirmation
  showConfirmation(element);
  
  // Notify popup
  chrome.runtime.sendMessage({
    action: 'elementSelected',
    element: selectedElement
  });
}

// Handle ESC key to cancel selection
function handleEscapeKey(e) {
  if (e.key === 'Escape' && isSelecting) {
    console.log('❌ Selection cancelled');
    cleanupSelectionMode();
  }
}

// Clean up selection mode
function cleanupSelectionMode() {
  isSelecting = false;
  document.body.style.cursor = '';
  
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('click', handleElementClick, true);
  document.removeEventListener('keydown', handleEscapeKey);
  
  // Remove overlay elements
  if (overlay) overlay.remove();
  if (highlightBox) highlightBox.remove();
  const infoLabel = document.getElementById('auto-clicker-info');
  if (infoLabel) infoLabel.remove();
}

// Show confirmation message
function showConfirmation(element) {
  const rect = element.getBoundingClientRect();
  
  const confirmation = document.createElement('div');
  confirmation.style.cssText = `
    position: absolute;
    left: ${rect.left + window.scrollX}px;
    top: ${rect.top + window.scrollY - 60}px;
    background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-family: 'Segoe UI', sans-serif;
    font-size: 13px;
    font-weight: 600;
    z-index: 1000000;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    animation: fadeInOut 2s ease;
  `;
  confirmation.textContent = '✅ Element Selected!';
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateY(10px); }
      20% { opacity: 1; transform: translateY(0); }
      80% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-10px); }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(confirmation);
  setTimeout(() => confirmation.remove(), 2000);
}

// Generate unique CSS selector
function generateSelector(element) {
  if (element.id) {
    return `#${element.id}`;
  }
  
  if (element.className) {
    const classes = element.className.split(' ').filter(c => c).join('.');
    if (classes) {
      const selector = `${element.tagName.toLowerCase()}.${classes}`;
      // Check if unique
      if (document.querySelectorAll(selector).length === 1) {
        return selector;
      }
    }
  }
  
  // Generate path-based selector
  const path = [];
  let current = element;
  
  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();
    
    if (current.id) {
      selector += `#${current.id}`;
      path.unshift(selector);
      break;
    }
    
    if (current.className) {
      const classes = current.className.split(' ').filter(c => c).join('.');
      if (classes) {
        selector += `.${classes}`;
      }
    }
    
    // Add nth-child if needed for uniqueness
    const siblings = Array.from(current.parentNode?.children || []);
    if (siblings.length > 1) {
      const index = siblings.indexOf(current) + 1;
      selector += `:nth-child(${index})`;
    }
    
    path.unshift(selector);
    current = current.parentElement;
  }
  
  return path.join(' > ');
}

// Generate XPath
function generateXPath(element) {
  if (element.id) {
    return `//*[@id="${element.id}"]`;
  }
  
  const path = [];
  let current = element;
  
  while (current && current !== document.body) {
    let index = 0;
    let sibling = current.previousSibling;
    
    while (sibling) {
      if (sibling.nodeType === 1 && sibling.tagName === current.tagName) {
        index++;
      }
      sibling = sibling.previousSibling;
    }
    
    const tagName = current.tagName.toLowerCase();
    const pathIndex = index > 0 ? `[${index + 1}]` : '';
    path.unshift(`${tagName}${pathIndex}`);
    
    current = current.parentElement;
  }
  
  return '/' + path.join('/');
}

// Start auto clicking
function startAutoClicking() {
  if (!selectedElement) {
    console.error('❌ No element selected!');
    return;
  }
  
  if (isRunning) {
    console.warn('⚠️ Already running!');
    return;
  }
  
  isRunning = true;
  clickCount = 0;
  startTime = Date.now();
  
  console.log('▶️ Auto clicking started');
  console.log('⚙️ Config:', config);
  
  // Start clicking
  scheduleNextClick();
}

// Schedule next click
function scheduleNextClick() {
  if (!isRunning) return;
  
  let delay;
  
  if (config.mode === 'fixed') {
    delay = config.fixedInterval;
  } else {
    // Random interval between min and max
    delay = Math.floor(Math.random() * (config.randomMax - config.randomMin + 1)) + config.randomMin;
  }
  
  clickInterval = setTimeout(() => {
    performClick();
    scheduleNextClick();
  }, delay);
  
  console.log(`⏱️ Next click in ${delay}ms`);
}

// Perform click
function performClick() {
  try {
    // Find element
    let element = document.querySelector(selectedElement.selector);
    
    // Fallback to XPath if CSS selector fails
    if (!element) {
      element = document.evaluate(
        selectedElement.xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
    }
    
    if (!element) {
      console.error('❌ Element not found! Selector:', selectedElement.selector);
      stopAutoClicking();
      alert('⚠️ Target element not found! The page might have changed. Please select a new element.');
      return;
    }
    
    // Create and dispatch click event
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
      buttons: 1
    });
    
    element.dispatchEvent(clickEvent);
    clickCount++;
    
    console.log(`✅ Click ${clickCount} performed on:`, element);
    
    // Visual feedback
    flashElement(element);
    
  } catch (error) {
    console.error('❌ Error clicking element:', error);
    stopAutoClicking();
  }
}

// Flash element for visual feedback
function flashElement(element) {
  const originalBorder = element.style.border;
  const originalBackground = element.style.background;
  
  element.style.border = '3px solid #2ecc71';
  element.style.background = 'rgba(46, 204, 113, 0.2)';
  
  setTimeout(() => {
    element.style.border = originalBorder;
    element.style.background = originalBackground;
  }, 200);
}

// Stop auto clicking
function stopAutoClicking() {
  if (!isRunning) return;
  
  isRunning = false;
  
  if (clickInterval) {
    clearTimeout(clickInterval);
    clickInterval = null;
  }
  
  const duration = Date.now() - startTime;
  console.log('⏸️ Auto clicking stopped');
  console.log(`📊 Total clicks: ${clickCount}`);
  console.log(`⏱️ Duration: ${(duration / 1000).toFixed(1)}s`);
}

// Reset everything
function reset() {
  stopAutoClicking();
  selectedElement = null;
  clickCount = 0;
  startTime = null;
  console.log('🔄 Reset complete');
}
