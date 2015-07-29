require('babel/register')


module.exports = function (grunt) {
  grunt.registerTask('verify', function() {
    var done = this.async()

    require(__dirname+'/../verify')(done)
  })
};
