function filterNotCsvw (quad) {
  if (quad.predicate.value.indexOf('http://www.w3.org/ns/csvw#') === 0) {
    return false
  }

  if (quad.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' && quad.object.value.indexOf('http://www.w3.org/ns/csvw#') === 0) {
    return false
  }

  return true
}

module.exports = filterNotCsvw
