#!/bin/bash

SSH_USER=ubuntu
SSH_HOST=51.79.222.185


SERVER_FILE_LOCATION=app/gendut-grosir/gendut-grosir-be

ssh -C $SSH_USER@$SSH_HOST "cd $SERVER_FILE_LOCATION && \
  git checkout development && \
  git pull && \
  docker-compose down && \
  docker-compose up -d --build && \
  exit"
