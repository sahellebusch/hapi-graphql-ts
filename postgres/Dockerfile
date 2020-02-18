FROM postgres:12

ENV POSTGRES_USER root
ENV POSTGRES_PASSWORD 123
ENV POSTGRES_DB project

COPY base-schema.sql /docker-entrypoint-initdb.d/
