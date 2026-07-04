#!/bin/bash
#
# Publish each product package to the MCP Registry.
# Run from the repo root by .github/workflows/release.yml (needs id-token: write).

set -euo pipefail

# Download the mcp-publisher binary once (asset names match uname output:
# mcp-publisher_{darwin,linux,windows}_{amd64,arm64}.tar.gz).
if [ ! -x ./mcp-publisher ]; then
  os=$(uname -s | tr '[:upper:]' '[:lower:]')
  arch=$(uname -m | sed 's/x86_64/amd64/; s/aarch64/arm64/')
  echo "Downloading mcp-publisher ($os/$arch)..."
  curl -fsSL "https://github.com/modelcontextprotocol/registry/releases/latest/download/mcp-publisher_${os}_${arch}.tar.gz" | tar xz mcp-publisher
fi

# Authenticate via GitHub Actions OIDC (token is cached for the commands below).
./mcp-publisher login github-oidc

# `publish` takes the path to a server.json, so no need to cd into each package.
for pkg in jira confluence bitbucket; do
  echo "Publishing $pkg..."
  ./mcp-publisher publish "packages/$pkg/server.json"
done

echo "All packages published to the MCP Registry."
