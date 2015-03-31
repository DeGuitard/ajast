module.exports = function (grunt) {
	grunt.registerTask('buildProd', [
		'compileAssets',
        'htmlmin',
        'ngtemplates',
		'concat',
		'newer:uglify',
		'newer:cssmin',
		'linkAssetsBuildProd',
		'clean:build',
		'copy:build',
        'compress:dist'
	]);
};
