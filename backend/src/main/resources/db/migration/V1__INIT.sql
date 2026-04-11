CREATE SCHEMA project;
SET search_path = project, pg_catalog;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(250) NOT NULL
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE user_role(
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) on DELETE CASCADE,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id) on DELETE CASCADE
);


CREATE TABLE pet_species (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE pets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    breed VARCHAR(50),
    age INTEGER,
    owner_id INTEGER NOT NULL,
    species_id INTEGER,
    CONSTRAINT fk_pet_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_pet_species FOREIGN KEY (species_id) REFERENCES pet_species(id)
);

CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    model VARCHAR(50),
    battery_level INTEGER,
    pet_id INTEGER UNIQUE,
    CONSTRAINT fk_device_pet FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);

CREATE TABLE health_metrics (
    id SERIAL PRIMARY KEY,
    heart_rate DOUBLE PRECISION,
    temperature DOUBLE PRECISION,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    timestamp TIMESTAMP NOT NULL,
    pet_id INTEGER NOT NULL,
    CONSTRAINT fk_metric_pet FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);

CREATE TABLE safe_zones (
    id SERIAL PRIMARY KEY,
    zone_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    pet_id INTEGER NOT NULL,
    CONSTRAINT fk_zone_pet FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);

CREATE TABLE safe_zone_vertices (
    id SERIAL PRIMARY KEY,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    sequence_order INTEGER,
    safe_zone_id INTEGER NOT NULL,
    CONSTRAINT fk_vertex_zone FOREIGN KEY (safe_zone_id) REFERENCES safe_zones(id) ON DELETE CASCADE
);
