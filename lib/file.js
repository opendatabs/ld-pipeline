const fs = require('fs')
const PassThrough = require('stream').PassThrough

function write (filename, options) {
  options = options || {}
  options.highWaterMark = options.highWaterMark || 1048576

  const stream = new PassThrough()

  stream.pipe(fs.createWriteStream(filename, options))

  return stream
}

module.exports = {
  write
}
