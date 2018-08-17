const fs = require('fs')
const Transform = require('stream').Transform

function write (filename, options) {
  const fsStream = fs.createWriteStream(filename, options)

  return new Transform({
    flush: callback => {
      fsStream.end(callback)
    },

    transform: (chunk, encoding, callback) => {
      fsStream.write(chunk, encoding)

      callback()
    }
  })
}

module.exports = {
  write
}
