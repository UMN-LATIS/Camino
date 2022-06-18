#!/usr/bin/env bash

echo "Checking services..."
docker compose ps --all

if [[ $(docker compose ps -aq --filter status=exited) ]]; then 
  echo "Error: Some services are not running." 1>&2
  exit 1; 
else
  exit 0;  
fi
