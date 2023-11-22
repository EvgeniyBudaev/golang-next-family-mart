CREATE TABLE catalogs (
                          id bigserial not null primary key,
                          alias varchar not null unique,
                          created_at timestamp not null,
                          deleted bool not null,
                          enabled bool not null,
                          image varchar,
                          name varchar not null unique,
                          updated_at timestamp not null,
                          uuid uuid not null unique
);