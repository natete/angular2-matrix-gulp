global.GULP_DIR = `${__dirname}/gulp`;
global.BASE_DIR = __dirname;

var plugins = require('gulp-load-plugins')({lazy: true});

var gulp = global.GULP || require('gulp');

plugins.requireTasks({
  path: `${__dirname}/gulp/tasks`,
  gulp: gulp
});

gulp.task('default', ['tasks']);