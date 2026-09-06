#!/usr/bin/env bash
# SessionStart hook — informational git sync check.
# Never stashes, pulls, or commits on its own; just surfaces state so a
# session (human or Claude) doesn't silently work on stale/conflicting state
# when multiple people are pushing to the same repo from different machines.
set -uo pipefail

repo_root="$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0
cd "$repo_root" || exit 0

# Portable watchdog: don't let a slow/unreachable remote block session
# start. `timeout` isn't on macOS by default, so kill the fetch by hand
# if it runs past 8s.
( git fetch --all --prune --quiet 2>/dev/null ) &
fetch_pid=$!
( sleep 8 && kill -9 "$fetch_pid" 2>/dev/null ) &
watchdog_pid=$!
wait "$fetch_pid" 2>/dev/null
kill "$watchdog_pid" 2>/dev/null
wait "$watchdog_pid" 2>/dev/null

branch="$(git symbolic-ref --short -q HEAD || echo '(detached HEAD)')"
upstream="$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"

ahead=0
behind=0
if [ -n "$upstream" ]; then
  counts="$(git rev-list --left-right --count "$upstream...HEAD" 2>/dev/null)"
  behind="$(echo "$counts" | awk '{print $1+0}')"
  ahead="$(echo "$counts" | awk '{print $2+0}')"
fi

repo_name="$(basename "$repo_root")"
msg="Git sync check ($repo_name) — branch '$branch'"
if [ -n "$upstream" ]; then
  msg="$msg tracking $upstream: $ahead ahead, $behind behind."
else
  msg="$msg has no upstream tracking branch."
fi

if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
  msg="$msg Working tree has UNCOMMITTED CHANGES — run 'git stash' before switching branches or pulling; 'git stash pop' restores it after."
else
  msg="$msg Working tree clean."
fi

jq -n --arg msg "$msg" '{systemMessage: $msg, hookSpecificOutput: {hookEventName: "SessionStart", additionalContext: $msg}}'
