#!/bin/bash

# Create user and database
sudo -u postgres psql << EOF
CREATE USER how_do_you_know_user WITH PASSWORD 'how_do_you_know';
CREATE DATABASE how_do_you_know;
GRANT ALL PRIVILEGES ON DATABASE how_do_you_know TO how_do_you_know_user;
\c how_do_you_know
GRANT ALL ON SCHEMA public TO how_do_you_know_user;
EOF

echo "Database setup complete!" 