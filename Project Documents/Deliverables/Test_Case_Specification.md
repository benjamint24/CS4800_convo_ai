# ConvoAI - Test Case Specification

**Date:** April 27, 2026

---

## Test Cases

### TC-001: User Registration and Login
**Priority:** Blocker

**PRECONDITIONS:** App running, test user doesn't exist

**TEST STEPS:**
1. Register with email: `testuser@example.com`, password: `SecurePass123`
2. Login with same credentials
3. Verify redirect to home, token stored in localStorage

**EXPECTED RESULTS:** Registration succeeds (HTTP 201), login succeeds, chat route accessible, session persists

---

### TC-002: Language Selection with Context Reset
**Priority:** Blocker

**PRECONDITIONS:** User logged in on Chat page

**TEST STEPS:**
1. Start chat in English, send "What do you recommend?"
2. Switch to Spanish language
3. Verify message history cleared
4. Send message in Spanish, receive Spanish response with Spanish restaurant context

**EXPECTED RESULTS:** History clears on language switch, Spanish response includes Spanish dishes (paella, tapas)

---

### TC-003: Text Chat - All 5 Languages
**Priority:** Blocker

**PRECONDITIONS:** User logged in

**TEST STEPS:**
1. Test English: send "Hello", verify English response
2. Test Spanish: send "Hola", verify Spanish response  
3. Test Chinese (romanized): send "Ni hao", verify romanized Pinyin only (NO Chinese characters)
4. Test Korean (romanized): send "Annyeonghaseyo", verify romanized only (NO Korean characters)
5. Test Japanese (romanized): send "Konnichiwa", verify romanized only (NO Japanese characters)

**EXPECTED RESULTS:** All languages respond with HTTP 200, CJK responses contain ONLY romanized text

---

### TC-004: Voice Transcription Multi-Language
**Priority:** Blocker

**PRECONDITIONS:** Microphone enabled, ElevenLabs API configured

**TEST STEPS:**
1. Enable voice input, speak: "I'd like a table for two"
2. Verify transcription completes, text appears in input field
3. Submit and receive AI response
4. Switch to Chinese (zh), verify language code maps to zho (NOT cmn)

**EXPECTED RESULTS:** Voice recording works, transcription accurate, Chinese uses correct zho code

---

### TC-005: Text-to-Speech Audio Synthesis
**Priority:** High

**PRECONDITIONS:** Chat page, AI response ready

**TEST STEPS:**
1. Send message, receive AI response
2. Click play button next to response
3. Listen to audio playback
4. Verify English has English accent, Spanish has Spanish accent, Chinese has Mandarin tone

**EXPECTED RESULTS:** HTTP 200 from synthesis API, appropriate accent per language, VoiceOrb shows playing state

---

### TC-006: Logout and Session Management
**Priority:** High

**PRECONDITIONS:** User logged in with chat history

**TEST STEPS:**
1. Verify email displayed in chat header
2. Click Logout button
3. Verify redirect to login, localStorage token cleared
4. Try direct navigation to `/chat`, verify redirected to `/login`

**EXPECTED RESULTS:** Session cleared, token removed, protected routes enforced

---

### TC-007: Language Validation and Error Handling
**Priority:** High

**TEST STEPS:**
1. Attempt chat message with invalid language "xx", verify HTTP 400 "INVALID_LANGUAGE"
2. Attempt voice with language "invalid", verify HTTP 400
3. Test valid languages "en" and "zh", verify HTTP 200

**EXPECTED RESULTS:** Invalid codes rejected, valid codes accepted, both endpoints validate consistently

---

## Quick Test Checklist

| Test | Status |
|---|---|
| TC-001: Registration & Login | ⬜ |
| TC-002: Language Context Reset | ⬜ |
| TC-003: All 5 Languages Text | ⬜ |
| TC-004: Voice Multi-Language | ⬜ |
| TC-005: Text-to-Speech | ⬜ |
| TC-006: Logout & Session | ⬜ |
| TC-007: Language Validation | ⬜ |

