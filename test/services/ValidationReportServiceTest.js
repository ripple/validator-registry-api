import 'sails-test-helper'
import assert from 'assert'
import {SHA256} from '../utils'
import moment from 'moment'

describe('ValidationReportService', () => {

  const publicKey1 = 'n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA'
  const publicKey2 = 'n9Ljaq2jmBnk1qnuyTdv2DpvoTbbLE8sqXGwvPRQdVk5UAFiBnDM'

  beforeEach(async () => {
    await database.sequelize.query('delete from "Validations"')
    await database.sequelize.query('delete from "ValidationReports"')
  })

  after(async () => {
    await database.sequelize.query('delete from "Validations"')
    await database.sequelize.query('delete from "ValidationReports"')
  })

  it('#latest should return the lastest report', async () => {
    const day = moment()

    let validation = await database.Validations.create({
      validation_public_key: publicKey1,
      reporter_public_key: publicKey1,
      ledger_hash: SHA256(),
      createdAt: day.toDate()
    })
    await ValidationReportService.create(day.format('YYYY-MM-DD'))

    const report = await ValidationReportService.latest()

    assert(report.date)
    assert(report.validators)
  })

  it('#historyForValidator should return all reports for validator', async () => {
    await database.sequelize.query('delete from "ValidationReports"')

    const day1 = moment().subtract(1, 'day')
    const day2 = moment().subtract(2, 'days')
    const day3 = moment().subtract(3, 'days')

    for (let i=0; i<3; i++) {
      let validation = await database.Validations.create({
        validation_public_key: publicKey1,
        reporter_public_key: publicKey1,
        ledger_hash: SHA256(),
        createdAt: day1.toDate()
      })
      // await validation.updateAttributes({ createdAt: day1 })
      validation = await database.Validations.create({
        validation_public_key: publicKey1,
        reporter_public_key: publicKey1,
        ledger_hash: SHA256(),
        createdAt: day2.toDate()
      })
      // await validation.updateAttributes({ createdAt: day2 })
      validation = await database.Validations.create({
        validation_public_key: publicKey1,
        reporter_public_key: publicKey1,
        ledger_hash: SHA256(),
        createdAt: day3.toDate()
      })
      // await validation.updateAttributes({ createdAt: day3 })
    }

    await ValidationReportService.create(day1.format('YYYY-MM-DD'))
    await ValidationReportService.create(day2.format('YYYY-MM-DD'))
    await ValidationReportService.create(day3.format('YYYY-MM-DD'))

    const reports = await ValidationReportService.historyForValidator(publicKey1)

    assert.strictEqual(reports.length, 3)
    reports.forEach(report => {
      assert.strictEqual(report.validations, 3)
    })
  })

  it('#compute should compute total unique validations per validator in a given day', async () => {

    const publicKey = 'n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA'
    const duplicateLedger = SHA256()

    // Store four ledgers one time and one ledger four times (five unique ledgers)
    for (let i=0; i<8; i++) {
      await database.Validations.create({
        validation_public_key: publicKey,
        reporter_public_key: publicKey,
        ledger_hash: i % 2 ? SHA256() : duplicateLedger
      })
    }

    const result = await ValidationReportService.compute(moment().format('YYYY-MM-DD'))
    assert.strictEqual(result[publicKey], 5)
  })

  it('#create should compute and store total validations per validator in a given day', async () => {

    const date = moment().format('YYYY-MM-DD')
    
    for (let i=0; i<5; i++) {
      await database.Validations.create({
        validation_public_key: publicKey1,
        reporter_public_key: publicKey1,
        ledger_hash: SHA256()
      })
      await database.Validations.create({
        validation_public_key: publicKey2,
        reporter_public_key: publicKey2,
        ledger_hash: SHA256()
      })
      await database.Validations.create({
        validation_public_key: publicKey2,
        reporter_public_key: publicKey2,
        ledger_hash: SHA256()
      })
    }

    const record = await ValidationReportService.create(date)

    assert(record.id)
    assert.strictEqual(record.date, date)
    assert.strictEqual(record.validators[publicKey1], 5)
    assert.strictEqual(record.validators[publicKey2], 10)
  })
})


