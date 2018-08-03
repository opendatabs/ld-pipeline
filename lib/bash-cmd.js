const exec = require('child_process').exec
const Transform = require('stream').Transform

class BashCmdTransform extends Transform {
  constructor (command) {
    super()

    this.command = command
  }

  _flush (callback) {
    exec(this.command, callback)
  }

  _transform (chunk, encoding, callback) {
    callback(null, chunk)
  }

  static create (command) {
    return new BashCmdTransform(command)
  }
}

module.exports = BashCmdTransform.create
