const c = require('../lib/indikatoren-config')
const fs = require('fs')
const p = require('barnard59')
const path = require('path')
// const upload = require('../lib/upload')

const target = process.argv[2] || 'staging'

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

  const output = fs.createWriteStream('tmp/indikatoren-output.nt')

  return p.run(input.pipe(output)).then(() => {
    const configTarget = config.upload[target]

    p.shell.exec(`ENDPOINT=${configTarget.graphStoreEndpoint} USER=$SPARQL_USER:$SPARQL_PASSWORD GRAPH=${configTarget.namedGraph} INPUT=tmp/indikatoren-output.nt ${path.join(__dirname, 'upload.sh')}`)
  })
})
