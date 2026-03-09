/**
 * Prompt Builder Utility
 * 
 * Renders prompt templates with variable configuration.
 * Supports learner levels, regional variants, and tone adjustments.
 */

const restaurantTemplate = require('./templates/restaurant.template');

/**
 * Configuration presets for learner levels
 */
const learnerLevelConfig = {
  beginner: {
    vocabulary: 'simple',
    sentenceComplexity: 'basic',
    responseLength: 'shorter',
    adjustment: 'beginnerAdjustment',
    description: 'Use basic vocabulary, simple present tense primarily, short clear sentences'
  },
  
  intermediate: {
    vocabulary: 'standard',
    sentenceComplexity: 'natural',
    responseLength: 'normal',
    adjustment: 'intermediateAdjustment',
    description: 'Natural restaurant Spanish, mixed tenses, conversational flow'
  },
  
  advanced: {
    vocabulary: 'rich',
    sentenceComplexity: 'varied',
    responseLength: 'flexible',
    adjustment: 'advancedAdjustment',
    description: 'Full vocabulary range, complex structures, idioms welcome'
  }
};

/**
 * Configuration presets for regional variants
 */
const regionalConfig = {
  spain: {
    pronounForms: 'vosotros',
    examples: ['vale', 'genial', 'estupendo'],
    description: 'Castilian Spanish (Spain)'
  },
  
  latinAmerica: {
    pronounForms: 'ustedes',
    examples: ['bueno', 'perfecto', 'excelente'],
    description: 'Latin American Spanish (neutral)'
  },
  
  mexico: {
    pronounForms: 'ustedes',
    examples: ['órale', 'qué padre', 'ándale'],
    description: 'Mexican Spanish'
  }
};

/**
 * Configuration presets for tone/formality
 */
const toneConfig = {
  casual: {
    formality: 'tú',
    style: 'relaxed',
    description: 'Friendly neighborhood restaurant atmosphere'
  },
  
  standard: {
    formality: 'tú',
    style: 'professional',
    description: 'Professional but approachable (default)'
  },
  
  formal: {
    formality: 'usted',
    style: 'refined',
    description: 'Upscale fine dining establishment'
  }
};

/**
 * Build a restaurant waiter system prompt with optional configuration
 * 
 * @param {Object} options - Configuration options
 * @param {string} [options.learnerLevel='intermediate'] - 'beginner', 'intermediate', or 'advanced'
 * @param {string} [options.region='spain'] - 'spain', 'latinAmerica', or 'mexico'
 * @param {string} [options.tone='standard'] - 'casual', 'standard', or 'formal'
 * @param {string} [options.customInstructions=null] - Additional custom instructions
 * 
 * @returns {Object} Prompt object with:
 *   - prompt: string - The complete system prompt
 *   - version: string - Template version used
 *   - config: Object - Configuration applied
 *   - metadata: Object - Template metadata
 */
function buildRestaurantPrompt(options = {}) {
  // Apply defaults
  const config = {
    learnerLevel: options.learnerLevel || 'intermediate',
    region: options.region || 'spain',
    tone: options.tone || 'standard',
    customInstructions: options.customInstructions || null
  };
  
  // Validate configuration
  if (!learnerLevelConfig[config.learnerLevel]) {
    throw new Error(`Invalid learner level: ${config.learnerLevel}. Must be 'beginner', 'intermediate', or 'advanced'`);
  }
  
  if (!regionalConfig[config.region]) {
    throw new Error(`Invalid region: ${config.region}. Must be 'spain', 'latinAmerica', or 'mexico'`);
  }
  
  if (!toneConfig[config.tone]) {
    throw new Error(`Invalid tone: ${config.tone}. Must be 'casual', 'standard', or 'formal'`);
  }
  
  // Start building the prompt
  const sections = [];
  
  // Add core role
  sections.push(restaurantTemplate.role.core);
  
  // Add learner level adjustment
  const learnerAdjustment = learnerLevelConfig[config.learnerLevel].adjustment;
  if (restaurantTemplate.role[learnerAdjustment]) {
    sections.push(restaurantTemplate.role[learnerAdjustment]);
  }
  
  // Add hard rules (always included)
  sections.push(restaurantTemplate.hardRules);
  
  // Add style guidelines
  sections.push(restaurantTemplate.styleGuidelines.default);
  
  // Add regional style
  if (restaurantTemplate.styleGuidelines[config.region]) {
    sections.push(restaurantTemplate.styleGuidelines[config.region]);
  }
  
  // Add tone style
  if (restaurantTemplate.styleGuidelines[config.tone]) {
    sections.push(restaurantTemplate.styleGuidelines[config.tone]);
  }
  
  // Add context
  sections.push(restaurantTemplate.context);
  
  // Add conversation patterns
  sections.push(restaurantTemplate.conversationPatterns);
  
  // Add fallbacks
  sections.push(restaurantTemplate.fallbacks);
  
  // Add custom instructions if provided
  if (config.customInstructions) {
    sections.push('\n\n## ADDITIONAL CUSTOM INSTRUCTIONS\n' + config.customInstructions);
  }
  
  // Assemble final prompt
  const prompt = sections.join('\n').trim();
  
  return {
    prompt,
    version: restaurantTemplate.metadata.version,
    config,
    metadata: {
      templateId: restaurantTemplate.metadata.scenarioId,
      generated: new Date().toISOString(),
      learnerLevel: learnerLevelConfig[config.learnerLevel].description,
      region: regionalConfig[config.region].description,
      tone: toneConfig[config.tone].description
    }
  };
}

/**
 * Get the legacy restaurant prompt (for comparison/fallback)
 * 
 * @returns {string} The original static prompt
 */
function getLegacyPrompt() {
  const legacyPrompt = require('./restaurantPrompt');
  return legacyPrompt;
}

/**
 * Get available configuration options
 * 
 * @returns {Object} Available options for each configuration type
 */
function getAvailableOptions() {
  return {
    learnerLevels: Object.keys(learnerLevelConfig).map(key => ({
      value: key,
      description: learnerLevelConfig[key].description
    })),
    regions: Object.keys(regionalConfig).map(key => ({
      value: key,
      description: regionalConfig[key].description
    })),
    tones: Object.keys(toneConfig).map(key => ({
      value: key,
      description: toneConfig[key].description
    }))
  };
}

/**
 * Get template metadata
 * 
 * @returns {Object} Template metadata including version, status, changelog
 */
function getTemplateMetadata() {
  return restaurantTemplate.metadata;
}

module.exports = {
  buildRestaurantPrompt,
  getLegacyPrompt,
  getAvailableOptions,
  getTemplateMetadata
};
