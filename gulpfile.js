
const {src, dest, watch, parallel} = require("gulp");

// CSS
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");

// Imágenes
const cache = require("gulp-cache");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");


// JavaScript
const terser = require("gulp-terser-js");


function css(done){        
    src('src/scss/**/*.scss')  // 1. Identificar el Archivo de SASS
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())             // 2. Compilarlo
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest("build/css")); // 3. Almacenarla en el disco duro

    done(); // Callback que avisa a GULP cuando llegamos al final
}

function imagenes(done){

    const opciones = {
        optimitazionLevel: 3
    };
    src('src/img/**/*.{png,jpg}')
    .pipe(cache(imagemin(opciones)))
    .pipe(dest('build/img'))

    done();
}

function versionWebp(done){
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
    .pipe(webp(opciones))
    .pipe(dest('build/img'))

    done();
}

function versionAvif(done){
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
    .pipe(avif(opciones))
    .pipe(dest('build/img'))

    done();
}
function javaScript(done){
    src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/js'))
    done();
}


function dev(done){    
    watch('src/scss/**/*.scss',css)   
    watch('src/js/**/*.js',javaScript)   
    
    done();
}

exports.css = css;
exports.js = javaScript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev =parallel(imagenes, versionWebp, versionAvif, javaScript, dev);