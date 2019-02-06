const {src,dest,watch,series,parallel}=require('gulp');
const sass=require('gulp-sass');
const browsync=require('browser-sync').create();
const nodemon=require('gulp-nodemon');
const del=require('del');
const uglify=require('gulp-uglify');
const csso=require('gulp-csso');
const pump=require('pump');
const htmlminify=require('gulp-html-minify');
reload=browsync.reload;


var path = {
    js: './public/js/**/*.js',
    ejs: './views/**/*.ejs',
    scss: './public/scss/**/*.scss',
    css:'./public/css/**/*.css',
    output:{
        path:'./dist',
        css:'./public/css/min',
        js:'./public/js/min'
    },
    ignore:{
        css:'!./public/css/min/**/*.css',
        js:'!./public/js/min/**/*.js'
    }
}


function defaultTask(cb){
    watch(path.scss, miniCssTask);
    watch([path.ejs, path.js, 'app.js']).on("change", reload);
    watch(path.js,miniJs);
}
function javascript(){

}
function nodemonTask(){
    let started=false;
    return nodemon({
        script:'app.js',
        ignore:['node_modules/','public/'],
        ext:'js'
    }).on('start',function(){
        if(!started){
            console.log('启动')
        browserSync();
        started=true;
        }
    })
}
function browserSync(){
       return browsync.init({
            proxy: 'http://localhost:3000',
            port:3001
        });
        defaultTask();
}
function sassTask(){
    return src(path.scss)
    .pipe(sass().on('error',sass.logError))
    .pipe(dest(path.output.css))
}

let miniCssTask=series(sassTask,cssoTask);
function cssoTask(){
    return src([`${path.output.css}/**/*.css`,path.ignore.css])
    .pipe(csso())
    .pipe(dest(path.output.css))
    .pipe(browsync.stream())
}
function miniJs(){
    return src([path.js,path.ignore.js])
    .pipe(uglify())
    .pipe(dest(path.output.js))
    .pipe(browsync.stream())
}
function ejsMinifyTask(){
    return src(path.ejs)
    .pipe(htmlminify())
    .pipe(dest(path.output.views));
}
exports.default=series(miniJs,miniCssTask,nodemonTask);