const rdf = require('rdf-ext')
const wellknown = require('wellknown')
const ns = require('./namespaces')

function geoJsonToWkt (quad) {
  const geometry = rdf.namedNode(`${quad.subject.value}/geometry`)
  const wkt = rdf.literal(wellknown.stringify(JSON.parse(quad.object.value)), ns.geo.wktLiteral)

  return [
    rdf.quad(quad.subject, ns.geo.hasGeometry, geometry),
    rdf.quad(geometry, ns.rdf.type, ns.geo.Geometry),
    rdf.quad(geometry, ns.geo.asWKT, wkt)
  ]
}

function geoStringToPoint (quad) {
  const [latitude, longitude] = quad.object.value.split(',').map(v => parseFloat(v))

  return [
    rdf.quad(quad.subject, ns.schema.latitude, rdf.literal(latitude.toString()), quad.graph),
    rdf.quad(quad.subject, ns.schema.longitude, rdf.literal(longitude.toString()), quad.graph)
  ]
}

function mapGeometry (quad) {
  if (!quad.predicate.equals(ns.geo.hasGeometry)) {
    return [quad]
  }

  const value = quad.object.value.trim()

  if (value.startsWith('{')) {
    return geoJsonToWkt(quad)
  }

  if (/^\d+.\d+,\d+.\d+$/.test(value)) {
    return geoStringToPoint(quad)
  }

  return [quad]
}

module.exports = mapGeometry
