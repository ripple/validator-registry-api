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

export async function compute() {

  let start = moment().format('YYYY-MM-DD')
  let end   = moment().add(1, 'day').format('YYYY-MM-DD')

  await storeClusterLedgers(start, end)

  const query = 'SELECT val.validation_public_key, '+
                'COUNT(DISTINCT( val.ledger_hash )) num_validated_ledger '+
                'FROM "Validations" val '+
                'join "ClusterLedgers" ledger ON val.ledger_hash = ledger.ledger_hash '+
                'GROUP BY val.validation_public_key;'

  const result = await database.sequelize.query(query)

  const denom_validated_ledger = await database.ClusterLedgers.count({})

  return _.map(result[0], result => {
    result.date_validated = start
    result.num_validated_ledger = parseInt(result.num_validated_ledger)
    result.denom_validated_ledger = denom_validated_ledger
    return result
  })
}

export async function create() {
  let results = await compute()

  var coefficients = {}
  results.forEach(result => {
    coefficients[result.validation_public_key] = result.num_validated_ledger / result.denom_validated_ledger
  })

  return CorrelationScore.create({
    quorum: QUORUM,
    cluster: validators,
    coefficients: coefficients,
    date: results[0].date_validated
  })
}
