var gulp=require('gulp');
var browSync=require('browser-sync').create();
var reload = browSync.reload;
var sass=require('gulp-sass');
var PORT=require('./app');
var path={
    js:'./public/**/*.js',
    ejs:'./views/**/*.ejs',
    scss:'./public/scss/**/*.scss'
}

gulp.task('sass',function(){
    return gulp.src(path.scss)
        .pipe(sass().on('error',sass.logError))
        .pipe(gulp.dest('./public/css'))
        .pipe(reload({stream: true}));;
})
gulp.task('brow-sync',['sass'],function(){
    browSync.init({
        proxy:'http://localhost:'+PORT,
        notify: false,
        port:2002
    })
    gulp.watch(path.scss,['sass']);
    gulp.watch([path.ejs,path.js,'app.js']).on("change", reload);
})

gulp.task('default',['brow-sync']);

