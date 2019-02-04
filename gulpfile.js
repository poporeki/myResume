const {src,dest,watch,series,parallel}=require('gulp');
const sass=require('gulp-sass');
const browsync=require('browser-sync').create();
const nodemon=require('gulp-nodemon');
reload=browsync.reload;


var path = {
    js: './public/**/*.js',
    ejs: './views/**/*.ejs',
    scss: './public/scss/**/*.scss',
    output:{
        css:'./public/css'
    }
}

function defaultTask(cb){
    watch(path.scss, sassTask);
    watch([path.ejs, path.js, 'app.js']).on("change", reload);
}
function javascript(){

}
function nodemonTask(){
    nodemon({
        script:'app.js',
        ignore:['node_modules/']
    }).on('start',function(){
        browserSync();
    })
}
function browserSync(){
        browsync.init({
            proxy: 'http://localhost:3000',
            port:3001
        });
        defaultTask();
}
function sassTask(){
    return src(path.scss)
    .pipe(sass().on('error',sass.logError))
    .pipe(dest(path.output.css))
    .pipe(browsync.stream())
}
exports.default=series(sassTask,nodemonTask,defaultTask);