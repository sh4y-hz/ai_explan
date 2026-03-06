# AI_explan Browser Extension

## What This Is

A browser extension that enables users to instantly explain selected terminology through a sidebar panel without interrupting their primary conversation or workflow. The extension provides contextual explanations that preserve thought continuity during AI discussions or document reading, featuring a "look up and dismiss" experience with seamless return to the main conversation.

## Core Value

Users can understand unfamiliar terminology in context without losing their train of thought or disrupting their primary workflow.

## Requirements

### Validated

(None yet — ship to validate)

### Active

<!-- Current scope. Building toward these. -->

- [ ] Browser extension that activates on text selection
- [ ] Right-click context menu integration with "AI_explan" option
- [ ] Slide-out sidebar panel for term explanations
- [ ] Three-part explanation format: basic definition, contextual function, and reasoning
- [ ] Context preservation from main conversation (default 3 rounds)
- [ ] Integration with Qwen and Kimi APIs
- [ ] Chrome browser support
- [ ] Responsive sidebar design
- [ ] Configuration for context length
- [ ] Ability to return to main conversation seamlessly
- [ ] Panel dismissal functionality ("burn after reading")

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Multi-browser support (Firefox, Safari, Edge) — Limited to Chrome for v1
- Additional AI model providers — Qwen and Kimi only for v1
- Account management or user data persistence — Local only for v1
- Advanced document parsing features — Basic text selection only

## Context

Modern users frequently encounter unfamiliar terminology during professional conversations with AI assistants or while reading complex documents. Existing solutions (separate tabs, direct questions to AI) break concentration and disrupt cognitive flow. This extension solves the context-switching problem by providing immediate, contextualized explanations in a non-intrusive sidebar.

## Constraints

- **Browser**: Chrome only — Focused development for initial release
- **Timeline**: MVP for personal use first — Commercial features deferred
- **Privacy**: Basic privacy considerations — Enhanced encryption deferred
- **API**: Qwen and Kimi integration — Other providers deferred to future versions
- **Technology**: Browser extension API compliance — Must work within browser security constraints

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Three-part explanation format | Users need basic understanding, contextual meaning, and reasoning | Implemented as foundation for all explanations |
| Chrome-first approach | Easier development and testing | May expand to other browsers later |
| Context length default 3 rounds | Balance between relevancy and performance | Configurable in settings |
| API integration approach | Leverage existing model subscriptions | Connect to Qwen and Kimi APIs |

---
*Last updated: 2026-03-06 after initialization*