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

# Local Hacking

To hack on validators.ripple.com, you'll need:

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

You'll now have validators.ripple.com running on localhost:1337.

Any modifications to the code will require a restart of the webapp container.
Usually you can ^C and re-run ``docker-compose up webapp``

If you need a shell:

```
$ docker-compose run webapp /bin/bash
```
