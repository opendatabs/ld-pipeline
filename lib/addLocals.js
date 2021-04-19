const namespace = require('@rdfjs/namespace')
const rdf = require('rdf-ext')

const ns = {
  rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
  schema: namespace('http://schema.org/')
}

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

module.exports = {
  addLocalsSwisstopo
}
