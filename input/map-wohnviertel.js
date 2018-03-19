const p = require('barnard59')
const slug = require('slug')

function mapString (value) {
  return slug(value, {mode: 'rfc3986'})
}

function mapWohnviertel (quad) {
  let subject = quad.subject
  let object = quad.object

  if (subject.value.startsWith('http://ld.statistik.bs.ch/observation/')) {
    // last part after / of the subject IRI
    const term = decodeURIComponent(quad.subject.value.split('/').pop())

    // subject base IRI
    const base = quad.subject.value.split('/').slice(0, -1).join('/')

    // map last part of subject with mapString
    subject = p.rdf.namedNode(base + '/' + mapString(term))
  }

  if (object.value === 'http://ld.statistik.bs.ch/property/wohnviertel') {
    object = p.rdf.namedNode('http://ld.statistik.bs.ch/code/wohnviertel/' + mapString(quad.object.value))
  }

  return p.rdf.quad(subject, quad.predicate, object)
}

module.exports = mapWohnviertel
