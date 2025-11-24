#!/bin/bash

# Test script for Doctor Approval/Rejection Tracking Feature
# This script tests the new approvedAt, approvedById, rejectedAt, rejectionReason fields

set -e

API_URL="http://localhost:5001/api/v1"
DOCTOR_EMAIL="doctor@starlab.com"
DOCTOR_PASSWORD="mock-password"

echo "🧪 Testing Doctor Approval/Rejection Tracking"
echo "=============================================="
echo ""

# Step 1: Login as doctor
echo "📝 Step 1: Logging in as doctor..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$DOCTOR_EMAIL\",\"password\":\"$DOCTOR_PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
DOCTOR_ID=$(echo "$LOGIN_RESPONSE" | jq -r '.user.id')

if [ "$TOKEN" == "null" ]; then
  echo "❌ Login failed. Please ensure the doctor user exists."
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Logged in successfully (Doctor ID: $DOCTOR_ID)"
echo ""

# Step 2: Get pending approvals
echo "📝 Step 2: Getting pending approvals..."
APPROVALS_RESPONSE=$(curl -s -X GET "$API_URL/doctors/pending-approvals" \
  -H "Authorization: Bearer $TOKEN")

# Parse and validate response
SUCCESS=$(printf '%s' "$APPROVALS_RESPONSE" | jq -r '.success' 2>/dev/null)
if [ "$SUCCESS" != "true" ]; then
  echo "❌ Failed to get pending approvals"
  printf '%s\n' "$APPROVALS_RESPONSE" | jq '.' 2>/dev/null || echo "Response: $APPROVALS_RESPONSE"
  exit 1
fi

printf '%s\n' "$APPROVALS_RESPONSE" | jq '.'

# Extract the data array
PENDING_COUNT=$(printf '%s' "$APPROVALS_RESPONSE" | jq '.data | length')
echo "✅ Found $PENDING_COUNT pending approval(s)"
echo ""

# Step 3: Get first test request for approval
if [ "$PENDING_COUNT" -gt 0 ]; then
  REQUEST_ID=$(printf '%s' "$APPROVALS_RESPONSE" | jq -r '.data[0].id')
  REQUEST_NO=$(printf '%s' "$APPROVALS_RESPONSE" | jq -r '.data[0].requestNo')

  echo "📝 Step 3: Getting request details for review..."
  echo "Request ID: $REQUEST_ID"
  echo "Request No: $REQUEST_NO"

  REVIEW_RESPONSE=$(curl -s -X GET "$API_URL/doctors/requests/$REQUEST_ID" \
    -H "Authorization: Bearer $TOKEN")

  echo "Request details:"
  printf '%s\n' "$REVIEW_RESPONSE" | jq '.data | {id, requestNo, status, documentStatus, approvedAt, approvedById, rejectedAt, rejectionReason}' 2>/dev/null || echo "Raw response: $REVIEW_RESPONSE"
  echo ""

  # Step 4: Test approval
  echo "📝 Step 4: Testing APPROVAL functionality..."
  echo "Would you like to approve this request? (This will set approvedAt and approvedById)"
  echo "Run manually:"
  echo "  curl -X POST \"$API_URL/doctors/requests/$REQUEST_ID/approve\" \\"
  echo "    -H \"Authorization: Bearer $TOKEN\""
  echo ""

  # Step 5: Test rejection
  echo "📝 Step 5: Testing REJECTION functionality..."
  echo "Would you like to reject this request? (This will set rejectedAt and rejectionReason)"
  echo "Run manually:"
  echo "  curl -X POST \"$API_URL/doctors/requests/$REQUEST_ID/reject\" \\"
  echo "    -H \"Authorization: Bearer $TOKEN\" \\"
  echo "    -H \"Content-Type: application/json\" \\"
  echo "    -d '{\"reason\":\"Test rejection reason\"}'"
  echo ""

  # Step 6: Verify fields after action
  echo "📝 Step 6: After approval/rejection, verify the fields:"
  echo "Run this to check the updated request:"
  echo "  curl -X GET \"$API_URL/doctors/requests/$REQUEST_ID\" \\"
  echo "    -H \"Authorization: Bearer $TOKEN\" | jq '{approvedAt, approvedById, rejectedAt, rejectionReason}'"
  echo ""

else
  echo "⚠️  No pending approvals found. Please create a test request with status RESULT_READY first."
  echo ""
  echo "To create test data:"
  echo "1. Create a test request as a customer"
  echo "2. Update its status to RESULT_READY"
  echo "3. Assign it to a doctor"
  echo ""
fi

echo "=============================================="
echo "✅ Test script completed!"
echo ""
echo "📊 Summary of new fields added:"
echo "  - approvedAt (DateTime): Timestamp when approved"
echo "  - approvedById (UUID): ID of user who approved"
echo "  - rejectedAt (DateTime): Timestamp when rejected"
echo "  - rejectionReason (String): Specific reason for rejection"
echo ""
echo "🔍 Database verification:"
echo "  SELECT id, request_no, approved_at, approved_by_id, rejected_at, rejection_reason"
echo "  FROM test_requests"
echo "  WHERE approved_at IS NOT NULL OR rejected_at IS NOT NULL;"
