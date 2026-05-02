const BaseLanguageStrategy = require('./baseLanguageStrategy');

class EnglishStrategy extends BaseLanguageStrategy {
  constructor() {
    super('en', {
      translationSourceName: 'English',
      writingSystem: 'standard'
    });
  }
}

module.exports = EnglishStrategy;
