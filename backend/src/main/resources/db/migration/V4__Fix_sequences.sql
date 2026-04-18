-- This migration resets all sequences to continue from the currentID

SELECT setval(
    pg_get_serial_sequence('project.roles', 'id'),
    (SELECT MAX(id) FROM project.roles)
);

SELECT setval(
    pg_get_serial_sequence('project.pet_species', 'id'),
    (SELECT MAX(id) FROM project.pet_species)
);

