// Пути к файлам и папка проекта
const project_folder = 'build';
const source_folder = 'source';
const path = {
  project_folder: {
    html: project_folder + '/',
    css: project_folder + '/css',
    js: project_folder + '/js',
    img: project_folder + '/img',
    fonts: project_folder + '/fonts',
  },
  source_folder : {
    html: [source_folder + '/*.html', '!' + source_folder + '/_*.html'],
    css: project_folder + '/scss/style.scss',
    js: project_folder + '/js/**/*.js',
    img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,jpeg,webp}',
    fonts: source_folder + '/fonts/*.ttf',
  },

  watch: {
    html: source_folder + '/**/*.html',
    css: source_folder + '/scss/**/*.scss',
    js: source_folder + '/js/**/*.js',
    img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,jpeg,webp}',
  },

  clean: './' + project_folder + '/'
}

const gulp = require('gulp');
const sync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const del = require('del');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const webp = require('gulp-webp');
const fileInclude = require('gulp-file-include');
const imagemin = require('gulp-imagemin');

// HTML

const html = () => {
  return gulp.src(path.source_folder.html)
    .pipe(fileInclude())
    .pipe(rename("index_src.html"))
    .pipe(gulp.dest(path.project_folder.html));
}

const htmlMin = () => {
  return gulp.src(path.source_folder.html)
    .pipe(fileInclude())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(path.project_folder.html));
}


// Images

const images = () => {
  return gulp.src(path.source_folder.img)
    .pipe(webp({
      quality: 70
    }))
    .pipe(gulp.dest(path.project_folder.img))
    .pipe(gulp.src(path.source_folder.img))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      interlaced: true,
      optimizationLevel: 3,
    })
    )
    .pipe(gulp.dest(path.project_folder.img))
    .pipe(sync.stream());
}

exports.images = images;

// Clean

const clean = () => {
  return del(path.clean);
}

// Server

const server = () => {
  sync.init({
    server: {
      baseDir: './' + project_folder + '/'
    },
    port: 3000,
    notify: false,
  })
}

exports.server = server;

// Reload

const reload = done => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch(watch.html, gulp.series(html, reload));
}

// Build

const build = gulp.series(
  clean,
  gulp.parallel(
    html,
    htmlMin,
    images
  )
);

exports.build = build;


// Default

exports.default = gulp.series(
  clean,
  gulp.parallel(
    html,
    htmlMin
  ),
  gulp.series(
    server,
    watcher
  )
);
