// popup.js - Extension popup logic

let currentMode = 'fixed';
let isRunning = false;
let selectedElement = null;

// DOM Elements
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const targetStatus = document.getElementById('targetStatus');
const elementPreview = document.getElementById('elementPreview');

const fixedModeBtn = document.getElementById('fixedModeBtn');
const randomModeBtn = document.getElementById('randomModeBtn');
const fixedIntervalInput = document.getElementById('fixedIntervalInput');
const randomIntervalInput = document.getElementById('randomIntervalInput');

const selectElementBtn = document.getElementById('selectElementBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

const clickCount = document.getElementById('clickCount');
const runningTime = document.getElementById('runningTime');
const statsSection = document.getElementById('statsSection');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Load saved state
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.storage.local.get(['mode', 'fixedInterval', 'randomMin', 'randomMax'], (data) => {
    if (data.mode) {
      currentMode = data.mode;
      updateModeUI();
    }
    if (data.fixedInterval) {
      document.getElementById('fixedInterval').value = data.fixedInterval;
    }
    if (data.randomMin) {
      document.getElementById('randomMin').value = data.randomMin;
    }
    if (data.randomMax) {
      document.getElementById('randomMax').value = data.randomMax;
    }
  });

  // Check if element is already selected
  chrome.tabs.sendMessage(tab.id, { action: 'getStatus' }, (response) => {
    if (chrome.runtime.lastError) {
      console.log('Content script not ready yet');
      return;
    }
    if (response && response.hasElement) {
      selectedElement = response.element;
      updateUIAfterSelection(response.element);
      if (response.isRunning) {
        updateUIRunning();
        updateStats(response.stats);
      }
    }
  });
});

// Mode switching
fixedModeBtn.addEventListener('click', () => {
  currentMode = 'fixed';
  updateModeUI();
  chrome.storage.local.set({ mode: 'fixed' });
});

randomModeBtn.addEventListener('click', () => {
  currentMode = 'random';
  updateModeUI();
  chrome.storage.local.set({ mode: 'random' });
});

function updateModeUI() {
  if (currentMode === 'fixed') {
    fixedModeBtn.classList.add('active');
    randomModeBtn.classList.remove('active');
    fixedIntervalInput.classList.remove('hidden');
    randomIntervalInput.classList.add('hidden');
  } else {
    randomModeBtn.classList.add('active');
    fixedModeBtn.classList.remove('active');
    randomIntervalInput.classList.remove('hidden');
    fixedIntervalInput.classList.add('hidden');
  }
}

// Save interval values
document.getElementById('fixedInterval').addEventListener('change', (e) => {
  chrome.storage.local.set({ fixedInterval: parseInt(e.target.value) });
});

document.getElementById('randomMin').addEventListener('change', (e) => {
  chrome.storage.local.set({ randomMin: parseInt(e.target.value) });
});

document.getElementById('randomMax').addEventListener('change', (e) => {
  chrome.storage.local.set({ randomMax: parseInt(e.target.value) });
});

// Select Element button
selectElementBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Update UI
  statusIndicator.classList.remove('idle');
  statusIndicator.classList.add('selecting');
  statusText.textContent = 'Selecting...';
  selectElementBtn.disabled = true;
  selectElementBtn.textContent = '👆 Click on the element you want to auto-click';

  // Enable element selection mode
  chrome.tabs.sendMessage(tab.id, { action: 'startSelection' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error:', chrome.runtime.lastError);
      statusText.textContent = 'Error: Refresh page and try again';
      selectElementBtn.disabled = false;
      selectElementBtn.textContent = '🎯 Select Element to Click';
      return;
    }
  });
});

// Start Auto Clicking
startBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  const config = {
    mode: currentMode,
    fixedInterval: parseInt(document.getElementById('fixedInterval').value),
    randomMin: parseInt(document.getElementById('randomMin').value),
    randomMax: parseInt(document.getElementById('randomMax').value)
  };

  // Validate random interval
  if (config.mode === 'random' && config.randomMin >= config.randomMax) {
    alert('⚠️ Minimum interval must be less than maximum interval!');
    return;
  }

  chrome.tabs.sendMessage(tab.id, { 
    action: 'startClicking',
    config: config
  }, (response) => {
    if (response && response.success) {
      updateUIRunning();
      startStatsUpdate(tab.id);
    }
  });
});

