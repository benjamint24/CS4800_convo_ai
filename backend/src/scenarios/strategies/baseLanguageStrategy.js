class BaseLanguageStrategy {
  constructor(language, metadata) {
    this.language = language;
    this.metadata = metadata;
  }

  buildPrompt(scenario) {
    if (!scenario || !scenario.systemPrompts) {
      throw new Error('A scenario with systemPrompts is required');
    }

    return scenario.systemPrompts?.[this.language] || scenario.systemPrompt;
  }

  getTranslationSourceName() {
    return this.metadata.translationSourceName;
  }

  getWritingSystem() {
    return this.metadata.writingSystem;
  }
}

module.exports = BaseLanguageStrategy;
