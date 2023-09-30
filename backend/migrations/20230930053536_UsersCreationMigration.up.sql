CREATE TABLE users (
                       id int not null primary key,
                       email varchar not null unique,
                       password varchar not null
);