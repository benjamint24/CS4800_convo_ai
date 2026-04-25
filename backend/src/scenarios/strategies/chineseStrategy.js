const BaseLanguageStrategy = require('./baseLanguageStrategy');

class ChineseStrategy extends BaseLanguageStrategy {
  constructor() {
    super('zh', {
      translationSourceName: 'Chinese',
      writingSystem: 'romanized'
    });
  }
}

module.exports = ChineseStrategy;
