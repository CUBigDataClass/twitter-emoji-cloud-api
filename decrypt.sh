#!/bin/bash


gcloud kms decrypt --location global --keyring bde-keyring --key twitter-emoji-api-key --ciphertext-file config.json.encrypted --plaintext-file config.json
gcloud kms decrypt --location global --keyring bde-keyring --key twitter-emoji-api-key --ciphertext-file key.json.encrypted --plaintext-file key.json