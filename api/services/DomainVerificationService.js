import Verifier from 'ripple-domain-verifier'

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
