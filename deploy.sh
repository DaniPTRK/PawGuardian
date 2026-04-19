#!/bin/bash
if [ -f .env ]; then
    export $(cat .env | xargs)
    echo "loaded environment variables from .env"
else
    echo ".env file not found"
fi

echo "Deploying PawGuardian stack..."
docker stack deploy -c docker-compose.yml pawguardian --with-registry-auth
echo "done"