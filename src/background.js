// AI_explan Background Service Worker
// Handles extension events and manages state

let isActive = false;

// Handle extension installation/update
chrome.runtime.onInstalled.addListener((details) => {
  console.log('AI_explan extension installed/updated');

  // Set initial state
  chrome.storage.local.get(['isActive'], (result) => {
    if (result.isActive === undefined) {
      isActive = true; // Default to active
      chrome.storage.local.set({ isActive: true });
    } else {
      isActive = result.isActive;
    }
  });

  // Register context menu
  registerContextMenu();
});

// Register context menu when extension loads
function registerContextMenu() {
  // Remove existing context menu items first to prevent duplicates
  chrome.contextMenus.removeAll(() => {
    // Create context menu item for selected text
    chrome.contextMenus.create({
      id: 'ai_explan_context_menu',
      title: 'AI_explan',
      contexts: ['selection'],
      enabled: isActive
    }, () => {
      // Check for errors
      if (chrome.runtime.lastError) {
        console.error('Error creating context menu:', chrome.runtime.lastError);
      } else {
        console.log('Context menu registered successfully');
      }
    });
  });
}

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'ai_explan_context_menu' && isActive) {
    // Send message to content script to open sidebar
    chrome.tabs.sendMessage(tab.id, {
      action: 'openSidebar',
      selectedText: info.selectionText
    }).catch((error) => {
      console.error('Error sending message to content script:', error);
    });
  }
});

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch(request.action) {
    case 'getState':
      chrome.storage.local.get(['isActive'], (result) => {
        sendResponse({ isActive: result.isActive !== false }); // Default to true if undefined
      });
      return true; // Keep message channel open for async response

    case 'toggleState':
      isActive = !request.state;
      chrome.storage.local.set({ isActive: isActive }, () => {
        // Update context menu based on new state
        chrome.contextMenus.update('ai_explan_context_menu', {
          enabled: isActive
        }).catch((error) => {
          console.error('Error updating context menu:', error);
        });

        sendResponse({ isActive: isActive });
      });
      return true; // Keep message channel open for async response

    case 'closeSidebar':
      chrome.tabs.sendMessage(sender.tab.id, {
        action: 'closeSidebar'
      }).catch((error) => {
        console.error('Error closing sidebar:', error);
      });
      break;

    default:
      console.log('Unknown message received:', request);
  }
});