// Injected script - ทำงานในบริบทของหน้าเว็บเพื่อเข้าถึง Web Audio API
(function() {
  'use strict';

  let audioContext = null;
  let mediaElements = new Map();
  let currentSettings = {
    enabled: true,
    volume: 100,
    bass: 0,
    eq: [0, 0, 0, 0, 0]
  };

  // Signal that injected script is ready
  window.postMessage({ type: 'AUDIO_BOOST_READY' }, '*');

  // Initialize Audio Context
  function initAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
  }

  // Create audio processing nodes
  function createAudioNodes(mediaElement) {
    const ctx = initAudioContext();
    
    // Create source from media element
    const source = ctx.createMediaElementSource(mediaElement);
    
    // Create gain node for volume
    const gainNode = ctx.createGain();
    
    // Create bass boost using biquad filter
    const bassNode = ctx.createBiquadFilter();
    bassNode.type = 'lowshelf';
    bassNode.frequency.value = 200;
    
    // Create 5-band EQ
    const eqNodes = [
      createEQFilter(ctx, 60, 'lowshelf'),
      createEQFilter(ctx, 250, 'peaking'),
      createEQFilter(ctx, 1000, 'peaking'),
      createEQFilter(ctx, 4000, 'peaking'),
      createEQFilter(ctx, 16000, 'highshelf')
    ];
    
    // Connect nodes: source -> bass -> eq1 -> eq2 -> ... -> gain -> destination
    let currentNode = source;
    currentNode = connectNode(currentNode, bassNode);
    
    eqNodes.forEach(eqNode => {
      currentNode = connectNode(currentNode, eqNode);
    });
    
    currentNode = connectNode(currentNode, gainNode);
    gainNode.connect(ctx.destination);
    
    return {
      source,
      gainNode,
      bassNode,
      eqNodes
    };
  }

  function createEQFilter(ctx, frequency, type) {
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = 1;
    filter.gain.value = 0;
    return filter;
  }

  function connectNode(from, to) {
    from.connect(to);
    return to;
  }

  // Process media element
  function processMediaElement(mediaElement) {
    if (mediaElements.has(mediaElement)) {
      return mediaElements.get(mediaElement);
    }

    try {
      const nodes = createAudioNodes(mediaElement);
      mediaElements.set(mediaElement, nodes);
      
      // Apply current settings
      applySettings(nodes, currentSettings);
      
      console.log('🔊 Audio Booster: Processing media element', mediaElement.tagName);
      
      // Monitor when element is removed
      const checkInterval = setInterval(() => {
        if (!document.contains(mediaElement)) {
          mediaElements.delete(mediaElement);
          clearInterval(checkInterval);
        }
      }, 1000);
      
      return nodes;
    } catch (error) {
      // Some media elements might already be connected to audio context
      if (error.name === 'InvalidStateError') {
        console.log('🔊 Audio Booster: Media element already connected, skipping');
      } else {
        console.error('🔊 Audio Booster: Error processing media element:', error);
      }
      return null;
    }
  }

  // Apply audio settings to nodes
  function applySettings(nodes, settings) {
    if (!nodes || !settings) return;

    const ctx = audioContext;
    if (!ctx) return;

    // Apply volume (convert percentage to gain)
    const volumeGain = settings.enabled ? (settings.volume / 100) : 1;
    nodes.gainNode.gain.setValueAtTime(volumeGain, ctx.currentTime);

    // Apply bass boost
    const bassGain = settings.enabled ? settings.bass : 0;
    nodes.bassNode.gain.setValueAtTime(bassGain, ctx.currentTime);

    // Apply EQ
    if (settings.enabled && settings.eq) {
      settings.eq.forEach((gain, index) => {
        if (nodes.eqNodes[index]) {
          nodes.eqNodes[index].gain.setValueAtTime(gain, ctx.currentTime);
        }
      });
    } else {
      // Reset EQ
      nodes.eqNodes.forEach(node => {
        node.gain.setValueAtTime(0, ctx.currentTime);
      });
    }
  }

  // Find and process all media elements
  function processAllMedia() {
    const mediaElements = document.querySelectorAll('video, audio');
    mediaElements.forEach(element => {
      if (!element.src && !element.currentSrc) return;
      processMediaElement(element);
    });
  }

  // Update all media with new settings
  function updateAllMedia(settings) {
    currentSettings = settings;
    
    mediaElements.forEach((nodes, element) => {
      applySettings(nodes, settings);
    });
    
    // Process any new media elements
    processAllMedia();
  }

  // Listen for messages from content script
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;

    if (event.data.type === 'AUDIO_BOOST_UPDATE') {
      updateAllMedia(event.data.settings);
    } else if (event.data.type === 'AUDIO_BOOST_NEW_MEDIA') {
      setTimeout(processAllMedia, 100);
    }
  });

  // Override HTMLMediaElement.prototype.play to catch dynamically loaded media
  const originalPlay = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function() {
    if (!mediaElements.has(this)) {
      processMediaElement(this);
    }
    return originalPlay.apply(this, arguments);
  };

  // Process existing media on load with retry
  function initializeMediaProcessing() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(processAllMedia, 500);
      });
    } else {
      // Process immediately and retry after delay
      processAllMedia();
      setTimeout(processAllMedia, 1000);
      setTimeout(processAllMedia, 3000);
    }
  }

  initializeMediaProcessing();

  // Watch for new media elements
  const observer = new MutationObserver((mutations) => {
    let hasNewMedia = false;
    
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === 'VIDEO' || node.nodeName === 'AUDIO') {
          hasNewMedia = true;
        } else if (node.querySelectorAll) {
          const mediaInNode = node.querySelectorAll('video, audio');
          if (mediaInNode.length > 0) {
            hasNewMedia = true;
          }
        }
      });
    });
    
    if (hasNewMedia) {
      setTimeout(processAllMedia, 100);
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // Resume audio context on user interaction (required by browsers)
  function resumeAudioContext() {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
      processAllMedia(); // Reprocess media when context resumes
    }
  }

  ['click', 'touchstart', 'keydown', 'play'].forEach(eventType => {
    document.addEventListener(eventType, resumeAudioContext, { passive: true });
  });

  // Also listen for play events on the window
  window.addEventListener('play', function() {
    setTimeout(processAllMedia, 100);
  }, true);

  console.log('🔊 Audio Booster Pro: Initialized');
})();
