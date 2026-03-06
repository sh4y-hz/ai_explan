// AI_explan Sidebar Script
// Handles sidebar behavior and interactions

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get required elements
  const closeBtn = document.getElementById('ai-explan-close-btn');
  const selectedTermElement = document.getElementById('selected-term');
  const resultElement = document.getElementById('ai-explan-result');

  // Add event listener to the close button
  closeBtn.addEventListener('click', () => {
    closeSidebar();
  });

  // Add click event listener to handle clicks outside the sidebar content
  // Note: This will be handled by the content script since the sidebar is embedded in the page

  // Function to close the sidebar
  function closeSidebar() {
    // Send message to background script to close the sidebar
    chrome.runtime.sendMessage({
      action: 'closeSidebar'
    });
  }

  // Function to update the term being explained
  function updateTerm(term) {
    if (selectedTermElement) {
      selectedTermElement.textContent = `"${term}"`;
    }
  }

  // Function to update the explanation result
  function updateResult(result) {
    if (resultElement) {
      resultElement.innerHTML = result;
    }
  }

  // Listen for messages from content script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request.action) {
      case 'updateTerm':
        updateTerm(request.term);
        break;

      case 'updateResult':
        updateResult(request.result);
        break;

      case 'showSidebar':
        showSidebar();
        break;

      case 'hideSidebar':
        hideSidebar();
        break;

      default:
        console.log('Unknown message received in sidebar:', request);
    }
  });

  // Function to show the sidebar with animation
  function showSidebar() {
    const container = document.getElementById('ai-explan-sidebar-container');
    if (container) {
      container.classList.add('sidebar-open');
    }
  }

  // Function to hide the sidebar with animation
  function hideSidebar() {
    const container = document.getElementById('ai-explan-sidebar-container');
    if (container) {
      container.classList.remove('sidebar-open');
    }
  }
});

// Helper function to get URL parameter (in case the term is passed via URL)
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}