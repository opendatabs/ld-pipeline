const spawn = require('child_process').spawn

/**
 * Uses curl to upload a stream to a SPARQL endpoint using the Graph Store HTTP Protocol
 * @param endpoint
 * @param graph
 * @param options
 */
function upload (endpoint, graph, options) {
  options = options || {}
  options.method = options.method || 'PUT'
  options.mediaType = options.mediaType || 'application/n-triples'

  const args = [
    '-v',
    '--request', options.method,
    '--header', `content-type:${options.mediaType}`,
    '--upload-file', '-',
    '--get', endpoint,
    '--data-urlencode', `graph=${graph}`
  ]

  if (options.authentication) {
    args.unshift(`${options.authentication.user}:${options.authentication.password}`)
    args.unshift('--user')
  }

  const curl = spawn('curl', args)

  curl.stdout.pipe(process.stdout)
  curl.stderr.pipe(process.stderr)

  return curl.stdin
}

module.exports = upload
