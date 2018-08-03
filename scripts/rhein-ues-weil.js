const c = require('../lib/rhein-ues-weil-config')
const p = require('barnard59')
const pipeline = require('../lib/pipeline')

c.read().then(config => {
  p.shell.mkdir('-p', 'target/rhein-ues-weil/')

  config.target = process.argv.slice().pop() || 'staging'

  if (process.env.FTP_USER) {
    config['ftp-server'][config.target].user = process.env.FTP_USER
  }

  if (process.env.FTP_PASSWORD) {
    config['ftp-server'][config.target].password = process.env.FTP_PASSWORD
  }

  return p.run(() => {
    const task = config.tasks['rhein-ues-weil']

    // set global context for sub-pipelines
    task.global = config

    console.log('processing task rhein-ues-weil')

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
