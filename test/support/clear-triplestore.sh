#!/bin/bash

DATA=$(cd $(dirname $BASH_SOURCE) && cd ../../tmp && pwd )/triplestore

sudo rm -rf $DATA
