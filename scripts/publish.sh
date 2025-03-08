#!/bin/bash
set -e

# Use npm with package-lock=false for the publish command
npm run publish:ci

# Code below fixes strange lerna \ NPM bug with package-lock.json incorrectly updated on CI
# If lerna is removed from repository this workaround can be removed
# Check if package-lock.json was modified in the last commit
if git diff-tree --no-commit-id --name-only -r HEAD | grep -q "package-lock.json"; then
  echo "Reverting changes to package-lock.json files"
  # Revert any changes to package-lock.json files
  git checkout HEAD^ -- "**/package-lock.json" || true
  git checkout HEAD^ -- "package-lock.json" || true

  # If there are changes to commit after reverting
  if ! git diff --quiet; then
    git add -A
    # Amend the last commit instead of creating a new one
    git commit --amend --no-edit
    # Push the amended commit
    git push origin HEAD:master
  fi
else
  echo "No package-lock.json changes detected"
  # Push version tags created by lerna
  git push --follow-tags origin master
fi
