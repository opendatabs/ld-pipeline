const config = require('../lib/config').read()
const fs = require('fs')
const p = require('barnard59')
const upload = require('../lib/upload')

const input = p.concat(Object.keys(config.tasks).map(key => {
  const task = config.tasks[key]

  return () => {
    return fs.createReadStream(task.output)
  }
}))

const output = upload('https://test.lindas-data.ch:8443/lindas', 'https://linked.opendata.swiss/graph/bs/statistics', {
  authentication: {
    user: process.env.SPARQL_ENDPOINT_USER,
    password: process.env.SPARQL_ENDPOINT_PASSWORD
  }
})

input.pipe(output)
