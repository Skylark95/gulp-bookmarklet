var through = require('through2');
var gutil = require('gulp-util');
var bookmarklet = require('bookmarklet');
var netscape = require('netscape-bookmarks');
var path = require('path');
var replaceExt = require('replace-ext');
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-bookmarklet';

module.exports = function(opt) {
    var opt = opt || {},
        format = opt.format || 'js',
        htmlSingleFileName = opt.file || 'bookmarklets.html',
        validFormats = ['js', 'html', 'htmlsingle'],
        bookmarklets = {},
        latestFile;

    if (validFormats.indexOf(format) === -1) {
        throw new PluginError(PLUGIN_NAME, "Invalid format '" + format + "' - Must be one of ['js', 'html', 'htmlsingle']");
    }

    function generateBookmarklet(file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }

        if (file.isBuffer()) {
            var filename = path.basename(file.path).replace(path.extname(file.path), ''),
                data = bookmarklet.parseFile(file.contents.toString(enc));

            if (data.errors) {
                this.emit('error', new PluginError(PLUGIN_NAME, data.errors.join('\n')));
                return cb();
            }

            var code = bookmarklet.convert(data.code, data.options);
            latestFile = file;

            if (format === 'htmlsingle') {
                bookmarklets[filename] = code;
            } else {
                if (format === 'html') {
                    var bookmark = {};
                    bookmark[filename] = code;
                    code = netscape(bookmark);
                    file.path = replaceExt(file.path, '.html');
                } else { // format === 'js'
                    file.path = replaceExt(file.path, '.min.js');
                }
                file.contents = new Buffer(code);
                this.push(file);
            }
            cb();
        }
    }

    function endStream(cb) {
        if (format !== 'htmlsingle' || bookmarklets.length === 0) {
            cb();
            return;
        }

        var code = netscape(bookmarklets),
            file = latestFile.clone({contents: false});
        file.path = path.join(latestFile.base, htmlSingleFileName);
        file.contents = new Buffer(code);
        this.push(file);
        cb();
    }

    return through.obj(generateBookmarklet, endStream);
};
