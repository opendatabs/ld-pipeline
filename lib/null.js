const Writable = require('stream').Writable

class Null extends Writable {
  constructor () {
    super({objectMode: true})
  }

  _write (chunk, encoding, callback) {
    callback()
  }

  static create () {
    return new Null()
  }
}

module.exports = Null.create
