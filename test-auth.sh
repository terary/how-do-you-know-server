#!/bin/bash

# Configuration
API_URL="http://localhost:3001"
EMAIL="username"
PASSWORD="password"

# Make login request and store the response
echo "Making login request..."
LOGIN_RESPONSE=$(curl -s -X POST \
  "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d "{\"username\":\"${EMAIL}\",\"password\":\"${PASSWORD}\"}")

# Extract access token using jq (you'll need jq installed)
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

if [ -z "$ACCESS_TOKEN" ]; then
    echo "Failed to get access token"
    echo "Login response: $LOGIN_RESPONSE"
    exit 1
fi

echo "Got access token"

# Make profile request with the token
echo "Making profile request..."
PROFILE_RESPONSE=$(curl -s -X GET \
  "${API_URL}/auth/profile" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Origin: http://localhost:3000")

echo "Profile Response:"
echo $PROFILE_RESPONSE | jq '.'