import 'sails-test-helper'
import assert from 'assert'
import moment from 'moment'
import {SHA256} from '../utils'

describe('ReportsController', () => {

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

  const date = moment().subtract(1, 'days').format('YYYY-MM-DD')

  beforeEach(async () => {
    await database.Validations.truncate()
    await database.ClusterLedgers.truncate()
    await database.ReportEntries.truncate()
    await database.Reports.truncate({cascade: true})

    const days = [
      moment().subtract(1, 'days'),
      moment().subtract(2, 'days'),
      moment().subtract(3, 'days')
    ]

    for (let i=0; i<3; i++) {
      const ledgers = Ledgers()

      for (let ledgerHash of ledgers) {

        for (let validator of alphaCluster) {
          await database.Validations.create({
            ledger_hash: ledgerHash,
            validation_public_key: validator,
            reporter_public_key: validator,
            createdAt: days[i].toDate()
          })
          await database.Validations.create({
            ledger_hash: SHA256(),
            validation_public_key: validator,
            reporter_public_key: validator,
            createdAt: days[i].toDate()
          })
        }

        for (let validator of otherCluster) {

          if (ledgers.indexOf(ledgerHash) % 2 === 0) {
            await database.Validations.create({
              ledger_hash: ledgerHash,
              validation_public_key: validator,
              reporter_public_key: validator,
              createdAt: days[i].toDate()
            })
          } else {
            await database.Validations.create({
              ledger_hash: SHA256(),
              validation_public_key: validator,
              reporter_public_key: validator,
              createdAt: days[i].toDate()
            })
          }
        }
      }

      await ReportService.create(alphaCluster, days[i].format('YYYY-MM-DD'))
    }
  })

  after(async () => {
    await database.Validations.truncate()
    await database.ClusterLedgers.truncate()
    await database.ReportEntries.truncate()
    await database.Reports.truncate({cascade: true})
  })

  describe('GET /reports/:date', () => {

    it('.show should return the report for the specified date', async (done) => {

      request
        .get(`/reports/${date}`)
        .expect(200)
        .end((error, response) => {
          assert.strictEqual(response.body.report.date, date)
          assert.strictEqual(response.body.report.quorum, 3)
          assert.strictEqual(response.body.report.cluster_validations, 10)
          alphaCluster.forEach(validator => {
            const validator_report = _.find(response.body.report.entries, report_entry => {
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
            const validator_report = _.find(response.body.report.entries, report_entry => {
              return report_entry.validation_public_key===validator
            })
            assert(validator_report)
            assert.strictEqual(validator_report.validations, 10)
            assert.strictEqual(validator_report.agreement_validations, 5)
            assert.strictEqual(validator_report.disagreement_validations, 5)
            assert.strictEqual(validator_report.agreement_coefficient, .5)
            assert.strictEqual(validator_report.disagreement_coefficient, .5)
          })
          done()
        })
    })
  })

  describe('GET /validators/:validation_public_key/reports', () => {

    it('.indexByValidator should return the historical daily report for a validator', (done) => {
      const validation_public_key = 'n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA'

      request
        .get(`/validators/${otherCluster[0]}/reports`)
        .expect(200)
        .end((error, response) => {
          assert(response.body.reports)
          assert.strictEqual(response.body.reports.length, 3)
          assert(response.body.reports[0].date > response.body.reports[1].date &&
                 response.body.reports[1].date > response.body.reports[2].date)
          for (let i=0; i<3; i++) {
            assert.strictEqual(response.body.reports[i].quorum, 3)
            assert.strictEqual(response.body.reports[i].cluster_validations, 10)
            assert.strictEqual(response.body.reports[i].entries[0].validation_public_key, otherCluster[0])
            assert.strictEqual(response.body.reports[i].entries[0].validations, 10)
            assert.strictEqual(response.body.reports[i].entries[0].agreement_validations, 5)
            assert.strictEqual(response.body.reports[i].entries[0].disagreement_validations, 5)
            assert.strictEqual(response.body.reports[i].entries[0].agreement_coefficient, .5)
            assert.strictEqual(response.body.reports[i].entries[0].disagreement_coefficient, .5)
          }
          done()
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
