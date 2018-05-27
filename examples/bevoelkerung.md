# Bevölkerungsbestand am Jahresende Stadt Basel (6623)

The following query fetches all values from the Basel dataset:

```
SELECT * WHERE {
  GRAPH <https://linked.opendata.swiss/graph/bs/statistics> {
    ?observation <http://purl.org/linked-data/cube#dataSet> <http://ld.data-bs.ch/dataset/6623> .
    ?observation <http://ld.data-bs.ch/property/jahr> ?zeit .
    ?observation <http://ld.data-bs.ch/property/bevolkerung-stadt-basel> ?bew .
    ?observation <http://ld.data-bs.ch/property/raum> ?raum .
    ?raum <http://www.w3.org/2000/01/rdf-schema#label> ?raumLabel .
  }
}
```

This query fetches the same kind of observations from the Zürich dataset:

```
SELECT * WHERE {
  GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
    ?observation <http://purl.org/linked-data/cube#dataSet> <http://ld.stadt-zuerich.ch/statistics/dataset/BEW-RAUM-ZEIT> .
    ?observation <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .
    ?observation <http://ld.stadt-zuerich.ch/statistics/measure/BEW> ?bew .
    ?observation <http://ld.stadt-zuerich.ch/statistics/property/RAUM> ?raum .
    ?raum <http://www.w3.org/2000/01/rdf-schema#label> ?raumLabel .
  }
}
```

And both combined can be fetched with this query:

```
SELECT ?zeit (?bew AS ?bev) ?raumLabel WHERE {{
  SERVICE <http://ld.integ.stadt-zuerich.ch/query> {
    SELECT * WHERE {
      GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
        ?observation <http://purl.org/linked-data/cube#dataSet> <http://ld.stadt-zuerich.ch/statistics/dataset/BEW-RAUM-ZEIT> .
        ?observation <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .
        ?observation <http://ld.stadt-zuerich.ch/statistics/measure/BEW> ?bew .
        ?observation <http://ld.stadt-zuerich.ch/statistics/property/RAUM> ?raum .
        ?raum <http://www.w3.org/2000/01/rdf-schema#label> ?raumLabel .
        FILTER (?raum IN (<http://ld.stadt-zuerich.ch/statistics/code/R30000>, <http://ld.stadt-zuerich.ch/statistics/code/R20000>))
      }
    }
  }
} UNION {
  SELECT * WHERE {
    GRAPH <https://linked.opendata.swiss/graph/bs/statistics> {
      ?observation <http://purl.org/linked-data/cube#dataSet> <http://ld.data-bs.ch/dataset/6623> .
      ?observation <http://ld.data-bs.ch/property/jahr> ?zeit .
      ?observation <http://ld.data-bs.ch/property/bevolkerung-stadt-basel> ?bew .
      ?observation <http://ld.data-bs.ch/property/raum> ?raum .
      ?raum <http://www.w3.org/2000/01/rdf-schema#label> ?raumLabel .
    }
  }
}} ORDER BY ?zeit ?raum
```

If the geometry is also selected, the map can be used to display the data:

```
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT * WHERE {
  GRAPH <https://linked.opendata.swiss/graph/bs/statistics> {
    ?observation <http://purl.org/linked-data/cube#dataSet> <http://ld.data-bs.ch/dataset/6623> .
    ?observation <http://ld.data-bs.ch/property/jahr> ?zeit .
    ?observation <http://ld.data-bs.ch/property/bevolkerung-stadt-basel> ?bew .
    ?observation <http://ld.data-bs.ch/property/raum> ?raum .
    ?raum <http://www.w3.org/2000/01/rdf-schema#label> ?raumLabel .
    ?raum <http://www.opengis.net/ont/geosparql#hasGeometry> ?geometry .
    BIND (CONCAT(?raumLabel, ": ", ?bew) AS ?geometryLabel )
    FILTER (?zeit > xsd:date("2017-01-01"))
  }
}
```