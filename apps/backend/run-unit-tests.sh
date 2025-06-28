#!/bin/bash

echo "🧪 Running Star Lab Backend Unit Tests"
echo "======================================"

# Set environment variables
export NODE_ENV=test
export JWT_SECRET=test_jwt_secret

# Change to backend directory
cd /home/dan/workspace/star-lab/apps/backend

echo "📦 Installing dependencies if needed..."
npm install --silent

echo ""
echo "🔨 Building TypeScript..."
npm run build

echo ""
echo "🧪 Running Unit Tests..."
echo ""

# Run each test file individually to see which ones work
test_files=(
    "CustomerService.test.ts"
    "DoctorService.test.ts"
    "UserService.test.ts"
    "InvoiceService.test.ts"
    "LabService.test.ts"
    "TestRequestService.test.ts"
    "FileService.test.ts"
)

passed=0
failed=0

for test_file in "${test_files[@]}"; do
    echo "▶️  Running $test_file..."
    
    if timeout 60s npx jest "src/__tests__/$test_file" --runInBand --forceExit --silent; then
        echo "✅ $test_file - PASSED"
        ((passed++))
    else
        echo "❌ $test_file - FAILED"
        ((failed++))
    fi
    echo ""
done

echo "======================================"
echo "📊 Test Results Summary"
echo "✅ Passed: $passed"
echo "❌ Failed: $failed"
echo "📁 Total: $((passed + failed))"

if [ $failed -eq 0 ]; then
    echo "🎉 All tests passed!"
    exit 0
else
    echo "⚠️  Some tests failed. Check the output above."
    exit 1
fi
