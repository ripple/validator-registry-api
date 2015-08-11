import {CronJob} from 'cron'
import moment from 'moment'

const validators = [
  'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7',
  'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj',
  'n9L81uNCaPgtUJfaHh89gmdvXKAmSt5Gdsw2g1iPWaPkAHW5Nm4C',
  'n9KiYM9CgngLvtRCQHZwgC2gjpdaZcCcbt3VboxiNFcKuwFVujzS',
  'n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA'
]

const QUORUM = 3

export async function storeClusterLedgers(start, end) {
  await database.ClusterLedgers.truncate()
  const ledgers = await database.Validations.findAll({
    attributes: ['ledger_hash'],
    where: database.sequelize.and({
        createdAt: { gte: start }
      }, {
        createdAt: { lt: end }
      }, {
        validation_public_key: validators
      }
    ),
    group: ['ledger_hash'],
    having: [`COUNT(DISTINCT(validation_public_key)) >= ${QUORUM}`],
    raw: true
  })

  return await database.ClusterLedgers.bulkCreate(ledgers)
}

export async function computeCorrelationCoefficient(start, end) {

  await storeClusterLedgers(start, end)

  const query = 'SELECT val.validation_public_key, '+
                'COUNT(DISTINCT( val.ledger_hash )) num_validated_ledger '+
                'FROM "Validations" val '+
                'join "ClusterLedgers" ledger ON val.ledger_hash = ledger.ledger_hash '+
                'GROUP BY val.validation_public_key;'

  const result = await database.sequelize.query(query)

  const denom_validated_ledger = await database.ClusterLedgers.count({})

  return _.map(result[0], result => {
    result.num_validated_ledger = parseInt(result.num_validated_ledger)
    result.denom_validated_ledger = denom_validated_ledger
    return result
  })
}

export async function create(start) {
  const end = moment(start).add(1, 'day').format('YYYY-MM-DD')

  let results = await computeCorrelationCoefficient(start, end)

  var coefficients = {}
  results.forEach(result => {
    coefficients[result.validation_public_key] = {
      correlation: result.num_validated_ledger / result.denom_validated_ledger
    }
  })

  return database.CorrelationScores.create({
    quorum: QUORUM,
    cluster: validators,
    coefficients: coefficients,
    date: start
  })
}

export async function start() {
  try {
    // Perform coefficient calculation hourly
    const job = new CronJob('0 0 * * * *', async function() {
      try {
        const date = moment().subtract(1, 'day').format('YYYY-MM-DD')

        const score = await database.CorrelationScores.findOne({ where: { date: date }})

        if (score) {
          console.error('Correlation Coefficients already computed for', date)
        } else {
          const record = await create(date)
          console.log('Computed Correlation Coefficients', record.toJSON())
        }
      } catch (error) {
        console.error('Error with Correlation Coefficient task', error)
      }
    }, null, true)
    console.log('Started coefficient calculations cron job')
  } catch (error) {
    console.error('Error starting coefficient calculations cron job:', error)
  }
}
