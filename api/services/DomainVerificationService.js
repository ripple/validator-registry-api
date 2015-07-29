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
      // Do not record domain if domain verification state is unchanged
      if (verification && verification.domain===domain) return
      await database.Verifications.create({
        validation_public_key: validator,
        domain: domain
      })
    } catch(err) {
      // Do not record error if domain verification state is unchanged
      if (verification && verification.error===err.type) return
      await database.Verifications.create({
        validation_public_key: validator,
        error: err.type
      })
    }
  }
}
