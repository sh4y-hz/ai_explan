// AI_explan Popup Script
// Handles the popup UI and settings management with advanced configuration

// Import Settings Manager and Config Validator
// Scripts are loaded via HTML script tags in popup.html

document.addEventListener('DOMContentLoaded', () => {
  // Initialize settings manager
  const settingsManager = new SettingsManager();

  // Get UI elements
  const toggleSwitch = document.getElementById('toggle-switch');
  const statusText = document.getElementById('status-text');
  const panelWidthSlider = document.getElementById('panel-width');
  const panelWidthValue = document.getElementById('panel-width-value');
  const preferredApiSelect = document.getElementById('preferred-api');

  // Qwen API elements
  const qwenApiKeyInput = document.getElementById('qwen-api-key');
  const qwenBaseUrlInput = document.getElementById('qwen-base-url');
  const qwenModelInput = document.getElementById('qwen-model');

  // Kimi API elements
  const kimiApiKeyInput = document.getElementById('kimi-api-key');
  const kimiBaseUrlInput = document.getElementById('kimi-base-url');
  const kimiModelInput = document.getElementById('kimi-model');

  // OpenAI API elements
  const openaiApiKeyInput = document.getElementById('openai-api-key');
  const openaiBaseUrlInput = document.getElementById('openai-base-url');
  const openaiModelInput = document.getElementById('openai-model');

  // Anthropic API elements
  const anthropicApiKeyInput = document.getElementById('anthropic-api-key');
  const anthropicBaseUrlInput = document.getElementById('anthropic-base-url');
  const anthropicModelInput = document.getElementById('anthropic-model');

  const apiFailoverCheckbox = document.getElementById('api-failover');
  const contextLengthSlider = document.getElementById('context-length');
  const contextLengthValue = document.getElementById('context-length-value');
  const includeHeadersCheckbox = document.getElementById('include-headers');
  const includeCodeBlocksCheckbox = document.getElementById('include-code-blocks');
  const themeSelect = document.getElementById('theme-select');
  const fontSizeSelect = document.getElementById('font-size');
  const panelOpacitySlider = document.getElementById('panel-opacity');
  const panelOpacityValue = document.getElementById('panel-opacity-value');
  const showAnimationsCheckbox = document.getElementById('show-animations');
  const animationSpeedSelect = document.getElementById('animation-speed');
  const enableLoggingCheckbox = document.getElementById('enable-logging');
  const sendAnonymousUsageCheckbox = document.getElementById('send-anonymous-usage');
  const exportSettingsBtn = document.getElementById('export-settings');
  const importSettingsBtn = document.getElementById('import-settings');
  const restoreDefaultsBtn = document.getElementById('restore-defaults');

  // Tab elements
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // API provider sections
  const qwenApiSection = document.getElementById('qwen-api-section');
  const kimiApiSection = document.getElementById('kimi-api-section');
  const openaiApiSection = document.getElementById('openai-api-section');
  const anthropicApiSection = document.getElementById('anthropic-api-section');

  // Initialize tab functionality
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');

      // Remove active class from all buttons and contents
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Add active class to clicked button and corresponding content
      btn.classList.add('active');
      document.getElementById(`${tabName}-tab`).classList.add('active');

      // Special handling for API tab to show appropriate sections
      if (tabName === 'api') {
        updateApiSectionsVisibility();
      }
    });
  });

  // Update width display when slider changes
  panelWidthSlider.addEventListener('input', () => {
    panelWidthValue.textContent = `${panelWidthSlider.value}px`;
  });

  // Update context length display when slider changes
  contextLengthSlider.addEventListener('input', () => {
    contextLengthValue.textContent = contextLengthSlider.value;
  });

  // Update opacity display when slider changes
  panelOpacitySlider.addEventListener('input', () => {
    panelOpacityValue.textContent = `${panelOpacitySlider.value}%`;
  });

  // Update API sections visibility based on selected API
  function updateApiSectionsVisibility() {
    const selectedApi = preferredApiSelect.value;

    // Hide all sections first
    qwenApiSection.style.display = 'none';
    kimiApiSection.style.display = 'none';
    openaiApiSection.style.display = 'none';
    anthropicApiSection.style.display = 'none';

    // Show relevant section based on selection
    if (selectedApi === 'qwen' || selectedApi === 'automatic') {
      qwenApiSection.style.display = 'block';
    }
    if (selectedApi === 'kimi' || selectedApi === 'automatic') {
      kimiApiSection.style.display = 'block';
    }
    if (selectedApi === 'openai' || selectedApi === 'automatic') {
      openaiApiSection.style.display = 'block';
    }
    if (selectedApi === 'anthropic' || selectedApi === 'automatic') {
      anthropicApiSection.style.display = 'block';
    }
  }

  // Update API sections when preferred API changes
  preferredApiSelect.addEventListener('change', updateApiSectionsVisibility);

  // Load settings from extension storage
  async function loadSettings() {
    try {
      // Use chrome.runtime.sendMessage to get settings from background
      chrome.runtime.sendMessage({ action: 'getFullSettings' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error getting settings:', chrome.runtime.lastError);
          // Use defaults if there's an error
          applyDefaultSettings();
          return;
        }

        if (response && response.settings) {
          applySettings(response.settings);
        } else {
          // Use defaults if no response
          applyDefaultSettings();
        }
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      applyDefaultSettings();
    }
  }

  // Apply settings to UI
  function applySettings(settings) {
    // Apply general settings
    toggleSwitch.checked = settings.isActive;
    updateStatusText(settings.isActive);

    // Apply panel settings
    panelWidthSlider.value = settings.panelWidth;
    panelWidthValue.textContent = `${settings.panelWidth}px`;

    // Apply API settings
    preferredApiSelect.value = settings.preferredApi;

    // Qwen API settings
    if (settings.qwenApiKey) {
      qwenApiKeyInput.placeholder = "API key is configured";
    }
    qwenBaseUrlInput.value = settings.qwenBaseUrl || 'https://dashscope.aliyuncs.com/compatible-mode/v1';
    qwenModelInput.value = settings.qwenModel || 'qwen-max';

    // Kimi API settings
    if (settings.kimiApiKey) {
      kimiApiKeyInput.placeholder = "API key is configured";
    }
    kimiBaseUrlInput.value = settings.kimiBaseUrl || 'https://api.moonshot.cn/v1';
    kimiModelInput.value = settings.kimiModel || 'moonshot-v1-8k';

    // OpenAI API settings
    if (settings.openaiApiKey) {
      openaiApiKeyInput.placeholder = "API key is configured";
    }
    openaiBaseUrlInput.value = settings.openaiBaseUrl || 'https://api.openai.com/v1';
    openaiModelInput.value = settings.openaiModel || 'gpt-4o';

    // Anthropic API settings
    if (settings.anthropicApiKey) {
      anthropicApiKeyInput.placeholder = "API key is configured";
    }
    anthropicBaseUrlInput.value = settings.anthropicBaseUrl || 'https://api.anthropic.com/v1';
    anthropicModelInput.value = settings.anthropicModel || 'claude-3-5-sonnet-20241022';

    apiFailoverCheckbox.checked = settings.apiFailoverEnabled;

    // Apply context settings
    contextLengthSlider.value = settings.contextLength;
    contextLengthValue.textContent = settings.contextLength;
    includeHeadersCheckbox.checked = settings.includeHeadersInContext;
    includeCodeBlocksCheckbox.checked = settings.includeCodeBlocksInContext;

    // Apply appearance settings
    themeSelect.value = settings.theme;
    fontSizeSelect.value = settings.fontSize;
    panelOpacitySlider.value = settings.panelOpacity * 100; // Convert from 0-1 to 0-100
    panelOpacityValue.textContent = `${Math.round(settings.panelOpacity * 100)}%`;
    showAnimationsCheckbox.checked = settings.showAnimations;
    animationSpeedSelect.value = settings.animationSpeed;

    // Apply advanced settings
    enableLoggingCheckbox.checked = settings.enableLogging;
    sendAnonymousUsageCheckbox.checked = settings.sendAnonymousUsage;

    // Update API sections visibility based on current selection
    updateApiSectionsVisibility();
  }

  // Apply default settings
  function applyDefaultSettings() {
    const defaults = new SettingsManager().defaultSettings;
    applySettings(defaults);
  }

  // Update the status text based on extension state
  function updateStatusText(isActive) {
    statusText.textContent = isActive ? 'Extension Active' : 'Extension Inactive';
    statusText.style.color = isActive ? '#4CAF50' : '#999';
  }

  // Save general settings
  function saveGeneralSettings() {
    const newSettings = {
      isActive: toggleSwitch.checked,
      panelWidth: parseInt(panelWidthSlider.value)
    };

    chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings: newSettings
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error saving general settings:', chrome.runtime.lastError);
        return;
      }
      console.log('General settings saved:', response);
    });
  }

  // Save API settings
  function saveApiSettings() {
    const newSettings = {
      preferredApi: preferredApiSelect.value,
      apiFailoverEnabled: apiFailoverCheckbox.checked,
      // Qwen settings
      qwenBaseUrl: qwenBaseUrlInput.value,
      qwenModel: qwenModelInput.value,
      // Kimi settings
      kimiBaseUrl: kimiBaseUrlInput.value,
      kimiModel: kimiModelInput.value,
      // OpenAI settings
      openaiBaseUrl: openaiBaseUrlInput.value,
      openaiModel: openaiModelInput.value,
      // Anthropic settings
      anthropicBaseUrl: anthropicBaseUrlInput.value,
      anthropicModel: anthropicModelInput.value
    };

    // Only add API keys if they're provided (for security, we don't save them every time)
    // But we still update the API manager with the current values if they're entered
    if (qwenApiKeyInput.value) {
      newSettings.qwenApiKey = qwenApiKeyInput.value;
      qwenApiKeyInput.value = ''; // Clear for security
      qwenApiKeyInput.placeholder = "API key is configured";
    }
    if (kimiApiKeyInput.value) {
      newSettings.kimiApiKey = kimiApiKeyInput.value;
      kimiApiKeyInput.value = ''; // Clear for security
      kimiApiKeyInput.placeholder = "API key is configured";
    }
    if (openaiApiKeyInput.value) {
      newSettings.openaiApiKey = openaiApiKeyInput.value;
      openaiApiKeyInput.value = ''; // Clear for security
      openaiApiKeyInput.placeholder = "API key is configured";
    }
    if (anthropicApiKeyInput.value) {
      newSettings.anthropicApiKey = anthropicApiKeyInput.value;
      anthropicApiKeyInput.value = ''; // Clear for security
      anthropicApiKeyInput.placeholder = "API key is configured";
    }

    chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings: newSettings
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error saving API settings:', chrome.runtime.lastError);
        alert('Error saving API settings: ' + chrome.runtime.lastError.message);
        return;
      }
      if (response && response.success) {
        console.log('API settings saved:', response);
        alert('API settings saved successfully!');
      } else {
        const errorMsg = response?.error || 'Unknown error';
        console.error('Failed to save API settings:', errorMsg);
        alert('Failed to save API settings: ' + errorMsg);
      }
    });
    return false;
  }

  // Save context settings
  function saveContextSettings() {
    const newSettings = {
      contextLength: parseInt(contextLengthSlider.value),
      includeHeadersInContext: includeHeadersCheckbox.checked,
      includeCodeBlocksInContext: includeCodeBlocksCheckbox.checked
    };

    chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings: newSettings
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error saving context settings:', chrome.runtime.lastError);
        return;
      }
      console.log('Context settings saved:', response);
    });
  }

  // Save appearance settings
  function saveAppearanceSettings() {
    const newSettings = {
      theme: themeSelect.value,
      fontSize: fontSizeSelect.value,
      panelOpacity: parseInt(panelOpacitySlider.value) / 100, // Convert to 0-1 range
      showAnimations: showAnimationsCheckbox.checked,
      animationSpeed: animationSpeedSelect.value
    };

    chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings: newSettings
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error saving appearance settings:', chrome.runtime.lastError);
        return;
      }
      console.log('Appearance settings saved:', response);
    });
  }

  // Save advanced settings
  function saveAdvancedSettings() {
    const newSettings = {
      enableLogging: enableLoggingCheckbox.checked,
      sendAnonymousUsage: sendAnonymousUsageCheckbox.checked
    };

    chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings: newSettings
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error saving advanced settings:', chrome.runtime.lastError);
        return;
      }
      console.log('Advanced settings saved:', response);
    });
  }

  // Add explicit save button for API settings
  const saveApiSettingsBtn = document.createElement('button');
  saveApiSettingsBtn.id = 'save-api-settings';
  saveApiSettingsBtn.className = 'btn-primary';
  saveApiSettingsBtn.textContent = 'Save API Settings';
  saveApiSettingsBtn.style.marginTop = '10px';
  saveApiSettingsBtn.style.display = 'block';

  // Find the API section and add the save button
  const apiSection = document.querySelector('#api-tab .config-section');
  if (apiSection) {
    // Create a container div for the button
    const buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'center';
    buttonContainer.style.marginTop = '15px';
    buttonContainer.appendChild(saveApiSettingsBtn);

    apiSection.appendChild(buttonContainer);
  }

  // Add event listener for the new save API settings button
  saveApiSettingsBtn.addEventListener('click', saveApiSettings);

  // Event listeners for settings changes
  toggleSwitch.addEventListener('change', saveGeneralSettings);
  panelWidthSlider.addEventListener('change', saveGeneralSettings);

  // Individual change listeners for immediate saving (optional)
  preferredApiSelect.addEventListener('change', () => {
    // Update API sections visibility
    updateApiSectionsVisibility();
    // Save the setting
    saveApiSettings();
  });

  qwenBaseUrlInput.addEventListener('change', saveApiSettings);
  qwenModelInput.addEventListener('change', saveApiSettings);

  kimiBaseUrlInput.addEventListener('change', saveApiSettings);
  kimiModelInput.addEventListener('change', saveApiSettings);

  openaiBaseUrlInput.addEventListener('change', saveApiSettings);
  openaiModelInput.addEventListener('change', saveApiSettings);

  anthropicBaseUrlInput.addEventListener('change', saveApiSettings);
  anthropicModelInput.addEventListener('change', saveApiSettings);

  apiFailoverCheckbox.addEventListener('change', saveApiSettings);

  contextLengthSlider.addEventListener('change', saveContextSettings);
  includeHeadersCheckbox.addEventListener('change', saveContextSettings);
  includeCodeBlocksCheckbox.addEventListener('change', saveContextSettings);

  themeSelect.addEventListener('change', saveAppearanceSettings);
  fontSizeSelect.addEventListener('change', saveAppearanceSettings);
  panelOpacitySlider.addEventListener('change', saveAppearanceSettings);
  showAnimationsCheckbox.addEventListener('change', saveAppearanceSettings);
  animationSpeedSelect.addEventListener('change', saveAppearanceSettings);

  enableLoggingCheckbox.addEventListener('change', saveAdvancedSettings);
  sendAnonymousUsageCheckbox.addEventListener('change', saveAdvancedSettings);

  // Export settings
  exportSettingsBtn.addEventListener('click', async () => {
    try {
      const exportedSettings = await settingsManager.exportSettings();

      // Create a blob and download link
      const blob = new Blob([exportedSettings], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'ai_explan_settings.json';
      document.body.appendChild(a);
      a.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error exporting settings:', error);
      alert('Error exporting settings. See console for details.');
    }
  });

  // Import settings
  importSettingsBtn.addEventListener('click', async () => {
    // Create file input programmatically
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const content = event.target.result;
          const success = await settingsManager.importSettings(content);

          if (success) {
            alert('Settings imported successfully!');
            // Reload the popup to apply new settings
            window.location.reload();
          } else {
            alert('Failed to import settings. Please check the file format.');
          }
        };
        reader.readAsText(file);
      } catch (error) {
        console.error('Error importing settings:', error);
        alert('Error importing settings. See console for details.');
      }
    };

    input.click();
  });

  // Restore defaults
  restoreDefaultsBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to restore default settings? This will reset all your customizations.')) {
      try {
        await settingsManager.restoreDefaults();
        alert('Settings restored to defaults. Popup will reload.');
        window.location.reload();
      } catch (error) {
        console.error('Error restoring defaults:', error);
        alert('Error restoring defaults. See console for details.');
      }
    }
  });

  // Load initial settings
  loadSettings();
});