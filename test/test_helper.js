import Sails from 'sails'

before(done => Sails.lift(done))

after (done => Sails.lower(done))

export default true