const BaseLanguageStrategy = require('./baseLanguageStrategy');

class KoreanStrategy extends BaseLanguageStrategy {
  constructor() {
    super('ko', {
      translationSourceName: 'Korean',
      writingSystem: 'romanized'
    });
  }
}

module.exports = KoreanStrategy;
