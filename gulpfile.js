var gulp        = require('gulp');
var less        = require('gulp-less');
var browserSync = require('browser-sync');

gulp.task('less', function(){
    return gulp.src('assets/less/main.less')
               .pipe(less({
                   paths:    ['less'],
                   //compress: true
               }).on('error', function(err){
                   this.emit('end');
               }))
               .pipe(gulp.dest('assets/css'));
});

gulp.task('serve', function() {
    browserSync({
        server: {
            baseDir: '.'
        }
    });

    gulp.watch(['assets/less/*.less'], {cwd: '.'}, ['less']);
    gulp.watch(['*.html', 'assets/css/*.css', 'assets/js/*.js'], {cwd: '.'}, browserSync.reload);
});
