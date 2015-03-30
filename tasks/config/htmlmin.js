module.exports = function(grunt) {

    grunt.config.set('htmlmin', {
        dist: {
            files: [
                {
                    expand: true,     // Enable dynamic expansion.
                    cwd: '.tmp/public/',      // Src matches are relative to this path.
                    src: ['**/*.html'], // Actual pattern(s) to match.
                    dest: '.tmp/public/'   // Destination path prefix.
                }
            ],
            options: {
                collapseBooleanAttributes:      true,
                collapseWhitespace:             true,
                removeAttributeQuotes:          true,
                removeComments:                 true,
                removeEmptyAttributes:          true,
                removeRedundantAttributes:      true,
                removeScriptTypeAttributes:     true,
                removeStyleLinkTypeAttributes:  true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-htmlmin');
};
