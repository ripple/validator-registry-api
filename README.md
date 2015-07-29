# validators-registry-api

Node.js server application to track and publish rippled validator performance and ownership.

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
Response:
* Array of Validators

##### GET /validators/:validation_public_key
Response:
* Validator
  * validation_public_key
  * domain
  * error

##### GET /validators/:validation_public_key/validations
Response:
* Array of Validations

##### GET /ledgers/:ledger_hash/validations
Response:
* Array of Validations

##### GET /ledgers/:ledger_hash/validations/:validation_public_key
Response:
* Array of Validations

##### POST /validations
Request parameters:
* validation_public_key
* reporter_public_key
* ledger_hash

# Local Hacking

To hack on validators-registry-api, you'll need:

* Docker (``apt-get install docker``)
* Docker-compose (``pip install docker-compose``)

To build the environment:

```
$ docker-compose build
$ docker-compose run webapp npm install
$ docker-compose run webapp sequelize --url=postgres://postgres:postgres@postgres/postgres db:migrate
```

To bring up the environment:

```
$ docker-compose up
```

You'll now have validators-registry-api running on localhost:1337.

Any modifications to the code will require a restart of the webapp container.
Usually you can ^C and re-run ``docker-compose up webapp``

If you need a shell:

```
$ docker-compose run webapp /bin/bash
```

# Deployment to api.validators.ripple.com

Check the README in the ansible/ directory
