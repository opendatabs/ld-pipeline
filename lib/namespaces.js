const namespace = require('@rdfjs/namespace')

const ns = {
  bscode: namespace('https://ld.bs.ch/code/'),
  bsproperty: namespace('https://ld.bs.ch/property/'),
  geo: namespace('http://www.opengis.net/ont/geosparql#'),
  municipality: namespace('https://ld.bs.ch/boundaries/municipality/'),
  rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
  schema: namespace('https://schema.org/')
}

module.exports = ns
