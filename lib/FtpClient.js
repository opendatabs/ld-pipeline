const Ftp = require('ftp')
const Promise = require('bluebird')

class FtpClient {
  constructor (options) {
    this.client = new Ftp()

    this.host = options.host
    this.port = options.port || 21
    this.user = options.user
    this.password = options.password
  }

  connect () {
    this.client.connect({
      host: this.host,
      port: this.port,
      user: this.user,
      password: this.password
    })

    return new Promise((resolve, reject) => {
      this.client.once('ready', resolve)
      this.client.once('error', reject)
    })
  }

  disconnect () {
    this.client.end()

    return new Promise(resolve => {
      this.client.once('close', resolve)
    })
  }

  list (path) {
    return Promise.promisify(this.client.list.bind(this.client))(path)
  }

  get (path) {
    return Promise.promisify(this.client.get.bind(this.client))(path)
  }

  rename (oldPath, newPath) {
    return Promise.promisify(this.client.rename.bind(this.client))(oldPath, newPath)
  }
}

module.exports = FtpClient
