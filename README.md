# validators.ripple.com

Node.js server application to track and reward validator performance,
and report on the state of the ripple peer network.

a [Sails](http://sailsjs.org) application

## Migrate

Add db configuration to config/config.json

````
sequelize db:migrate
````

## HTML Pages

##### GET /

### Validators and Validations

##### GET /validators
##### GET /validators/:public_key
##### GET /validators/:public_key/validations
##### GET /ledgers/:ledger_hash/validations
##### GET /ledgers/:ledger_hash/validations/:validation_public_key

### Incentivization

##### GET /incentivization
##### GET /incentivization/payouts
##### GET /incentivization/payouts/:id
##### GET /validators/:public_key/payouts

### Peer Crawler

##### GET /peer-crawler
##### GET /peer-crawler/crawls
##### GET /peer-crawler/crawls/:id

