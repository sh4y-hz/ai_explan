---
phase: 1
slug: extension-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-06
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | manual testing / browser dev tools |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `manual inspection` |
| **Full suite command** | `manual testing checklist` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Manual inspection of extension
- **After every plan wave:** Manual testing of functionality
- **Before `/gsd:verify-work`:** Full functionality must work
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | CORE-01 | manual | `manual test` | ✅ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | CORE-02 | manual | `manual test` | ✅ W0 | ⬜ pending |
| 01-03-01 | 03 | 1 | CORE-03 | manual | `manual test` | ✅ W0 | ⬜ pending |
| 01-04-01 | 04 | 1 | CORE-04 | manual | `manual test` | ✅ W0 | ⬜ pending |
| 01-05-01 | 05 | 1 | CORE-05 | manual | `manual test` | ✅ W0 | ⬜ pending |
| 01-06-01 | 06 | 1 | CORE-06 | manual | `manual test` | ✅ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `manifest.json` — core extension definition
- [ ] `src/background.js` — service worker
- [ ] `src/content.js` — content script
- [ ] `src/popup.html` — toolbar popup
- [ ] `src/sidebar.html` — sidebar panel
- [ ] `package.json` — if needed for build process

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Extension installs and activates/deactivates | CORE-01 | Browser extension functionality | Install extension, click toolbar icon, verify activation state changes |
| Context menu shows "AI_explan" | CORE-02 | Browser UI interaction | Select text on webpage, right-click, verify context menu option appears |
| Sidebar opens from right edge | CORE-03 | Visual UI behavior | Click context menu option, verify sidebar slides in from right |
| Smooth animations | CORE-04 | Visual UI behavior | Open/close sidebar multiple times, verify smooth CSS transitions |
| Close panel functionality | CORE-05 | UI interaction | Click 'X' button and click outside panel, verify it closes |
| State persistence | CORE-06 | Data persistence | Activate extension, close browser, reopen, verify activation state maintained |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending