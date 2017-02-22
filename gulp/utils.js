const plugins = require('gulp-load-plugins')({ lazy: true });
const config = require(global.CONFIG_PATH || './gulp.config');

module.exports = utils();

function utils() {

  return {
    log: log,
    logError: logError,
    extractArrayArgs: extractArrayArgs
  };
}

/**
 * Prints out in the console the given message or object.
 * @param {object | string} msg object or string to be logged.
 */
function log (msg) {
  if (typeof msg === 'object') {
    for (const item in msg) {
      if (msg.hasOwnProperty(item) && typeof msg[item] === 'string' || typeof msg[item] === 'number') {
        plugins.util.log(`\t${plugins.util.colors.cyan(item)} \t -> \t ${plugins.util.colors.green(msg[item])}`);
      } else if (msg.hasOwnProperty(item)) {
        plugins.util.log(plugins.util.colors.blue(item));
        log(msg[item]);
      }
    }
  } else {
    plugins.util.log(plugins.util.colors.blue(msg));
  }
}

/**
 * Prints out in the console the given message or object.
 * @param {object | string} msg object or string to be logged.
 */
function logError (msg) {
  if (typeof msg === 'object') {
    for (const item in msg) {
      if (msg.hasOwnProperty(item) && typeof msg[item] === 'string' || typeof msg[item] === 'number') {
        plugins.util.log(`\t${plugins.util.colors.red(item)} \t -> \t ${plugins.util.colors.red(msg[item])}`);
      } else if (msg.hasOwnProperty(item)) {
        plugins.util.log(plugins.util.colors.red(item));
        log(msg[item]);
      }
    }
  } else {
    plugins.util.log(plugins.util.colors.red(msg));
  }
}

/**
 * Extract the given argument name values from the given yargs arguments object as an array.
 * @param args the yargs arguments object.
 * @param argName the name of the argument to be extracted.
 * @returns {array} the values of the requested argument name.
 */
function extractArrayArgs(args, argName) {
  let extractedValues;

  if (args[argName]) {
    if (typeof args[argName] === 'string') {
      extractedValues = [args[argName]];
    } else {
      extractedValues = args[argName];
    }
  } else {
    extractedValues = [];
  }
  return extractedValues;
}