import 'sails-test-helper'
import assert from 'assert'

describe('SubscriptionService', () => {

  before(async() => {
    await database.Validations.truncate()
  });

  afterEach(async() => {
    await database.Validations.truncate()
  });

  describe('getRippleds', () => {

    it('should return a list of rippled nodes', async() => {

      const rippleds = await SubscriptionService.getRippleds(process.env.PEERS_API_URL)
      expect(rippleds).to.be.instanceof(Array)
      expect(rippleds[0].version).to.exist
      expect(rippleds[0].node_public_key).to.exist
    })
  })

  describe('subscribeToRippleds', () => {

    it('should open websocket connections to rippleds', async(done) => {

      const rippleds = [{
        ip: 's1.ripple.com:51235',
        version: 'rippled-0.30.0'
      }]
      const connections = await SubscriptionService.subscribeToRippleds(rippleds)
      // Wait for subscription to start
      setTimeout(() => {
        expect(connections).to.be.an('object')
        expect(_.size(connections)).to.equal(2)
        _.forEach(connections, function(connection, ip) {
          expect(['ws://s1.ripple.com:51233', 'wss://s.altnet.rippletest.net:51233']).to.include(ip)
          expect(connection).to.exist
        });
        done()
      }, 1000)
    })
  })
})
