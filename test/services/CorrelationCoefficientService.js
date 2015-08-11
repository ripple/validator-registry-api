import 'sails-test-helper'
import assert from 'assert'
import moment from 'moment'
import {SHA256} from '../utils'

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

  let start = moment().format('YYYY-MM-DD')
  let end   = moment().add(1, 'day').format('YYYY-MM-DD')
  beforeEach(async () => {
    await database.Validations.truncate()
    await database.ClusterLedgers.truncate()

    const ledgers = Ledgers()

    for (let ledgerHash of ledgers) {

      for (let validator of alphaCluster) {
        let validation = await database.Validations.create({
          ledger_hash: ledgerHash,
          validation_public_key: validator,
          reporter_public_key: validator
        })
      }

      for (let validator of otherCluster) {

        if (ledgers.indexOf(ledgerHash) % 2 === 0) {
          let validation = await database.Validations.create({
            ledger_hash: ledgerHash,
            validation_public_key: validator,
            reporter_public_key: validator
          })
        }
      }
    }
  })

  after(async() => {
    await database.Validations.truncate()
  });

  describe('storeClusterLedgers', () => {

    it('should persist the cluster ledgers to the database', async() => {

      await CorrelationCoefficientService.storeClusterLedgers(start, end)
      const ledgers = await database.ClusterLedgers.findAll({raw:true})
      expect(ledgers).to.be.instanceof(Array)
      expect(ledgers).to.have.length(10)

      ledgers.forEach(result => {
        assert(result.ledger_hash)
      })
    })
  })

  describe('computeCorrelationCoefficient', () => {

    it('should calculate the correlation coefficient', async () => {

      const results = await CorrelationCoefficientService.computeCorrelationCoefficient(start, end)
      results.forEach(result => {

        assert(result.validation_public_key)
        assert(result.denom_validated_ledger, 10)

        if (_.contains(alphaCluster, result.validation_public_key)) {
          assert.strictEqual(result.num_validated_ledger, 10)
        } else if (_.contains(otherCluster, result.validation_public_key)) {
          assert.strictEqual(result.num_validated_ledger, 5)
        } else { assert(0) }
      })
    })
  })

  describe('create', () => {

    it('should persist the correlation coefficient to the database', async () => {

      const result = await CorrelationCoefficientService.create(start)

      assert.strictEqual(result.quorum, 3)
      assert.strictEqual(result.cluster.length, 5)
      assert(result.createdAt)
      assert(result.updatedAt)


      alphaCluster.forEach(validator => {
        assert.strictEqual(result.coefficients[validator].correlation, 1)
      })

      otherCluster.forEach(validator => {
        assert.strictEqual(result.coefficients[validator].correlation, 0.5)
      })
    })
  })
})

function Ledgers() {
  var ledgers = []
  for (var i=0; i<10; i++) {
    let ledger = SHA256()
    ledgers.push(ledger)
  }
  return ledgers
}

