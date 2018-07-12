const c = require('../lib/indikatoren-config')
const p = require('barnard59')
const pipeline = require('../lib/pipeline')

c.read().then(config => {
  p.shell.mkdir('-p', 'target/')

  return p.run(() => {
    // run one task after another
    return p.Promise.serially(Object.keys(config.tasks), key => {
      const task = config.tasks[key]

      // ignore abstract tasks
      if (task.abstract) {
        return
      }

      let steps = task.steps

      // if steps is a string, load steps from another task with the given key
      if (typeof steps === 'string') {
        steps = config.tasks[steps].steps
      }

      // ignore tasks without steps
      if (!steps) {
        return
      }

      console.log(`processing task ${key}`)

      // build the pipeline...
      return pipeline(steps, task).then(stream => {
        // ...and run it
        return p.run(stream)
      })
    })
  })
}).then(() => {
  console.log('done')
}).catch((err) => {
  console.error(err.stack)
})
