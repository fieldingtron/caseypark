var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var sass = require("gulp-sass")(require("sass"));
var cp = require("child_process");
var reload = browserSync.reload;

var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build',
};

/**
 * Build the Jekyll Site
 */
gulp.task("jekyll-build", function (done) {
  browserSync.notify(messages.jekyllBuild);
  return cp
    .spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit" })
    .on("close", done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task(
  "jekyll-rebuild",
  gulp.series("jekyll-build", function (done) {
    console.log("rebuilding the website");
    browserSync.reload();
    done();
  })
);

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task(
  "browser-sync",
  gulp.series("sass", "jekyll-build", function () {
    browserSync.init({ server: { baseDir: "_site" } });
  })
);

gulp.task("default", gulp.series("sass", "jekyll-build"));

/**
 * Compile files from _scss into both _site/css (for live injecting) and locally site (for future jekyll builds)
 */
gulp.task("sass", function () {
  return gulp
    .src("scss/styles.scss")
    .pipe(sass({ includePaths: ["scss"], onError: browserSync.notify }))
    .pipe(gulp.dest("_site/css"))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(gulp.dest("css"));
});

/**
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task("watch", function () {
  gulp.watch(
    [
      "_sass/*.scss",
      "css/*.scss",
      "js/*.js",
      "*.html",
      "_layouts/*.html",
      "_includes/*.html",
      "_pages/*.html",
      "_includes/*.svg",
      "_posts/*",
    ],
    gulp.series("jekyll-rebuild")
  );
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task("default", gulp.series("browser-sync", "watch"));
