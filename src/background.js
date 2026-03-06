// AI_explan Background Service Worker
// Handles extension events and manages state

// Handle extension installation/update
chrome.runtime.onInstalled.addListener((details) => {
  console.log('AI_explan extension installed/updated');

  // Set initial state
  chrome.storage.local.get(['isActive'], (result) => {
    const isActive = result.isActive !== false; // Default to true if undefined
    // Save the state in storage
    chrome.storage.local.set({ isActive: isActive }, () => {
      console.log('Extension state initialized:', isActive);
      // Register context menu
      registerContextMenu(isActive);
    });
  });
});

// Register context menu when extension loads
function registerContextMenu(isActive) {
  // Remove existing context menu items first to prevent duplicates
  chrome.contextMenus.removeAll(() => {
    // Create context menu item for selected text
    chrome.contextMenus.create({
      id: 'ai_explan_context_menu',
      title: 'AI_explan',
      contexts: ['selection'],
      enabled: isActive !== false // Default to enabled if undefined
    }, () => {
      // Check for errors
      if (chrome.runtime.lastError) {
        console.error('Error creating context menu:', chrome.runtime.lastError);
      } else {
        console.log('Context menu registered successfully with enabled state:', isActive !== false);
      }
    });
  });
}

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'ai_explan_context_menu') {
    // Check if extension is active before opening sidebar
    chrome.storage.local.get(['isActive'], (result) => {
      if (result.isActive !== false) { // Only proceed if extension is active
        // Send message to content script to open sidebar
        chrome.tabs.sendMessage(tab.id, {
          action: 'openSidebar',
          selectedText: info.selectionText
        }).catch((error) => {
          console.error('Error sending message to content script:', error);
        });
      }
    });
  }
});

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch(request.action) {
    case 'getState':
      chrome.storage.local.get(['isActive'], (result) => {
        const isActive = result.isActive !== false; // Default to true if undefined
        sendResponse({ isActive: isActive });
      });
      return true; // Keep message channel open for async response

    case 'toggleState':
      const newState = request.state;
      chrome.storage.local.set({ isActive: newState }, () => {
        // Update context menu based on new state
        chrome.contextMenus.update('ai_explan_context_menu', {
          enabled: newState
        }).catch((error) => {
          console.error('Error updating context menu:', error);
        });

        sendResponse({ isActive: newState });
      });
      return true; // Keep message channel open for async response

    case 'closeSidebar':
      chrome.tabs.sendMessage(sender.tab.id, {
        action: 'closeSidebar'
      }).catch((error) => {
        console.error('Error closing sidebar:', error);
      });
      break;

    case 'textSelectionChanged':
      // Could handle text selection changes here if needed
      break;

    default:
      console.log('Unknown message received:', request);
  }
});