#!/bin/bash -e

docker-compose -f src/test/container/docker-compose.yml -p idiomatic-hapi-ts-server-tests up -d
docker-compose -f src/test/container/docker-compose.yml -p idiomatic-hapi-ts-server-tests exec -T idiomatic-hapi-ts-server-test node_modules/mocha/bin/mocha --recursive dist/test/integration --timeout 20000 --exit
