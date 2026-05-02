const BaseLanguageStrategy = require('./baseLanguageStrategy');

class JapaneseStrategy extends BaseLanguageStrategy {
  constructor() {
    super('ja', {
      translationSourceName: 'Japanese',
      writingSystem: 'romanized'
    });
  }
}

module.exports = JapaneseStrategy;
