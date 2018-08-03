const Transform = require('stream').Transform

function stringify () {
  const stream = new Transform({
    writableObjectMode: true,
    transform: (chunk, encoding, callback) => {
      stream.push(`${JSON.stringify(chunk)}\n`)

      callback()
    }
  })

  return stream
}

module.exports = {
  stringify
}
