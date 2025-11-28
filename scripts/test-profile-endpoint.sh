#!/bin/bash

# Test Universal Profile Endpoint for All User Roles
# This script tests the new /api/v1/users/profile endpoint

API_BASE_URL="http://localhost:5001/api/v1"

echo "=========================================="
echo "Testing Universal Profile Endpoint"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test profile for a user
test_profile() {
    local email=$1
    local password=$2
    local role=$3

    echo -e "${BLUE}=========================================="
    echo -e "Testing: ${role} - ${email}"
    echo -e "==========================================${NC}"

    # 1. Login
    echo -e "\n${YELLOW}Step 1: Login${NC}"
    LOGIN_RESPONSE=$(curl -s -X POST "${API_BASE_URL}/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"${email}\",\"password\":\"${password}\"}")

    echo "Login Response:"
    echo "$LOGIN_RESPONSE" | jq '.'

    # Extract token
    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')

    if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
        echo -e "${RED}❌ Login failed!${NC}"
        return 1
    fi

    echo -e "${GREEN}✅ Login successful${NC}"
    echo "Token: ${TOKEN:0:50}..."

    # 2. Get Profile
    echo -e "\n${YELLOW}Step 2: Get Profile${NC}"
    PROFILE_RESPONSE=$(curl -s -X GET "${API_BASE_URL}/users/profile" \
        -H "Authorization: Bearer ${TOKEN}" \
        -H "Content-Type: application/json")

    echo "Profile Response:"
    echo "$PROFILE_RESPONSE" | jq '.'

    # Check if request was successful
    SUCCESS=$(echo "$PROFILE_RESPONSE" | jq -r '.success')

    if [ "$SUCCESS" == "true" ]; then
        echo -e "${GREEN}✅ Profile retrieved successfully${NC}"

        # Display key information
        echo -e "\n${YELLOW}Profile Summary:${NC}"
        echo "$PROFILE_RESPONSE" | jq '{
            email: .data.email,
            role: .data.role,
            firstName: .data.userProfile.firstName,
            lastName: .data.userProfile.lastName,
            phoneNumber: .data.userProfile.phoneNumber,
            isActive: .data.userProfile.isActive,
            hasCustomer: (.data.customer != null),
            hasDoctor: (.data.doctor != null)
        }'

        # Show role-specific data
        if [ "$role" == "CUSTOMER" ]; then
            echo -e "\n${YELLOW}Customer Data:${NC}"
            echo "$PROFILE_RESPONSE" | jq '.data.customer | {
                companyNameEn,
                companyNameTh,
                legalEntityId,
                companyPhone
            }'
        elif [ "$role" == "DOCTOR" ]; then
            echo -e "\n${YELLOW}Doctor Data:${NC}"
            echo "$PROFILE_RESPONSE" | jq '.data.doctor | {
                licenseNumber,
                specialization,
                qualifications
            }'
        fi
    else
        echo -e "${RED}❌ Failed to retrieve profile${NC}"
        return 1
    fi

    echo -e "\n${GREEN}✅ Test completed for ${role}${NC}\n"
}

# Test all user roles
echo -e "${BLUE}Testing all user roles...${NC}\n"

# 1. Test ADMIN
test_profile "admin@starlab.com" "password123" "ADMIN"

# 2. Test CUSTOMER
test_profile "customer@starlab.com" "password123" "CUSTOMER"

# 3. Test DOCTOR
test_profile "doctor@starlab.com" "password123" "DOCTOR"

# 4. Test TECHNICIAN
test_profile "technician1@starlab.com" "password123" "TECHNICIAN"

# 5. Test LAB_ADMIN
test_profile "labadmin@starlab.com" "password123" "LAB_ADMIN"

# 6. Test APPROVAL
test_profile "approval@starlab.com" "password123" "APPROVAL"

echo -e "${BLUE}=========================================="
echo -e "All tests completed!"
echo -e "==========================================${NC}"
