#!/bin/bash
# Runs at session start — feeds Clerk auth status into Claude context

WHOAMI=$(echo "{}" | clerk whoami --mode agent 2>/dev/null)
DOCTOR=$(echo "{}" | clerk doctor --mode agent 2>&1 | sed 's/\x1b\[[0-9;]*[mGKHF]//g')

CONTEXT="## Clerk Auth (session init)\n\n### whoami\n${WHOAMI}\n\n### doctor\n${DOCTOR}"

python3 -c "
import sys, json
ctx = sys.argv[1]
print(json.dumps({
    'hookSpecificOutput': {
        'hookEventName': 'SessionStart',
        'additionalContext': ctx
    }
}))
" "$CONTEXT"
