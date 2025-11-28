#!/bin/bash
# Codex Direct Execution Helper Script
# Usage: ./codex-exec.sh [reasoning_level] "Your task description"
# Examples:
#   ./codex-exec.sh low "List all files"
#   ./codex-exec.sh high "Refactor the API endpoints"
#   ./codex-exec.sh "Quick task" (defaults to low reasoning)

# Default reasoning level
REASONING="${1:-low}"

# If only one argument, it's the prompt with default reasoning
if [ $# -eq 1 ]; then
    PROMPT="$1"
    REASONING="low"
else
    PROMPT="$2"
fi

# Pre-execution checks
if [ -z "$PROMPT" ]; then
    echo "Error: No task specified"
    exit 1
fi

# Log execution
echo "$(date): Starting task: $PROMPT" >> codex-execution.log

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🤖 Codex Direct Execution${NC}"
echo -e "${YELLOW}Reasoning: ${REASONING}${NC}"
echo -e "${GREEN}Task: ${PROMPT}${NC}"
echo "----------------------------------------"

# Execute Codex with full access and no approval needed
timeout 300 codex exec \
    -s danger-full-access \
    -c model_reasoning_effort="${REASONING}" \
    "$PROMPT" \
    2>&1 | tee codex-output.log

# Capture exit code
EXIT_CODE=$?

# Post-execution analysis
echo "----------------------------------------"
if [ $EXIT_CODE -eq 124 ]; then
    echo -e "${RED}⏰ Task timed out after 300 seconds${NC}"
elif [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ Task completed successfully${NC}"
else
    echo -e "${RED}❌ Task failed with exit code: $EXIT_CODE${NC}"
    # Optionally run diagnosis
    echo "Running diagnosis..."
    codex exec -s danger-full-access -c model_reasoning_effort="low" \
        "Analyze the last error and suggest fixes"
fi

exit $EXIT_CODE

