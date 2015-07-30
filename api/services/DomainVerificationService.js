import Verifier from 'ripple-domain-verifier'
import {CronJob} from 'cron'

export async function verify() {

  let verifier = new Verifier()

  const validators = await database.Validations.getValidators()

  for (let validator of validators) {

    // Get the most recent domain verification for this validator
    const verification = await database.Verifications.findOne({
      where: {validation_public_key: validator},
      order: '"createdAt" DESC'
    })

    try {
      const domain = await verifier.verifyValidatorDomain(validator)

      if (!(verification && verification.domain===domain)) {
        await database.Verifications.create({
          validation_public_key: validator,
          domain: domain
        })
      }
    } catch(err) {

      if (!(verification && verification.error===err.type)) {
        await database.Verifications.create({
          validation_public_key: validator,
          error: err.type
        })
      }
    }
  }
}

export async function start() {
  try {
    // Perform domain verification hourly
    const job = new CronJob('0 0 * * * *', async function() {
      try {
        await verify()
        console.log('Verified validator domains')
      } catch (error) {
        console.error('Error with validator domain verification task:', error)
      }
    }, null, true)
    console.log('Started domain verification cron job')
  } catch (error) {
    console.error('Error starting domain verification cron job:', error)
  }
}
