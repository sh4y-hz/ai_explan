/**
 * Settings Manager for AI_explan Extension
 * Handles loading, saving, and managing all extension settings
 */

class SettingsManager {
  constructor() {
    this.defaultSettings = {
      // General settings
      isActive: true,
      contextDepth: 3,
      panelWidth: 400,

      // API settings
      preferredApi: 'qwen',
      qwenApiKey: null,
      qwenBaseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      qwenModel: 'qwen-max',
      kimiApiKey: null,
      kimiBaseUrl: 'https://api.moonshot.cn/v1',
      kimiModel: 'moonshot-v1-8k',
      openaiApiKey: null,
      openaiBaseUrl: 'https://api.openai.com/v1',
      openaiModel: 'gpt-3.5-turbo',
      anthropicApiKey: null,
      anthropicBaseUrl: 'https://api.anthropic.com/v1',
      anthropicModel: 'claude-3-haiku-20240307',
      apiFailoverEnabled: true,

      // Context settings
      contextLength: 3, // Number of paragraphs before/after
      includeHeadersInContext: true,
      includeCodeBlocksInContext: true,

      // Appearance settings
      panelOpacity: 1.0,
      fontSize: 'medium',
      theme: 'system', // 'light', 'dark', or 'system'
      showAnimations: true,
      animationSpeed: 'normal', // 'slow', 'normal', 'fast'

      // Advanced settings
      enableLogging: false,
      sendAnonymousUsage: false
    };
  }

  /**
   * Load settings from storage, with defaults for missing settings
   * @returns {Promise<Object>} Loaded settings
   */
  async loadSettings() {
    try {
      // Get all stored settings
      const storedSettings = await chrome.storage.local.get(null);

      // Merge with defaults for any missing settings
      const mergedSettings = { ...this.defaultSettings, ...storedSettings };

      return mergedSettings;
    } catch (error) {
      console.error('Error loading settings:', error);
      // Return defaults if there's an error
      return { ...this.defaultSettings };
    }
  }

