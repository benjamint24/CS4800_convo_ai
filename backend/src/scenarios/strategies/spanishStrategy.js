const BaseLanguageStrategy = require('./baseLanguageStrategy');

class SpanishStrategy extends BaseLanguageStrategy {
  constructor() {
    super('es', {
      translationSourceName: 'Spanish',
      writingSystem: 'standard'
    });
  }
}

module.exports = SpanishStrategy;
