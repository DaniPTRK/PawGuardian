# PawGuardian

To start working with the backend, run the following command in the project root to launch the PostgreSQL, MongoDB, and PgAdmin:

```shell
docker compose up -d
```

You can use PGAdmin at http://localhost:5050 (email: `admin@pawguardian.com`, password: `admin`) to access the database on `localhost:5432` with database/user/password `pawguardian`.

To run the backend you need Maven installed. Run the following commands from the `backend/` directory:

```shell
mvn clean install
mvn spring-boot:run
```

or
```shell
./mvnw clean install
./mvnw spring-boot:run
```