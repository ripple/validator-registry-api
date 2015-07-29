require('babel/register')


module.exports = function (grunt) {
	grunt.registerTask('correlate', function() {
    var done = this.async()

    require(__dirname+'/../correlate')(done)
  })
};
