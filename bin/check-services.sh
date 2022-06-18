#!/usr/bin/env bash

echo "Checking services..."
docker compose ps --all

if [[ $(docker compose ps -aq --filter status=exited) ]]; then 
  err "Error: Some services are not running."
  exit 1;
fi
