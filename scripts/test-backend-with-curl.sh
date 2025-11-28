#!/usr/bin/env bash
# Convenience helpers for exercising the Star Lab backend with curl.

set -euo pipefail

BASE_URL=${BASE_URL:-http://localhost:5001}
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@starlab.com}
ADMIN_PASSWORD=${ADMIN_PASSWORD:-mock-password}
CUSTOMER_EMAIL=${CUSTOMER_EMAIL:-customer@starlab.com}
CUSTOMER_PASSWORD=${CUSTOMER_PASSWORD:-mock-password}
JQ_BIN=${JQ_BIN:-jq}

print_usage() {
  cat <<'EOF'
Usage:
  ./scripts/test-backend-with-curl.sh <command> [args]

Commands:
  smoke                               Hit public health endpoints (/, /api-docs) to verify server up.
  login-admin                         Output JWT token for seeded admin user.
  login-customer                      Output JWT token for seeded customer user.
  admin-customers                     List customers (requires admin role).
  admin-test-requests                 List all test requests (requires admin role).
  admin-lab-statistics                Fetch lab statistics (requires admin role).
  admin-invoices                      List invoices (requires admin role).
  customer-profile                    Fetch authenticated customer profile.
  customer-test-requests              List authenticated customer's test requests.
  create-test-request <payload.json>  Create test request using payload file (customer role).

Environment overrides:
  BASE_URL=http://localhost:5001
  ADMIN_EMAIL=admin@starlab.com
  ADMIN_PASSWORD=mock-password
  CUSTOMER_EMAIL=customer@starlab.com
  CUSTOMER_PASSWORD=mock-password
  JQ_BIN=jq                             (path/name of jq binary)

Notes:
  - jq is required for token extraction and pretty-printing JSON.
  - Commands that need authentication will obtain a fresh token each run.
  - Use HTTPie/Postman/etc. for more complex workflows if desired.
EOF
}

require_jq() {
  if ! command -v "$JQ_BIN" >/dev/null 2>&1; then
    echo "jq is required (set JQ_BIN if installed elsewhere)." >&2
    exit 1
  fi
}

curl_json() {
  local method=$1
  local path=$2
  local token=${3:-}
  local data=${4:-}

  local args=(-sS -X "$method" "$BASE_URL$path" -H "Accept: application/json")
  if [[ "$method" == "POST" || "$method" == "PUT" || "$method" == "PATCH" ]]; then
    args+=(-H "Content-Type: application/json")
  fi
  if [[ -n "$token" ]]; then
    args+=(-H "Authorization: Bearer $token")
  fi
  if [[ -n "$data" ]]; then
    args+=(-d "$data")
  fi

  curl "${args[@]}"
}

pretty_print() {
  if command -v "$JQ_BIN" >/dev/null 2>&1; then
    "$JQ_BIN" .
  else
    cat
  fi
}

login() {
  require_jq
  local email=$1
  local password=$2

  local response
  response=$(curl_json "POST" "/api/v1/auth/login" "" "{\"email\":\"$email\",\"password\":\"$password\"}")

  if [[ $(echo "$response" | "$JQ_BIN" -r 'has("token")') != "true" ]]; then
    echo "$response" | pretty_print
    echo "Failed to retrieve token for $email" >&2
    exit 1
  fi

  echo "$response" | "$JQ_BIN" -r '.token'
}

customer_token() {
  login "$CUSTOMER_EMAIL" "$CUSTOMER_PASSWORD"
}

admin_token() {
  login "$ADMIN_EMAIL" "$ADMIN_PASSWORD"
}

command_smoke() {
  echo "# GET $BASE_URL/"
  curl -sS "$BASE_URL/" || true
  echo -e "\n\n# GET $BASE_URL/api-docs (headers only)"
  curl -sS -o /dev/null -D - "$BASE_URL/api-docs" | head -n 10 || true
}

command_login_admin() {
  admin_token
}

command_login_customer() {
  customer_token
}

command_admin_customers() {
  local token
  token=$(admin_token)
  curl_json "GET" "/api/v1/customers" "$token" | pretty_print
}

command_admin_test_requests() {
  local token
  token=$(admin_token)
  curl_json "GET" "/api/v1/test-requests" "$token" | pretty_print
}

command_admin_lab_statistics() {
  local token
  token=$(admin_token)
  curl_json "GET" "/api/v1/lab/statistics" "$token" | pretty_print
}

command_admin_invoices() {
  local token
  token=$(admin_token)
  curl_json "GET" "/api/v1/invoices" "$token" | pretty_print
}

command_customer_profile() {
  local token
  token=$(customer_token)
  curl_json "GET" "/api/v1/customers/profile" "$token" | pretty_print
}

command_customer_test_requests() {
  local token
  token=$(customer_token)
  curl_json "GET" "/api/v1/test-requests/my-requests" "$token" | pretty_print
}

command_create_test_request() {
  if [[ $# -lt 1 ]]; then
    echo "create-test-request requires a JSON payload file." >&2
    exit 1
  fi

  local payload_file=$1
  if [[ ! -f "$payload_file" ]]; then
    echo "Payload file not found: $payload_file" >&2
    exit 1
  fi

  local token payload
  token=$(customer_token)
  payload=$(<"$payload_file")

  curl_json "POST" "/api/v1/test-requests" "$token" "$payload" | pretty_print
}

main() {
  if [[ $# -lt 1 ]]; then
    print_usage
    exit 1
  fi

  local cmd=$1
  shift

  case "$cmd" in
    smoke) command_smoke "$@" ;;
    login-admin) command_login_admin "$@" ;;
    login-customer) command_login_customer "$@" ;;
    admin-customers) command_admin_customers "$@" ;;
    admin-test-requests) command_admin_test_requests "$@" ;;
    admin-lab-statistics) command_admin_lab_statistics "$@" ;;
    admin-invoices) command_admin_invoices "$@" ;;
    customer-profile) command_customer_profile "$@" ;;
    customer-test-requests) command_customer_test_requests "$@" ;;
    create-test-request) command_create_test_request "$@" ;;
    -h|--help|help) print_usage ;;
    *)
      echo "Unknown command: $cmd" >&2
      print_usage
      exit 1
      ;;
  esac
}

main "$@"
