// AI_explan Background Service Worker
// Handles extension events, state management, API coordination, and configuration framework

// Import API manager and settings manager
importScripts('api/api-manager.js', 'settings-manager.js');

// Initialize managers
const apiManager = new ApiManager();
const settingsManager = new SettingsManager();

// Handle extension installation/update
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('AI_explan extension installed/updated');

  // Load settings, with defaults for missing settings
  const settings = await settingsManager.loadSettings();

  console.log('Extension settings initialized');
  console.log('Active:', settings.isActive);
  console.log('Context depth:', settings.contextDepth);
  console.log('Preferred API:', settings.preferredApi);
  console.log('Panel width:', settings.panelWidth);

  // Register context menu based on active state
  registerContextMenu(settings.isActive);

  // Initialize API manager with configuration
  const apiConfig = {
    preferredApi: settings.preferredApi,
    qwenApiKey: settings.qwenApiKey || null,
    qwenBaseUrl: settings.qwenBaseUrl || null,
    qwenModel: settings.qwenModel || null,
    kimiApiKey: settings.kimiApiKey || null,
    kimiBaseUrl: settings.kimiBaseUrl || null,
    kimiModel: settings.kimiModel || null,
    openaiApiKey: settings.openaiApiKey || null,
    openaiBaseUrl: settings.openaiBaseUrl || null,
    openaiModel: settings.openaiModel || null,
    anthropicApiKey: settings.anthropicApiKey || null,
    anthropicBaseUrl: settings.anthropicBaseUrl || null,
    anthropicModel: settings.anthropicModel || null,
    failoverEnabled: settings.apiFailoverEnabled !== undefined ? settings.apiFailoverEnabled : true
  };
  apiManager.initialize(apiConfig).catch(error => {
    console.error('Error initializing API manager:', error);
  });
});

