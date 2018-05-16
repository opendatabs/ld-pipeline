# Bevölkerungsbestand am Jahresende (4132)

The following query fetches all values from the Basel dataset:

```
SELECT * WHERE {
  GRAPH <https://linked.opendata.swiss/graph/bs/statistics> {    
    ?observation <http://purl.org/linked-data/cube#dataSet> <http://ld.data-bs.ch/dataset/6623> .
    ?observation <http://ld.data-bs.ch/property/jahr> ?zeit .
    ?observation <http://ld.data-bs.ch/property/bevolkerung-stadt-basel> ?bew .
    ?observation <http://ld.data-bs.ch/property/raum> ?raum .
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
  }
}
```

```
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT ?zeit (STRDT(STR(?bew), xsd:integer) AS ?bev) ?raum WHERE {{
  SERVICE <http://ld.integ.stadt-zuerich.ch/query> {
    SELECT * WHERE {
      GRAPH <https://linked.opendata.swiss/graph/zh/statistics> {
        ?observation <http://purl.org/linked-data/cube#dataSet> <http://ld.stadt-zuerich.ch/statistics/dataset/BEW-RAUM-ZEIT> .
        ?observation <http://ld.stadt-zuerich.ch/statistics/property/ZEIT> ?zeit .
        ?observation <http://ld.stadt-zuerich.ch/statistics/measure/BEW> ?bew .
        ?observation <http://ld.stadt-zuerich.ch/statistics/property/RAUM> ?raum .
        FILTER (?raum IN (<http://ld.stadt-zuerich.ch/statistics/code/R10000>))
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
    }
  }
}} ORDER BY ?zeit ?raum
```
