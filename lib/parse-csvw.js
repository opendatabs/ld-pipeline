const p = require('barnard59')

/**
 * Combines the JSON-LD parser for the CSVW Metadata and the CSVW parser
 * @param metadata The file name of the CSVW Metadata JSON-LD file
 * @param baseIRI The base IRI of the CSVW file
 * @returns Stream The Quad stream from the CSVW parser
 */
function parseCsvw (metadata, baseIRI) {
  return p.rdf.dataset().import(p.file.read(metadata).pipe(p.jsonld.parse())).then((dataset) => {
    return p.csvw.parse({
      baseIRI: baseIRI,
      metadata: dataset
    })
  })
}

module.exports = parseCsvw
