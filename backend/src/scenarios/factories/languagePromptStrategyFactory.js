const EnglishStrategy = require('../strategies/englishStrategy');
const SpanishStrategy = require('../strategies/spanishStrategy');
const ChineseStrategy = require('../strategies/chineseStrategy');
const KoreanStrategy = require('../strategies/koreanStrategy');
const JapaneseStrategy = require('../strategies/japaneseStrategy');

const strategyMap = {
  en: new EnglishStrategy(),
  es: new SpanishStrategy(),
  zh: new ChineseStrategy(),
  ko: new KoreanStrategy(),
  ja: new JapaneseStrategy()
};

function getLanguagePromptStrategy(language) {
  return strategyMap[language] || strategyMap.es;
}

function getSupportedLanguages() {
  return Object.keys(strategyMap);
}

module.exports = {
  getLanguagePromptStrategy,
  getSupportedLanguages
};
