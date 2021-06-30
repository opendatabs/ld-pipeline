import rdf from 'rdf-ext'
import * as ns from './namespaces.js'

function addLocals (baseIri, quad) {
  if (!quad.predicate.equals(ns.rdf.type)) {
    return [quad]
  }

  const pathname = (new URL(quad.subject.value)).pathname
  const subject = rdf.namedNode(`${baseIri}${pathname}`)

  return [
    rdf.quad(subject, ns.rdf.type, quad.object),
    rdf.quad(subject, ns.schema.sameAs, quad.subject),
    quad
  ]
}

function addLocalsSwisstopo (quad) {
  return addLocals('https://ld.bs.ch', quad)
}

export {
  addLocalsSwisstopo
}
