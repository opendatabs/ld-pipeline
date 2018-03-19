const config = require('../lib/config').read()
const p = require('barnard59')
const pipeline = require('../lib/pipeline')

p.shell.mkdir('-p', 'target/')

p.run(() => {
  // run one task after another
  return p.Promise.serially(Object.keys(config.tasks), key => {
    const task = config.tasks[key]

    // ignore tasks without steps
    if (!task.steps) {
      return
    }

    console.log(`processing task ${key}`)

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
