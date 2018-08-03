const fs = require('fs')
const path = require('path')

/**
 * Creates a CSVW Metadata JSON-LD object based on the given tsv file
 * @param filename File name of the tsv file
 * @param aboutBaseIRI Base IRI for the subject URL
 * @param propertyBaseIRI Base IRI for the predicate URLs
 * @returns object CSVW Metadata JSON-LD object
 */
function create (filename, aboutBaseIRI, propertyBaseIRI, options) {
  options = options || {}

  const delimiter = options.delimiter || '\t'
  const tableSchema = options.tableSchema || {}

  // the base name will be used as key for the dataset
  const basename = path.basename(filename, '.tsv')

  // reads the first line and split columns
  const headers = fs.readFileSync(filename).toString().split('\n').shift()
    .match(new RegExp('[^\\t"]+|"([^"]*)"', 'g')).map(t => t.split('"').join('').split('\t').join(' ').trim())
    .filter(t => t)

  if (!tableSchema.aboutUrl) {
    // base name + first column name will be used as key for the observation
    tableSchema.aboutUrl = `${aboutBaseIRI}${basename}/observation/{${headers[0]}}`
  }

  if (!tableSchema.columns) {
    tableSchema.columns = headers.map(header => {
      return {
        titles: header,
        propertyUrl: `${propertyBaseIRI}${header}`
      }
    })
  }

  // add the Observation type to each subject / row
  tableSchema.columns.push({
    virtual: true,
    propertyUrl: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
    valueUrl: 'http://purl.org/linked-data/cube#Observation'
  })

  tableSchema.columns.push({
    virtual: true,
    propertyUrl: 'http://purl.org/linked-data/cube#dataSet',
    valueUrl: `${aboutBaseIRI}${basename}`
  })

  return {
    '@context': 'http://www.w3.org/ns/csvw',
    dialect: {
      delimiter
    },
    tableSchema
  }
}

module.exports = {
  create
}
