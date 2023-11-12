CREATE TABLE catalogs (
                       id bigserial not null primary key,
                       name varchar not null unique
);