const c = require('../lib/rhein-ues-weil-config')
const p = require('barnard59')
const pipeline = require('../lib/pipeline')

if (process.argv.length < 4) {
  console.error('not enough parameters')
  process.exit(1)
}

c.read().then(config => {
  p.shell.mkdir('-p', 'target/rhein-ues-weil/')

  const taskName = process.argv[2]

  config.target = process.argv[3] || 'staging'

  if (process.env.FTP_USER) {
    config['ftp-server'][config.target].user = process.env.FTP_USER
  }

  if (process.env.FTP_PASSWORD) {
    config['ftp-server'][config.target].password = process.env.FTP_PASSWORD
  }

  if (process.env.SPARQL_USER) {
    config.upload[config.target].user = process.env.SPARQL_USER
  }

  if (process.env.SPARQL_PASSWORD) {
    config.upload[config.target].password = process.env.SPARQL_PASSWORD
  }

  return p.run(() => {
    const task = config.tasks[taskName]

    // set global context for sub-pipelines
    task.global = config

    console.log(`processing task ${taskName}`)

    // build the pipeline...
    return pipeline(task.steps, task).then(stream => {
      // ...and run it
      return p.run(stream)
    })
  })
}).then(() => {
  console.log('done')
}).catch((err) => {
  console.error(err.stack)
})
