const project_folder = 'build'; /* Папка с готовым production */
const source_folder = '#src'; /* Папка с исходниками */
const path = {
  build: {
    html: project_folder + '/',
    css: project_folder + '/css',
    js: project_folder + '/js',
    img: project_folder + '/img',
    fonts: project_folder + '/fonts',
  },

  source: {
    html: [source_folder + '/*.html', '!' + source_folder + '/_*.html'],
    css: source_folder + '/scss/style.scss',
    js: source_folder + '/js/**/*.js',
    img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,jpeg,webp}',
    fonts: source_folder + '/fonts/*.ttf',
  },

  watch: {
    html: source_folder + '/**/*.html',
    css: source_folder + '/scss/**/*.scss',
    js: source_folder + '/js/**/*.js',
    img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,jpeg,webp}',
  }, /* Слушаем файлы */

  clean: './' + project_folder + '/', /* Очистка папок */
}

const { src, dest } = require('gulp');
const gulp = require('gulp');

// Установка плагинов
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const del = require('del');
const scss = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgSprite = require('gulp-svg-sprite');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');

// Настройка плагина browser-sync
const getBrowserSync = () => {
  browserSync.init({
    server: {
      baseDir: './' + project_folder + '/'
    },
    port: 3000,
    notify: false,
  })
}

// Работа со шрифтами
const getFonts = () => {
  src(path.source.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts))
  return src(path.source.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
}

// Настройка плагина file-include
const getHtml = () => {
  return src(path.source.html)
    .pipe(fileInclude())
    .pipe(dest(path.build.html))
    .pipe(browserSync.stream())
}

// Работа с CSS
const getCss = () => {
  return src(path.source.css)
    .pipe(sourcemap.init())
    .pipe(
      scss({
        outputStyle: 'expanded'
      })
        .on('error', scss.logError)
    )
    .pipe(autoprefixer())
    .pipe(gulp.dest(path.build.css))
    .pipe(cleanCSS())
    .pipe(
      rename({
        extname: '.min.css'
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browserSync.stream())
}

// Работа с JS
const getJs = () => {
  return src(path.source.js)
    .pipe(dest(path.build.js))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(
      rename({
        extname: '.min.js'
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browserSync.stream())
}

// Отдельная задача для создания спрайта из иконок
gulp.task('svgSprite', function () {
  return gulp.src([source_folder + '/img/icons/*.svg'])
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../icons/sprite.svg',
          example: true,
        }
      }
    }))
    .pipe(dest(path.build.img))
})

const getImages = () => {
  return src(path.source.img)
    .pipe(webp({
      quality: 70
    }))
    .pipe(dest(path.build.img))
    .pipe(src(path.source.img))
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(dest(path.build.img))
    .pipe(browserSync.stream())
}

// Настройка "слежки" за файлами
const getFileWatch = () => {
  gulp.watch([path.watch.html], getHtml);
  gulp.watch([path.watch.css], getCss);
  gulp.watch([path.watch.js], getJs);
  gulp.watch([path.watch.js], getImages);
}

// Настройка плагина удаления файлов
const getClean = () => {
  return del(path.clean);
}

const build = gulp.series(getClean, gulp.parallel(getJs, getCss, getHtml, getImages, getFonts));
const watch = gulp.parallel(build, getFileWatch, getBrowserSync);

exports.getFonts = getFonts;
exports.getImages = getImages;
exports.getJs = getJs;
exports.getCss = getCss;
exports.getHtml = getHtml;
exports.build = build;
exports.watch = watch;
exports.default = watch;
