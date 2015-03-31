module.exports = function(grunt) {

    grunt.config.set('compress', {
        dist: {
            options: {
                mode: 'zip',
                archive: 'dist/dist-<%= pkg.version %>.zip'
            },
            files: [
                {expand: true, src: ['./api/**', './config/**', './tasks/**', './views/**', './www/**']}
            ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compress');
};
