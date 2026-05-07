#!/usr/bin/env bash
#
# Generates API docs and updates the README

set -e
set -o pipefail

echo "Generating new API docs"

npm run document
