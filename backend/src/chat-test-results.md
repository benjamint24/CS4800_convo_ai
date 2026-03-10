# Chat Endpoint Test Results (Task 2.4.6)

## 1. Test Setup
- Date: 2026-03-09
- Execution mode: In-process API runner against Express app
- Backend source: backend/src/app.js
- Test artifact source: backend/src/chat-flow-test-output.json
- Environment checks:
- backend/.env exists: true
- JWT_SECRET present: true
- HUGGINGFACE_API_KEY present: true

## 2. API Contract Under Test
- Endpoint: POST /api/chat
- Authentication: Bearer JWT required
- Required request field: message (string)
- Optional request fields: history, learnerLevel, region, tone
- Expected success fields: assistantMessage, model, usage, timestamp, promptVersion
- Expected error fields: error, message, details (optional), timestamp

## 3. Test Matrix
| ID | Scenario | Expected | Actual | Status |
|---|---|---|---|---|
| T01 | Register new user | 201 | 500 Server error | Fail |
| T02 | Login valid credentials | 200 + token | 500 Server error | Fail |
| T03 | Chat missing token | 401 | 401 (No token provided) | Pass |
| T04 | Chat invalid token | 401 | 401 (Unauthorized) | Pass |
| T05 | Chat empty message | 400 validation | 400 CHAT_VALIDATION_ERROR | Pass |
| T06 | Chat invalid history role | 400 validation | 400 CHAT_VALIDATION_ERROR | Pass |
| T07 | Chat single-turn success | 200 assistant reply | 400 CHAT_VALIDATION_ERROR (provider returned 404 Not Found) | Fail |
| T08 | Auth regression wrong password | 400 Invalid credentials | 500 Server error | Fail |
| T09 | Auth regression missing register fields | 400 | 400 Email and password required | Pass |
| T10 | Protected GET /api/chat regression | 200 protected payload | 200 protected payload | Pass |

## 4. Multi-Turn Context Results (5 required scripts)
All 5 scripted flows failed at request validation before inference due prompt length constraint.

| Flow ID | Theme | Turn 1 Status | Turn 2 Status | Continuity Result |
|---|---|---:|---:|---|
| F1-order-modify | order then modify | 400 | 400 | Fail |
| F2-food-then-drink | drink follow-up | 400 | 400 | Fail |
| F3-allergy-clarify | allergy continuity | 400 | 400 | Fail |
| F4-billing-close | billing closeout | 400 | 400 | Fail |
| F5-offtopic-redirect | off-topic redirect | 400 | 400 | Fail |

Summary:
- multi-turn pass count: 0/5
- blocker: provider request path currently returns 404 Not Found

## 5. Error Handling Results
### Verified Pass
- Missing token handled with 401.
- Invalid token handled with 401.
- Invalid/empty payload handled with 400 and stable error format.

### Verified Issue
- Intended success-path chat request fails before any assistant output:
- error: CHAT_VALIDATION_ERROR
- details.statusCode: 404
- details.error.error: Not Found

### Provider Failure / Timeout Simulation
- Partially reached provider layer (404 upstream response observed).
- Timeout behavior not validated yet because provider call path is still failing.

## 6. Regression Results
### Auth endpoints
- POST /api/auth/register: failing (500)
- POST /api/auth/login: failing (500)

Observed root cause from runtime logs:
- Prisma datasource validation failure:
- DATABASE_URL does not start with postgresql:// or postgres://

### Protected route behavior
- GET /api/chat with valid JWT: pass (200)

## 7. Critical Blockers
### Blocker 1: Database URL invalid
Impact:
- auth register/login fail with 500
- full loop login -> chat cannot be validated

Fix needed:
- set backend/.env DATABASE_URL to valid postgres connection string format
- example format: postgresql://user:password@host:5432/dbname

### Blocker 2: Provider API path mismatch (404)
Impact:
- all chat success and multi-turn requests fail with 400
- no real inference call, no continuity validation

Fix needed:
1. migrate AI service request format to current Hugging Face router chat-completions API, or
2. switch to supported Hugging Face JS client for chat completion.

## 8. Repeatable Test Assets
- Runner script: backend/src/chat-flow-test-runner.js
- Raw results JSON: backend/src/chat-flow-test-output.json
- This report: backend/src/chat-test-results.md

## 9. Final Verdict
Status: Not ready

Completion criteria check:
1. Multi-turn 5 scripted flows: Not met (0/5)
2. Error handling verified and documented: Partially met
3. Repeatable test script available: Met
4. Full login -> chat flow verified: Not met

## 10. Next Actions
1. Fix DATABASE_URL format in backend/.env and verify auth success.
2. Migrate AI service request path/format to current Hugging Face router chat API.
3. Re-run runner script and update this report with:
- auth success statuses
- single-turn chat success
- 5/5 multi-turn continuity outcomes
- provider failure and timeout simulation results