// Stop Auto Clicking
stopBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, { action: 'stopClicking' }, (response) => {
    if (response && response.success) {
      updateUIStopped();
    }
  });
});

// Reset
resetBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, { action: 'reset' }, () => {
    updateUIIdle();
  });
});

// Update UI after element selection
function updateUIAfterSelection(element) {
  statusIndicator.classList.remove('selecting');
  statusIndicator.classList.add('idle');
  statusText.textContent = 'Ready';
  targetStatus.textContent = 'Selected ✓';
  
  // Show element preview
  elementPreview.classList.remove('hidden');
  elementPreview.textContent = element.selector;
  
  // Show/hide buttons
  selectElementBtn.classList.add('hidden');
  startBtn.classList.remove('hidden');
  resetBtn.classList.remove('hidden');
  selectElementBtn.disabled = false;
  selectElementBtn.textContent = '🎯 Select Element to Click';
}

// Update UI when running
function updateUIRunning() {
  statusIndicator.classList.remove('idle');
  statusIndicator.classList.add('running');
  statusText.textContent = 'Running';
  
  startBtn.classList.add('hidden');
  stopBtn.classList.remove('hidden');
  resetBtn.classList.add('hidden');
  
  statsSection.classList.remove('hidden');
  
  // Disable mode and interval changes
  fixedModeBtn.disabled = true;
  randomModeBtn.disabled = true;
  document.getElementById('fixedInterval').disabled = true;
  document.getElementById('randomMin').disabled = true;
  document.getElementById('randomMax').disabled = true;
}

// Update UI when stopped
function updateUIStopped() {
  statusIndicator.classList.remove('running');
  statusIndicator.classList.add('idle');
  statusText.textContent = 'Stopped';
  
  stopBtn.classList.add('hidden');
  startBtn.classList.remove('hidden');
  resetBtn.classList.remove('hidden');
  
  // Enable mode and interval changes
  fixedModeBtn.disabled = false;
  randomModeBtn.disabled = false;
  document.getElementById('fixedInterval').disabled = false;
  document.getElementById('randomMin').disabled = false;
  document.getElementById('randomMax').disabled = false;
  
  // Stop stats update
  if (window.statsInterval) {
    clearInterval(window.statsInterval);
  }
}

// Update UI to idle state
function updateUIIdle() {
  statusIndicator.classList.remove('selecting', 'running');
  statusIndicator.classList.add('idle');
  statusText.textContent = 'Idle';
  targetStatus.textContent = 'Not Set';
  
  elementPreview.classList.add('hidden');
  selectElementBtn.classList.remove('hidden');
  startBtn.classList.add('hidden');
  stopBtn.classList.add('hidden');
  resetBtn.classList.add('hidden');
  statsSection.classList.add('hidden');
  
  clickCount.textContent = '0';
  runningTime.textContent = '0s';
  
  // Enable all controls
  fixedModeBtn.disabled = false;
  randomModeBtn.disabled = false;
  document.getElementById('fixedInterval').disabled = false;
  document.getElementById('randomMin').disabled = false;
  document.getElementById('randomMax').disabled = false;
  
  // Stop stats update
  if (window.statsInterval) {
    clearInterval(window.statsInterval);
  }
}

// Start updating stats
function startStatsUpdate(tabId) {
  if (window.statsInterval) {
    clearInterval(window.statsInterval);
  }
  
  window.statsInterval = setInterval(() => {
    chrome.tabs.sendMessage(tabId, { action: 'getStats' }, (response) => {
      if (chrome.runtime.lastError || !response) {
        clearInterval(window.statsInterval);
        return;
      }
      updateStats(response);
    });
  }, 500);
}

// Update statistics display
function updateStats(stats) {
  if (!stats) return;
  
  clickCount.textContent = stats.clickCount || 0;
  
  const seconds = Math.floor((stats.runningTime || 0) / 1000);
  if (seconds < 60) {
    runningTime.textContent = `${seconds}s`;
  } else {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    runningTime.textContent = `${minutes}m ${remainingSeconds}s`;
  }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'elementSelected') {
    selectedElement = message.element;
    updateUIAfterSelection(message.element);
  }
});
