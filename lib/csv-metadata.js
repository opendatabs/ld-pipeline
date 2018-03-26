const fs = require('fs')
const path = require('path')
const slug = require('slug')

/**
 * Creates a CSVW Metadata JSON-LD object based on the given tsv file
 * @param filename File name of the tsv file
 * @param aboutBaseIRI Base IRI for the subject URL
 * @param propertyBaseIRI Base IRI for the predicate URLs
 * @returns object CSVW Metadata JSON-LD object
 */
function create (filename, aboutBaseIRI, propertyBaseIRI, options) {
  options = options || {}

  const columns = options.columns || {}

  // the base name will be used as key for the dataset
  const basename = path.basename(filename, '.tsv')

  // reads the first line, splits it by \t and removes "
  const headers = fs.readFileSync(filename).toString().split('\n').shift().split('\t').map(t => t.split('"').join(''))

  return {
    '@context': 'http://www.w3.org/ns/csvw',
    dialect: {
      delimiter: '\t'
    },
    tableSchema: {
      // base name + first column name will be used as key for the observation
      aboutUrl: `${aboutBaseIRI}${basename}/{${headers[0]}}`,
      columns: headers.map(header => {
        // if there is a predefined mapping, use the mapping
        if (header in columns) {
          return columns[header]
        }

        return {
          titles: header,
          // process the column name with slug to get a nicer namespace for the predicate
          propertyUrl: `${propertyBaseIRI}${slug(header, {mode: 'rfc3986'})}`
        }
      }).concat([{
        // add the Observation type to each subject / row
        virtual: true,
        propertyUrl: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
        valueUrl: 'http://purl.org/linked-data/cube#Observation'
      }])
    }
  }
}

module.exports = {
  create
}
