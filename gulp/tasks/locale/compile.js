const utils = require(`${global.GULP_DIR}/utils`);
const config = require(global.CONFIG_PATH || `${global.GULP_DIR}/gulp.config`);
const path = require('path');
const fs = require('fs');
const spawn = require('child_process').spawn;

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

      buildDefault();
      langs.forEach(lang => buildWithLang(lang));
    }

    done();
  }
};

function buildWithLang(lang) {
  const buildSpawnArgs = [
    'build',
    '--aot', 'true',
    '--i18nFile', path.join(config.locale.folder, `/messages.${lang}.xlf`),
    '--locale', lang,
    '--i18nFormat', 'xlf',
    '--baseHref', lang,
    '--outputPath', path.join(config.distFolder, `/${lang}`)
  ];

  build(buildSpawnArgs);
}

function buildDefault() {
  const buildSpawnArgs = [
    'build',
    '--aot', 'true',
    '--baseHref', 'en',
    '--outputPath', path.join(config.distFolder, `/en`)
  ];

  build(buildSpawnArgs);
}

function build(buildSpawnArgs) {
  const buildSpawn = spawn('ng', buildSpawnArgs);

  buildSpawn.stdout.on('data', (data) => utils.log(data.toString()));
  buildSpawn.stderr.on('data', (data) => utils.log(data.toString()));
}