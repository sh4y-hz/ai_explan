# Requirements: AI_explan Browser Extension

**Defined:** 2026-03-06
**Core Value:** Users can understand unfamiliar terminology in context without losing their train of thought or disrupting their primary workflow.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Extension Core

- [ ] **CORE-01**: Extension installs and activates/deactivates via toolbar icon
- [ ] **CORE-02**: Right-click context menu shows "AI_explan" option when text is selected
- [ ] **CORE-03**: Clicking "AI_explan" opens slide-out sidebar panel
- [ ] **CORE-04**: Panel displays with smooth animation from right side of browser
- [ ] **CORE-05**: Panel can be closed with 'X' button or by clicking outside
- [ ] **CORE-06**: Extension remembers activation state between browser sessions

### Explanation Interface

- [ ] **EXPL-01**: Panel displays three-part explanation: basic definition, contextual function, and reasoning
- [ ] **EXPL-02**: Explanation includes visual indicators to distinguish the three parts
- [ ] **EXPL-03**: Panel supports text selection for copying
- [ ] **EXPL-04**: Panel includes "Return to Main Conversation" button
- [ ] **EXPL-05**: Panel includes "Continue Exploring" area for follow-up questions

### Context Handling

- [ ] **CTX-01**: Extension captures selected text along with surrounding context (up to 3 rounds of conversation by default)
- [ ] **CTX-02**: Context retrieval configurable via settings (default 3 rounds)
- [ ] **CTX-03**: Context properly formats text from various web pages (paragraphs, lists, code blocks)
- [ ] **CTX-04**: Context preserves essential formatting for comprehension

### AI Integration

- [ ] **AI-01**: Extension connects to Qwen API for term explanations
- [ ] **AI-02**: Extension connects to Kimi API for term explanations
- [ ] **AI-03**: API calls include selected text and contextual information
- [ ] **AI-04**: Response handling manages different response formats from APIs
- [ ] **AI-05**: Error handling for API connection issues

### UI/UX

- [ ] **UI-01**: Sidebar panel responsive to browser window size
- [ ] **UI-02**: Panel width adjustable by user preference
- [ ] **UI-03**: Clean, minimal design that doesn't compete with main content
- [ ] **UI-04**: Dark/light mode matching system preference
- [ ] **UI-05**: Smooth animations for panel opening/closing

### Configuration

- [ ] **CONF-01**: Settings accessible via toolbar popup menu
- [ ] **CONF-02**: Context length configurable (default 3 rounds)
- [ ] **CONF-03**: API endpoint selection (Qwen, Kimi)
- [ ] **CONF-04**: Panel appearance customization (width, transparency)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Multi-Browser Support
- **MB-01**: Firefox extension support
- **MB-02**: Safari extension support
- **MB-03**: Edge extension support

### Enhanced AI Features
- **EAI-01**: Support for additional AI model providers
- **EAI-02**: Local AI model integration
- **EAI-03**: Custom knowledge base integration

### Advanced Context
- **EADV-01**: Cross-tab context awareness
- **EADV-02**: Persistent conversation history
- **EADV-03**: Context sharing between users

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Account management | Deferring to v2+ |
| Cloud synchronization | Privacy concerns, deferring to v2+ |
| Web application version | Browser extension focus for v1 |
| Offline functionality | Requires local models, deferring to v2+ |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORE-01 | Phase 1 | Pending |
| CORE-02 | Phase 1 | Pending |
| CORE-03 | Phase 1 | Pending |
| CORE-04 | Phase 1 | Pending |
| CORE-05 | Phase 1 | Pending |
| CORE-06 | Phase 1 | Pending |
| EXPL-01 | Phase 2 | Pending |
| EXPL-02 | Phase 2 | Pending |
| EXPL-03 | Phase 2 | Pending |
| EXPL-04 | Phase 2 | Pending |
| EXPL-05 | Phase 2 | Pending |
| CTX-01 | Phase 3 | Pending |
| CTX-02 | Phase 3 | Pending |
| CTX-03 | Phase 3 | Pending |
| CTX-04 | Phase 3 | Pending |
| AI-01 | Phase 4 | Pending |
| AI-02 | Phase 4 | Pending |
| AI-03 | Phase 4 | Pending |
| AI-04 | Phase 4 | Pending |
| AI-05 | Phase 4 | Pending |
| UI-01 | Phase 5 | Pending |
| UI-02 | Phase 5 | Pending |
| UI-03 | Phase 5 | Pending |
| UI-04 | Phase 5 | Pending |
| UI-05 | Phase 5 | Pending |
| CONF-01 | Phase 6 | Pending |
| CONF-02 | Phase 6 | Pending |
| CONF-03 | Phase 6 | Pending |
| CONF-04 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-06*
*Last updated: 2026-03-06 after initial definition*