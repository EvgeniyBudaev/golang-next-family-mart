CREATE TABLE catalogs (
                       id bigserial not null primary key,
                       alias varchar not null unique,
                       created_at timestamp not null,
                       name varchar not null unique,
                       uuid uuid not null unique
);