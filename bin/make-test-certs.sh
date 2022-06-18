#!/usr/bin/env bash

echo "Creating .cert folder...";
mkdir .cert

echo "Creating Test Key..."
echo "${{ secrets.TEST_KEY_PEM_BASE64 }}" | base64 -d > .cert/key.pem

echo "Creating Test Certificate..."
echo "${{ secrets.TEST_CERT_PEM_BASE64 }}" | base64 -d > .cert/cert.pem
