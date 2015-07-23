# api.validators.ripple.com deployment

api.validators.ripple.com is the reference implementation of this validator registry
API. There are two deployment environments, staging and production. Both
environments are composed of:

- DNS entries for api-{environment}.validators.ripple.com and
  {environment}.validators.ripple.com
- One EC2 instance, with Name=api-{environment}.validators.ripple.com
- One RDS instance, named validators-{environment}.

Deployment happens automatically via circleci:

1. A pull request is made against the 'staging' branch
2. The request is merged, triggering a circleci build
3. Circleci runs tests via docker-compose
4. After tests pass, the built docker image is pushed to quay.io as
   validators.ripple.com:{environment}
5. ansible-playbook is ran against site.yml which updates docker, and stands up
   the needed containers

## Docker containers

There are three docker containers in use with specific names:

- validatorsripplecom_nginx - The NGINX container, used for SSL termination
- validatorsripplecom_web - The sails webapp
- logspout - Used to ship application logs to papertrail.

The nginx container is configured by dropping a few files in
/opt/validators.ripple.com/ and mounting them inside the nginx container.
Specifically:

- An nginx config
- SSL cert and keys
- Non-default Diffie-Hellman parameters

Our SSL key is a wildcard cert for \*.validators.ripple.com, with
validators.ripple.com as an alternate name.

Attempts to access \*.validators.ripple.com without HTTPS will redirect to
validators.ripple.com.
