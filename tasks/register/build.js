module.exports = function (grunt) {
	grunt.registerTask('build', [
		'compileAssets',
        'htmlmin',
        'ngtemplates',
        'concat',
		'linkAssetsBuild',
		'clean:build',
		'copy:build'
	]);
};
