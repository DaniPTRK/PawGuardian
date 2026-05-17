#!/bin/bash
set -e

# Usage: ./deploy.sh [--swarm|--k8s|--kind] [--skip-build]
#   --swarm       Deploy using Docker Swarm (default)
#   --k8s         Deploy to an existing Kubernetes cluster
#   --kind        Create a local Kind cluster (1 control-plane + 2 workers) and deploy to it
#   --skip-build  Skip image build & push (use existing images on Docker Hub)
#   --help        Show this message

MODE="swarm"
SKIP_BUILD=false
USE_KIND=false

for arg in "$@"; do
  case $arg in
    --swarm)       MODE="swarm" ;;
    --k8s)         MODE="k8s" ;;
    --kind)        MODE="k8s"; USE_KIND=true ;;
    --skip-build)  SKIP_BUILD=true ;;
    --help)
      sed -n '3,8p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "Unknown arg: $arg"
      echo "Run ./deploy.sh --help for usage."
      exit 1
      ;;
  esac
done

if [ -f .env ]; then
    export $(cat .env | xargs)
    echo "loaded environment variables from .env"
else
    echo ".env file not found"
fi

echo ""
echo "PawGuardian - Build & Deploy  [mode: $MODE]"

# Build & push images
if [ "$SKIP_BUILD" = true ]; then
  echo ""
  echo "Skipping image build (--skip-build)"
else
  # Build Backend
  echo ""
  echo "Building backend..."
  cd backend
  docker build --no-cache -t daniptrk/pawguardian-backend:latest .
  docker push daniptrk/pawguardian-backend:latest
  cd ..
  echo "Backend image pushed"

  # Build Frontend
  echo ""
  echo "Building frontend..."
  cd frontend
  docker build --no-cache -t daniptrk/pawguardian-frontend:latest .
  docker push daniptrk/pawguardian-frontend:latest
  cd ..
  echo "Frontend image pushed"

  # Build Telemetry Simulator
  echo ""
  echo "Building telemetry simulator..."
  cd services/telemetry-simulator
  docker build --no-cache -t daniptrk/pawguardian-telemetry-simulator:latest .
  docker push daniptrk/pawguardian-telemetry-simulator:latest
  cd ../..
  echo "Telemetry simulator image pushed"
fi

# Deploy
if [ "$MODE" = "swarm" ]; then

  echo ""
  echo "Checking Docker Swarm secrets..."
  echo "${MAIL_USERNAME:-placeholder}" | docker secret create mail_username - 2>/dev/null || true
  echo "${MAIL_PASSWORD:-placeholder}" | docker secret create mail_password - 2>/dev/null || true

  echo ""
  echo "Deploying PawGuardian stack to Docker Swarm..."
  docker stack deploy -c docker-compose-dev.yml pawguardian --with-registry-auth

  echo ""
  echo "Deployment complete!"
  echo ""
  echo "Services:"
  echo "  Frontend: http://localhost:3000"
  echo "  Backend: http://localhost:8090"
  echo "  Kong: http://localhost:8000"
  echo "  Telemetry Simulator: http://localhost:8091"
  echo "  pgAdmin: http://localhost:5050"
  echo "  Portainer: http://localhost:9000"
  echo "  Prometheus: http://localhost:9090"
  echo "  Grafana: http://localhost:3001"
  echo ""
  echo "Check service status: docker stack services pawguardian"

