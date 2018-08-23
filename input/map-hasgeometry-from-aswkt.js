const p = require('barnard59')

const terms = {
  asWKT: p.rdf.namedNode('http://www.opengis.net/ont/geosparql#asWKT'),
  hasGeometry: p.rdf.namedNode('http://www.opengis.net/ont/geosparql#hasGeometry')
}

function mapHasGeometryFromAsWkt (quad) {
  const quads = [quad]

  if (quad.predicate.equals(terms.asWKT)) {
    const subject = p.rdf.namedNode(quad.subject.value.split('/').slice(0, -1).join('/'))

    quads.push(p.rdf.quad(subject, terms.hasGeometry, quad.subject))
  }

  return quads
}

module.exports = mapHasGeometryFromAsWkt
