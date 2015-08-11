var Sails = require('sails')
var moment = require('moment')

module.exports = function (done) {

  Sails.lift({}, async () => {

    try {
      var date = moment().subtract(1, 'day').format('YYYY-MM-DD')

      const score = await database.CorrelationScores.findOne({ where: { date: date }})

      if (score) {
        console.error('Correlation Coefficients already computed for', date)
      } else {
        const record = await CorrelationCoefficientService.create(date)
        console.log('Computed Correlation Coefficients', record.toJSON())
      }
    } catch (error) {
      console.error('Error with Correlation Coefficient task', error)
    }

    done()
  })
};
