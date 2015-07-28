var Sails = require('sails')

module.exports = function (done) {

  Sails.lift({}, async () => {
    try {
      await DomainVerificationService.verify()
      console.log('Verified validator domains')
    } catch (error) {
      console.error('Error with validator domain verification task', error)
    }

    done()
  })
};
