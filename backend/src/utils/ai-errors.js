/**
 * Custom error classes for AI service operations
 * 
 * All errors extend AIServiceError and include:
 * - name: Error class name
 * - message: Human-readable description
 * - code: Machine-readable error code
 * - statusCode: Recommended HTTP status code
 * - details: Additional context (optional)
 */

/**
 * Base class for all AI service errors
 */
class AIServiceError extends Error {
  constructor(message, code, statusCode, details = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Thrown when input validation fails
 * Examples: empty prompt, malformed messages, invalid config
 */
class AIValidationError extends AIServiceError {
  constructor(message, details = {}) {
    super(message, 'AI_VALIDATION_ERROR', 400, details);
  }
}

/**
 * Thrown when the AI provider API fails
 * Examples: 5xx errors, network failures, timeout
 */
class AIProviderError extends AIServiceError {
  constructor(message, details = {}) {
    super(message, 'AI_PROVIDER_ERROR', 502, details);
  }
}

/**
 * Thrown when rate limit or quota is exceeded
 */
class AIQuotaError extends AIServiceError {
  constructor(message, details = {}) {
    super(message, 'AI_QUOTA_EXCEEDED', 429, details);
  }
}

/**
 * Thrown when request exceeds timeout threshold
 */
class AITimeoutError extends AIServiceError {
  constructor(message, details = {}) {
    super(message, 'AI_TIMEOUT_ERROR', 504, details);
  }
}

/**
 * Thrown when AI service configuration is invalid
 * Examples: missing API key, invalid model ID
 */
class AIConfigurationError extends AIServiceError {
  constructor(message, details = {}) {
    super(message, 'AI_CONFIG_ERROR', 500, details);
  }
}

module.exports = {
  AIServiceError,
  AIValidationError,
  AIProviderError,
  AIQuotaError,
  AITimeoutError,
  AIConfigurationError
};
