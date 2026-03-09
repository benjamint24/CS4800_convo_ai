/**
 * AI Service Wrapper
 * 
 * Provides a clean, provider-agnostic interface for AI chat interactions.
 * Handles all Hugging Face API communication, retry logic, and error mapping.
 */

const fetchFn = globalThis.fetch ? globalThis.fetch.bind(globalThis) : require('node-fetch');
const aiConfig = require('../config/ai.config');
const {
  AIValidationError,
  AIProviderError,
  AITimeoutError,
  AIQuotaError,
  AIConfigurationError
} = require('../utils/ai-errors');

/**
 * Validate system prompt
 * @private
 */
function validateSystemPrompt(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    throw new AIValidationError('System prompt must be a non-empty string', {
      field: 'systemPrompt',
      received: typeof prompt
    });
  }
  
  if (prompt.trim().length === 0) {
    throw new AIValidationError('System prompt cannot be empty or whitespace only', {
      field: 'systemPrompt'
    });
  }
  
  if (prompt.length > 4000) {
    throw new AIValidationError('System prompt exceeds maximum length of 4000 characters', {
      field: 'systemPrompt',
      length: prompt.length,
      maxLength: 4000
    });
  }
}

/**
 * Validate conversation messages
 * @private
 */
function validateMessages(messages) {
  if (!Array.isArray(messages)) {
    throw new AIValidationError('Messages must be an array', {
      field: 'messages',
      received: typeof messages
    });
  }
  
  if (messages.length === 0) {
    throw new AIValidationError('Messages array cannot be empty', {
      field: 'messages'
    });
  }
  
  messages.forEach((msg, index) => {
    if (!msg || typeof msg !== 'object') {
      throw new AIValidationError(`Message at index ${index} must be an object`, {
        field: `messages[${index}]`,
        received: typeof msg
      });
    }
    
    if (!msg.role || !['user', 'assistant'].includes(msg.role)) {
      throw new AIValidationError(`Message at index ${index} must have role 'user' or 'assistant'`, {
        field: `messages[${index}].role`,
        received: msg.role
      });
    }
    
    if (!msg.content || typeof msg.content !== 'string' || msg.content.trim().length === 0) {
      throw new AIValidationError(`Message at index ${index} must have non-empty content`, {
        field: `messages[${index}].content`
      });
    }
  });
}

/**
 * Validate generation configuration
 * @private
 */
function validateConfig(config) {
  if (!config || typeof config !== 'object') {
    return; // Config is optional
  }
  
  if (config.temperature !== undefined) {
    if (typeof config.temperature !== 'number' || config.temperature < 0 || config.temperature > 2) {
      throw new AIValidationError('Temperature must be a number between 0.0 and 2.0', {
        field: 'config.temperature',
        received: config.temperature
      });
    }
  }
  
  if (config.maxTokens !== undefined) {
    if (typeof config.maxTokens !== 'number' || config.maxTokens <= 0 || config.maxTokens > aiConfig.model.maxOutputTokens) {
      throw new AIValidationError(`Max tokens must be a positive number <= ${aiConfig.model.maxOutputTokens}`, {
        field: 'config.maxTokens',
        received: config.maxTokens,
        max: aiConfig.model.maxOutputTokens
      });
    }
  }
  
  if (config.topP !== undefined) {
    if (typeof config.topP !== 'number' || config.topP < 0 || config.topP > 1) {
      throw new AIValidationError('topP must be a number between 0.0 and 1.0', {
        field: 'config.topP',
        received: config.topP
      });
    }
  }
}

/**
 * Estimate token count (rough approximation)
 * @private
 */
function estimateTokens(text) {
  if (!text) return 0;
  // Rough estimate: ~4 characters per token
  return Math.ceil(text.length / 4);
}

/**
 * Build request payload for Hugging Face API
 * @private
 */
function buildRequestPayload(systemPrompt, messages, config) {
  // Format for Hugging Face conversational models
  // Construct the full conversation including system message
  const conversationParts = [`<s>[INST] ${systemPrompt}\n\n`];
  
  messages.forEach((msg, index) => {
    if (msg.role === 'user') {
      if (index === 0) {
        conversationParts.push(`${msg.content} [/INST]`);
      } else {
        conversationParts.push(`<s>[INST] ${msg.content} [/INST]`);
      }
    } else if (msg.role === 'assistant') {
      conversationParts.push(` ${msg.content}</s>`);
    }
  });
  
  const inputs = conversationParts.join('');
  
  return {
    inputs: inputs,
    parameters: {
      temperature: config.temperature ?? aiConfig.defaults.temperature,
      max_new_tokens: config.maxTokens ?? aiConfig.defaults.maxTokens,
      top_p: config.topP ?? aiConfig.defaults.topP,
      return_full_text: false
    }
  };
}

/**
 * Make HTTP request to Hugging Face with timeout
 * @private
 */
