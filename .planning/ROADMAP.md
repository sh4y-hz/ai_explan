# Roadmap: AI_explan Browser Extension

**Created:** 2026-03-06
**Project:** AI_explan Browser Extension
**Core Value:** Users can understand unfamiliar terminology in context without losing their train of thought or disrupting their primary workflow
**Total Phases:** 6
**Requirements Mapped:** 24/24 (100%)

## Phase 1: Extension Foundation
**Goal:** Implement core extension infrastructure and UI framework
**Success Criteria:**
1. User can install and activate extension via toolbar icon
2. Selected text triggers context menu with "AI_explan" option
3. Sidebar panel opens smoothly from right edge of browser
4. Panel can be closed and extension state persists between sessions

**Mapped Requirements:**
- CORE-01: Extension installs and activates/deactivates via toolbar icon
- CORE-02: Right-click context menu shows "AI_explan" option when text is selected
- CORE-03: Clicking "AI_explan" opens slide-out sidebar panel
- CORE-04: Panel displays with smooth animation from right side of browser
- CORE-05: Panel can be closed with 'X' button or by clicking outside
- CORE-06: Extension remembers activation state between browser sessions

## Phase 2: Explanation Interface
**Goal:** Design and implement the explanation presentation layer
**Success Criteria:**
1. Selected terms appear with three-part structured explanation
2. User can distinguish between definition, contextual function, and reasoning
3. Text in panel can be selected and copied
4. Clear navigation options exist for returning to main conversation
5. Area exists for follow-up exploration of concepts

**Mapped Requirements:**
- EXPL-01: Panel displays three-part explanation: basic definition, contextual function, and reasoning
- EXPL-02: Explanation includes visual indicators to distinguish the three parts
- EXPL-03: Panel supports text selection for copying
- EXPL-04: Panel includes "Return to Main Conversation" button
- EXPL-05: Panel includes "Continue Exploring" area for follow-up questions

## Phase 3: Context Handling
**Goal:** Implement intelligent context capture and preparation
**Success Criteria:**
1. Context around selected text captured appropriately (with default 3 rounds)
2. Context configuration is adjustable through settings
3. Various text formats from web pages are properly parsed
4. Essential formatting preserved for better comprehension

**Mapped Requirements:**
- CTX-01: Extension captures selected text along with surrounding context (up to 3 rounds of conversation by default)
- CTX-02: Context retrieval configurable via settings (default 3 rounds)
- CTX-03: Context properly formats text from various web pages (paragraphs, lists, code blocks)
- CTX-04: Context preserves essential formatting for comprehension

## Phase 4: AI Integration
**Goal:** Connect extension to Qwen and Kimi APIs for intelligent explanations
**Success Criteria:**
1. Extension successfully sends requests to Qwen API with context
2. Extension successfully sends requests to Kimi API with context
3. Responses are properly formatted and presented in the panel
4. Error conditions are gracefully handled when APIs are unavailable

**Mapped Requirements:**
- AI-01: Extension connects to Qwen API for term explanations
- AI-02: Extension connects to Kimi API for term explanations
- AI-03: API calls include selected text and contextual information
- AI-04: Response handling manages different response formats from APIs
- AI-05: Error handling for API connection issues

## Phase 5: UI/UX Polish
**Goal:** Refine user interface and experience for production readiness
**Success Criteria:**
1. Panel appearance adapts to browser window dimensions appropriately
2. User can customize panel width according to preference
3. Visual design complements rather than competes with main content
4. Theme follows system preferences for dark/light mode
5. Animations enhance rather than distract from the experience

**Mapped Requirements:**
- UI-01: Sidebar panel responsive to browser window size
- UI-02: Panel width adjustable by user preference
- UI-03: Clean, minimal design that doesn't compete with main content
- UI-04: Dark/light mode matching system preference
- UI-05: Smooth animations for panel opening/closing

## Phase 6: Configuration Framework
**Goal:** Provide user control over extension behavior and settings
**Success Criteria:**
1. Settings accessible through intuitive toolbar popup
2. Context length configurable with appropriate defaults
3. User can select preferred API endpoint (Qwen or Kimi)
4. Visual appearance customizable to user preferences

**Mapped Requirements:**
- CONF-01: Settings accessible via toolbar popup menu
- CONF-02: Context length configurable (default 3 rounds)
- CONF-03: API endpoint selection (Qwen, Kimi)
- CONF-04: Panel appearance customization (width, transparency)

## Implementation Notes
- Phases 1-4 form the core functionality of the extension
- Phase 5 enhances user experience with polish
- Phase 6 provides flexibility and customization
- Each phase delivers incremental value to the user
- Requirements not marked as "complete" after a phase remain on the backlog for future phases

---
*Roadmap created: 2026-03-06*
*Last updated: 2026-03-06 after initial roadmap creation*