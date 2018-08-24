# LINDAS

The data is published to the LINDAS SPARQL endpoint.

- The UI to query the endpoint can be found at: https://lindas-data.ch/sparql-ui/
- The SPARQL endpoint itself is reachable at: https://lindas-data.ch/sparql

The data of Statistisches Amt Basel-Stadt is stored in a separate named graph.
The following query can be used to list a available named graphs:

```sparql
SELECT DISTINCT ?g WHERE {
  GRAPH ? {
    ?s ?p ?o .
  }
}
```

It will also list the named graph in the following query.
The query fetches the 10 random triples found in the named graph:

```sparql
SELECT * WHERE {
  GRAPH <https://linked.opendata.swiss/graph/bs/statistics> {
    ?s ?p ?o .
  }
} LIMIT 10
```
