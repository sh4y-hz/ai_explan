---
title: "Phase 1: Extension Foundation"
phase: 1
wave: 1
depends_on: []
files_modified:
  - "manifest.json"
  - "src/background.js"
  - "src/content.js"
  - "src/popup.html"
  - "src/popup.js"
  - "src/popup.css"
  - "src/sidebar.html"
  - "src/sidebar.js"
  - "src/sidebar.css"
  - "assets/icon.png"
autonomous: true
---

# Phase 1: Extension Foundation

## Overview
Implement core extension infrastructure and UI framework. This includes the basic extension setup with toolbar icon, context menu integration, and slide-out sidebar panel that can open and close smoothly. The extension should be able to activate/deactivate and maintain its state between sessions.

## Requirements Coverage
This plan addresses the following requirements from REQUIREMENTS.md:
- CORE-01: Extension installs and activates/deactivates via toolbar icon
- CORE-02: Right-click context menu shows "AI_explan" option when text is selected
- CORE-03: Clicking "AI_explan" opens slide-out sidebar panel
- CORE-04: Panel displays with smooth animation from right side of browser
- CORE-05: Panel can be closed with 'X' button or by clicking outside
- CORE-06: Extension remembers activation state between browser sessions

## Implementation Plan

<task id="01-01">
### Task 01-01: Create Manifest File
**Objective:** Create the manifest.json file with proper configurations for Manifest V3

**Steps:**
1. Create manifest.json file in root directory
2. Set manifest version to 3
3. Add name, version, description
4. Define permissions: "activeTab", "contextMenus", "storage"
5. Register background service worker
6. Define content script
7. Define action (browser_action)
8. Add icons reference

**Verification:**
- [ ] manifest.json file exists with correct structure
- [ ] All required permissions are included
- [ ] Background service worker registered
- [ ] Content script defined
- [ ] Action properly configured
</task>

<task id="01-02">
### Task 01-02: Implement Background Service Worker
**Objective:** Create background script to handle extension events

**Steps:**
1. Create src/background.js file
2. Implement installation handler to set initial state
3. Register context menu when extension is installed/updated
4. Add message listener for communication with content script
5. Implement state management using chrome.storage

**Verification:**
- [ ] Background script handles installation correctly
- [ ] Context menu is registered when extension loads
- [ ] Message listener is properly set up
- [ ] State is managed with chrome.storage
</task>

<task id="01-03">
### Task 01-03: Create Content Script
**Objective:** Implement content script to detect text selection and inject sidebar

**Steps:**
1. Create src/content.js file
2. Implement text selection detection
3. Add context menu visibility logic (only when text is selected)
4. Set up communication channel with background script
5. Implement sidebar injection logic
6. Add message listener for commands from background

**Verification:**
- [ ] Content script detects text selection properly
- [ ] Context menu appears only when text is selected
- [ ] Communication with background works
- [ ] Sidebar injection functionality implemented
</task>

<task id="01-04">
### Task 01-04: Build Popup Interface
**Objective:** Create toolbar popup for extension controls

**Steps:**
1. Create src/popup.html with basic UI elements
2. Add toggle switch for extension activation
3. Create src/popup.js for interaction logic
4. Add CSS styling in src/popup.css
5. Implement state visualization and update

**Verification:**
- [ ] Popup UI displays when toolbar icon clicked
- [ ] Toggle switch reflects extension state
- [ ] State changes are persisted
- [ ] Visual feedback for activation state is clear
</task>

<task id="01-05">
### Task 01-05: Create Sidebar UI
**Objective:** Build sidebar panel interface for term explanations

**Steps:**
1. Create src/sidebar.html with container and close button
2. Implement sliding animation with CSS
3. Create src/sidebar.js for behavior logic
4. Add CSS styling for positioning and animations in src/sidebar.css
5. Implement close functionality (X button and click outside)

**Verification:**
- [ ] Sidebar slides in smoothly from right edge
- [ ] Close button functionality works
- [ ] Click outside also closes the panel
- [ ] Animation timing is appropriate (300ms ease)
</task>

<task id="01-06">
### Task 01-06: Integrate Components
**Objective:** Connect all components and finalize core functionality

**Steps:**
1. Ensure proper communication between all components
2. Implement activation state persistence across sessions
3. Test context menu appearance when text is selected
4. Verify sidebar opens on context menu click
5. Test that extension state persists between browser sessions
6. Ensure sidebar does not interfere with main page content

**Verification:**
- [ ] Extension activates/deactivates via toolbar icon
- [ ] Context menu appears when text is selected
- [ ] Sidebar opens from right edge when menu option selected
- [ ] Panel can be closed via 'X' button or clicking outside
- [ ] Extension activation state persists between browser sessions
</task>

## Success Criteria
Based on ROADMAP.md, Phase 1 is successful when:
1. User can install and activate extension via toolbar icon
2. Selected text triggers context menu with "AI_explan" option
3. Sidebar panel opens smoothly from right edge of browser
4. Panel can be closed and extension state persists between sessions

## Validation
- All requirements CORE-01 through CORE-06 are addressed
- Extension functions as described in PROJECT.md
- Implementation follows decisions documented in CONTEXT.md