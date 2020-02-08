#!/bin/bash

docker-compose -f src/test/container/docker-compose.yml -p idiomatic-hapi-ts-server-tests stop
docker-compose -f src/test/container/docker-compose.yml -p idiomatic-hapi-ts-server-tests rm -f
