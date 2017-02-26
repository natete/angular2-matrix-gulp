const utils = require(`${global.GULP_DIR}/utils`);
const config = require(global.CONFIG_PATH || `${global.GULP_DIR}/gulp.config`);
const path = require('path');
const fs = require('fs');

const EXPORT = 'module.exports = `';

module.exports = {
  desc: 'Exports xlf language files content to.',
  dep: [],
  fn: function (gulp, done) {
    utils.log('***  Adding languages ***');

    if (fs.existsSync(config.locale.langs)) {
      let langs = require(config.locale.langs);

      if (!fs.existsSync(config.locale.exportsFolder)) {
        fs.mkdirSync(config.locale.exportsFolder);
      }

      langs.forEach(lang => exportLangFile(lang));
    }

    done();
  }
};

function exportLangFile(lang) {
  const messagesFile = `/messages.${lang}.xlf`;
  const messagesFilePath = path.join(config.locale.folder, messagesFile);

  if (fs.existsSync(messagesFilePath)) {
    const messagesFileContent = fs.readFileSync(messagesFilePath);
    const content = `${EXPORT}${messagesFileContent}\`;`;

    fs.writeFileSync(path.join(config.locale.exportsFolder, `${messagesFile}.ts`), content);
  }
}
