#!/bin/bash

# Server configuration
SERVER_HOST_NAME="localhost:3001"

# Step 1: Authenticate and get token
echo "Authenticating..."
echo "Trying to connect to http://${SERVER_HOST_NAME}/auth/login..."
AUTH_RESPONSE=$(curl -v -s -w "\n%{http_code}" -X POST http://${SERVER_HOST_NAME}/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "username", "password": "password"}' 2>&1)

echo "Full curl output:"
echo "$AUTH_RESPONSE"
echo "------------------------"

HTTP_CODE=$(echo "$AUTH_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$AUTH_RESPONSE" | sed '$d')

echo "Response Body: $RESPONSE_BODY"
echo "HTTP Status Code: $HTTP_CODE"

if [ "$HTTP_CODE" != "200" ]; then
    echo "Authentication failed with status code: $HTTP_CODE"
    exit 1
fi

# Extract token
TOKEN=$(echo $RESPONSE_BODY | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "Failed to get authentication token"
    exit 1
fi

echo "Got authentication token: $TOKEN"

# Step 2: Get current profile
echo "Getting current profile..."
PROFILE_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET http://${SERVER_HOST_NAME}/auth/profile \
  -H "Authorization: Bearer $TOKEN")

HTTP_CODE=$(echo "$PROFILE_RESPONSE" | tail -n1)
PROFILE_BODY=$(echo "$PROFILE_RESPONSE" | sed '$d')

echo "Profile Response: $PROFILE_BODY"
echo "Profile Status Code: $HTTP_CODE"

if [ "$HTTP_CODE" != "200" ]; then
    echo "Failed to get profile with status code: $HTTP_CODE"
    exit 1
fi

# Step 3: Update profile with the same data
echo "Updating profile..."
UPDATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://${SERVER_HOST_NAME}/auth/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$PROFILE_BODY")

HTTP_CODE=$(echo "$UPDATE_RESPONSE" | tail -n1)
UPDATE_BODY=$(echo "$UPDATE_RESPONSE" | sed '$d')

echo "Update Response: $UPDATE_BODY"
echo "Update Status Code: $HTTP_CODE"

echo "Profile update test completed" 
echo "UPDATE RESPONSE: $UPDATE_RESPONSE"