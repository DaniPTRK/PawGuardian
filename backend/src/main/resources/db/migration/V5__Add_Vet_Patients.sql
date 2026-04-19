-- Adds the vet_patient join table for many-to-many between vets and their assigned pets
CREATE TABLE IF NOT EXISTS project.vet_patient (
    vet_id  BIGINT NOT NULL REFERENCES project.users(id) ON DELETE CASCADE,
    pet_id  BIGINT NOT NULL REFERENCES project.pets(id)  ON DELETE CASCADE,
    PRIMARY KEY (vet_id, pet_id)
);

