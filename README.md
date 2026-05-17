# PawGuardian

PawGuardian is a pet monitoring and safety platform that allows pet owners to track their animals
in real time, configure safe zones and monitor health metrics collected from wearable devices.
The platform supports multiple user roles (**Owners**, **Vets**, and **Admins**) each
with their own dedicated features and access levels.

---

## Architecture

| Layer | Technology                                    |
|-------|-----------------------------------------------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS   |
| Backend | Spring Boot 3 + PostgreSQL + MongoDB + Flyway |
| Auth | JWT (stateless)                               |
| API Gateway | Kong                                          |
| Telemetry Simulator | Python / FastAPI                              |
| Observability | Prometheus + Grafana                          |
| Container orchestration | Docker Swarm or Kubernetes (Kind-compatible)  |

---

## Backend

### Local development

**Prerequisites:** Java 17+, Maven 3.8+, Docker.

```shell
# Start infrastructure (PostgreSQL, MongoDB, pgAdmin)
docker compose up -d

# Run the backend
cd backend
mvn spring-boot:run
```

- API: [http://localhost:8090](http://localhost:8090)
- Swagger UI: [http://localhost:8090/swagger-ui.html](http://localhost:8090/swagger-ui.html)
- pgAdmin: [http://localhost:5050](http://localhost:5050) - `admin@pawguardian.com` / `admin`

### Default admin account

On first startup an admin account is created automatically:
- **Email:** `admin@admin.com`
- **Password:** `admin`

### User Roles & Flow

| Role | Description |
|------|-------------|
| `OWNER` | Default role on registration. Can manage pets, safe zones, and view health data. |
| `VET` | Promoted by an admin. Can view assigned patients, their health metrics, and safe zones. |
| `ADMIN` | Full platform access. Can manage users, promote roles, and assign pets to vets. |

**Typical flow:**
1. User registers: `OWNER` role assigned
2. Admin promotes the user: `POST /api/v1/users/{userId}/promote/{role}`
3. Admin assigns a pet to a vet: `POST /api/v1/users/{vetId}/assign-pet/{petId}`
4. Vet accesses their patients: `GET /api/v1/vet/patients`

---

## Frontend

### Local development

**Prerequisites:** Node.js 20+, npm.

```shell
cd frontend
npm install
npm run dev
```

App runs at [http://localhost:5173](http://localhost:5173).

### Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check + production bundle to `dist/` |
| `npm run lint` | ESLint across `src/` |
| `npm run preview` | Preview the production build locally |

### Pages

| Page | Route | Access |
|------|-------|--------|
| Login | `/login` | Public |
| Register | `/register` | Public |
| Home | `/home` | All roles |
| Map & Safe Zones | `/map` | All roles |
| Health Metrics | `/health` | All roles |
| Feedback | `/feedback` | All roles |
| Profile & Pets | `/profile` | All roles |
| Device Simulator | `/dev-sim` | All roles |
| User Management | `/users` | Admin only |
| Vet Patients | `/vet` | Vet only |

---

## Telemetry Simulator

A FastAPI service that generates synthetic GPS, heart rate, temperature, and battery telemetry for registered pets and
posts it to the backend. Controlled entirely from the **Device Simulator** page in the frontend.

- Local URL: [http://localhost:8091](http://localhost:8091)
- Kong proxy path: `/simulator/`

---

## Deployment

### Prerequisites

Before any deployment mode, create a `.env` file in the project root:

```dotenv
MAIL_USERNAME=mailtrap_username
MAIL_PASSWORD=mailtrap_password
DB_PASSWORD=pawguardian
```

### `deploy.sh` - unified build & deploy script

```
Usage: ./deploy.sh [--swarm|--k8s|--kind] [--skip-build]

  --swarm       Deploy using Docker Swarm (default)
  --k8s         Deploy to an existing Kubernetes cluster
  --kind        Create a local Kind cluster (1 control-plane + 2 workers) and deploy
  --skip-build  Skip image build & push, apply config only
  --help        Show this message
```

The script reads `.env`, builds and pushes Docker images (unless `--skip-build`), then deploys.
On Kubernetes re-deployments the script re-inserts secrets to keep credentials up to date and performs
a rolling restart so pods pick up the new `:latest` images.

---

### Docker Swarm

```shell
chmod +x deploy.sh
./deploy.sh           # or ./deploy.sh --swarm
```

**Service URLs:**

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8090 |
| Kong Gateway | http://localhost:8000 |
| Telemetry Simulator | http://localhost:8091 |
| pgAdmin | http://localhost:5050 |
| Portainer | http://localhost:9000 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3001 |

**Network layout:**

| Network | Services |
|---------|----------|
| `database-network` | postgres, mongodb, pgadmin, backend |
| `backend-network` | backend, frontend, kong, telemetry-simulator, portainer |
| `monitoring-network` | prometheus, grafana |

---

### Kubernetes (existing cluster)

```shell
./deploy.sh --k8s
# skip image build if images are already on Docker Hub
./deploy.sh --k8s --skip-build
```

The script applies all manifests in `k8s/`, re-inserts the `pawguardian-secrets` secret from `.env`,
waits for database rollouts, deploys the application services, and prints NodePort URLs on completion.

---

### Kind

Creates a cluster named `pawguardian` (1 control-plane + 2 workers) if it does not already exist,
then runs the same deployment flow as `--k8s`.

**NodePort URLs**:

| Service | NodePort |
|---------|----------|
| Frontend | 30000 |
| Backend | 30090 |
| Kong Gateway | 30800 |
| Telemetry Simulator | 30091 |
| pgAdmin | 30050 |
| Portainer | 30900 |
| Prometheus | 30902 |
| Grafana | 30301 |

Access a service at `http://<node-ip>:<nodeport>`. The node IP is printed automatically
by the script.

---

## CI/CD - GitHub Actions

The pipeline runs on every push or pull request to `main`.

| Job | Trigger | What it does |
|-----|---------|--------------|
| `build-backend` | push + PR | Maven build + tests |
| `build-frontend` | push + PR | `npm ci`, ESLint, `npm run build` |
| `docker-push` | push to main | Builds & pushes all three images (`:latest` + `:<git-sha>`) |

**Required GitHub Secrets:**

| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |

---

## Project structure

```
PawGuardian/
├── backend/                   Spring Boot application
├── frontend/                  React + Vite SPA
├── services/
│   └── telemetry-simulator/   FastAPI synthetic-telemetry service
├── k8s/                       Kubernetes manifests (namespace: pawguardian)
├── infra/                     Kong, Prometheus, Grafana config (Swarm)
├── docker-compose.yml         Full swarm stack (1 manager, 2 workers)
├── docker-compose-dev.yml     Swarm stack on manager only
├── kind-cluster.yaml          Kind cluster definition
└── deploy.sh                  Unified build & deploy script
```