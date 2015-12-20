# gulp-bookmarklet
Gulp wrapper for the [bookmarklet](https://github.com/mrcoles/bookmarklet) package used to generate multiple bookmarklets from source.

## Installation
Install package with NPM and add it to your development dependencies:

`npm install --save-dev gulp-bookmarklet`

## Usage
No arguments are required for usage. By default a call to `gulp-bookmarklet` with no arguments will generate bookmarklet code for each source file in minified js files.
```
var bookmarklet = require('gulp-bookmarklet');

gulp.task('bookmarklet', function() {
    return gulp.src('src/*.js')
        .pipe(bookmarklet())
        .pipe(gulp.dest('min.js'));
});
```

To generate bookmarklets in a different format, call `gulp-bookmarklet` with parameter object `{format: '???'}` where ??? may be one of:
* **js** - minified bookmarklet text (Default)
* **html** - generate bookmark files using [netscape-bookmarks](https://github.com/bahamas10/node-netscape-bookmarks) to allow for easy import into web browser
* **htmlsingle** - same as `html` except all bookmarklets are exported to a single html file
  * Additional parameters: `file` - Custom filename for the output file generated, default name is `bookmarklets.html`

Below is an example of using `htmlsingle` with a custom file name:
```
var bookmarklet = require('gulp-bookmarklet');

gulp.task('bookmarklet', function() {
    return gulp.src('src/*.js')
        .pipe(bookmarklet({
            format: 'htmlsingle',
            file: 'awesome.html'
        }))
        .pipe(gulp.dest('./'));
});
```
