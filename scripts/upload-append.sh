#!/bin/bash

cat $INPUT | curl -v --user $USER --request POST --header content-type:application/n-triples -T - -G $ENDPOINT --data-urlencode graph=$GRAPH
