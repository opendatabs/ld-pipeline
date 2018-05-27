ENDPOINT=http://data.zazuko.com/statabs
USER=$SPARQL_USER:$SPARQL_PASSWORD
GRAPH=https://linked.opendata.swiss/graph/bs/statistics
INPUT=tmp/output.nt

cat $INPUT | curl -v --user $USER --request PUT --header content-type:application/n-triples -T - -G $ENDPOINT --data-urlencode graph=$GRAPH
