require('babel/register')


module.exports = function (grunt) {
  grunt.registerTask('fill-history', function() {
    var done = this.async()

    require(__dirname+'/../fill-history')(done)
  })
};
