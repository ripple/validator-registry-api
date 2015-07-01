/**
 * disableProduction
 *
 * @module      :: Policy
 * @description :: Simple policy to disable all production access
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

  // Forbid all acess in production to test automated deployment infrastructure
  if (process.env.NODE_ENV === 'production') {
    return res.forbidden('You are not permitted to perform this action.');
  } else {
    return next()
  }
};
