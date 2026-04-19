# PawGuardian

PawGuardian is a pet monitoring and safety platform that allows pet owners to track their animals
in real time, configure safe zones and monitor health metrics collected from wearable devices.
The platform supports multiple user roles (**Owners**, **Vets**, and **Admins**) each
with their own dedicated features and access levels.

---

## Backend

The backend is built with **Spring Boot**, uses **PostgreSQL** as the primary database, and
**MongoDB** for telemetry storage. Database migrations are managed by **Flyway**, and authentication
is handled with **JWT**.

### Local Setup

Before doing the following steps, make sure you have the following:
- Java 17+
- Maven 3.8+
- Docker & Docker Compose

**Step 1 — Start the infrastructure** (PostgreSQL, MongoDB, PgAdmin):

```shell
docker compose up -d
```

PgAdmin is available at [http://localhost:5050](http://localhost:5050)
- Email: `admin@pawguardian.com`
- Password: `admin`
- Database host: `localhost:5432` | database/user/password: `pawguardian`

**Step 2 — Run the backend** from the `backend/` directory:

```shell
mvn clean install
mvn spring-boot:run
```


The API will be available at [http://localhost:8090](http://localhost:8090).

Swagger UI is available at [http://localhost:8090/swagger-ui.html](http://localhost:8090/swagger-ui.html).

### Default Admin Account

On first startup, an admin account is automatically created:
- **Email:** `admin@admin.com`
- **Password:** `admin`

### User Roles & Flow

| Role | Description |
|------|-------------|
| `OWNER` | Default role on registration. Can manage pets, safe zones, and view health data. |
| `VET` | Promoted by an admin. Can view assigned patients, their health metrics, and safe zones. |
| `ADMIN` | Full platform access. Can manage users, promote roles, and assign pets to vets. |

**Typical flow:**
1. User registers → gets `OWNER` role
2. Admin promotes user to `VET` or `ADMIN` via `POST /api/v1/users/{userId}/promote/{role}`
3. Admin assigns pets to a vet via `POST /api/v1/users/{vetId}/assign-pet/{petId}`
4. Vet logs in and accesses their patients at `GET /api/v1/vet/patients`

### Production Deployment

The application is deployed using Docker Swarm. The image is built and pushed
to Docker Hub automatically via CI/CD Github pipeline on every push to `main` or `feature\**`.

**Prerequisites on the server:**
- Docker with Swarm mode enabled (`docker swarm init`)
- The repository cloned or `docker-compose.yml` present

**Step 1 — Create mail secrets** (one time only):
```shell
echo "your_mailtrap_username" | docker secret create mail_username -
echo "your_mailtrap_password" | docker secret create mail_password -
```

**Step 2 — Deploy the stack:**
```shell
./deploy.sh
```

This pulls the latest image from Docker Hub and deploys the full stack as a
Docker Swarm service with 2 backend replicas.

**Optional environment overrides**:
```shell
MAIL_HOST=smtp.yourprovider.com MAIL_PORT=587 GEOFENCE_COOLDOWN=10 ./deploy.sh
```

**Check service status:**
```shell
docker service ls
docker service logs pawguardian_backend -f
```

---

## Frontend

**TODO**

---


## Utilities

- **`deploy.sh`** — Deploy the application stack to Docker Swarm