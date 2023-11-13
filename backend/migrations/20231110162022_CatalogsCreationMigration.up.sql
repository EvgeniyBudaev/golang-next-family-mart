CREATE TABLE catalogs (
                       id bigserial not null primary key,
                       alias varchar not null unique,
                       name varchar not null unique
);