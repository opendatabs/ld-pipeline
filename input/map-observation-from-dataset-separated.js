const p = require('barnard59')

const terms = {
  dataSet: p.rdf.namedNode('http://purl.org/linked-data/cube#dataSet'),
  observation: p.rdf.namedNode('http://purl.org/linked-data/cube#observation')
}

function mapObservationFromDatasetSeparated (quad) {
  const quads = [quad]

  if (quad.predicate.equals(terms.dataSet)) {
    const object = p.rdf.namedNode(`${quad.object.value}/observation`)

    quads.push(p.rdf.quad(object, terms.observation, quad.subject))
  }

  return quads
}

module.exports = mapObservationFromDatasetSeparated
