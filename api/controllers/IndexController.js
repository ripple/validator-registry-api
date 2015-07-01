/**
 * IndexController
 *
 * @description :: Server-side logic for managing the API index
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	

  /**
   * `IndexController.index()`
   */
  index: function (req, res) {
    return res.json({
      validations: 'GET /validations',
      validators: 'GET /validators'
    });
  }
};

