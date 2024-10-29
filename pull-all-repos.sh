#!/bin/bash

# We can use this script to pull changes from all sub-repositories in a mega repository.
# This can be used in the monitor repo.
# This script cd's into sub-repos and pulls changes from the remote.
# If there are any local changes, it stashes them before pulling and pops the stash after pulling.
# If there are any conflicts, it stops the operation and asks the user to resolve the conflicts manually.

# chmod +x pull-all-repos.sh

# Function to handle conflicts
handle_conflict() {
  echo "Conflict detected in $1. Stopping operation."
  exit 1
}

# Check if inside a Git repo
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
  echo "This script must be run inside a Git repository."
  exit 1
fi

# Iterate through all sub-repos (directories with .git)
for repo in $(find . -type d -name ".git" | sed 's/\/.git//'); do
  echo "Processing repository: $repo"
  cd "$repo" || { echo "Failed to enter $repo"; exit 1; }

  # Stash any local changes
  if [ -n "$(git status --porcelain)" ]; then
    echo "Stashing changes in $repo"
    git stash push -m "Auto-stash from pull-all-repos.sh"
  fi

  # Pull changes from the remote
  if ! git pull; then
    handle_conflict "$repo"
  fi

  # Pop the stash (if any stashes were created)
  if git stash list | grep -q "Auto-stash from pull-all-repos.sh"; then
    echo "Popping stash in $repo"
    if ! git stash pop; then
      handle_conflict "$repo"
    fi
  fi

  # Go back to the root directory of the main repo
  cd - > /dev/null || exit 1
done

echo "All repositories pulled successfully!"
