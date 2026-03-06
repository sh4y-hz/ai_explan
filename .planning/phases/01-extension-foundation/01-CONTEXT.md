# Phase 1: Extension Foundation - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement core extension infrastructure and UI framework. This includes the basic extension setup with toolbar icon, context menu integration, and slide-out sidebar panel that can open and close smoothly. The extension should be able to activate/deactivate and maintain its state between sessions.

</domain>

<decisions>
## Implementation Decisions

### Extension Architecture
- Manifest V3 - Use modern Chrome extension standards
- Service Worker - For background event handling
- Content Script - For interacting with web page DOM
- Popup UI - For settings and extension state control

### Toolbar Activation
- Extension activates/deactivates via toolbar icon click
- Icon shows clear visual state (active/inactive)
- Activation state persists across browser sessions
- Simple toggle mechanism with clear visual feedback

### Context Menu Integration
- "AI_explan" option appears in right-click context menu when text is selected
- Menu item only appears when text is selected on the page
- Clicking menu item triggers sidebar panel to open from right edge

### Sidebar Panel Implementation
- Panel slides out from right side of browser window
- Smooth CSS animation for opening/closing (300ms ease)
- Panel can be closed by clicking 'X' button or clicking outside the panel
- Panel overlays page content without resizing the main page

### Claude's Discretion
- Specific CSS styling and visual design
- Exact animation timing and easing functions
- File structure organization
- Internal component communication methods

</decisions>

<specifics>
## Specific Ideas

- The sidebar should be non-intrusive and not compete visually with main page content
- Panel width should be reasonable (around 400px) to not overwhelm the main content
- Visual feedback for extension activation state is important

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- None (starting from scratch)

### Established Patterns
- None (starting from scratch)

### Integration Points
- Chrome extension APIs for context menus, storage, and action buttons
- Content script injection mechanism
- Communication between content script, popup and background service worker

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---
*Phase: 01-extension-foundation*
*Context gathered: 2026-03-06*