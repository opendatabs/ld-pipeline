#!/bin/bash

DATA=$(cd $(dirname $BASH_SOURCE) && cd ../../tmp && pwd )/ftp

rm -rf $DATA
