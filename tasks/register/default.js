module.exports = function (grunt) {
	grunt.registerTask('default', ['compileAssets', 'ngtemplates', 'concat', 'linkAssets',  'watch']);
};
