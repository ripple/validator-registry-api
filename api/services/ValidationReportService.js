import {CronJob} from 'cron'
import moment from 'moment'

const DATE_FORMAT = 'YYYY-MM-DD'

export async function historyForValidator(validationPublicKey) {

  const reports = await database.ValidationReports.findAll({
    order: 'date DESC',
    raw: true
  })

  const relevantReports = _.filter(reports, report => {
    return _.has(report.validators, validationPublicKey)
  })

  const scores = await database.CorrelationScores.findAll({
    where: {
      date: {
        in: _.pluck(relevantReports, 'date')
      }
    },
    raw: true
  })

  const history = _.map(relevantReports, report => {
    return {
      date: report.date,
      validations: report.validators[validationPublicKey],
      correlation_coefficient: _.find(scores, score => {
        return score.date === report.date
      }).coefficients[validationPublicKey]
    }
  })

  return history || []
}

export async function create(date) {

  let report = await database.ValidationReports.findOne({ where: { date: date }})

  if (report) {
    throw new Error(`report already exists for ${date}`)
  } else {
    const validators = await compute(date) 
    const report = await  database.ValidationReports.create({
      date: date,
      validators: validators
    })
    return report
  }
}

export async function compute(start) {

  const end   = moment(start).add(1, 'day').format(DATE_FORMAT)

  var query = `select count(distinct ledger_hash) validations, validation_public_key from "Validations" where "createdAt" > '${start}'and "createdAt" < '${end}' group by validation_public_key`

  const results = await database.sequelize.query(query)

  return (results => {
    var map = {}
    results.forEach(result => {
      map[result.validation_public_key] = parseInt(result.validations)
    })
    return map
  })(results[0])
}

export async function latest() {

  const report = await database.ValidationReports.findOne({
    order: 'date DESC',
    raw: true
  })
  const scores = await database.CorrelationScores.findOne({
    where: {
      date: report.date
    },
    raw: true
  })
  _.forEach(report.validators, (validations, validator)=>{
    report.validators[validator] = {
      validations: validations,
      correlation_coefficient: scores.coefficients[validator]
    }
  })
  return report
}

export async function start() {
  try {
    // Perform daily validators report hourly
    const job = new CronJob('0 0 * * * *', async function() {
      try {
        const date = moment().subtract(1, 'day').format('YYYY-MM-DD')

        const score = await database.ValidationReports.findOne({ where: { date: date }})

        if (score) {
          console.error('Validators report already computed for', date)
        } else {
          const record = await create(date)
          console.log('Completed validators report', record.toJSON())
        }
      } catch (error) {
        console.error('Error with Correlation Coefficient task', error)
      }
    }, null, true)
    console.log('Started validators report cron job')
  } catch (error) {
    console.error('Error starting validators report cron job:', error)
  }
}
