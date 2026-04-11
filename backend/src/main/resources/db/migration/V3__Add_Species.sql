INSERT INTO project.pet_species (id, name)
VALUES
    (1, 'DOG'),
    (2, 'CAT'),
    (3, 'OTHER')
ON CONFLICT (id) DO NOTHING;