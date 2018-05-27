const fs = require('fs')
const p = require('barnard59')
const Transform = require('stream').Transform

const terms = {
  comment: p.rdf.namedNode('http://www.w3.org/2000/01/rdf-schema#comment'),
  description: p.rdf.namedNode('http://www.w3.org/2000/01/rdf-schema#description'),
  label: p.rdf.namedNode('http://www.w3.org/2000/01/rdf-schema#label')
}

/**
 *
 * @param filename The file name of the JSON data file
 * @returns Stream
 */
function jsonData (filename, datasetIri) {
  const data = JSON.parse(fs.readFileSync(filename).toString())
  const datasetTerm = p.rdf.namedNode(datasetIri)

  let sent = false

  return new Transform({
    objectMode: true,
    transform (chunk, encoding, callback) {
      if (!sent) {
        this.push(p.rdf.quad(datasetTerm, terms.comment, p.rdf.literal(data.erlaeuterungen)))
        this.push(p.rdf.quad(datasetTerm, terms.description, p.rdf.literal(data.description)))
        this.push(p.rdf.quad(datasetTerm, terms.label, p.rdf.literal(`${data.title} ${data.subtitle}`)))

        sent = true
      }

      this.push(chunk)

      callback()
    }
  })
}

module.exports = jsonData
