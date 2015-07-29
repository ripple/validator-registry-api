import moment from 'moment'

const validators = [
  'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7',
  'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj',
  'n9L81uNCaPgtUJfaHh89gmdvXKAmSt5Gdsw2g1iPWaPkAHW5Nm4C',
  'n9KiYM9CgngLvtRCQHZwgC2gjpdaZcCcbt3VboxiNFcKuwFVujzS',
  'n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA'
]

const QUORUM = 3

export async function compute() {

  let start = moment().format('YYYY-MM-DD')
  let end   = moment().add(1, 'day').format('YYYY-MM-DD')

  let query = `select num.validation_public_key , num.date_validated , num.num_validated_ledger, denom.denom_validated_ledger, cast(num.num_validated_ledger/ denom.denom_validated_ledger as float) as pct_validated_ledger from ( select b.validation_public_key , to_char(b."createdAt",'yyyy-MM-dd')  date_validated, count(distinct( b.ledger_hash)) num_validated_ledger from  "Validations" b where exists (select a.ledger_hash, count(distinct(a.validation_public_key))  rowcount from "Validations" a where a."createdAt" >= '${start}' and a."createdAt" < '${end}' and a.validation_public_key in ('n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7','n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj','n9L81uNCaPgtUJfaHh89gmdvXKAmSt5Gdsw2g1iPWaPkAHW5Nm4C', 'n9KiYM9CgngLvtRCQHZwgC2gjpdaZcCcbt3VboxiNFcKuwFVujzS', 'n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA') and a.ledger_hash != b.ledger_hash group by a.ledger_hash having count(distinct(a.validation_public_key)) >= 3) group by b.validation_public_key, to_char(b."createdAt",'yyyy-MM-dd')) num join (select to_char(c."createdAt",'yyyy-MM-dd') as date_validated, count(distinct( c.ledger_hash)) as denom_validated_ledger from "Validations" c where c.validation_public_key in ('n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7','n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj','n9L81uNCaPgtUJfaHh89gmdvXKAmSt5Gdsw2g1iPWaPkAHW5Nm4C', 'n9KiYM9CgngLvtRCQHZwgC2gjpdaZcCcbt3VboxiNFcKuwFVujzS','n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA') and c."createdAt" >= '${start}' and c."createdAt" < '${end}' group by to_char(c."createdAt",'yyyy-MM-dd') having count(distinct(c.validation_public_key)) >= 3) denom  on num.date_validated = denom.date_validated;`

  const result = await database.sequelize.query(query)
  return _.map(result[0], result => {
    result.num_validated_ledger = parseInt(result.num_validated_ledger)
    result.denom_validated_ledger = parseInt(result.denom_validated_ledger)
    return result
  })
}

export async function create() {
  return compute().then(results => {

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
  })
}

