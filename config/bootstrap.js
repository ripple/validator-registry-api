/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  const ALPHA_CLUSTER = [
    'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7',
    'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj',
    'n9L81uNCaPgtUJfaHh89gmdvXKAmSt5Gdsw2g1iPWaPkAHW5Nm4C',
    'n9KiYM9CgngLvtRCQHZwgC2gjpdaZcCcbt3VboxiNFcKuwFVujzS',
    'n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA'
  ]

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  if (process.env.NODE_ENV==='test') {
    // Do not start services in testing
    cb()
  } else {
    Promise.all([
      DomainVerificationService.start(),
      ReportService.start(ALPHA_CLUSTER)
    ]).then(() => {
      cb()
    });
  }
};
