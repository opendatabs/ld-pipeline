const path = require('path')
const FtpClient = require('./FtpClient')
const PassThrough = require('stream').PassThrough
const Readable = require('stream').Readable
const Transform = require('stream').Transform

function read (filename, options) {
  const client = new FtpClient(options)

  return client.connect().then(() => {
    return client.get(filename)
  }).then(stream => {
    stream.once('end', () => client.disconnect())
    stream.once('error', () => client.disconnect())

    const output = new PassThrough()

    stream.pipe(output)

    return output
  })
}

function list (pathname, options) {
  const client = new FtpClient(options)

  return client.connect().then(() => {
    return client.list(pathname)
  }).then(list => {
    return client.disconnect().then(() => {
      const stream = new Readable({
        objectMode: true,
        read: () => {
          list.filter(file => {
            return file.type === '-'
          }).map(file => {
            return path.join(pathname, file.name)
          }).forEach(filename => {
            stream.push(filename)
          })

          stream.push(null)
        }
      })

      return stream
    })
  })
}

function rename (oldFilename, newFilename, options) {
  return new Transform({
    flush: callback => {
      const client = new FtpClient(options)

      return client.connect().then(() => {
        return client.rename(oldFilename, newFilename)
      }).then(() => {
        return client.disconnect()
      }).then(callback).catch(callback)
    },

    transform: (chunk, encoding, callback) => {
      callback(null, chunk)
    }
  })
}

module.exports = {
  list,
  read,
  rename
}
