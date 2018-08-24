# Rheinüberwachungsstation Weil am Rhein

There are two dataset which contain data from the RÜS:
 - The [raw dataset](https://ld.data-bs.ch/dataset/rhein-ues-weil-raw) which contains also the current values.
 - The [corrected dataset](https://ld.data-bs.ch/dataset/rhein-ues-weil-corrected) with manually corrected values.

The following query fetches all values of observations newer than 2018-08-15:

```sparql
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
SELECT * WHERE {
  GRAPH <https://linked.opendata.swiss/graph/bs/rhein-ues-weil> {
    ?observation <http://purl.org/linked-data/cube#dataSet> <https://ld.data-bs.ch/dataset/rhein-ues-weil-raw> .
    ?observation <https://ld.data-bs.ch/property/start> ?start .
    ?observation <https://ld.data-bs.ch/property/electrical-conductivity> ?electricalConductivity .
    ?observation <https://ld.data-bs.ch/property/oxygen-saturation> ?oxygenSaturation .
    ?observation <https://ld.data-bs.ch/property/ph> ?ph .
    ?observation <https://ld.data-bs.ch/property/temperature> ?temperature .
    ?observation <https://ld.data-bs.ch/property/observedBy> ?observedBy .
    ?observedBy <http://www.w3.org/2000/01/rdf-schema#label> ?observedByLabel .
    FILTER (?start > xsd:dateTime("2018-08-15T17:45:00.000Z"))
  }
}
```

To show the data in a chart click on `Pivot Table` and configure the columns like shown in the picture:

![YASGUI Chart Config](https://cdn.rawgit.com/StataBS/ld-pipeline/master/examples/yasgui-chart-config-rhein-ues-weil.png)