// Register context menu when extension loads
async function registerContextMenu(isActive) {
  // Remove existing context menu items first to prevent duplicates
  chrome.contextMenus.removeAll(() => {
    // Create context menu item for selected text
    chrome.contextMenus.create({
      id: 'ai_explan_context_menu',
      title: 'AI_explan',
      contexts: ['selection'],
      // Default to enabled if undefined
      enabled: isActive !== undefined ? isActive : true
    }, () => {
      // Check for errors
      if (chrome.runtime.lastError) {
        console.error('Error creating context menu:', chrome.runtime.lastError);
      } else {
        console.log('Context menu registered successfully with enabled state:', isActive !== undefined ? isActive : true);
      }
    });
  });
}

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'ai_explan_context_menu') {
    // Check if extension is active before opening sidebar
    chrome.storage.local.get(['isActive']).then(async (result) => {
      const settings = await settingsManager.loadSettings();
      if (settings.isActive !== undefined ? settings.isActive : true) { // Default to active if undefined
        // Send message to content script to open sidebar with context
        chrome.tabs.sendMessage(tab.id, {
          action: 'openSidebar',
          selectedText: info.selectionText
        }).catch((error) => {
          console.error('Error sending message to content script:', error);
        });
      }
    }).catch((error) => {
      console.error('Error checking extension state:', error);
    });
  }
});

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request.action);

  // Handle async operations
  (async () => {
    switch(request.action) {
      case 'getFullSettings':
        try {
          const settings = await settingsManager.loadSettings();
          sendResponse({ settings });
        } catch (error) {
          console.error('Error getting settings:', error);
          sendResponse({ settings: settingsManager.defaultSettings });
        }
        break;

      case 'updateSettings':
        console.log('updateSettings called with:', request.settings);
        try {
          const currentSettings = await settingsManager.loadSettings();
          const updatedSettings = { ...currentSettings, ...request.settings };
          await settingsManager.saveSettings(updatedSettings);

          if (request.settings.hasOwnProperty('isActive')) {
            await registerContextMenu(request.settings.isActive);
          }

          if (request.settings.preferredApi ||
              request.settings.qwenApiKey || request.settings.qwenBaseUrl || request.settings.qwenModel ||
              request.settings.kimiApiKey || request.settings.kimiBaseUrl || request.settings.kimiModel ||
              request.settings.openaiApiKey || request.settings.openaiBaseUrl || request.settings.openaiModel ||
              request.settings.anthropicApiKey || request.settings.anthropicBaseUrl || request.settings.anthropicModel ||
              request.settings.apiFailoverEnabled !== undefined) {
            const apiConfig = {
              preferredApi: request.settings.preferredApi || currentSettings.preferredApi,
              qwenApiKey: request.settings.qwenApiKey || currentSettings.qwenApiKey || null,
              qwenBaseUrl: request.settings.qwenBaseUrl || currentSettings.qwenBaseUrl || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
              qwenModel: request.settings.qwenModel || currentSettings.qwenModel || 'qwen-max',
              kimiApiKey: request.settings.kimiApiKey || currentSettings.kimiApiKey || null,
              kimiBaseUrl: request.settings.kimiBaseUrl || currentSettings.kimiBaseUrl || 'https://api.moonshot.cn/v1',
              kimiModel: request.settings.kimiModel || currentSettings.kimiModel || 'moonshot-v1-8k',
              openaiApiKey: request.settings.openaiApiKey || currentSettings.openaiApiKey || null,
              openaiBaseUrl: request.settings.openaiBaseUrl || currentSettings.openaiBaseUrl || 'https://api.openai.com/v1',
              openaiModel: request.settings.openaiModel || currentSettings.openaiModel || 'gpt-3.5-turbo',
              anthropicApiKey: request.settings.anthropicApiKey || currentSettings.anthropicApiKey || null,
              anthropicBaseUrl: request.settings.anthropicBaseUrl || currentSettings.anthropicBaseUrl || 'https://api.anthropic.com/v1',
              anthropicModel: request.settings.anthropicModel || currentSettings.anthropicModel || 'claude-3-haiku-20240307',
              failoverEnabled: request.settings.apiFailoverEnabled !== undefined ? request.settings.apiFailoverEnabled : currentSettings.apiFailoverEnabled
            };
            try {
              await apiManager.initialize(apiConfig);
            } catch (error) {
              console.error('Error reinitializing API manager:', error);
            }
          }

          console.log('Settings saved successfully, sending response');
          sendResponse({ success: true, settings: updatedSettings });
        } catch (error) {
          console.error('Error updating settings:', error);
          sendResponse({ success: false, error: error.message });
        }
        break;

      case 'toggleState':
        try {
          const newState = request.state;
          const currentSettings = await settingsManager.loadSettings();
          const updatedSettings = { ...currentSettings, isActive: newState };
          await settingsManager.saveSettings(updatedSettings);

          chrome.contextMenus.update('ai_explan_context_menu', {
            enabled: newState
          }).catch((error) => {
            console.error('Error updating context menu:', error);
          });

          sendResponse({
            isActive: newState,
            contextDepth: updatedSettings.contextDepth,
            preferredApi: updatedSettings.preferredApi,
            panelWidth: updatedSettings.panelWidth
          });
        } catch (error) {
          console.error('Error toggling extension state:', error);
          sendResponse({ isActive: false, error: error.message });
        }
        break;

      case 'updateContextDepth':
        try {
          const newContextDepth = request.depth;
          const currentSettings = await settingsManager.loadSettings();
          const updatedSettings = { ...currentSettings, contextDepth: newContextDepth };
          await settingsManager.saveSettings(updatedSettings);

          sendResponse({
            isActive: updatedSettings.isActive,
            contextDepth: updatedSettings.contextDepth,
            preferredApi: updatedSettings.preferredApi,
            panelWidth: updatedSettings.panelWidth
          });
        } catch (error) {
          console.error('Error updating context depth:', error);
          sendResponse({ error: error.message });
        }
        break;

      case 'updatePreferredApi':
        try {
          const newPreferredApi = request.api;
          const currentSettings = await settingsManager.loadSettings();
          const updatedSettings = { ...currentSettings, preferredApi: newPreferredApi };
          await settingsManager.saveSettings(updatedSettings);

          const apiConfig = {
            preferredApi: newPreferredApi,
            qwenApiKey: currentSettings.qwenApiKey || null,
            qwenBaseUrl: currentSettings.qwenBaseUrl || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
            qwenModel: currentSettings.qwenModel || 'qwen-max',
            kimiApiKey: currentSettings.kimiApiKey || null,
            kimiBaseUrl: currentSettings.kimiBaseUrl || 'https://api.moonshot.cn/v1',
            kimiModel: currentSettings.kimiModel || 'moonshot-v1-8k',
            openaiApiKey: currentSettings.openaiApiKey || null,
            openaiBaseUrl: currentSettings.openaiBaseUrl || 'https://api.openai.com/v1',
            openaiModel: currentSettings.openaiModel || 'gpt-3.5-turbo',
            anthropicApiKey: currentSettings.anthropicApiKey || null,
            anthropicBaseUrl: currentSettings.anthropicBaseUrl || 'https://api.anthropic.com/v1',
            anthropicModel: currentSettings.anthropicModel || 'claude-3-haiku-20240307',
            failoverEnabled: currentSettings.apiFailoverEnabled !== undefined ? currentSettings.apiFailoverEnabled : true
          };

          apiManager.initialize(apiConfig).catch(error => {
            console.error('Error reinitializing API manager:', error);
          });

          sendResponse({
            isActive: updatedSettings.isActive,
            contextDepth: updatedSettings.contextDepth,
            preferredApi: updatedSettings.preferredApi,
            panelWidth: updatedSettings.panelWidth
          });
        } catch (error) {
          console.error('Error updating preferred API:', error);
          sendResponse({ error: error.message });
        }
        break;

      case 'updatePanelWidth':
        try {
          const newPanelWidth = request.width;
          const currentSettings = await settingsManager.loadSettings();
          const updatedSettings = { ...currentSettings, panelWidth: newPanelWidth };
          await settingsManager.saveSettings(updatedSettings);

          sendResponse({
            isActive: updatedSettings.isActive,
            contextDepth: updatedSettings.contextDepth,
            preferredApi: updatedSettings.preferredApi,
            panelWidth: updatedSettings.panelWidth
          });
        } catch (error) {
          console.error('Error updating panel width:', error);
          sendResponse({ error: error.message });
        }
        break;

      case 'updateApiKey':
        try {
          const apiType = request.apiType;
          const newApiKey = request.apiKey;
          const keyField = `${apiType}ApiKey`;
          const currentSettings = await settingsManager.loadSettings();
          const updatedSettings = { ...currentSettings, [keyField]: newApiKey };
          await settingsManager.saveSettings(updatedSettings);

          const apiConfig = {
            preferredApi: currentSettings.preferredApi,
            qwenApiKey: updatedSettings.qwenApiKey || null,
            qwenBaseUrl: updatedSettings.qwenBaseUrl || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
            qwenModel: updatedSettings.qwenModel || 'qwen-max',
            kimiApiKey: updatedSettings.kimiApiKey || null,
            kimiBaseUrl: updatedSettings.kimiBaseUrl || 'https://api.moonshot.cn/v1',
            kimiModel: updatedSettings.kimiModel || 'moonshot-v1-8k',
            openaiApiKey: updatedSettings.openaiApiKey || null,
            openaiBaseUrl: updatedSettings.openaiBaseUrl || 'https://api.openai.com/v1',
            openaiModel: updatedSettings.openaiModel || 'gpt-3.5-turbo',
            anthropicApiKey: updatedSettings.anthropicApiKey || null,
            anthropicBaseUrl: updatedSettings.anthropicBaseUrl || 'https://api.anthropic.com/v1',
            anthropicModel: updatedSettings.anthropicModel || 'claude-3-haiku-20240307',
            failoverEnabled: updatedSettings.apiFailoverEnabled !== undefined ? updatedSettings.apiFailoverEnabled : true
          };

          apiManager.initialize(apiConfig).catch(error => {
            console.error('Error reinitializing API manager:', error);
          });

          sendResponse({
            isActive: updatedSettings.isActive,
            contextDepth: updatedSettings.contextDepth,
            preferredApi: updatedSettings.preferredApi,
            panelWidth: updatedSettings.panelWidth
          });
        } catch (error) {
          console.error('Error updating API key:', error);
          sendResponse({ error: error.message });
        }
        break;

      case 'requestExplanation':
        try {
          const term = request.term;
          const context = request.context;
          const explanation = await apiManager.requestExplanation(term, context);

          sendResponse({
            success: true,
            explanation: explanation
          });
        } catch (error) {
          console.error('Error getting explanation from API:', error);
          sendResponse({
            success: false,
            error: error.message
          });
        }
        break;

      case 'chat':
        try {
          const messages = request.messages;
          const context = request.context;
          const selectedText = request.selectedText;

          const response = await apiManager.chat(messages, context, selectedText);

          sendResponse(response);
        } catch (error) {
          console.error('Error in chat:', error);
          sendResponse({
            success: false,
            error: error.message
          });
        }
        break;

      case 'closeSidebar':
        chrome.tabs.sendMessage(sender.tab.id, {
          action: 'closeSidebar'
        }).catch((error) => {
          console.error('Error closing sidebar:', error);
        });
        break;

      case 'textSelectionChanged':
        break;

      default:
        console.log('Unknown message received:', request);
    }
  })();

  // Return true to keep the message channel open for async response
  return true;
});