elif [ "$MODE" = "k8s" ]; then

  # Check for Kind setup if --kind was used
  if [ "$USE_KIND" = true ]; then
    if ! command -v kind &>/dev/null; then
      echo "Error: kind not found."
      echo "Install it with:"
      echo "  curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.23.0/kind-linux-amd64"
      echo "  chmod +x kind && sudo mv kind /usr/local/bin/"
      exit 1
    fi
  fi

  if ! command -v kubectl &>/dev/null; then
    if [ "$USE_KIND" = true ]; then
      echo "Error: kubectl not found. Install it before using --kind."
    else
      echo "Error: kubectl not found. Install it before using --k8s."
    fi
    exit 1
  fi

  # Set up Kind cluster if needed
  if [ "$USE_KIND" = true ]; then
    CLUSTER_NAME="pawguardian"

    if kind get clusters 2>/dev/null | grep -q "^${CLUSTER_NAME}$"; then
      echo "Kind cluster '${CLUSTER_NAME}' already exists, reusing it."
    else
      echo ""
      echo "Creating Kind cluster '${CLUSTER_NAME}' (1 control-plane + 2 workers)..."
      kind create cluster --name "$CLUSTER_NAME" --config kind-cluster.yaml
      echo "Cluster created."
    fi

    echo ""
    echo "Switching kubectl context to kind-${CLUSTER_NAME}..."
    kubectl config use-context "kind-${CLUSTER_NAME}"

    echo ""
    echo "Waiting for all nodes to be Ready..."
    kubectl wait --for=condition=Ready nodes --all --timeout=120s
    echo ""
    echo "Nodes:"
    kubectl get nodes
    echo ""
  else
    echo ""
    echo "Target cluster: $(kubectl config current-context)"
    echo ""
  fi

  # Namespace
  echo "Applying namespace..."
  kubectl apply -f k8s/namespace.yaml

  # Secrets
  echo "Upserting Kubernetes secret..."
  kubectl create secret generic pawguardian-secrets \
    --namespace=pawguardian \
    --from-literal=mail-username="${MAIL_USERNAME:-}" \
    --from-literal=mail-password="${MAIL_PASSWORD:-}" \
    --from-literal=db-password="${DB_PASSWORD:-pawguardian}" \
    --save-config --dry-run=client -o yaml | kubectl apply -f -
  echo "Secret applied."

  # Infrastructure
  echo ""
  echo "Deploying infrastructure..."
  kubectl apply -f k8s/postgres.yaml
  kubectl apply -f k8s/mongodb.yaml
  kubectl apply -f k8s/pgadmin.yaml
  kubectl apply -f k8s/prometheus.yaml
  kubectl apply -f k8s/grafana.yaml
  kubectl apply -f k8s/kong.yaml
  kubectl apply -f k8s/portainer.yaml

  echo ""
  echo "Waiting for databases to be ready..."
  kubectl rollout status deployment/postgres -n pawguardian --timeout=120s
  kubectl rollout status deployment/mongodb  -n pawguardian --timeout=120s

  # Application services
  echo ""
  echo "Deploying application services..."
  BACKEND_EXISTS=$(kubectl get deployment backend -n pawguardian &>/dev/null && echo "yes" || echo "no")
  kubectl apply -f k8s/backend.yaml
  kubectl apply -f k8s/frontend.yaml
  kubectl apply -f k8s/telemetry-simulator.yaml

  if [ "$BACKEND_EXISTS" = "yes" ]; then
    echo ""
    echo "Restarting app pods to pull latest images..."
    kubectl rollout restart deployment/backend -n pawguardian
    kubectl rollout restart deployment/frontend -n pawguardian
    kubectl rollout restart deployment/telemetry-simulator -n pawguardian
  else
    echo ""
    echo "First deployment — pods will start automatically."
  fi

  echo ""
  echo "Waiting for app rollout..."
  kubectl rollout status deployment/backend             -n pawguardian --timeout=120s
  kubectl rollout status deployment/frontend            -n pawguardian --timeout=120s
  kubectl rollout status deployment/telemetry-simulator -n pawguardian --timeout=120s

  echo ""
  echo "Deployment complete!"
  echo ""
  echo "Pod status:"
  kubectl get pods -n pawguardian
  echo ""

  NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}' 2>/dev/null || echo "<node-ip>")
  echo "NodePort URLs:"
  echo "  Frontend:            http://$NODE_IP:30000"
  echo "  Backend:             http://$NODE_IP:30090"
  echo "  Kong:                http://$NODE_IP:30800"
  echo "  Telemetry Simulator: http://$NODE_IP:30091"
  echo "  pgAdmin:             http://$NODE_IP:30050"
  echo "  Portainer:           http://$NODE_IP:30900"
  echo "  Prometheus:          http://$NODE_IP:30902"
  echo "  Grafana:             http://$NODE_IP:30301"
  echo ""
  if [ "$USE_KIND" = true ]; then
    echo "To tear down the cluster:"
    echo "  kind delete cluster --name pawguardian"
  fi

fi
