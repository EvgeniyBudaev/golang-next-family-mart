CREATE TABLE attributes (
                            id BIGSERIAL NOT NULL PRIMARY KEY,
                            alias VARCHAR NOT NULL UNIQUE,
                            created_at TIMESTAMP NOT NULL,
                            deleted bool NOT NULL,
                            enabled bool NOT NULL,
                            filtered bool NOT NULL,
                            name VARCHAR NOT NULL UNIQUE,
                            type VARCHAR NOT NULL,
                            updated_at TIMESTAMP NOT NULL,
                            uuid uuid NOT NULL UNIQUE
);