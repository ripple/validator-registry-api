import 'sails-test-helper'
import assert from 'assert'

describe('ValidationSubscriptionService', () => {

  before(async() => {
    await database.Validations.truncate()
  });

  afterEach(async() => {
    await database.Validations.truncate()
  });

  describe('getRippleds', () => {

    it('should return a list of rippled nodes', async() => {

      const rippleds = await ValidationSubscriptionService.getRippleds(process.env.PEERS_API_URL)
      expect(rippleds).to.be.instanceof(Array)
      expect(rippleds[0].version).to.exist
      expect(rippleds[0].public_key).to.exist
    })
  })

  describe('subscribeToRippleds', () => {

    it('should open websocket connections to rippleds', async(done) => {

      const rippleds = [{
        ipp: 's1.ripple.com:51235',
        version: 'rippled-0.30.0',
        public_key: 'n94szsuScMEjP4Nu7c3mndcyjWJELepZcASEkDMcDSwXhHH6Sn37'
      }]
      const connections = await ValidationSubscriptionService.subscribeToRippleds(rippleds)
      // Wait for subscription to start
      setTimeout(() => {
        expect(connections).to.be.an('object')
        expect(_.size(connections)).to.equal(1)
        _.forEach(connections, function(connection, ip) {
          expect(connection.public_key).to.equal(rippleds[0].public_key)
          expect(connection.ws).to.exist
        });
        done()
      }, 1000)
    })
  })
})
