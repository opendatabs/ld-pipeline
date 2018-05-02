# Bevölkerungsbestand am Jahresende (4132)

The following query fetches all values from the Basel dataset:

```
SELECT * WHERE {
  GRAPH <https://linked.opendata.swiss/graph/bs/statistics> {    
    ?observation <http://purl.org/linked-data/cube#dataSet> <http://ld.statistik.bs.ch/dataset/4132> .
    ?observation <http://ld.statistik.bs.ch/property/datum> ?zeit .
    ?observation <http://ld.statistik.bs.ch/property/bevolkerung> ?bew .
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
