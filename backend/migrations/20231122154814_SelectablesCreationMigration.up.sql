CREATE TABLE selectables (
                             id BIGSERIAL NOT NULL PRIMARY KEY,
                             attribute_id BIGINT NOT NULL,
                             uuid UUID NOT NULL UNIQUE,
                             value varchar NOT NULL UNIQUE,
                             created_at TIMESTAMP NOT NULL,
                             updated_at TIMESTAMP NOT NULL,
                             is_deleted BOOL NOT NULL,
                             is_enabled BOOL NOT NULL,
                             CONSTRAINT fk_attribute_id FOREIGN KEY (attribute_id) REFERENCES attributes (id)
);
