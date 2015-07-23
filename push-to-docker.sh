docker tag validatorregistryapi_webapp quay.io/ripple/validators.ripple.com:$CIRCLE_SHA
docker tag validatorregistryapi_webapp quay.io/ripple/validators.ripple.com:$1
docker login --email=$DOCKER_EMAIL --username=$DOCKER_USERNAME --password=$DOCKER_PASSWORD quay.io
docker push quay.io/ripple/validators.ripple.com:$CIRCLE_SHA
docker push quay.io/ripple/validators.ripple.com:$1
