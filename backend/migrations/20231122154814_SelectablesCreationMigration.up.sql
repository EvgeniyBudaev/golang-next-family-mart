CREATE TABLE selectables (
                             id BIGSERIAL NOT NULL PRIMARY KEY,
                             attribute_id BIGINT NOT NULL,
                             created_at TIMESTAMP NOT NULL,
                             deleted bool NOT NULL,
                             enabled bool NOT NULL,
                             updated_at TIMESTAMP NOT NULL,
                             uuid uuid NOT NULL UNIQUE,
                             value varchar NOT NULL UNIQUE,
                             CONSTRAINT fk_attribute_id FOREIGN KEY (attribute_id) REFERENCES attributes (id)
);
