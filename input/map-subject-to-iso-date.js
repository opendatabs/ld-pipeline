const moment = require('moment')
const p = require('barnard59')

const ddmmyyyyhhmmRegExp = new RegExp('\\d{2}[.]\\d{2}[.]\\d{4} \\d{2}:\\d{2}')
const ddmmyyyyhhmmssRegExp = new RegExp('\\d{2}[.]\\d{2}[.]\\d{4} \\d{2}:\\d{2}:\\d{2}')

function mapSubjectToIsoDate (quad) {
  if (quad.subject.termType !== 'NamedNode') {
    return quad
  }

  let subject = quad.subject

  const pathEnd = decodeURIComponent(subject.value).split('/').pop()

  if (ddmmyyyyhhmmRegExp.test(pathEnd)) {
    const pathStart = subject.value.split('/').slice(0, -1).join('/')
    const date = encodeURIComponent((moment(pathEnd, 'DD.MM.YYYY HH:mm')).toISOString().split(':').join(''))

    subject = p.rdf.namedNode(`${pathStart}/${date}`)
  }

  if (ddmmyyyyhhmmssRegExp.test(pathEnd)) {
    const pathStart = subject.value.split('/').slice(0, -1).join('/')
    const date = encodeURIComponent((moment(pathEnd, 'DD.MM.YYYY HH:mm:ss')).toISOString().split(':').join(''))

    subject = p.rdf.namedNode(`${pathStart}/${date}`)
  }

  return p.rdf.quad(subject, quad.predicate, quad.object, quad.graph)
}

module.exports = mapSubjectToIsoDate
