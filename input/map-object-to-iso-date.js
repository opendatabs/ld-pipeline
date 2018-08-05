const moment = require('moment')
const p = require('barnard59')

const ddmmyyyyhhmmRegExp = new RegExp('\\d{2}[.]\\d{2}[.]\\d{4} \\d{2}:\\d{2}')
const ddmmyyyyhhmmssRegExp = new RegExp('\\d{2}[.]\\d{2}[.]\\d{4} \\d{2}:\\d{2}:\\d{2}')

function mapObjectToIsoDate (quad) {
  if (quad.object.termType !== 'Literal') {
    return quad
  }

  if (quad.object.datatype.value !== 'http://www.w3.org/2001/XMLSchema#dateTime') {
    return quad
  }

  let object = quad.object

  if (ddmmyyyyhhmmRegExp.test(quad.object.value)) {
    const date = moment(quad.object.value, 'DD.MM.YYYY HH:mm').toISOString()

    object = p.rdf.literal(date, quad.object.datatype)
  }

  if (ddmmyyyyhhmmssRegExp.test(quad.object.value)) {
    const date = moment(quad.object.value, 'DD.MM.YYYY HH:mm:ss').toISOString()

    object = p.rdf.literal(date, quad.object.datatype)
  }

  return p.rdf.quad(quad.subject, quad.predicate, object, quad.graph)
}

module.exports = mapObjectToIsoDate
