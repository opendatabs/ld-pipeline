const c = require('../lib/config')
const fs = require('fs')
const p = require('barnard59')
// const upload = require('../lib/upload')

const target = process.argv[2] || 'test'

c.read().then(config => {
  const input = p.concat(Object.keys(config.tasks).filter(key => config.tasks[key].output).map(key => {
    const task = config.tasks[key]

    return () => {
      return fs.createReadStream(task.output)
    }
  }))

  // TODO: not working, curl says: "Signaling end of chunked upload via terminating chunk."
  /*
  const output = upload(config.upload[target].graphStoreEndpoint, config.upload[target].namedGraph, {
    authentication: {
      user: process.env.SPARQL_USER,
      password: process.env.SPARQL_PASSWORD
    }
  })
  */

  const output = fs.createWriteStream('tmp/output.nt')

  input.pipe(output)
})
