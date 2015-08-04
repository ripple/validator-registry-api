import Sails from 'sails'
import moment from 'moment'
import bluebird from 'bluebird'
import {SHA256} from '../test/utils'

let liftSails = bluebird.promisify(Sails.lift)

export default async function () {

  await liftSails({})

  const publicKeys = [
    'n9KHeNRQCgmzdD2WF92abMkRfxWGFyYQS1rJ5idZt9Yg3fEXU6Dh',
    'n9JmgHszbQFCm6zD8NSobkd7K54qLtDgCaYf2mq772N5KMYEmnXv',
    'n9L81uNCaPgtUJfaHh89gmdvXKAmSt5Gdsw2g1iPWaPkAHW5Nm4C'
  ]

  const day1 = moment().subtract(1, 'day')
  const day2 = moment().subtract(2, 'days')
  const day3 = moment().subtract(3, 'days')
  const days = [day1, day2, day3]

  for (let j=0; j<days.length; j++) {

    for (let k=0; k<publicKeys.length; k++) {

      for (let i=0; i<5; i++) {

        try {
          let v = await database.Validations.create({
            validation_public_key: publicKeys[k],
            reporter_public_key: publicKeys[k],
            ledger_hash: SHA256(),
            createdAt: days[j].toDate()
          })
          console.log(days[j].toDate())
        } catch(error) {
          console.log('ERROR',error)
        }
      }
    }
  }

  try {
    let report1 = await ValidationReportService.create(day1.format('YYYY-MM-DD'))
    console.log(report1.toJSON())
    let report2 = await ValidationReportService.create(day2.format('YYYY-MM-DD'))
    console.log(report2.toJSON())
    let report3 = await ValidationReportService.create(day3.format('YYYY-MM-DD'))
    console.log(report3.toJSON())
  } catch(error) {
    console.log('ERROR', error)
  }
}

