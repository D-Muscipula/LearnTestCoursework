FROM postgres:15

# Environment variables for database setup
ENV POSTGRES_DB=learntest
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Copy initialization scripts
COPY ./init.sql /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432 