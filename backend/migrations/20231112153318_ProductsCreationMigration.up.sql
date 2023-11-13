CREATE TABLE products (
                          id bigserial not null primary key,
                          alias varchar not null unique,
                          catalog_alias varchar not null unique,
                          name varchar not null unique
);