const utils = require(`${global.GULP_DIR}/utils`);
const config = require(global.CONFIG_PATH || `${global.GULP_DIR}/gulp.config`);
const spawn = require('child_process').spawn;
const formattor = require('formattor');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');

module.exports = {
  desc: 'Generate message file for each language using xi18n.',
  dep: [],
  fn: function (gulp, done) {
    utils.log('*** Generating xi18n files ***');

    const xi18nArgs = ['xi18n', '-op', config.locale.folder, '-f', 'xlf'];

    let xi18nSpawn = spawn('ng', xi18nArgs);

    xi18nSpawn.stdout.on('data', (data) => utils.log(data.toString()));

    xi18nSpawn.on('exit', () => {

      updateTranslations();

      done();
    });
  }
};

/**
 * Update translation xlf files for all the used languages.
 */
function updateTranslations() {
  let $ = cheerio.load(fs.readFileSync(config.locale.messages), { xmlMode: true });
  let sourceTranslationUnits = $('trans-unit');
  let langs = fs.existsSync(config.locale.langs) ? require(config.locale.langs) : [];
  let processedLanguages = [];

  let messageFiles = getMessageFiles();

  messageFiles.forEach((file) => {
    updateLanguage(file, sourceTranslationUnits, processedLanguages, langs);
  });

  addMissingLanguages(processedLanguages, langs);
}

/**
 * Get the xlf files to be updated.
 * @returns {Array.<string>} the list of file names to be updated.
 */
function getMessageFiles() {
  return fs.readdirSync(config.locale.folder)
      .filter(file => file !== config.locale.messagesFilename && file !== config.locale.langsFilename);
}

/**
 * Updates a language file by adding new nodes and removing unused nodes.
 * @param file the file to be updated.
 * @param sourceTranslationUnits the translation units available in the main file.
 * @param processedLanguages
 * @param langs
 */
function updateLanguage(file, sourceTranslationUnits, processedLanguages, langs) {
  utils.log(`*** Overwriting ${file} ***`);

  const filePath = path.join(config.locale.folder, `/${file}`);

  const processedLang = processLanguage(sourceTranslationUnits, filePath, processedLanguages, langs);

  fs.writeFileSync(filePath, processedLang);
}

/**
 * Add missing language files according to the supported lang files.
 * @param processedLanguages the list of processed languages.
 * @param langs the list of supported languages.
 */
function addMissingLanguages(processedLanguages, langs) {
  let missingLanguages = langs.filter(lang => !processedLanguages.includes(lang));

  missingLanguages.forEach(lang => addMissingLang(lang));
}


/**
 * Create a new language file for the given lang.
 * @param lang the lang to be added.
 */
function addMissingLang(lang) {
  utils.log(`*** Adding missing lang ${lang} ***`);

  let $ = cheerio.load(fs.readFileSync(config.locale.messages), { xmlMode: true });

  $('file').attr('source-language', lang);

  fs.writeFileSync(path.join(config.locale.folder, `/messages.${lang}.xlf`), formattor($.html(), { method: 'xml' }));
}

/**
 * Processes the given language to update the translation unit nodes.
 * @param sourceTranslationUnits the translation unit nodes in the main file.
 * @param file the file to be updated.
 * @param processedLanguages the list of processed languages.
 * @param langs the list of supported langugaes.
 */
function processLanguage(sourceTranslationUnits, file, processedLanguages, langs) {
  let $ = cheerio.load(fs.readFileSync(file), { xmlMode: true });

  updateProcessedLanguages(processedLanguages, langs, $('file').attr('source-language'));

  let targetTranslationUnitsArray = clearUnneededLangs(sourceTranslationUnits, $('trans-unit'), $);

  targetTranslationUnitsArray = addNeededLangs(sourceTranslationUnits, targetTranslationUnitsArray, $);

  $('body').empty().append(targetTranslationUnitsArray);

  return formattor($.html(), { method: 'xml' });
}

/**
 * Updates the list of processed languages adding the given and updates the list of supported languages if needed.
 * @param processedLanguages the list of processed languages.
 * @param langs the list of supported languages.
 * @param langCode the code of the lang to be added.
 */
function updateProcessedLanguages(processedLanguages, langs, langCode) {
  if (!langs.includes(langCode)) {
    langs.push(langCode);
  }

  processedLanguages.push(langCode);
}

/**
 * Remove unused translation unit nodes.
 * @param sourceTranslationUnits the translation unit nodes in the main file.
 * @param targetTranslationUnits the translation unit nodes in the file to be updated.
 * @param $ the cheerio object to allow conversion to jquery objects.
 * @returns {array} the list of updated nodes.
 */
function clearUnneededLangs(sourceTranslationUnits, targetTranslationUnits, $) {
  utils.log('*** Removing unneeded translation units ***');

  let translationUnitsArray = targetTranslationUnits.toArray();

  translationUnitsArray.forEach(transUnit => {
    let id = `#${$(transUnit).attr('id')}`;

    if (sourceTranslationUnits.filter(id).length === 0) {
      utils.log(`*** Removing node ${id} ***`);
      translationUnitsArray.splice(translationUnitsArray.indexOf(transUnit), 1);
    }
  });

  return translationUnitsArray;
}

/**
 * Add new translation unit nodes.
 * @param sourceTranslationUnits the translation unit nodes in the main file.
 * @param translationUnitsArray the array translation unit nodes in the file to be updated.
 * @param $ the cheerio object to allow conversion to jquery objects.
 * @returns {Array} the list of updated nodes.
 */
function addNeededLangs(sourceTranslationUnits, translationUnitsArray, $) {

  sourceTranslationUnits.each((i, transUnit) => {

    let id = $(transUnit).attr('id');

    if (!translationUnitsArray.find(targetTransUnit => id === targetTransUnit.attribs.id)) {
      utils.log(`*** Adding node ${id} ***`);
      translationUnitsArray.push(transUnit);
    }
  });

  return translationUnitsArray.map(item => $(item));
}
