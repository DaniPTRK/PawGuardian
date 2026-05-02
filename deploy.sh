#!/bin/bash
set -e

if [ -f .env ]; then
    export $(cat .env | xargs)
    echo "loaded environment variables from .env"
else
    echo ".env file not found"
fi

echo ""
echo "PawGuardian — Build & Deploy locally"

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

# Build Telemetry Sim
echo ""
echo "Building telemetry simulator..."
cd services/telemetry-simulator
docker build --no-cache -t daniptrk/pawguardian-telemetry-simulator:latest .
docker push daniptrk/pawguardian-telemetry-simulator:latest
cd ../..
echo "Telemetry simulator image pushed"

# Create secrets
echo ""
echo "Checking secrets"
echo "${MAIL_USERNAME:-placeholder}" | docker secret create mail_username - 2>/dev/null || true
echo "${MAIL_PASSWORD:-placeholder}" | docker secret create mail_password - 2>/dev/null || true

# Deploy stack
echo ""
echo "Deploying PawGuardian stack... "
docker stack deploy -c docker-compose.yml pawguardian --with-registry-auth

echo ""
echo "Deployment complete!"
echo ""