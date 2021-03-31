#!/bin/bash

DATA=$(cd $(dirname $BASH_SOURCE) && cd ../../tmp && pwd )/ftp

mkdir -p $DATA

#
# raw
#

# input folder
mkdir -p $DATA/onlinedaten/roh/archiv_sql

# output folder
mkdir -p $DATA/onlinedaten/roh/archiv_lod

# copy initial data
SOURCE=$(cd $(dirname $BASH_SOURCE) && pwd )/rhein-ues-weil
cp $SOURCE/roh/* $DATA/onlinedaten/roh/archiv_sql

#
# corrected
#

# input folder
mkdir -p $DATA/onlinedaten/korrigiert/

# copy initial data
SOURCE=$(cd $(dirname $BASH_SOURCE) && pwd )/rhein-ues-weil
cp $SOURCE/korrigiert/* $DATA/onlinedaten/korrigiert/

docker run --rm -it \
  --name bs-ftp-server \
  -d \
  -p 21:21 \
  -p 21000-21010:21000-21010 \
  -v $DATA:/home/user/admin \
  -e USERS="admin|test|/home/user/admin" \
  delfer/alpine-ftp-server