  /**
   * Save settings to storage
   * @param {Object} settings - Settings object to save
   * @returns {Promise<void>}
   */
  async saveSettings(settings) {
    try {
      // Validate settings before saving
      const validatedSettings = this.validateSettings(settings);

      // Save to storage
      await chrome.storage.local.set(validatedSettings);

      // Dispatch event to notify other parts of the extension
      this.dispatchSettingsChangeEvent(validatedSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  /**
   * Validate settings before saving
   * @param {Object} settings - Settings to validate
   * @returns {Object} Validated and potentially corrected settings
   */
  validateSettings(settings) {
    const validated = { ...settings };

    // Validate context depth (1-10)
    if (typeof validated.contextDepth === 'number') {
      validated.contextDepth = Math.max(1, Math.min(10, validated.contextDepth));
    } else {
      validated.contextDepth = this.defaultSettings.contextDepth;
    }

    // Validate panel width (300-800)
    if (typeof validated.panelWidth === 'number') {
      validated.panelWidth = Math.max(300, Math.min(800, validated.panelWidth));
    } else {
      validated.panelWidth = this.defaultSettings.panelWidth;
    }

    // Validate context length (1-10)
    if (typeof validated.contextLength === 'number') {
      validated.contextLength = Math.max(1, Math.min(10, validated.contextLength));
    } else {
      validated.contextLength = this.defaultSettings.contextLength;
    }

    // Validate preferred API
    if (!['qwen', 'kimi', 'openai', 'anthropic', 'automatic'].includes(validated.preferredApi)) {
      validated.preferredApi = this.defaultSettings.preferredApi;
    }

    // Validate opacity (0.1-1.0)
    if (typeof validated.panelOpacity === 'number') {
      validated.panelOpacity = Math.max(0.1, Math.min(1.0, validated.panelOpacity));
    } else {
      validated.panelOpacity = this.defaultSettings.panelOpacity;
    }

    // Validate font size
    if (!['small', 'medium', 'large'].includes(validated.fontSize)) {
      validated.fontSize = this.defaultSettings.fontSize;
    }

    // Validate theme
    if (!['light', 'dark', 'system'].includes(validated.theme)) {
      validated.theme = this.defaultSettings.theme;
    }

    // Validate animation speed
    if (!['slow', 'normal', 'fast'].includes(validated.animationSpeed)) {
      validated.animationSpeed = this.defaultSettings.animationSpeed;
    }

    return validated;
  }

  /**
   * Get a specific setting value
   * @param {string} key - Setting key
   * @param {*} defaultValue - Default value if setting doesn't exist
   * @returns {Promise<any>} Setting value
   */
  async getSetting(key, defaultValue = null) {
    const settings = await this.loadSettings();
    return settings[key] !== undefined ? settings[key] : defaultValue;
  }

  /**
   * Set a specific setting value
   * @param {string} key - Setting key
   * @param {any} value - Setting value
   * @returns {Promise<void>}
   */
  async setSetting(key, value) {
    const settings = await this.loadSettings();
    settings[key] = value;
    await this.saveSettings(settings);
  }

  /**
   * Restore all settings to default values
   * @returns {Promise<void>}
   */
  async restoreDefaults() {
    await chrome.storage.local.clear(); // Clear all settings
    await chrome.storage.local.set({ ...this.defaultSettings }); // Set defaults
    this.dispatchSettingsChangeEvent({ ...this.defaultSettings });
  }

  /**
   * Export settings as JSON string
   * @returns {Promise<string>} JSON string of settings
   */
  async exportSettings() {
    const settings = await this.loadSettings();
    return JSON.stringify(settings, null, 2);
  }

  /**
   * Import settings from JSON string
   * @param {string} settingsJson - JSON string of settings
   * @returns {Promise<boolean>} True if import successful
   */
  async importSettings(settingsJson) {
    try {
      const importedSettings = JSON.parse(settingsJson);
      const validatedSettings = this.validateSettings(importedSettings);
      await this.saveSettings(validatedSettings);
      return true;
    } catch (error) {
      console.error('Error importing settings:', error);
      return false;
    }
  }

  /**
   * Dispatch settings change event
   * @param {Object} settings - Updated settings
   * @private
   */
  dispatchSettingsChangeEvent(settings) {
    // Create a custom event to notify other parts of the extension
    // Only dispatch in environments where window is available
    if (typeof window !== 'undefined' && typeof document !== 'undefined' && window?.dispatchEvent) {
      const event = new CustomEvent('aiExplanSettingsChanged', {
        detail: { settings }
      });
      window.dispatchEvent(event);
    }
  }

  /**
   * Get available configuration presets
   * @returns {Object} Object with preset configurations
   */
  getConfigPresets() {
    return {
      default: { ...this.defaultSettings },
      focusMode: {
        ...this.defaultSettings,
        panelWidth: 350,
        showAnimations: false,
        fontSize: 'small'
      },
      researchMode: {
        ...this.defaultSettings,
        contextLength: 5,
        includeHeadersInContext: true,
        includeCodeBlocksInContext: true,
        panelWidth: 500
      },
      minimalMode: {
        ...this.defaultSettings,
        panelWidth: 300,
        contextLength: 1,
        showAnimations: false
      }
    };
  }

  /**
   * Apply a configuration preset
   * @param {string} presetName - Name of the preset to apply
   * @returns {Promise<boolean>} True if preset applied successfully
   */
  async applyPreset(presetName) {
    const presets = this.getConfigPresets();
    const preset = presets[presetName];

    if (!preset) {
      console.error(`Preset '${presetName}' not found`);
      return false;
    }

    try {
      await this.saveSettings(preset);
      return true;
    } catch (error) {
      console.error(`Error applying preset '${presetName}':`, error);
      return false;
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SettingsManager;
} else if (typeof chrome !== 'undefined' && chrome.runtime) {
  // Initialize settings manager for extension use
  // Only assign to window if it's available in the current context
  if (typeof window !== 'undefined') {
    window.SettingsManager = SettingsManager;
  } else {
    // For service worker context, make it globally available differently
    globalThis.SettingsManager = SettingsManager;
  }
}