require('babel/register')


module.exports = function (grunt) {
	grunt.registerTask('db:seed', function() {
    var done = this.async()

    require(__dirname+'/../db_seed')().then(done)
  })
};