async function makeHuggingFaceRequest(payload) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), aiConfig.timeout.requestMs);
  
  try {
    const response = await fetchFn(
      `${aiConfig.baseUrl}/${aiConfig.model.id}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${aiConfig.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new AITimeoutError(
        `Request timed out after ${aiConfig.timeout.requestMs}ms`,
        { timeout: aiConfig.timeout.requestMs }
      );
    }
    
    throw new AIProviderError(
      `Network error: ${error.message}`,
      { originalError: error.message }
    );
  }
}

/**
 * Map HTTP response to appropriate error
 * @private
 */
async function handleErrorResponse(response) {
  let errorBody;
  try {
    errorBody = await response.json();
  } catch {
    errorBody = { error: await response.text() };
  }
  
  const statusCode = response.status;
  
  // Map status codes to appropriate errors
  if (statusCode === 401 || statusCode === 403) {
    throw new AIConfigurationError(
      'Invalid API key or unauthorized access',
      { statusCode, error: errorBody }
    );
  }
  
  if (statusCode === 429) {
    throw new AIQuotaError(
      'Rate limit or quota exceeded',
      { statusCode, error: errorBody }
    );
  }
  
  if (statusCode >= 400 && statusCode < 500) {
    throw new AIValidationError(
      `Bad request: ${errorBody.error || 'Unknown error'}`,
      { statusCode, error: errorBody }
    );
  }
  
  if (statusCode >= 500) {
    throw new AIProviderError(
      `Provider server error: ${errorBody.error || 'Unknown error'}`,
      { statusCode, error: errorBody }
    );
  }
  
  throw new AIProviderError(
    `Unexpected response: ${statusCode}`,
    { statusCode, error: errorBody }
  );
}

/**
 * Parse and normalize Hugging Face response
 * @private
 */
function normalizeResponse(rawResponse, systemPrompt, messages) {
  let generatedText = '';
  
  // Hugging Face can return array or single object
  if (Array.isArray(rawResponse)) {
    generatedText = rawResponse[0]?.generated_text || '';
  } else if (rawResponse.generated_text) {
    generatedText = rawResponse.generated_text;
  } else if (typeof rawResponse === 'string') {
    generatedText = rawResponse;
  } else {
    throw new AIProviderError(
      'Unexpected response format from provider',
      { receivedKeys: Object.keys(rawResponse) }
    );
  }
  
  // Estimate token usage (Hugging Face Inference API doesn't always return this)
  const promptText = systemPrompt + messages.map(m => m.content).join(' ');
  const promptTokens = estimateTokens(promptText);
  const completionTokens = estimateTokens(generatedText);
  
  return {
    response: generatedText.trim(),
    model: aiConfig.model.id,
    usage: {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens
    },
    metadata: {
      provider: aiConfig.provider,
      finishReason: rawResponse.finish_reason || 'stop',
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Execute request with retry logic
 * @private
 */
async function executeWithRetry(fn, attempt = 1) {
  try {
    return await fn();
  } catch (error) {
    // Don't retry validation or configuration errors
    if (error instanceof AIValidationError || error instanceof AIConfigurationError) {
      throw error;
    }
    
    // Check if error is retryable
    const isRetryable = 
      error instanceof AIProviderError ||
      error instanceof AITimeoutError ||
      error instanceof AIQuotaError;
    
    if (!isRetryable || attempt >= aiConfig.retry.maxRetries) {
      // Max retries exhausted or non-retryable error
      if (attempt > 1) {
        error.details = {
          ...error.details,
          attempts: attempt,
          retriesExhausted: true
        };
      }
      throw error;
    }
    
    // Calculate backoff time (exponential backoff)
    const backoffMs = aiConfig.retry.backoffMs * Math.pow(2, attempt - 1);
    
    console.warn(`[AI Service] Retry attempt ${attempt}/${aiConfig.retry.maxRetries} after ${backoffMs}ms. Error: ${error.message}`);
    
    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, backoffMs));
    
    // Retry
    return executeWithRetry(fn, attempt + 1);
  }
}

/**
 * Send a chat request to the configured AI provider
 * 
 * @param {Object} options - Request options
 * @param {string} options.systemPrompt - System instructions for the AI
 * @param {Array<{role: string, content: string}>} options.messages - Conversation history
 * @param {Object} [options.config] - Optional generation config overrides
 * @param {number} [options.config.temperature] - Sampling temperature (0.0-2.0)
 * @param {number} [options.config.maxTokens] - Max tokens to generate
 * @param {number} [options.config.topP] - Nucleus sampling threshold (0.0-1.0)
 * 
 * @returns {Promise<Object>} Normalized AI response with shape:
 *   - response: string - The assistant's message
 *   - model: string - Model ID used
 *   - usage: Object - Token usage statistics
 *   - metadata: Object - Provider-specific metadata
 * 
 * @throws {AIValidationError} If inputs are invalid
 * @throws {AIProviderError} If provider API fails
 * @throws {AITimeoutError} If request times out
 * @throws {AIQuotaError} If quota/rate limit exceeded
 * @throws {AIConfigurationError} If configuration is invalid
 */
async function sendChatRequest({ systemPrompt, messages, config = {} }) {
  const startTime = Date.now();
  
  try {
    // Validate all inputs
    validateSystemPrompt(systemPrompt);
    validateMessages(messages);
    validateConfig(config);
    
    console.log(`[AI Service] Sending request to ${aiConfig.model.id} with ${messages.length} messages`);
    
    // Execute with retry logic
    const result = await executeWithRetry(async () => {
      // Build request payload
      const payload = buildRequestPayload(systemPrompt, messages, config);
      
      // Make HTTP request
      const response = await makeHuggingFaceRequest(payload);
      
      // Handle errors
      if (!response.ok) {
        await handleErrorResponse(response);
      }
      
      // Parse response
      const rawResponse = await response.json();
      
      // Normalize response format
      return normalizeResponse(rawResponse, systemPrompt, messages);
    });
    
    const duration = Date.now() - startTime;
    console.log(`[AI Service] Request completed in ${duration}ms. Tokens used: ${result.usage.totalTokens}`);
    
    return result;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[AI Service] Request failed after ${duration}ms:`, error.message);
    throw error;
  }
}

module.exports = {
  sendChatRequest
};
