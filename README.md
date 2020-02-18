# Hapi/GraphQL/Typescript Server

## The hell is this anyways?

This project is to provide a skeleton Hapi+Graphql+Typescript server with what I consider some best practices. So what is in it?

* The hapi REST framework with apollo-graphql
** Checkout: the `/documentation` and `graphql` routes for some fun stuff.
* Examples of graphql objects using TypeGraphql.
* Examples integration tests that use a raw injector.
* Example of a apollo datasource object that can be utilized in both hapi handlers and graphql resolvers.
* Docker builds that separate out running it locally vs. running for integration tests
* Uses ts-node0dev for automatic file watching and server recimpiling and restarting
* Examples of both promises and async await
* Passing variables from the top (dependency injection) which provides easy ways to provide mock objects for easier testing.
* Joi for request/response validation

It is my hope that this server will provide some useful examples that any team can take or leave, but overall provides some decent scaffolding.

## TODO

* Fix linting issues with deocrators and "unused** variables
* Multistaged Dockerfiles for dev and production level builds
* Speed up jest in the docker container
** perhaps we want to do file watching?
* Choose another logger (good no nlonger supported) clean up output noise in tests
* Use the apollo-graphql-hapi plugin when it's fixed (see comments in copy/pasted code from that repo)

## Open Questions

* Do we want to run the server inside of the docker container at all times? (I would prefer to)
* Do we want to use promises or async/await (means we might struggle with using bluebird, which is awesome)
* May need to provide a multi-stage build so we can install dev/production level deps for local dev
* Do we want to integrate TypeORM since it works well with TypeGraphql?
* Promises or async/await? Bluebird?

