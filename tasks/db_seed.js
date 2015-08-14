import Sails from 'sails'
import moment from 'moment'
import bluebird from 'bluebird'
import {SHA256} from '../test/utils'

let liftSails = bluebird.promisify(Sails.lift)

export default async function () {

  try {

    await liftSails({})

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

      let report = await ReportService.create(days[i].format('YYYY-MM-DD'))
      console.log(report)
    }
  } catch(error) {
    console.log('ERROR', error)
  }
}

function Ledgers() {
  var ledgers = []
  for (var i=0; i<10; i++) {
    let ledger = SHA256()
    ledgers.push(ledger)
  }
  return ledgers
}
