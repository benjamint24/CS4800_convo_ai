# ConvoAI Backend Setup

This backend can be run using:

1. Docker Compose (recommended for full stack)
2. Local Node (if environment is stable)

--------------------------------------------------
PREREQUISITES

- PostgreSQL installed locally (see database-setup.md)
- Node 20 LTS (for local setup)
- Docker Desktop (for Docker setup)

--------------------------------------------------
OPTION A — DOCKER COMPOSE (RECOMMENDED)

From the project root:

docker compose up --build

This starts:

- PostgreSQL on port 5432
- Backend on http://localhost:5050
- Frontend on http://localhost:5173

To stop everything:

docker compose down

--------------------------------------------------
OPTION B — LOCAL NODE

1. Install Node 20 LTS:

nvm install 20
nvm use 20

Verify:
node -v

2. Install dependencies:

cd backend
npm install

3. Generate Prisma client:

npx prisma generate

4. Start server:

npm run dev

Backend runs at:
http://localhost:5050

--------------------------------------------------
ENVIRONMENT VARIABLES

Create backend/.env:

PORT=5050
DATABASE_URL=postgresql://YOUR_NAME@host.docker.internal:5432/convoai
JWT_SECRET=supersecret
HUGGINGFACE_API_KEY=yourkey
AI_MODEL_ID=mistralai/Mistral-7B-Instruct-v0.2  # Optional, defaults to Mistral-7B

--------------------------------------------------
AI SERVICE WRAPPER

The backend includes a centralized AI service layer that handles all Hugging Face API interactions.

LOCATION:
- Service: backend/src/services/ai.service.js
- Config: backend/src/config/ai.config.js
- Errors: backend/src/utils/ai-errors.js

USAGE EXAMPLE:

const { sendChatRequest } = require('./services/ai.service');

try {
  const result = await sendChatRequest({
    systemPrompt: 'You are a friendly Spanish restaurant waiter...',
    messages: [
      { role: 'user', content: 'Hola, quisiera ordenar.' }
    ],
    config: {
      temperature: 0.7,
      maxTokens: 512
    }
  });
  
  console.log(result.response);  // AI's reply
  console.log(result.usage);     // Token usage stats
} catch (error) {
  console.error(error.code);     // Machine-readable error code
  console.error(error.message);  // Human-readable message
}

RESPONSE SHAPE:

{
  response: string,           // The assistant's message
  model: string,              // Model ID used
  usage: {
    promptTokens: number,
    completionTokens: number,
    totalTokens: number
  },
  metadata: {
    provider: string,         // 'huggingface'
    finishReason: string,     // 'stop' or 'length'
    timestamp: string         // ISO 8601 timestamp
  }
}

ERROR TYPES:

All errors include:
- name: Error class name
- code: Machine-readable code (string)
- message: Human-readable description
- statusCode: Recommended HTTP status for API responses
- details: Additional context (object)

1. AIValidationError (400)
   Code: AI_VALIDATION_ERROR
   When: Invalid input (empty prompt, malformed messages, bad config)
   
2. AIConfigurationError (500)
   Code: AI_CONFIG_ERROR
   When: Missing/invalid configuration (API key, model ID)
   
3. AIProviderError (502)
   Code: AI_PROVIDER_ERROR
   When: Provider API fails (5xx errors, network failures)
   
4. AIQuotaError (429)
   Code: AI_QUOTA_EXCEEDED
   When: Rate limit or quota exceeded
   
5. AITimeoutError (504)
   Code: AI_TIMEOUT_ERROR
   When: Request exceeds timeout threshold (30s default)

ERROR HANDLING IN CONTROLLERS:

const { sendChatRequest } = require('../services/ai.service');
const { 
  AIValidationError, 
  AIProviderError,
  AIQuotaError 
} = require('../utils/ai-errors');

try {
  const result = await sendChatRequest({ ... });
  res.json(result);
} catch (error) {
  // All AI errors have statusCode property
  const status = error.statusCode || 500;
  
  res.status(status).json({
    error: error.code,
    message: error.message,
    details: error.details
  });
}

CONFIGURATION:

The service reads these environment variables:
- HUGGINGFACE_API_KEY (required)
- AI_MODEL_ID (optional, defaults to Mistral-7B-Instruct-v0.2)

To change models, update AI_MODEL_ID in .env:
AI_MODEL_ID=mistralai/Mixtral-8x7B-Instruct-v0.1

Default generation parameters (can be overridden per request):
- Temperature: 0.7
- Max tokens: 512
- Top P: 0.95

RETRY LOGIC:

The service automatically retries on transient failures:
- Retryable: 429, 500, 502, 503, 504, timeouts
- Non-retryable: 400-499 (except 429), validation errors
- Max retries: 3 attempts with exponential backoff
- Backoff: 1s, 2s, 4s

TIMEOUTS:

- Full request timeout: 30 seconds
- Connection timeout: 10 seconds

TESTING:

For controller tests, mock the AI service:

jest.mock('../services/ai.service');
const { sendChatRequest } = require('../services/ai.service');

sendChatRequest.mockResolvedValue({
  response: 'Mocked AI response',
  model: 'test-model',
  usage: { totalTokens: 100 },
  metadata: { provider: 'mock' }
});

FUTURE ENHANCEMENTS:

- Add support for streaming responses
- Add conversation truncation for long histories
- Add circuit breaker pattern for cascade failure protection
- Add detailed token usage tracking
- Support additional providers (OpenAI, Anthropic, etc.)

--------------------------------------------------
CHAT CONVERSATION ENDPOINT (TASK 2.4.5)

Route:
- POST /api/chat

Authentication:
- Required (Authorization: Bearer <JWT>)

Request Body:
- message: required string
- history: optional array of prior turns
- learnerLevel: optional ('beginner' | 'intermediate' | 'advanced')
- region: optional ('spain' | 'latinAmerica' | 'mexico')
- tone: optional ('casual' | 'standard' | 'formal')

History item shape:
- role: 'user' or 'assistant'
- content: non-empty string

Validation limits:
- message max length: 2000 characters
- history max entries: 10

Success Response (200):

{
  assistantMessage: string,
  model: string,
  usage: {
    promptTokens: number,
    completionTokens: number,
    totalTokens: number
  },
  timestamp: string,
  promptVersion: string
}

Error Response:

{
  error: string,
  message: string,
  details: object | undefined,
  timestamp: string
}

Chat error codes:
- CHAT_VALIDATION_ERROR (400)
- CHAT_PROMPT_CONFIG_ERROR (400)
- CHAT_RATE_LIMITED (429)
- CHAT_PROVIDER_ERROR (502)
- CHAT_TIMEOUT (504)
- CHAT_PROVIDER_CONFIG_ERROR (500)
- CHAT_INTERNAL_ERROR (500)

Example request:

curl -X POST http://localhost:5050/api/chat \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hola, quisiera ordenar una paella",
    "history": [
      { "role": "assistant", "content": "¡Hola! Bienvenido. ¿Qué te gustaría pedir?" }
    ],
    "learnerLevel": "intermediate",
    "region": "spain",
    "tone": "standard"
  }'