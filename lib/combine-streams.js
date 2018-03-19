const duplexify = require('duplexify')
const PassThrough = require('stream').PassThrough

/**
 * Combines multiple duplex streams with .pipe into a single duplex stream
 * @param streams The streams which should be combined
 * @param options Options for the new duplex stream like objectMode
 * @returns Duplex The combined Duplex stream
 */
function combineStreams (streams, options) {
  if (streams.length === 0) {
    return new PassThrough(options)
  }

  if (streams.length === 1) {
    return streams[0]
  }

  const next = (streams) => {
    if (streams.length < 2) {
      return
    }

    streams[0].pipe(streams[1])

    next(streams.slice(1))
  }

  next(streams)

  return duplexify(streams[streams.length - 1], streams[0])
}

module.exports = combineStreams
