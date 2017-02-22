const utils = require(`${global.GULP_DIR}/utils`);
const config = require(global.CONFIG_PATH || `${global.GULP_DIR}/gulp.config`);
const args = require('yargs').argv;
const path = require('path');
const fs = require('fs');

module.exports = {
  desc: 'Adds languages from config file and remove the corresponding xlf.',
  dep: [],
  fn: function (gulp, done) {
    utils.log('***  Adding languages ***');

    const langsToAdd = utils.extractArrayArgs(args, 'lang');

    if (fs.existsSync(config.locale.langs)) {
      let langs = require(config.locale.langs);

      langs = langs.concat(langsToAdd.filter((lang) => !langs.includes(lang)));

      fs.writeFileSync(config.locale.langs, JSON.stringify(langs));

    } else {
      fs.writeFileSync(config.locale.langs, JSON.stringify(langsToAdd));
    }

    createLanguageFiles(langsToAdd);

    done();
  }
};

function createLanguageFiles(langsToAdd) {
  langsToAdd.forEach(lang => {
    const messagesPath = path.join(config.locale.folder, `/messages.${lang}.xlf`);
    if (!fs.existsSync(messagesPath)) {
      fs.writeFileSync(messagesPath, fs.readFileSync(config.locale.messages));
    }
  });
}