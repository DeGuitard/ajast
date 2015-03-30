module.exports = function(grunt) {

    grunt.config.set('ngtemplates', {
        ajast: {
            src: ['.tmp/public/js/templates/**.html'],
            dest: '.tmp/public/js/templates/templates.js',
            options: {
                htmlmin: {
                    collapseBooleanAttributes:      true,
                    collapseWhitespace:             true,
                    removeAttributeQuotes:          true,
                    removeComments:                 true,
                    removeEmptyAttributes:          true,
                    removeRedundantAttributes:      true,
                    removeScriptTypeAttributes:     true,
                    removeStyleLinkTypeAttributes:  true
                },
                url: function(url) { return url.replace('.tmp/public', ''); }
            }
        }
    });

    grunt.loadNpmTasks('grunt-angular-templates');
};
