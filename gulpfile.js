const package = require('./package.json');
const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat-util');
const pump = require('pump');

const source = 'source';
const name = 'lineemotes.plugin.js';
const betterdiscord = process.env.appdata + '/BetterDiscord/plugins/';
const build = 'dist';

const deploy = false; // copy built plugin directly into BetterDiscord

const entry = [
    `./${source}/__lineemotes.plugin.js`,
    `./${source}/_categories.js`,
    `./${source}/_menu.js`,
    `./${source}/_observer.js`,
    `./${source}/_pack.js`,
    `./${source}/_preview.js`,
    `./${source}/_storage.js`,
    `./${source}/_stylesheet.js`
];

gulp.task('build', ['build:css'], function (callback) {
    var tasks = [
        gulp.src(entry),
        concat(name),
        concat.footer(`lineemotes.prototype.getVersion = () => "${package.version}";`),
        gulp.dest(build)
    ]
    if (deploy) {
        tasks.push(gulp.dest(betterdiscord))
    }
    pump(tasks, callback);
});

gulp.task('build:css', function () {
    return gulp.src('stylesheet/stylesheet.scss')
              .pipe(sass().on('error', sass.logError))
              .pipe(concat('_stylesheet.js'))
              .pipe(concat.header('lineemotes.getStylesheet = function () { \nvar stylesheet = `'))
              .pipe(concat.footer('` \nreturn "<style>" + stylesheet + "</style>"; \n};\n'))
              .pipe(gulp.dest(source));
});

gulp.task('build:watch', function () {
    gulp.watch(entry, ['build']);
});
