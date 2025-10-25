// Content script - จัดการ audio elements ในหน้าเว็บ
(function() {
  'use strict';

  let injectedScriptReady = false;
  let pendingSettings = null;

  // Listen for ready signal from injected script
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    
    if (event.data.type === 'AUDIO_BOOST_READY') {
      injectedScriptReady = true;
      console.log('🔊 Audio Booster: Injected script ready');
      
      // Send pending settings if any
      if (pendingSettings) {
        window.postMessage({
          type: 'AUDIO_BOOST_UPDATE',
          settings: pendingSettings
        }, '*');
        pendingSettings = null;
      } else {
        // Load and apply saved settings
        loadAndApplySettings();
      }
    }
  });

  // Inject the audio processor script
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('injected.js');
  script.onload = function() {
    console.log('🔊 Audio Booster: Script injected');
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateAudio') {
      sendSettingsToInjected(request.settings);
      sendResponse({ success: true });
    }
    return true;
  });

  // Function to send settings to injected script
  function sendSettingsToInjected(settings) {
    if (injectedScriptReady) {
      window.postMessage({
        type: 'AUDIO_BOOST_UPDATE',
        settings: settings
      }, '*');
    } else {
      // Store settings to send when ready
      pendingSettings = settings;
    }
  }

  // Load and apply saved settings
  function loadAndApplySettings() {
    chrome.storage.local.get(['audioSettings'], function(result) {
      if (result.audioSettings) {
        console.log('🔊 Audio Booster: Applying saved settings', result.audioSettings);
        sendSettingsToInjected(result.audioSettings);
      }
    });
  }

  // Listen for new audio/video elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === 'VIDEO' || node.nodeName === 'AUDIO') {
          // Notify injected script about new media element
          window.postMessage({
            type: 'AUDIO_BOOST_NEW_MEDIA'
          }, '*');
        }
      });
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
