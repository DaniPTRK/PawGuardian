INSERT INTO project.roles (id, name)
VALUES
    (1, 'ADMIN'),
    (2, 'OWNER'),
    (3, 'VET')
ON CONFLICT (id) DO NOTHING;
