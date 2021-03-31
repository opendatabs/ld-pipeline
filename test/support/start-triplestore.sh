#!/bin/bash

DATA=$(cd $(dirname $BASH_SOURCE) && cd ../../tmp && pwd )/triplestore
CONFIG=$(cd $(dirname $BASH_SOURCE) && pwd )/fuseki-config.ttl

mkdir -p $DATA

docker run --rm -it \
  --name bs-triplestore \
  -d \
  -p 3030:3030 \
  -v $DATA:/fuseki \
  -v $CONFIG:/config.ttl:ro \
  -e ADMIN_PASSWORD=test \
  stain/jena-fuseki \
  /jena-fuseki/fuseki-server -config=/config.ttl
