#!/bin/bash

# Lighthouse CI test script for all pages
# This script runs Lighthouse audits on all important pages

echo "Starting Lighthouse CI tests..."

if ! curl -s http://localhost:3000 > /dev/null; then
  echo "Error: Application is not running on http://localhost:3000"
  echo "Please start the application with 'npm run dev' or 'npm run build && npm start'"
  exit 1
fi

mkdir -p ./lighthouse-reports

# Pages to test
declare -a pages=(
  "http://localhost:3000/"
  "http://localhost:3000/login"
  "http://localhost:3000/signup"
  "http://localhost:3000/dashboard"
  "http://localhost:3000/dashboard/yatra"
  "http://localhost:3000/dashboard/yatra/create"
  "http://localhost:3000/dashboard/profile"
  "http://localhost:3000/dashboard/support"
  "http://localhost:3000/dashboard/payment-history"
)

for page in "${pages[@]}"
do
  page_name=$(echo $page | sed 's/http:\/\/localhost:3000\///' | sed 's/\//-/g')
  if [ -z "$page_name" ]; then
    page_name="home"
  fi

  echo "Testing: $page (saving as $page_name)"

  npx lighthouse $page \
    --output=html \
    --output=json \
    --output-path=./lighthouse-reports/$page_name \
    --chrome-flags="--headless --no-sandbox" \
    --preset=desktop \
    --quiet

  echo "✓ Completed: $page_name"
done

echo ""
echo "All Lighthouse tests completed!"
echo "Reports saved in ./lighthouse-reports/"
echo ""
echo "To run Lighthouse CI with assertions: npx lhci autorun"
