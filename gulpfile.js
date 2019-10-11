var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('sass', function(done) {
  exec('npm run scss', function(err, stdout) {
    console.log(stdout);
    done();
  });
});

gulp.task('sass:watch', function() {
  gulp.watch('./src/app/**/*.scss', gulp.series('sass'));
});

gulp.task('default', gulp.series('sass', 'sass:watch'));
