import 'sails-test-helper'
import assert from 'assert'
import {SHA256} from '../utils'
import moment from 'moment'

describe('ReportService', () => {

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

  const days = [
    moment(),
    moment().subtract(1, 'days'),
    moment().subtract(2, 'days')
  ]

  const start = days[0].format('YYYY-MM-DD')

  beforeEach(async () => {
    await database.Validations.truncate()
    await database.ClusterLedgers.truncate()
    await database.ReportEntries.truncate()
    await database.Reports.truncate({cascade: true})

    for (let i=0; i<3; i++) {
      const ledgers = Ledgers()

      for (let ledgerHash of ledgers) {

        for (let validator of alphaCluster) {
          await database.Validations.create({
            ledger_hash: ledgerHash,
            validation_public_key: validator,
            createdAt: days[i].toDate()
          })
          await database.Validations.create({
            ledger_hash: SHA256(),
            validation_public_key: validator,
            createdAt: days[i].toDate()
          })
        }

        for (let validator of otherCluster) {

          if (ledgers.indexOf(ledgerHash) % 2 === 0) {
            await database.Validations.create({
              ledger_hash: ledgerHash,
              validation_public_key: validator,
              createdAt: days[i].toDate()
            })
          } else {
            await database.Validations.create({
              ledger_hash: SHA256(),
              validation_public_key: validator,
              createdAt: days[i].toDate()
            })
          }
        }
      }
    }
  })

  after(async() => {
    await database.Validations.truncate()
    await database.ClusterLedgers.truncate()
    await database.ReportEntries.truncate()
    await database.Reports.truncate({cascade: true})
  });

  describe('create', () => {

    it('should persist the report to the database', async () => {

      const report = await ReportService.create(start)

      assert(report.id)
      assert.strictEqual(report.date, start)
      assert.strictEqual(report.quorum, 3)
      assert.strictEqual(report.cluster.length, 5)
      assert.strictEqual(report.cluster_validations, 10)

      const report_entries = await database.ReportEntries.findAll({
        where: {
          report_id: report.id
        },
        raw: true
      })

      alphaCluster.forEach(validator => {
        const validator_report = _.find(report_entries, report_entry => {
          return report_entry.validation_public_key===validator
        })
        assert(validator_report)
        assert.strictEqual(validator_report.validations, 20)
        assert.strictEqual(validator_report.agreement_validations, 10)
        assert.strictEqual(validator_report.disagreement_validations, 10)
        assert.strictEqual(validator_report.agreement_coefficient, 1)
        assert.strictEqual(validator_report.disagreement_coefficient, .5)
      })

      otherCluster.forEach(validator => {
        const validator_report = _.find(report_entries, report_entry => {
          return report_entry.validation_public_key===validator
        })
        assert(validator_report)
        assert.strictEqual(validator_report.validations, 10)
        assert.strictEqual(validator_report.agreement_validations, 5)
        assert.strictEqual(validator_report.disagreement_validations, 5)
        assert.strictEqual(validator_report.agreement_coefficient, .5)
        assert.strictEqual(validator_report.disagreement_coefficient, .5)
      })
    })
  })

  describe('createReportEntries', () => {

    it('should persist the report entries to the database', async () => {

      const end = moment(start).add(1, 'day').format('YYYY-MM-DD')
      const cluster_ledgers = await ReportService.storeClusterLedgers(start, end)

      const report = await database.Reports.create({
        quorum: 3,
        cluster: alphaCluster,
        date: start,
        cluster_validations: cluster_ledgers.length
      })

      const report_entries = await ReportService.createReportEntries(start, end, report)

      alphaCluster.forEach(validator => {
        const validator_report = _.find(report_entries, report_entry => {
          return report_entry.validation_public_key===validator
        })
        assert(validator_report)
        assert.strictEqual(validator_report.validations, 20)
        assert.strictEqual(validator_report.agreement_validations, 10)
        assert.strictEqual(validator_report.disagreement_validations, 10)
        assert.strictEqual(validator_report.agreement_coefficient, 1)
        assert.strictEqual(validator_report.disagreement_coefficient, .5)
      })

      otherCluster.forEach(validator => {
        const validator_report = _.find(report_entries, report_entry => {
          return report_entry.validation_public_key===validator
        })
        assert(validator_report)
        assert.strictEqual(validator_report.validations, 10)
        assert.strictEqual(validator_report.agreement_validations, 5)
        assert.strictEqual(validator_report.disagreement_validations, 5)
        assert.strictEqual(validator_report.agreement_coefficient, .5)
        assert.strictEqual(validator_report.disagreement_coefficient, .5)
      })

      const db_report_entries = await database.ReportEntries.findAll({
        where: {
          report_id: report.id
        },
        raw: true
      })

      alphaCluster.forEach(validator => {
        const validator_report = _.find(db_report_entries, report_entry => {
          return report_entry.validation_public_key===validator
        })
        assert(validator_report)
        assert.strictEqual(validator_report.validations, 20)
        assert.strictEqual(validator_report.agreement_validations, 10)
        assert.strictEqual(validator_report.disagreement_validations, 10)
        assert.strictEqual(validator_report.agreement_coefficient, 1)
        assert.strictEqual(validator_report.disagreement_coefficient, .5)
      })

      otherCluster.forEach(validator => {
        const validator_report = _.find(db_report_entries, report_entry => {
          return report_entry.validation_public_key===validator
        })
        assert(validator_report)
        assert.strictEqual(validator_report.validations, 10)
        assert.strictEqual(validator_report.agreement_validations, 5)
        assert.strictEqual(validator_report.disagreement_validations, 5)
        assert.strictEqual(validator_report.agreement_coefficient, .5)
        assert.strictEqual(validator_report.disagreement_coefficient, .5)
      })
    })
  })

  describe('storeClusterLedgers', () => {

    it('should persist the ledgers validated by cluster quorum to the database', async () => {

      const end = moment(start).add(1, 'day').format('YYYY-MM-DD')
      const cluster_ledgers = await ReportService.storeClusterLedgers(start, end)
      assert.strictEqual(cluster_ledgers.length, 10)

      const db_cluster_ledgers = await database.ClusterLedgers.findAll()
      assert.strictEqual(db_cluster_ledgers.length, 10)
    })
  })

  describe('fillHistory', () => {

    it('should create reports for past days with validations', async () => {

      await ReportService.fillHistory()

      const reports = await database.Reports.findAll({
        raw: true
      })
      assert.strictEqual(reports.length, 2)
      for (let i=1; i<3; i++) {
        assert(_.find(reports, report => {
          return report.date = days[i].format('YYYY-MM-DD')
        }))
      }
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
