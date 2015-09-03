import 'sails-test-helper'
import assert from 'assert'

describe('LedgersController', () => {

  it('#show should return a list of validations for the ledger', done => {

    var ledgerHash = '80BD6E9C249DA088278534985607D346B04FCFE20B3EC18B08786A1FC6B0FF7E'
    var validationPublicKey1 = 'n94a9mou7p3eRLSPmhKXYSvTJikm4dJ9EWsEgPuzPEeMb7DzsXKh'
    var validationPublicKey2 = 'n94KLCd8PtLA2iZRAWgZQ2yFDeQbdkXhYJWRWfwm9nXw7vuoocd6'
    var reporterPublicKey1   = 'n9KNNZhJbJ9Wiu1QDZtNUvKe7gy9a3PoH5YmBzVJ47JMyUEH6xpX'
    var reporterPublicKey2   = 'n9KsiCqPvXTzzuLrr7Ge96Vczd8n73xgGGKc5sC7KobgQRnWfDbS'

    database.Validations.truncate().then(() => {
      return database.Validations.create({
        ledger_hash: ledgerHash,
        validation_public_key: validationPublicKey1,
        reporter_public_key: reporterPublicKey1
      })
    }).then(() => {
      return database.Validations.create({
        ledger_hash: ledgerHash,
        validation_public_key: validationPublicKey1,
        reporter_public_key: reporterPublicKey2
      })
    }).then(() => {
      return database.Validations.create({
        ledger_hash: ledgerHash,
        validation_public_key: validationPublicKey2,
        reporter_public_key: reporterPublicKey1
      })
    })
    .then(() => {

      request
        .get(`/ledgers/${ledgerHash}/validations`)
        .end((error, response) => {
          assert.strictEqual(response.body.ledger_hash, ledgerHash)
          assert.strictEqual(response.body.validations.length, 2)
          done()
        })
    })
    .catch(error => {
      console.log(error)
    })
  })
})

