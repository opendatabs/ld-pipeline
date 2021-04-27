const TermMap = require('@rdfjs/term-map')
const { DateTime } = require('luxon')
const rdf = require('rdf-ext')
const ns = require('./namespaces')

function mapDateTime (quad) {
  if (!ns.xsd.dateTime.equals(quad.object.datatype)) {
    return quad
  }

  if ((/^\d\d.\d\d.\d\d\d\d \d\d:\d\d$/).test(quad.object.value)) {
    const value = DateTime.fromFormat(quad.object.value, 'dd.MM.yyyy HH:mm', { zone: 'UTC+1' })

    return rdf.quad(quad.subject, quad.predicate, rdf.literal(value.toISO(), ns.xsd.dateTime), quad.graph)
  }

  if ((/^\d\d.\d\d.\d\d\d\d \d\d:\d\d:\d\d$/).test(quad.object.value)) {
    const value = DateTime.fromFormat(quad.object.value, 'dd.MM.yyyy HH:mm:ss', { zone: 'UTC+1' })

    return rdf.quad(quad.subject, quad.predicate, rdf.literal(value.toISO(), ns.xsd.dateTime), quad.graph)
  }

  return quad
}

function mapUsingMap (map, quad) {
  const object = map.get(quad.object)

  if (!object) {
    throw new Error(`can't map property ${quad.predicate.value} with value ${quad.object.value}`)
  }

  return rdf.quad(quad.subject, quad.predicate, object, quad.graph)
}

function mapContainedInPlace (quad) {
  const map = new TermMap([
    [rdf.literal('Basel'), ns.municipality('2701')],
    [rdf.literal('Bettingen'), ns.municipality('2702')],
    [rdf.literal('Riehen'), ns.municipality('2703')]
  ])

  if (quad.object.termType === 'NamedNode') {
    return quad
  }

  return mapUsingMap(map, quad)
}

function mapGeschlecht (quad) {
  const map = new TermMap([
    [rdf.literal('M'), ns.bscode('geschlecht/Maennlich')],
    [rdf.literal('W'), ns.bscode('geschlecht/Weiblich')]
  ])

  return mapUsingMap(map, quad)
}

function mapStaatsangehoerigkeit (quad) {
  const map = new TermMap([
    [rdf.literal('A'), ns.bscode('staatsangehoerigkeit/Auslaender')],
    [rdf.literal('CH'), ns.bscode('staatsangehoerigkeit/Schweizer')]
  ])

  return mapUsingMap(map, quad)
}

const mapFunctions = new TermMap([
  [ns.schema.addressLocality, mapContainedInPlace],
  [ns.schema.containedInPlace, mapContainedInPlace],
  [ns.schema.endDate, mapDateTime],
  [ns.bsproperty.geschlecht, mapGeschlecht],
  [ns.bsproperty.staatsangehoerigkeit, mapStaatsangehoerigkeit],
  [ns.schema.startDate, mapDateTime]
])

function map (quad) {
  const mapFunction = mapFunctions.get(quad.predicate)

  if (!mapFunction) {
    return quad
  }

  return mapFunction(quad)
}

module.exports = map
