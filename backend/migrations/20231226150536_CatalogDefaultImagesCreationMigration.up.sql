CREATE TABLE catalog_default_images (
                                id bigserial NOT NULL PRIMARY KEY,
                                catalog_id bigint NOT NULL,
                                uuid uuid NOT NULL UNIQUE,
                                name VARCHAR NOT NULL,
                                url VARCHAR NOT NULL,
                                size INTEGER NOT NULL,
                                created_at TIMESTAMP NOT NULL,
                                updated_at TIMESTAMP NOT NULL,
                                is_deleted bool NOT NULL,
                                is_enabled bool NOT NULL,
                                CONSTRAINT fk_catalog_id FOREIGN KEY (catalog_id) REFERENCES catalogs (id)
);
