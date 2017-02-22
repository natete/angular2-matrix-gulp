let path = require('path');

module.exports = getConfig();

function getConfig() {
  const config = {};
  const langsFilename = 'langs.json';
  const localeFolder = path.join(global.BASE_DIR, '/src/assets/locale');
  const messagesFilename = 'messages.xlf';

  config.locale = {
    folder: localeFolder,
    langs: path.join(localeFolder, `/${langsFilename}`),
    langsFilename: 'langs.json',
    messages: path.join(localeFolder, `/${messagesFilename}`),
    messagesFilename: messagesFilename
  };

  return config;
}