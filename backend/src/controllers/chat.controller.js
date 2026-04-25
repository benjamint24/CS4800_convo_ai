const { sendChatRequest } = require('../services/ai.service');
const {
  getLanguagePromptStrategy,
  getSupportedLanguages
} = require('../scenarios/factories/languagePromptStrategyFactory');
const {
  AIValidationError,
  AIProviderError,
  AIQuotaError,
  AITimeoutError,
  AIConfigurationError
} = require('../utils/ai-errors');

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_ENTRIES = 10;
const SUPPORTED_LANGUAGES = getSupportedLanguages();

function sendError(res, status, error, message, details) {
  return res.status(status).json({
    error,
    message,
    details,
    timestamp: new Date().toISOString()
  });
}

function validateMessage(message) {
  if (typeof message !== 'string') {
    return 'Field "message" must be a string';
  }

  const trimmed = message.trim();
  if (!trimmed) {
    return 'Field "message" is required';
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return `Field "message" must be <= ${MAX_MESSAGE_LENGTH} characters`;
  }

  return null;
}

function validateHistory(history) {
  if (history === undefined) {
    return null;
  }

  if (!Array.isArray(history)) {
    return 'Field "history" must be an array';
  }

  if (history.length > MAX_HISTORY_ENTRIES) {
    return `Field "history" must have <= ${MAX_HISTORY_ENTRIES} entries`;
  }

  for (let i = 0; i < history.length; i += 1) {
    const item = history[i];

    if (!item || typeof item !== 'object') {
      return `History item at index ${i} must be an object`;
    }

    if (!['user', 'assistant'].includes(item.role)) {
      return `History item at index ${i} must have role "user" or "assistant"`;
    }

    if (typeof item.content !== 'string' || !item.content.trim()) {
      return `History item at index ${i} must have non-empty string content`;
    }
  }

  return null;
}

function mapAiError(error) {
  if (error instanceof AIValidationError) {
    return {
      status: 400,
      code: 'CHAT_VALIDATION_ERROR',
      message: 'Invalid chat request payload',
      details: error.details
    };
  }

  if (error instanceof AIQuotaError) {
    return {
      status: 429,
      code: 'CHAT_RATE_LIMITED',
      message: 'AI provider rate limit exceeded, please retry shortly',
      details: error.details
    };
  }

  if (error instanceof AITimeoutError) {
    return {
      status: 504,
      code: 'CHAT_TIMEOUT',
      message: 'AI provider request timed out',
      details: error.details
    };
  }

  if (error instanceof AIProviderError) {
    return {
      status: 502,
      code: 'CHAT_PROVIDER_ERROR',
      message: 'AI provider returned an upstream error',
      details: error.details
    };
  }

  if (error instanceof AIConfigurationError) {
    return {
      status: 500,
      code: 'CHAT_PROVIDER_CONFIG_ERROR',
      message: 'AI provider configuration error',
      details: error.details
    };
  }

  return {
    status: 500,
    code: 'CHAT_INTERNAL_ERROR',
    message: 'Unexpected chat server error',
    details: undefined
  };
}

exports.createConversationReply = async (req, res) => {
  try {
    const {
      message,
      history = [],
      learnerLevel,
      region,
      tone,
      scenarioId = 'restaurant',
      language = 'es'
    } = req.body || {};

    const messageError = validateMessage(message);
    if (messageError) {
      return sendError(res, 400, 'CHAT_VALIDATION_ERROR', messageError);
    }

    const historyError = validateHistory(history);
    if (historyError) {
      return sendError(res, 400, 'CHAT_VALIDATION_ERROR', historyError);
    }

    const normalizedHistory = history.map((item) => ({
      role: item.role,
      content: item.content.trim()
    }));

    const normalizedMessage = message.trim();

    // Get the scenario from prompts.js
    const scenarios = require('../scenarios/prompts');
    const scenario = scenarios[scenarioId];
    
    if (!scenario) {
      return sendError(res, 400, 'INVALID_SCENARIO', `Scenario "${scenarioId}" not found`);
    }

    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return sendError(
        res,
        400,
        'INVALID_LANGUAGE',
        `Language "${language}" is not supported. Use one of: ${SUPPORTED_LANGUAGES.join(', ')}`
      );
    }

    const languageStrategy = getLanguagePromptStrategy(language);
    const selectedSystemPrompt = languageStrategy.buildPrompt(scenario);
    const writingSystem = languageStrategy.getWritingSystem();

    const aiResult = await sendChatRequest({
      systemPrompt: selectedSystemPrompt,
      messages: [
        ...normalizedHistory,
        { role: 'user', content: normalizedMessage }
      ]
    });

    let englishTranslation = null;

    // Keep translation helper for non-English practice languages.
    if (language !== 'en') {
      const translationResult = await sendChatRequest({
        systemPrompt: `Translate the following ${languageStrategy.getTranslationSourceName()} sentence to natural English. Only return the English translation.`,
        messages: [
          { role: 'user', content: aiResult.response }
        ]
      });

      englishTranslation = translationResult.response;
    }


    return res.status(200).json({
      assistantMessage: aiResult.response,
      translation: englishTranslation,
      language,
      writingSystem,
      model: aiResult.model,
      usage: aiResult.usage,
      timestamp: new Date().toISOString(),
      //promptVersion: promptData.version
    });
  } catch (error) {
    console.error('[Chat Controller] createConversationReply failed:', error.message);
    const mapped = mapAiError(error);
    return sendError(res, mapped.status, mapped.code, mapped.message, mapped.details);
  }
};
