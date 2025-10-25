// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('🔊 Audio Booster Pro installed');
  
  // Set default settings only if not already set
  chrome.storage.local.get(['audioSettings'], (result) => {
    if (!result.audioSettings) {
      chrome.storage.local.set({
        audioSettings: {
          enabled: true,
          volume: 100,
          bass: 0,
          eq: [0, 0, 0, 0, 0]
        }
      });
    }
  });
});

// Listen for tab updates to apply settings
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Wait a bit for content script to load
    setTimeout(() => {
      chrome.storage.local.get(['audioSettings'], (result) => {
        if (result.audioSettings) {
          chrome.tabs.sendMessage(tabId, {
            action: 'updateAudio',
            settings: result.audioSettings
          }).catch(err => {
            // Content script might not be ready yet or tab doesn't support it
            console.log('🔊 Cannot apply settings to tab:', err.message);
          });
        }
      });
    }, 500);
  }
});

// Apply settings to all existing tabs on extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log('🔊 Audio Booster Pro starting up');
  applySettingsToAllTabs();
});

// Function to apply settings to all tabs
function applySettingsToAllTabs() {
  chrome.storage.local.get(['audioSettings'], (result) => {
    if (result.audioSettings) {
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          if (tab.url && !tab.url.startsWith('chrome://')) {
            chrome.tabs.sendMessage(tab.id, {
              action: 'updateAudio',
              settings: result.audioSettings
            }).catch(() => {
              // Ignore errors for tabs without content script
            });
          }
        });
      });
    }
  });
}

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSettings') {
    chrome.storage.local.get(['audioSettings'], (result) => {
      sendResponse(result.audioSettings || {});
    });
    return true;
  }
});
