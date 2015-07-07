# validators.ripple.com

Node.js server application to track and reward validator performance,
and report on the state of the ripple peer network.

a [Sails](http://sailsjs.org) application

## Migrate

Add db configuration to config/config.json

````
sequelize db:migrate --url YOUR_POSTGRES_DB_URL
````

## Run

````
DATABASE_URL=YOUR_POSTGRES_DB_URL npm start
````

## Basic Authentication

To require basic http authentication set the following environment variables:

- BASIC_AUTH_USER (default undefined)
- BASIC_AUTH_PASS (default undefined)

If both variables are set validator-registry-api will require basic auth in order to POST to /validations

## HTML Pages

##### GET /

### Validators and Validations

##### GET /validators
##### GET /validators/:validation_public_key
##### GET /validators/:validation_public_key/validations
##### GET /ledgers/:ledger_hash/validations
##### GET /ledgers/:ledger_hash/validations/:validation_public_key
##### POST /validations
###### Request parameters
* validation_public_key
* ledger_hash
* reporter_public_key
