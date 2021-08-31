# ld-pipeline

This repository contains [barnard59](https://github.com/zazuko/barnard59) Linked Data pipelines to convert and publish Open Data of Basel-Stadt.
The data is published at [https://ld.bs.ch/](https://ld.bs.ch/).
A UI to run [SPARQL](https://www.w3.org/TR/sparql11-query/) queries can be found at [https://ld.bs.ch/sparql/](https://ld.bs.ch/sparql/).

## Usage
All scripts are configured as npm scripts and can be run like:

```bash
npm run $script
```

See `scripts` in the `package.json` files for a full overview of all scripts.

## Scripts

For each pipeline there are multiple scripts.
Scripts ending with `:stdout`, `:store`, and `:store-default` are defined for all pipelines.
The ODG pipeline has additional `:monthly` and `:weekly` postfixes to select datasets for the monthly or weekly cron job.

### stdout

Scripts ending with `:stdout` write RDF data as N-Triples to stdout.
These scripts are mainly used during the development phase.

### store

Scripts ending with `:store` write RDF data to the SPARQL endpoint given in the following environment variables:

- `ENDPOINT_URL`
- `ENDPOINT_USER`
- `ENDPOINT_PASSWORD`

These scripts are used in the production environment.
The variables are defined in the GitLab CI settings.

### store-default

Scripts ending with `:store-default` write RDF data to the default SPARQL endpoint.
The default SPARQL endpoint is a local instance that can be started and stopped with the scripts in the `test/support` folder.
These scripts are used to test the full pipeline before deploying it in the production environment.

## Pipelines

Pipelines based on [CSV on the Web](https://www.w3.org/TR/csv2rdf/) mappings use the `url` defined in the mapping as input.

### code

The `code` pipeline generates dimension value triples like labels based on CSV files. 

### mirror

The `mirror` pipeline takes care of importing external triples and links them with a `sameAs` triple to the local instance.

### ogd

The `ogd` pipeline generates Linked Data cubes based on CSV files from Github or Open Data portal.
There are two versions of the pipeline `weekly` and `monthly` as described in the scripts section of this document.
The location of the CSV mapping file controls to which of the pipelines a mapping belongs.  

### raum

The `raum` pipeline is similar to the `code`, but additionally generates geometry data. 

### rhein-ues-weil

The `rhein-ues-weil` pipelines reads CSV files with sensor data from an FTP server and adds new observations to cube.

### static

The `static` reads all Turtle files from the `static` folder and write the data to the matching named graph.

## Example Queries

The folowing [query](https://s.zazuko.com/3Umo4) returns the population of people between 30-40 per location:

```sparql
PREFIX bsprop: <https://ld.bs.ch/property/>
PREFIX cube: <https://cube.link/>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX schema: <http://schema.org/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT ?wkt (CONCAT(?name, " ", STR(SUM(?anzahl))) AS ?wktLabel) WHERE {
  <https://ld.bs.ch/cube/100128> cube:observationSet ?observationSet.
  
  ?observationSet cube:observation ?observation.
  
  ?observation
    bsprop:date ?date;
    bsprop:alter ?alter;
    bsprop:anzahl ?anzahl;
    bsprop:raum ?raum.

  ?raum geo:hasGeometry ?geometry.
  ?raum schema:name ?name .
  ?geometry geo:asWKT ?wkt.

  FILTER(?date = xsd:date("2020-12-31"))
  FILTER(?alter >= 30 && ?alter < 40)
}
GROUP BY ?raum ?wkt ?name ?wktLabel
```

The following [query](https://s.zazuko.com/2hE5DD) returns the COVID test stations that don't require being an existing patient:

```sparql
PREFIX bsprop: <https://ld.bs.ch/property/>
PREFIX cube: <https://cube.link/>
PREFIX schema: <http://schema.org/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT ?observation ?wkt ?wktLabel WHERE {
  <https://ld.bs.ch/cube/100134> cube:observationSet ?observationSet.

  ?observationSet cube:observation ?observation.

  ?observation
    schema:name ?name;
    bsprop:bestehend ?bestehend;
    schema:telephone ?telephone;
    schema:streetAddress ?streetAddress;
    schema:latitude ?latitude;
    schema:longitude ?longitude.

  BIND(CONCAT("POINT (", ?longitude, " ", ?latitude,")") AS ?wkt)
  BIND(CONCAT(?name, ", ", ?streetAddress, " (Tel: ", ?telephone, ")") AS ?wktLabel)

  FILTER(?bestehend = false)
}
```

The following [query](https://s.zazuko.com/VKiFP) returns the total number of trees that have an age information available and the age of the oldest tree per municipality:

```sparql
PREFIX bsprop: <https://ld.bs.ch/property/>
PREFIX cube: <https://cube.link/>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX schema: <http://schema.org/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT ?wkt (CONCAT(?name, " Anzahl: ", STR(?anzahl), " max. Alter: ", STR(?maxAge)) AS ?wktLabel) WHERE {

SELECT (COUNT(*) AS ?anzahl) (MAX(xsd:integer(?age)) AS ?maxAge) ?name ?wkt WHERE {
  <https://ld.bs.ch/cube/100052> cube:observationSet ?observationSet.

  ?observationSet cube:observation ?observation.

  ?observation
    schema:addressLocality ?addressLocality;
    bsprop:baumalter ?baumalter.
  
  ?addressLocality schema:sameAs ?municipality.
  ?raum dct:isVersionOf ?municipality.

  ?raum
    schema:name ?name;
    dct:issued ?issued;
    geo:defaultGeometry ?geometry.
  
  ?geometry geo:asWKT ?wkt.
  
  BIND(xsd:integer(?baumalter) AS ?age)

  FILTER(?issued >= xsd:date("2021-01-01"))
  FILTER(?age > 0)
} GROUP BY ?name ?wkt

}
```


The following [query](https://s.zazuko.com/2Dchw) returns the oldest tree(s) for each species:

```sparql
PREFIX bsprop: <https://ld.bs.ch/property/>
PREFIX cube: <https://cube.link/>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX schema: <http://schema.org/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT * WHERE {
  {
    SELECT (MAX(?age) AS ?maxAge) ?baumart WHERE {
      <https://ld.bs.ch/cube/100052> cube:observationSet ?observationSet.
    
      ?observationSet cube:observation ?observation.
    
      ?observation
        bsprop:baumart ?baumart;
        bsprop:baumalter ?baumalter.
    
      BIND(xsd:integer(?baumalter) AS ?age)
    
      FILTER(?age > 0)
      FILTER(?baumart != <https://ld.bs.ch/code/baumart/>)
    } GROUP BY ?baumart
  }

  {
    SELECT * WHERE {
      <https://ld.bs.ch/cube/100052> cube:observationSet ?observationSet.

      ?observationSet cube:observation ?observation.
    
      ?observation
        bsprop:baumart ?baumart;
        bsprop:baumalter ?baumalter;
        schema:latitude ?latitude;
        schema:longitude ?longitude.

      BIND(xsd:integer(?baumalter) AS ?age1)
    }
  }
  
  {
    SELECT * WHERE {
      ?baumart schema:name ?label

      FILTER(LANG(?label) = "de")
    }
  }
  
  FILTER(?age1 = ?maxAge)
  
  BIND(CONCAT("POINT (", ?longitude, " ", ?latitude,")") AS ?wkt)
  BIND(CONCAT(?label, " (", STR(?maxAge), ")") AS ?wktLabel)
}
```