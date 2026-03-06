// AI_explan Content Script
// Detects text selection and handles sidebar injection

let sidebarInjected = false;
let currentSelectedText = '';

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch(request.action) {
    case 'openSidebar':
      currentSelectedText = request.selectedText;
      injectSidebar();
      break;

    case 'closeSidebar':
      closeSidebar();
      break;

    default:
      console.log('Unknown message received in content script:', request);
  }
});

// Inject sidebar into the page
function injectSidebar() {
  // Check if sidebar already exists
  if (document.getElementById('ai-explan-sidebar')) {
    // If it exists, just update the content and show it
    updateSidebarContent(currentSelectedText);
    showSidebar();
    return;
  }

  // Create sidebar container
  const sidebar = document.createElement('div');
  sidebar.id = 'ai-explan-sidebar';
  sidebar.innerHTML = `
    <div id="ai-explan-sidebar-header">
      <h3>AI_explan</h3>
      <button id="ai-explan-close-btn">&times;</button>
    </div>
    <div id="ai-explan-content">
      <p>Explaining: <strong>"${currentSelectedText}"</strong></p>
      <div id="ai-explan-result">Processing your request...</div>
    </div>
  `;

  // Add styles to the sidebar
  const style = document.createElement('style');
  style.textContent = `
    #ai-explan-sidebar {
      position: fixed;
      top: 0;
      right: 0;
      width: 400px;
      height: 100vh;
      background-color: white;
      box-shadow: -2px 0 10px rgba(0,0,0,0.1);
      z-index: 1000000;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease;
      transform: translateX(100%);
    }

    #ai-explan-sidebar.ai-explan-open {
      transform: translateX(0);
    }

    #ai-explan-sidebar-header {
      padding: 15px;
      background-color: #f5f5f5;
      border-bottom: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    #ai-explan-close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      margin: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #ai-explan-content {
      padding: 15px;
      overflow-y: auto;
      flex-grow: 1;
    }

    #ai-explan-result {
      margin-top: 10px;
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(sidebar);

  // Add event listeners
  document.getElementById('ai-explan-close-btn').addEventListener('click', closeSidebar);
  document.addEventListener('click', handleOutsideClick);

  // Show the sidebar with animation
  setTimeout(() => {
    sidebar.classList.add('ai-explan-open');
  }, 10);
}

// Update sidebar content
function updateSidebarContent(text) {
  const contentDiv = document.getElementById('ai-explan-result');
  if (contentDiv) {
    contentDiv.innerHTML = `<p>Explaining: <strong>"${text}"</strong></p><p>Processing your request...</p>`;
  }
}

// Show the sidebar
function showSidebar() {
  const sidebar = document.getElementById('ai-explan-sidebar');
  if (sidebar && !sidebar.classList.contains('ai-explan-open')) {
    sidebar.classList.add('ai-explan-open');
  }
}

// Close the sidebar
function closeSidebar() {
  const sidebar = document.getElementById('ai-explan-sidebar');
  if (sidebar) {
    sidebar.classList.remove('ai-explan-open');

    // Remove the sidebar after animation completes
    setTimeout(() => {
      sidebar.remove();
      // Find and remove the specific style element
      const allStyles = document.querySelectorAll('style');
      for (let i = 0; i < allStyles.length; i++) {
        if (allStyles[i].textContent.includes('#ai-explan-sidebar')) {
          allStyles[i].remove();
          break;
        }
      }
    }, 300);
  }
}

// Handle clicking outside the sidebar
function handleOutsideClick(event) {
  const sidebar = document.getElementById('ai-explan-sidebar');
  if (sidebar && sidebar.classList.contains('ai-explan-open') &&
      !sidebar.contains(event.target) &&
      event.target.id !== 'ai-explan-close-btn') {
    // Only close if the click wasn't inside the sidebar or on the close button
    if (!sidebar.contains(event.target)) {
      closeSidebar();
    }
  }
}

// Monitor text selection to enable/disable context menu
document.addEventListener('mouseup', () => {
  setTimeout(() => {
    const selectedText = window.getSelection().toString().trim();

    // Notify background script about selection state
    chrome.runtime.sendMessage({
      action: 'textSelectionChanged',
      hasSelection: selectedText.length > 0
    }).catch((error) => {
      // Ignore errors if background script isn't ready yet
    });
  }, 1);
});