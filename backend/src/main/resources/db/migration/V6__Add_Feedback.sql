CREATE TABLE IF NOT EXISTS project.feedbacks (
    id          BIGSERIAL PRIMARY KEY,
    user_email  VARCHAR(255),
    category    VARCHAR(50)  NOT NULL,
    rating      INTEGER      NOT NULL CHECK (rating BETWEEN 1 AND 5),
    subscribe   BOOLEAN      DEFAULT false,
    message     TEXT         NOT NULL,
    created_at  TIMESTAMP    DEFAULT now()
);

