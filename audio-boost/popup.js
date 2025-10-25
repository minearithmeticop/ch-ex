// Popup controller
const elements = {
  enableBoost: document.getElementById('enableBoost'),
  volumeSlider: document.getElementById('volumeSlider'),
  volumeValue: document.getElementById('volumeValue'),
  bassSlider: document.getElementById('bassSlider'),
  bassValue: document.getElementById('bassValue'),
  eq60: document.getElementById('eq60'),
  eq250: document.getElementById('eq250'),
  eq1k: document.getElementById('eq1k'),
  eq4k: document.getElementById('eq4k'),
  eq16k: document.getElementById('eq16k'),
  applyBtn: document.getElementById('applyBtn'),
  resetBtn: document.getElementById('resetBtn'),
  status: document.getElementById('status')
};

// EQ Presets
const presets = {
  flat: [0, 0, 0, 0, 0],
  rock: [4, 2, -1, -2, 3],
  pop: [-1, 2, 4, 3, -1],
  jazz: [3, 1, -1, 1, 3],
  classical: [3, 2, -1, 2, 4],
  bass: [8, 6, 0, -2, -2]
};

// Load saved settings
chrome.storage.local.get(['audioSettings'], function(result) {
  if (result.audioSettings) {
    applySettingsToUI(result.audioSettings);
  }
});

// Volume slider
elements.volumeSlider.addEventListener('input', function() {
  elements.volumeValue.textContent = this.value + '%';
});

// Bass slider
elements.bassSlider.addEventListener('input', function() {
  elements.bassValue.textContent = this.value + ' dB';
});

// EQ sliders
['eq60', 'eq250', 'eq1k', 'eq4k', 'eq16k'].forEach(id => {
  const slider = document.getElementById(id);
  const valueDisplay = document.getElementById(id + 'Value');
  
  slider.addEventListener('input', function() {
    valueDisplay.textContent = this.value + 'dB';
  });
});

// Preset buttons
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const preset = this.dataset.preset;
    applyPreset(preset);
  });
});

// Apply button
elements.applyBtn.addEventListener('click', async function() {
  const settings = getSettingsFromUI();
  
  // Save settings
  await chrome.storage.local.set({ audioSettings: settings });
  console.log('🔊 Settings saved:', settings);
  
  // Apply to current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  try {
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'updateAudio',
      settings: settings
    });
    
    if (response && response.success) {
      showStatus('การตั้งค่าถูกนำไปใช้แล้ว! ✓');
    } else {
      showStatus('กำลังนำไปใช้... (รีเฟรชหน้าถ้ายังไม่ทำงาน)');
      
      // Retry after a short delay
      setTimeout(() => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'updateAudio',
          settings: settings
        }).catch(err => console.log('Retry failed:', err));
      }, 500);
    }
  } catch (error) {
    console.error('Error applying settings:', error);
    showStatus('ใช้การตั้งค่า! (รีเฟรชหน้าถ้ายังไม่ทำงาน)');
  }
});

// Reset button
elements.resetBtn.addEventListener('click', function() {
  const defaultSettings = {
    enabled: true,
    volume: 100,
    bass: 0,
    eq: [0, 0, 0, 0, 0]
  };
  
  applySettingsToUI(defaultSettings);
  chrome.storage.local.set({ audioSettings: defaultSettings });
  showStatus('รีเซ็ตเป็นค่าเริ่มต้นแล้ว!');
});

// Enable/Disable toggle
elements.enableBoost.addEventListener('change', async function() {
  const settings = getSettingsFromUI();
  chrome.storage.local.set({ audioSettings: settings });
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, {
    action: 'updateAudio',
    settings: settings
  });
});

// Helper functions
function getSettingsFromUI() {
  return {
    enabled: elements.enableBoost.checked,
    volume: parseInt(elements.volumeSlider.value),
    bass: parseInt(elements.bassSlider.value),
    eq: [
      parseInt(elements.eq60.value),
      parseInt(elements.eq250.value),
      parseInt(elements.eq1k.value),
      parseInt(elements.eq4k.value),
      parseInt(elements.eq16k.value)
    ]
  };
}

function applySettingsToUI(settings) {
  elements.enableBoost.checked = settings.enabled !== false;
  elements.volumeSlider.value = settings.volume || 100;
  elements.volumeValue.textContent = (settings.volume || 100) + '%';
  elements.bassSlider.value = settings.bass || 0;
  elements.bassValue.textContent = (settings.bass || 0) + ' dB';
  
  const eq = settings.eq || [0, 0, 0, 0, 0];
  const eqIds = ['eq60', 'eq250', 'eq1k', 'eq4k', 'eq16k'];
  
  eq.forEach((value, index) => {
    const slider = document.getElementById(eqIds[index]);
    const valueDisplay = document.getElementById(eqIds[index] + 'Value');
    slider.value = value;
    valueDisplay.textContent = value + 'dB';
  });
}

function applyPreset(presetName) {
  const eq = presets[presetName];
  const eqIds = ['eq60', 'eq250', 'eq1k', 'eq4k', 'eq16k'];
  
  eq.forEach((value, index) => {
    const slider = document.getElementById(eqIds[index]);
    const valueDisplay = document.getElementById(eqIds[index] + 'Value');
    slider.value = value;
    valueDisplay.textContent = value + 'dB';
  });
  
  if (presetName === 'bass') {
    elements.bassSlider.value = 12;
    elements.bassValue.textContent = '12 dB';
  }
  
  showStatus(`ใช้ Preset: ${presetName.toUpperCase()}`);
}

function showStatus(message) {
  elements.status.textContent = message;
  elements.status.classList.add('show');
  
  setTimeout(() => {
    elements.status.classList.remove('show');
  }, 2000);
}

// Apply settings when popup opens
chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
  if (!tabs[0]) return;
  
  const result = await chrome.storage.local.get(['audioSettings']);
  
  if (result.audioSettings) {
    console.log('🔊 Popup opened, applying settings to tab:', tabs[0].id);
    
    // Try to apply immediately
    try {
      await chrome.tabs.sendMessage(tabs[0].id, {
        action: 'updateAudio',
        settings: result.audioSettings
      });
      console.log('🔊 Settings applied successfully');
    } catch (err) {
      console.log('🔊 Content script not ready, will retry...', err);
      
      // Retry after delay
      setTimeout(() => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateAudio',
          settings: result.audioSettings
        }).catch(e => console.log('🔊 Retry failed:', e));
      }, 1000);
    }
  }
});
