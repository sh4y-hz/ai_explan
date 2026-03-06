# Phase 1 Research: Extension Foundation

## Objective
Research how to implement Phase 1: Extension Foundation - Answer: "What do I need to know to PLAN this phase well?"

## Phase Description
Implement core extension infrastructure and UI framework. This includes the basic extension setup with toolbar icon, context menu integration, and slide-out sidebar panel that can open and close smoothly. The extension should be able to activate/deactivate and maintain its state between sessions.

## Phase Goal
Implement core extension infrastructure and UI framework

## Phase Requirement IDs (MUST address)
- CORE-01: Extension installs and activates/deactivates via toolbar icon
- CORE-02: Right-click context menu shows "AI_explan" option when text is selected
- CORE-03: Clicking "AI_explan" opens slide-out sidebar panel
- CORE-04: Panel displays with smooth animation from right side of browser
- CORE-05: Panel can be closed with 'X' button or by clicking outside
- CORE-06: Extension remembers activation state between browser sessions

## User Decisions from Context
- Extension Architecture: Manifest V3 with service workers, content scripts, and popup UI
- Toolbar Activation: Activates via toolbar icon click with clear visual state
- Context Menu Integration: "AI_explan" option appears when text is selected
- Sidebar Panel: Slides out from right side with smooth CSS animation

## Technical Approach

### Chrome Extension Architecture
- Manifest V3 (required for Chrome Web Store submission)
- Service Worker as background script (replaces persistent background pages)
- Content script for DOM interaction and text selection detection
- Popup HTML/CSS/JS for extension settings/ui

### Files Structure
- manifest.json (entry point, defines permissions, scripts, and UI)
- src/background.js (service worker for event handling)
- src/content.js (content script for DOM manipulation)
- src/popup.html (toolbar popup UI)
- src/popup.js (popup behavior)
- src/popup.css (popup styling)
- src/sidebar.html (sidebar panel UI)
- src/sidebar.js (sidebar behavior)
- src/sidebar.css (sidebar styling)

### Implementation Considerations
- Content scripts run in isolation, communicate with background via messaging
- Context menu creation and management using chrome.contextMenus API
- Sidebar panel injection as iframe or div element
- State persistence using chrome.storage API
- Communication between content script, background, and sidebar using messaging

### Security & Permissions
- activeTab permission for accessing currently active tab
- contextMenus permission for context menu functionality
- storage permission for saving extension state
- scripting permission for injecting sidebar

## Recommended Approach

1. Create manifest.json with proper configuration for MV3
2. Implement service worker (background.js) to handle extension events
3. Create content script (content.js) to detect text selection and inject sidebar
4. Build sidebar UI components (HTML/CSS/JS)
5. Implement communication channels between components
6. Add context menu registration in background script
7. Implement state persistence using chrome.storage

## Potential Challenges

- Content script sandbox limitations
- Messaging between different extension components
- Proper cleanup of injected elements
- Ensuring smooth animations and performance
- Cross-site scripting restrictions

## Validation Architecture
- Extension successfully installs and appears in browser
- Toolbar icon shows correct activation state
- Context menu appears only when text is selected
- Sidebar opens smoothly on context menu click
- Extension state persists across browser sessions
- Sidebar can be closed via 'X' button or clicking outside