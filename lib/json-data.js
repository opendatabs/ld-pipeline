const fs = require('fs')
const p = require('barnard59')
const Transform = require('stream').Transform

const terms = {
  DataSet: p.rdf.namedNode('http://purl.org/linked-data/cube#DataSet'),
  DataStructureDefinition: p.rdf.namedNode('http://purl.org/linked-data/cube#DataStructureDefinition'),
  Slice: p.rdf.namedNode('http://purl.org/linked-data/cube#Slice'),
  comment: p.rdf.namedNode('http://www.w3.org/2000/01/rdf-schema#comment'),
  component: p.rdf.namedNode('http://purl.org/linked-data/cube#component'),
  description: p.rdf.namedNode('http://www.w3.org/2000/01/rdf-schema#description'),
  label: p.rdf.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
  seeAlso: p.rdf.namedNode('http://www.w3.org/2000/01/rdf-schema#seeAlso'),
  structure: p.rdf.namedNode('http://purl.org/linked-data/cube#structure'),
  type: p.rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')
}

/**
 *
 * @param filename The file name of the JSON data file
 * @returns Stream
 */
function jsonData (filename, datasetIri) {
  const data = JSON.parse(fs.readFileSync(filename).toString())
  const datasetTerm = p.rdf.namedNode(datasetIri)
  const structureTerm = p.rdf.namedNode(`${datasetIri}/structure`)

  let sent = false

  return new Transform({
    objectMode: true,
    transform (chunk, encoding, callback) {
      if (!sent) {
        this.push(p.rdf.quad(datasetTerm, terms.comment, p.rdf.literal(data.erlaeuterungen)))
        this.push(p.rdf.quad(datasetTerm, terms.description, p.rdf.literal(data.description)))
        this.push(p.rdf.quad(datasetTerm, terms.label, p.rdf.literal(`${data.title} ${data.subtitle}`)))
        this.push(p.rdf.quad(datasetTerm, terms.seeAlso, p.rdf.namedNode(`https://statabs.github.io/indikatoren/chart-details.html?id=${data.id}`)))
        this.push(p.rdf.quad(datasetTerm, terms.structure, structureTerm))
        this.push(p.rdf.quad(datasetTerm, terms.type, terms.DataSet))
        this.push(p.rdf.quad(datasetTerm, terms.type, terms.Slice))

        this.push(p.rdf.quad(structureTerm, terms.type, terms.DataStructureDefinition))

        // add all properties to the DataStructureDefinition
        if (data.properties) {
          data.properties.forEach(property => {
            this.push(p.rdf.quad(structureTerm, terms.component, p.rdf.namedNode(property)))
          })
        }

        sent = true
      }

      this.push(chunk)

      callback()
    }
  })
}

module.exports = jsonData
