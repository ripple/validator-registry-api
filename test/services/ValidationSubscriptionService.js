import assert from 'assert'
import 'sails-test-helper'

describe('ValidationSubscriptionService', () => {

  before(async() => {
    await database.Validations.truncate()
  });

  afterEach(async() => {
    await database.Validations.truncate()
  });

  describe('getRippleds', () => {

    it('should return a list of rippled nodes', async() => {

      const rippledApiUrl = '10.30.72.248:1234/rippleds'
      const rippleds = await ValidationSubscriptionService.getRippleds(rippledApiUrl)
      expect(rippleds).to.be.instanceof(Array)
      expect(rippleds[0].version).to.exist
      expect(rippleds[0].public_key).to.exist
    })
  })

  describe('subscribeToRippleds', () => {

    it('should feed subscription validations to Validations table', async(done) => {

      const rippleds = [{
        ipp: '72.251.233.165:51235',
        version: 'rippled-0.29.0',
        public_key: 'n9M77Uc9CSaSFZqt5V7sxPR4kFwbha7hwUFBD5v5kZt2SQjBeoDs'
      }]
      await ValidationSubscriptionService.subscribeToRippleds(rippleds)
      // Wait for subscription messages to arrive
      setTimeout(async () => {
        const validation = await database.Validations.findOne({
          raw: true
        })
        expect(validation).to.exist
        expect(validation).to.be.an('object')
        expect(validation.reporter_public_key).to.equal(rippleds[0].public_key)
        done()
      }, 1000)
    })
  })
})
