# Bevölkerungsbestand am Jahresende Stadt Basel (6623)

The following query fetches all values from the Basel dataset:

```sparql
SELECT * WHERE {
  GRAPH <https://linked.opendata.swiss/graph/bs/statistics> {
    ?observation <http://purl.org/linked-data/cube#dataSet> <https://ld.data-bs.ch/dataset/6623> .
    ?observation <https://ld.data-bs.ch/property/jahr> ?zeit .
    ?observation <https://ld.data-bs.ch/property/bevolkerung> ?bew .
    ?observation <https://ld.data-bs.ch/property/raum> ?raum .
    ?raum <http://www.w3.org/2000/01/rdf-schema#label> ?raumLabel .
  }
}
```

This query fetches the same kind of observations from the Zürich dataset:

```sparql
SELECT * WHERE {
  GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
    ?observation <http://purl.org/linked-data/cube#dataSet> <https://ld.stadt-zuerich.ch/statistics/dataset/BEW-RAUM-ZEIT> .
    ?observation <https://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .
    ?observation <https://ld.stadt-zuerich.ch/statistics/measure/BEW> ?bew .
    ?observation <https://ld.stadt-zuerich.ch/statistics/property/RAUM> ?raum .
    ?raum <http://www.w3.org/2000/01/rdf-schema#label> ?raumLabel .
  }
}
```

And both combined can be fetched with this query:

```sparql
SELECT ?zeit (?bew AS ?bev) ?raumLabel WHERE {{
  SERVICE <http://ld.integ.stadt-zuerich.ch/query> {
    SELECT * WHERE {
      GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
        ?observation <http://purl.org/linked-data/cube#dataSet> <https://ld.stadt-zuerich.ch/statistics/dataset/BEW-RAUM-ZEIT> .
        ?observation <https://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .
        ?observation <https://ld.stadt-zuerich.ch/statistics/measure/BEW> ?bew .
        ?observation <https://ld.stadt-zuerich.ch/statistics/property/RAUM> ?raum .
        ?raum <http://www.w3.org/2000/01/rdf-schema#label> ?raumLabel .
        FILTER (?raum IN (<https://ld.stadt-zuerich.ch/statistics/code/R30000>, <https://ld.stadt-zuerich.ch/statistics/code/R20000>))
      }
    }
  }
} UNION {
  SELECT * WHERE {
    GRAPH <https://linked.opendata.swiss/graph/bs/statistics> {
      ?observation <http://purl.org/linked-data/cube#dataSet> <https://ld.data-bs.ch/dataset/6623> .
      ?observation <https://ld.data-bs.ch/property/jahr> ?zeit .
      ?observation <https://ld.data-bs.ch/property/bevolkerung> ?bew .
      ?observation <https://ld.data-bs.ch/property/raum> ?raum .
      ?raum <http://www.w3.org/2000/01/rdf-schema#label> ?raumLabel .
    }
  }
}} ORDER BY ?zeit ?raum
```

To show the data in a chart click on `Pivot Table` and configure the columns like shown in the picture:

![YASGUI Chart Config](https://cdn.rawgit.com/StataBS/ld-pipeline/master/examples/yasgui-chart-config.png)

If the geometry is also selected, the map can be used to display the data:

```sparql
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT * WHERE {
  GRAPH <https://linked.opendata.swiss/graph/bs/statistics> {
    ?observation <http://purl.org/linked-data/cube#dataSet> <https://ld.data-bs.ch/dataset/6623> .
    ?observation <https://ld.data-bs.ch/property/jahr> ?zeit .
    ?observation <https://ld.data-bs.ch/property/bevolkerung> ?bew .
    ?observation <https://ld.data-bs.ch/property/raum> ?raum .
    ?raum <http://www.w3.org/2000/01/rdf-schema#label> ?raumLabel .
    ?raum <http://www.opengis.net/ont/geosparql#hasGeometry> ?geometry .
    ?geometry <http://www.opengis.net/ont/geosparql#asWKT> ?wkt .
    BIND (CONCAT(?raumLabel, ": ", ?bew) AS ?geometryLabel )
    FILTER (?zeit > xsd:date("2017-01-01"))
  }
}
```
