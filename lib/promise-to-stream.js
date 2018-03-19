const duplexify = require('duplexify')

function promiseToStream (promise, options) {
  const stream = duplexify(null, null, options)

  Promise.resolve().then(() => {
    return promise()
  }).then(result => {
    if (result.readable) {
      stream.setReadable(result)
    }

    if (result.writable) {
      stream.setWritable(result)
    }
  }).catch(err => {
    stream.emit('error', err)
  })

  return stream
}

module.exports = promiseToStream
