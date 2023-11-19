CREATE TABLE products (
                          id bigserial not null primary key,
                          alias varchar not null unique,
                          catalog_alias varchar not null,
                          created_at timestamp not null,
                          deleted bool not null,
                          enabled bool not null,
                          image varchar,
                          name varchar not null unique,
                          updated_at timestamp not null,
                          uuid uuid not null unique
);