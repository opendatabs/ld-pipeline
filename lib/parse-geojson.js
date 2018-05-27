const evalTemplateString = require('./eval-template-string')
const p = require('barnard59')
const wellknown = require('wellknown')
const Transform = require('stream').Transform

function parseGeoJsonFeature (feature, subject, predicate) {
  return p.rdf.quad(
    p.rdf.namedNode(evalTemplateString(subject, feature.properties)),
    p.rdf.namedNode(evalTemplateString(predicate, feature.properties)),
    p.rdf.literal(wellknown.stringify(feature), p.rdf.namedNode('http://www.opengis.net/ont/geosparql#wktLiteral'))
  )
}

function parseGeoJsonFeatureCollection (featureCollection, subject, predicate) {
  return featureCollection.features.map(feature => parseGeoJsonFeature(feature, subject, predicate))
}

function parseGeoJson (json, subject, predicate) {
  if (json.type === 'Feature') {
    return parseGeoJsonFeature(json, subject, predicate)
  } else if (json.type === 'FeatureCollection') {
    return parseGeoJsonFeatureCollection(json, subject, predicate)
  } else {
    return []
  }
}

class GeoJsonParser extends Transform {
  constructor (subject, predicate) {
    super({
      readableObjectMode: true
    })

    this.subject = subject
    this.predicate = predicate

    this.chunks = []
  }

  _flush (callback) {
    parseGeoJson(JSON.parse(Buffer.concat(this.chunks).toString()), this.subject, this.predicate).forEach(quad => {
      this.push(quad)
    })

    callback()
  }

  _transform (chunk, encoding, callback) {
    this.chunks.push(chunk)

    callback()
  }

  static create (subject, predicate) {
    return new GeoJsonParser(subject, predicate)
  }
}

module.exports = GeoJsonParser.create
