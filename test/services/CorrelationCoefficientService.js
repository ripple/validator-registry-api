import 'sails-test-helper'
import assert from 'assert'

describe('CorrelationCoefficientService', () => {

  const alphaCluster = [
    'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7',
    'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj',
    'n9L81uNCaPgtUJfaHh89gmdvXKAmSt5Gdsw2g1iPWaPkAHW5Nm4C',
    'n9KiYM9CgngLvtRCQHZwgC2gjpdaZcCcbt3VboxiNFcKuwFVujzS',
    'n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA'
  ]

  const otherCluster = [
    'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
    'n9MG8aiQxrupaCnkvTdLeEN6XGsedSdLd8NnVE9RgfaanPvrspL7'
  ]

  before(async () => {
    await database.sequelize.query('delete from "Validations"')

    const ledgers = Ledgers()

    ledgers.forEach(ledgerHash => {

      alphaCluster.forEach(async validator => {

        let validation = await database.Validations.create({
          ledger_hash: ledgerHash,
          validation_public_key: validator,
          reporter_public_key: validator
        })
      })

      otherCluster.forEach(async validator => {
        if (ledgers.indexOf(ledgerHash) % 2 === 0) {
          let validation = await database.Validations.create({
            ledger_hash: ledgerHash,
            validation_public_key: validator,
            reporter_public_key: validator
          })
        }
      })
    })
  })

  it('should calculate the correlation coefficient', done => {

    CorrelationCoefficientService.compute().then(results => {

      results.forEach(result => {

        assert(result.validation_public_key)
        assert(result.date_validated)
        assert(result.denom_validated_ledger, 10)

        if (_.contains(alphaCluster, result.validation_public_key)) {
          assert.strictEqual(result.num_validated_ledger, 10)
        } else {
          assert.strictEqual(result.num_validated_ledger, 5)
        }
      })

      done()
    })
    .catch(error => {
      console.log('ERROR', error)
    })
  })

  it('should persist the correlation coefficient to the database', async () => {

    const result = await CorrelationCoefficientService.create()

    assert.strictEqual(result.quorum, 3)
    assert.strictEqual(result.cluster.length, 5)
    assert(result.createdAt)
    assert(result.updatedAt)


    alphaCluster.forEach(validator => {
      assert.strictEqual(result.coefficients[validator], 1)
    })

    otherCluster.forEach(validator => {
      assert.strictEqual(result.coefficients[validator], 0.5)
    })
  })
})

function Ledgers() {
  var ledgers = []
  for (var i=0; i<10; i++) {
    let ledger = Sha256()
    ledgers.push(ledger)
  }
  return ledgers
}

function Sha256() {
  return require('crypto')
          .createHash('sha256')
          .update(String(Math.random()))
          .digest('hex')
          .toUpperCase()
}

