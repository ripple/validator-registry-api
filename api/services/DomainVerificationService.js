import Verifier from 'ripple-domain-verifier'
import {CronJob} from 'cron'

export async function verify() {

  let verifier = new Verifier()

  const validators = await database.Validations.getValidators()

  for (let validator of validators) {

    // Check for ephemeral public key from validator manifest
    // Validator operators set the domain field on the account root for the
    // ephemeral public key, but list the master public key in ripple.txt
    const ephemeral_public_key = await database.Manifests.getEphemeralKey(validator)
    let master_public_key
    if (ephemeral_public_key) {
      master_public_key = validator
      validator = ephemeral_public_key
    }

    // Get the most recent domain verification for this validator
    const verification = await database.Verifications.findOne({
      where: {validation_public_key: validator},
      order: '"createdAt" DESC',
      raw: true
    })

    try {
      const domain = await verifier.verifyValidatorDomain(validator, master_public_key)

      if (!verification || verification.domain!==domain) {
        await database.Verifications.create({
          validation_public_key: master_public_key ? master_public_key : validator,
          domain: domain
        })
      }
    } catch(err) {
      if (err.type==='AccountDomainNotFound' && master_public_key &&
          verification && verification.domain) {

        // Ignore AccountDomainNotFound for validators using manifests
        // if domain verification was previously success.
        // This is so that the domain to does not have to be set in the
        // account root for each new ephemeral key.
      } else if (!verification || verification.error!==err.type) {

        // Record new error
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
