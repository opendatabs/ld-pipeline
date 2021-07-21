import TermMap from '@rdfjs/term-map'
import { DateTime } from 'luxon'
import rdf from 'rdf-ext'
import * as ns from './namespaces.js'

function mapTermCleanLocal (term) {
  if (term.termType !== 'NamedNode') {
    return null
  }

  if (!term.value.startsWith(ns.bscode('').value)) {
    return null
  }

  return rdf.namedNode(term.value
    .split('%20').join('-')
    .split('%22').join('')
  )
}

function mapCleanLocal (quad) {
  const subject = mapTermCleanLocal(quad.subject)
  const object = mapTermCleanLocal(quad.object)

  if (!subject && !object) {
    return quad
  }

  return rdf.quad(subject || quad.subject, quad.predicate, object || quad.object, quad.graph)
}

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

function mapHomepage (quad) {
  // value gets prefixed with null-string to avoid null values -> to triple
  const value = quad.object.value.split('null', 1)[0]

  // as defined in the cube ontology https://github.com/zazuko/rdf-cube-schema
  // all dimension values must be given for each observation
  // see best practice for undefined values:
  // https://github.com/zazuko/rdf-cube-schema/blob/master/best-practice.md

  // in case of an empty string, use the undefined value defined in the cube ontology
  const object = value ? rdf.namedNode(value) : ns.cube.Undefined

  // for a literal value it would look like this:
  // rdf.literal('', ns.cube.Undefined)

  // that would generate a triple like:
  // <> <> ""^^cube:Undefined .

  return rdf.quad(quad.subject, quad.predicate, object, quad.graph)
}

const mapByFunctions = new TermMap([
  [ns.schema.addressLocality, mapContainedInPlace],
  [ns.schema.containedInPlace, mapContainedInPlace],
  [ns.schema.endDate, mapDateTime],
  [ns.bsproperty.geschlecht, mapGeschlecht],
  [ns.bsproperty.staatsangehoerigkeit, mapStaatsangehoerigkeit],
  [ns.schema.startDate, mapDateTime],
  [ns.schema.mainEntityOfPage, mapHomepage]
])

function map (quad) {
  const mapFunction = mapByFunctions.get(quad.predicate)

  if (mapFunction) {
    quad = mapFunction(quad)
  }

  quad = mapCleanLocal(quad)

  return quad
}

export default map
