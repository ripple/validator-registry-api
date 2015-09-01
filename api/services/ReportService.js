import {CronJob} from 'cron'
import moment from 'moment'

const CLUSTER = [
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
        validation_public_key: CLUSTER
      }
    ),
    group: ['ledger_hash'],
    having: [`COUNT(DISTINCT(validation_public_key)) >= ${QUORUM}`],
    raw: true
  })

  return await database.ClusterLedgers.bulkCreate(ledgers)
}


export async function createReportEntries(start, end, report) {

  const query = 'SELECT val.validation_public_key, '+
                'COUNT(DISTINCT( val.ledger_hash )) validations, '+
                'COUNT(DISTINCT(CASE WHEN cluster_ledger.id IS NOT NULL THEN val.ledger_hash ELSE NULL END)) agreement_validations '+
                'FROM (SELECT validation_public_key, ledger_hash '+
                'FROM "Validations" '+
                `WHERE "createdAt">='${start}' AND "createdAt"<'${end}') val `+
                'LEFT OUTER JOIN "ClusterLedgers" cluster_ledger ON val.ledger_hash = cluster_ledger.ledger_hash '+
                'GROUP BY val.validation_public_key;'

  const counts = await database.sequelize.query(query, {
    type: database.sequelize.QueryTypes.SELECT,
    raw: true
  })

  const report_entries = _.map(counts, validator => {
    const validations = parseInt(validator.validations)
    const agreement_validations = parseInt(validator.agreement_validations)
    const disagreement_validations = validations - agreement_validations
    return {
      validation_public_key: validator.validation_public_key,
      validations: validations,
      agreement_validations: agreement_validations,
      disagreement_validations: validations - agreement_validations,
      agreement_coefficient: agreement_validations / report.cluster_validations,
      disagreement_coefficient: disagreement_validations / validations,
      report_id: report.id
    }
  })

  return database.ReportEntries.bulkCreate(report_entries)
}


export async function create(start) {
  if (await database.Reports.findOne({
    where: {
      date: start
    }
  })) {
    throw new Error(`report already exists for ${start}`)
  }

  const end = moment(start).add(1, 'day').format('YYYY-MM-DD')
  const cluster_ledgers = await storeClusterLedgers(start, end)

  if (!cluster_ledgers.length) {
    throw new Error('no ledgers validated by cluster quorum')
  }

  const report = await database.Reports.create({
    quorum: QUORUM,
    cluster: CLUSTER,
    date: start,
    cluster_validations: cluster_ledgers.length
  })

  await createReportEntries(start, end, report)

  return report
}

export async function fillHistory() {

  var query = 'select distinct "createdAt"::date from "Validations"'
  const validation_dates = await database.sequelize.query(query, {
    type: database.sequelize.QueryTypes.SELECT,
    raw: true
  })

  for (let validation_date of validation_dates) {
    const date = moment(validation_date.createdAt).format('YYYY-MM-DD')
    if (date!==moment().format('YYYY-MM-DD') && !await database.Reports.findOne({
      where: {
        date: date
      }
    })) {
      await create(date)
    }
  }
}

export async function start() {
  try {

    // Perform daily report hourly
    const job = new CronJob('0 0 * * * *', async function() {
      try {
        const date = moment().subtract(1, 'day').format('YYYY-MM-DD')

        const score = await database.Reports.findOne({ where: { date: date }})

        if (score) {
          console.error('Report already computed for', date)
        } else {
          const record = await create(date)
          console.log('Completed report', record.toJSON())
        }
      } catch (error) {
        console.error('Error with report task', error)
      }
    }, null, true)
    console.log('Started report cron job')
  } catch (error) {
    console.error('Error starting report cron job:', error)
  }
}
