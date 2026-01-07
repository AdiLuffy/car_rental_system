#!/bin/bash
cd "$(dirname "$0")/backend"
echo "Starting Backend Server on port 8080..."
mvn spring-boot:run
