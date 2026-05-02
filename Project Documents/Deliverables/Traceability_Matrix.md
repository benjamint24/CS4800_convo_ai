# ConvoAI - Traceability Matrix

**Date:** April 27, 2026

---

## Use Case to Test Case Mapping

| Use Case | Description | Test Cases | Coverage |
|---|---|---|---|
| UC-01 | User Registration & Authentication | TC-001 | ✓ |
| UC-02 | User Login & Session | TC-001, TC-006 | ✓ |
| UC-03 | Select Language for Practice | TC-002, TC-007 | ✓ |
| UC-04 | Text-Based Chat (Multi-Lang) | TC-003 | ✓ |
| UC-05 | Voice-to-Text Transcription | TC-004 | ✓ |
| UC-06 | Text-to-Speech Synthesis | TC-005 | ✓ |
| UC-07 | Error Handling & Validation | TC-007 | ✓ |
| UC-08 | Context Reset on Change | TC-002 | ✓ |
| UC-09 | Logout & Session Cleanup | TC-006 | ✓ |
| UC-10 | Romanization (CJK Languages) | TC-003, TC-004 | ✓ |

**Total Coverage: 10/10 Use Cases (100%)**

---

## Test Case to Use Case Mapping

| Test Case | Title | Primary Use Cases | Secondary Use Cases |
|---|---|---|---|
| TC-001 | Registration & Login | UC-01, UC-02 | — |
| TC-002 | Language Context Reset | UC-03, UC-08 | — |
| TC-003 | All 5 Languages Text | UC-04, UC-10 | — |
| TC-004 | Voice Multi-Language | UC-05, UC-10 | — |
| TC-005 | Text-to-Speech | UC-06 | — |
| TC-006 | Logout & Session | UC-02, UC-09 | — |
| TC-007 | Language Validation | UC-03, UC-07 | — |

---

## Coverage Summary

✅ **Authentication:** TC-001 covers registration & login  
✅ **Language Selection:** TC-002, TC-007 cover language switching & validation  
✅ **Text Chat:** TC-003 covers all 5 languages with romanization verification  
✅ **Voice Features:** TC-004, TC-005 cover transcription & synthesis  
✅ **Session Management:** TC-006 covers logout & cleanup  
✅ **Error Handling:** TC-007 validates language codes across endpoints  
✅ **Context Reset:** TC-002 verifies history clears on language change

---

## Testing Priority

**Blocker (Must Pass First):**
- TC-001 (Registration, foundation for all tests)
- TC-002 (Language selection, core feature)
- TC-003 (Text chat, core feature)
- TC-004 (Voice input, core feature)

**High (Must Pass):**
- TC-005 (Voice output)
- TC-006 (Session cleanup)
- TC-007 (Error handling)

---

## Requirements Met

| Requirement | Test Case | Status |
|---|---|---|
| 5 Languages (EN,ES,ZH,KO,JA) | TC-003, TC-004, TC-005 | ✓ |
| Voice transcription | TC-004 | ✓ |
| Voice synthesis | TC-005 | ✓ |
| Text chat | TC-003 | ✓ |
| Romanization (CJK) | TC-003, TC-004 | ✓ |
| User registration | TC-001 | ✓ |
| Session management | TC-001, TC-006 | ✓ |
| Language validation | TC-007 | ✓ |
| Context reset | TC-002 | ✓ |
| Error handling | TC-007 | ✓ |

**Total Requirements Covered: 10/10 (100%)**

