const utils = require(`${global.GULP_DIR}/utils`);
const config = require(global.CONFIG_PATH || `${global.GULP_DIR}/gulp.config`);
const path = require('path');
const fs = require('fs');

module.exports = {
  desc: 'Displays the available tasks and its descriptions.',
  dep: [],
  fn: function (gulp, done) {
    utils.log('***  Displaying gulpfile documentation ***');

    const tasks = Object.keys(gulp.tasks);

    tasks.map(task => mapTasksToDescribedTasks(gulp.tasks[task]))
        .sort(sortTasks)
        .forEach(logTask);

    done();
  }
};

/**
 * Converts gulp task objects to objects to be logged.
 * @param task the task to be converted.
 * @returns {{name, desc: string}} the task object to be logged.
 */
function mapTasksToDescribedTasks(task) {
  const taskPath = getTaskPath(task);
  return log = {
    name: task.name,
    desc: fs.existsSync(taskPath) ? require(taskPath).desc : '""'
  };
}

/**
 * Gets the possible task path for a given task name.
 * @param task the task whose paht must be extracted.
 * @returns {string} the extracted path.
 */
function getTaskPath(task) {
  return path.join(global.GULP_DIR, `/tasks/${task.name.replace(':', '/')}.js`);
}

/**
 * Sort tasks alphabetically by its name.
 * @param task1 the first task to be compared.
 * @param task2 the second task to be compared.
 * @returns {number} a number representing the result of the comparision.
 */
function sortTasks(task1, task2) {
  let result = 0;

  if (task1.name < task2.name) {
    result = -1;
  } else if (task1.name > task2.name) {
    result = 1;
  }

  return result;
}

/**
 * Prints the task and its description.
 * @param task the task to be printed.
 */
function logTask(task) {
  const log = {};
  log[task.name] = task.desc;
  utils.log(log);
}
