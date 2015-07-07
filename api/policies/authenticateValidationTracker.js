/**
 * authenticateValidationTracker.js
 *
 * @module      :: Policy
 * @description :: HTTP Basic Auth policy to authenticate validation trackers
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
var basicAuth = require('basic-auth');

// only require basic auth if both variables are set
var BASIC_AUTH_USER = process.env.BASIC_AUTH_USER
var BASIC_AUTH_PASS = process.env.BASIC_AUTH_PASS

module.exports = function (req, res, next) {
  var user = basicAuth(req);

  if (BASIC_AUTH_USER && BASIC_AUTH_PASS) {
    if (!user || !user.name || !user.pass) {
      return res.forbidden('You are not permitted to perform this action.');
    }
    if (user.name === BASIC_AUTH_USER && user.pass === BASIC_AUTH_PASS) {
      return next();
    } else {
      return res.forbidden('You are not permitted to perform this action.');
    }
  } else {
    return next();
  }
};

