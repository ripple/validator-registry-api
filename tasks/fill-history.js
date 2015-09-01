var Sails = require('sails')

module.exports = function (done) {

  Sails.lift({}, async () => {
    try {
      await ReportService.fillHistory()
      console.log('Backfilled report history')
    } catch (error) {
      console.error('Error with backfill report history task', error)
    }

    done()
  })
};
