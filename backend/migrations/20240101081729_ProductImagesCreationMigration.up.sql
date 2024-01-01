CREATE TABLE product_images (
                                id bigserial NOT NULL PRIMARY KEY,
                                product_id bigint NOT NULL,
                                uuid uuid NOT NULL UNIQUE,
                                name VARCHAR NOT NULL,
                                url VARCHAR NOT NULL,
                                size INTEGER NOT NULL,
                                created_at TIMESTAMP NOT NULL,
                                updated_at TIMESTAMP NOT NULL,
                                is_deleted bool NOT NULL,
                                is_enabled bool NOT NULL,
                                CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES products (id)
);