const namespace = require('@rdfjs/namespace')

const ns = {
  rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
}

const csvw = 'http://www.w3.org/ns/csvw#'

function isNotCsvwTriple (quad) {
  if (quad.predicate.value.startsWith(csvw)) {
    return false
  }

  if (ns.rdf.type.equals(quad.predicate) && quad.object.value.startsWith(csvw)) {
    return false
  }

  return true
}

module.exports = isNotCsvwTriple
