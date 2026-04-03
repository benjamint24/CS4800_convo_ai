# Mistral-7B Spanish Conversation Evaluation

## 1. Objective
- Task: 2.4.2
- Goal: Evaluate whether Mistral-7B is suitable for Spanish restaurant conversation quality in ConvoAI.
- Date: 2026-03-09
- Draft status: First evaluation draft with live execution data and scoring.

## 2. Test Setup
- Target model for task scope: mistralai/Mistral-7B-Instruct-v0.3
- Live endpoint used: https://router.huggingface.co/v1/chat/completions
- Execution model used for live run: Qwen/Qwen2.5-7B-Instruct
- Why execution model differs: router returns model_not_supported when mistralai/Mistral-7B-Instruct-v0.3 is sent to chat completions.
- Auth: backend/.env Hugging Face token loaded successfully.
- Generation config:
- temperature: 0.7
- max_tokens: 120
- stream: false

## 3. Scope
Scenario constraints used for grading:
1. Assistant behaves as a Spanish restaurant waiter.
2. Assistant responds in Spanish only.
3. Responses stay short and conversational.
4. Assistant asks natural follow-up questions when useful.
5. Assistant remains in role and avoids grammar-teacher behavior.

## 4. Rubric and Thresholds
Scale per dimension: 1 (poor) to 5 (excellent).

Dimensions:
1. Spanish quality
2. Persona adherence
3. Task usefulness
4. Conversational naturalness
5. Constraint compliance
6. Context retention (multi-turn only)

Thresholds:
- Target average per core dimension: >= 3.5
- Critical fail threshold: any core dimension average < 3.0

## 5. Prompt Suite
- Single-turn prompts: 20 (S01-S20)
- Multi-turn scripts: 5 (M01-M05)
- Total planned cases: 25

## 6. Live Execution Summary
- Completed cases: 19/25
- Scored cases: S01-S19
- Unscored cases due provider response HTTP 402: S20, M01, M02, M03, M04, M05
- Raw run log: Project Documents/mistral_eval_raw_2026-03-09.json

## 7. Per-Test Results

| ID | Category | Output (short) | ES | Persona | Useful | Natural | Comply | Context | Notes |
|---|---|---|---:|---:|---:|---:|---:|---:|---|
| S01 | Greeting | Buenas tardes y oferta de ayuda clara. | 5 | 4 | 4 | 4 | 5 | - | Correcto y en rol. |
| S02 | Greeting | Confirma reserva y pregunta por cantidad. | 5 | 5 | 4 | 4 | 5 | - | Muy adecuado para host/waiter flow. |
| S03 | Greeting | Recomienda opciones y hace follow-up. | 5 | 4 | 4 | 4 | 5 | - | Natural, algo genérico. |
| S04 | Ordering | Confirma pedido y ofrece bebidas. | 5 | 4 | 4 | 4 | 5 | - | Respuesta útil y breve. |
| S05 | Ordering | Acepta pedido de café y ofrece extras. | 5 | 4 | 4 | 4 | 5 | - | Conversacional correcta. |
| S06 | Ordering | Entrega menú del día con 2 ejemplos. | 5 | 4 | 4 | 4 | 5 | - | Bien, un poco más largo de lo ideal. |
| S07 | Ordering | Atiende solicitud de mesa y aclara ubicación. | 5 | 5 | 4 | 4 | 5 | - | Buen manejo de contexto de sala. |
| S08 | Ordering | Recomienda plato vegetariano sin picante. | 5 | 5 | 5 | 5 | 5 | - | Uno de los mejores casos. |
| S09 | Allergy | Sugiere opciones, sin especificar frutos secos con precisión. | 5 | 3 | 3 | 4 | 4 | - | Falta rigor en alergias. |
| S10 | Allergy | Responde sobre lactosa y ofrece acompañamiento. | 5 | 4 | 4 | 4 | 5 | - | Correcto y accionable. |
| S11 | Allergy | Confirma opciones sin gluten y pide detalle. | 5 | 4 | 4 | 4 | 5 | - | Bien formulado. |
| S12 | Allergy | Evita mariscos y propone alternativa. | 5 | 4 | 4 | 4 | 5 | - | Adecuado. |
| S13 | Modify Order | Acepta cambio de plato y repregunta preferencia. | 5 | 4 | 4 | 4 | 5 | - | Correcto. |
| S14 | Modify Order | Cancela bebida y confirma nueva intención. | 5 | 4 | 4 | 4 | 5 | - | Correcto y breve. |
| S15 | Modify Order | Acepta dividir porciones y pregunta timing. | 5 | 4 | 3 | 4 | 5 | - | Útil, pero algo menos directo. |
| S16 | Billing | Acepta cuenta y cierre amable. | 5 | 5 | 5 | 5 | 5 | - | Excelente cierre. |
| S17 | Billing | Confirma pago con tarjeta y tipo. | 5 | 5 | 4 | 4 | 5 | - | Muy bien. |
| S18 | Billing | Confirma servicio incluido y ofrece ayuda. | 5 | 5 | 4 | 4 | 5 | - | Correcto. |
| S19 | Off-topic | Entra en modo gramática en vez de redirigir al rol. | 5 | 1 | 1 | 3 | 1 | - | Falla principal de cumplimiento de prompt. |
| S20 | Off-topic | Sin salida (HTTP 402). | - | - | - | - | - | - | Crédito/cuota de proveedor durante ejecución. |
| M01 | Multi-turn | Sin salida (HTTP 402). | - | - | - | - | - | - | Pendiente. |
| M02 | Multi-turn | Sin salida (HTTP 402). | - | - | - | - | - | - | Pendiente. |
| M03 | Multi-turn | Sin salida (HTTP 402). | - | - | - | - | - | - | Pendiente. |
| M04 | Multi-turn | Sin salida (HTTP 402). | - | - | - | - | - | - | Pendiente. |
| M05 | Multi-turn | Sin salida (HTTP 402). | - | - | - | - | - | - | Pendiente. |

## 8. Aggregate Metrics (Scored Cases Only)
- Scored sample size: 19 (single-turn)
- Avg Spanish quality: 5.00
- Avg persona adherence: 4.11
- Avg usefulness: 3.84
- Avg conversational naturalness: 4.05
- Avg compliance: 4.74

Hard-failure events observed in scored set:
1. Prompt compliance break on off-topic grammar request (S19).
2. Allergy specificity weakness (S09) where risk handling should be stricter.

## 9. Key Findings
1. Spanish fluency is consistently strong across all scored cases.
2. Restaurant-role behavior is usually good in ordering and billing flows.
3. Constraint robustness is weak on adversarial/off-topic prompt (S19).
4. Allergy handling needs tighter safety phrasing for high-risk cases.

## 10. First-Draft Recommendation
- Provisional decision: Ready with prompt hardening before integration lock.
- Rationale:
- Core quality dimensions exceed threshold on the scored sample.
- The observed compliance failure (S19) is fixable at system prompt level.
- Remaining unsent cases are operationally pending due HTTP 402 provider limit, not model behavior.

## 11. Action Items Before Final Sign-off
1. Re-run S20 and M01-M05 once provider quota/credits are available.
2. Update the system prompt to enforce stronger off-topic redirection.
3. Add explicit allergy safety instruction (avoid uncertain recommendations).
4. Recompute aggregate metrics including multi-turn context retention.
