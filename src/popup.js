// AI_explan Popup Script
// Handles the popup UI and state management

document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggle-switch');
  const statusText = document.getElementById('status-text');

  // Get the current extension state
  chrome.runtime.sendMessage({ action: 'getState' }, (response) => {
    if (response && response.isActive !== undefined) {
      const isActive = response.isActive;
      toggleSwitch.checked = isActive;
      updateStatusText(isActive);
    } else {
      // Default to active if there's an issue getting state
      toggleSwitch.checked = true;
      updateStatusText(true);
    }
  });

  // Handle toggle switch changes
  toggleSwitch.addEventListener('change', () => {
    const newState = toggleSwitch.checked;

    // Update the extension state
    chrome.runtime.sendMessage({
      action: 'toggleState',
      state: newState
    }, (response) => {
      if (response && response.isActive !== undefined) {
        updateStatusText(response.isActive);
      }
    });
  });

  // Update the status text based on extension state
  function updateStatusText(isActive) {
    statusText.textContent = isActive ? 'Extension Active' : 'Extension Inactive';
    statusText.style.color = isActive ? '#4CAF50' : '#999';
  }
});