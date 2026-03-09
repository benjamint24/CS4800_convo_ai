/**
 * AI Service Configuration
 * 
 * Centralized configuration for AI provider integration.
 * Supports easy provider switching and environment-based overrides.
 */

require('dotenv').config();
const { AIConfigurationError } = require('../utils/ai-errors');

const aiConfig = {
  // Provider selection (future: 'openai', 'anthropic', etc.)
  provider: 'huggingface',
  
  // API authentication
  apiKey: process.env.HUGGINGFACE_API_KEY,
  
  // Provider endpoints
  baseUrl: 'https://api-inference.huggingface.co/models',
  
  // Model configuration
  model: {
    id: process.env.AI_MODEL_ID || 'mistralai/Mistral-7B-Instruct-v0.2',
    contextWindow: 32768,
    maxOutputTokens: 1024
  },
  
  // Default generation parameters
  defaults: {
    temperature: 0.7,
    maxTokens: 512,
    topP: 0.95
  },
  
  // Retry configuration for transient failures
  retry: {
    maxRetries: 3,
    backoffMs: 1000,
    retryableStatuses: [429, 500, 502, 503, 504]
  },
  
  // Timeout configuration
  timeout: {
    requestMs: 30000,    // 30 seconds for full request
    connectionMs: 10000  // 10 seconds for initial connection
  }
};

// Validate critical configuration on module load
if (!aiConfig.apiKey) {
  throw new AIConfigurationError(
    'HUGGINGFACE_API_KEY environment variable is required',
    { missingKey: 'HUGGINGFACE_API_KEY' }
  );
}

if (!aiConfig.model.id) {
  throw new AIConfigurationError(
    'AI model ID is required',
    { field: 'model.id' }
  );
}

module.exports = aiConfig;
