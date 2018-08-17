const fetch = require('nodeify-fetch')
const Transform = require('stream').Transform
const SparqlHttpClient = require('sparql-http-client')

class AtEndTransform extends Transform {
  constructor (callback) {
    super()

    this.callback = callback
  }

  _flush (callback) {
    Promise.resolve().then(() => {
      return this.callback()
    }).then(() => callback()).catch(err => callback(err))
  }

  _transform (chunk, encoding, callback) {
    callback(null, chunk)
  }
}

function sparqlUpdate (query, options) {
  return new AtEndTransform(() => {
    const client = new SparqlHttpClient({
      fetch,
      endpointUrl: options.sparqlEndpointUrl,
      updateUrl: options.sparqlUpdateUrl
    })

    const headers = {}

    if (options.user) {
      headers.authorization = 'Basic ' + Buffer.from(`${options.user}:${options.password}`).toString('base64')
    }

    return client.updateQuery(query, {headers})
  })
}

module.exports = {
  sparqlUpdate
}
