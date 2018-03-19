const p = require('barnard59')
const config = require('../lib/config').read()

p.shell.mkdir('-p', 'tmp')

Object.keys(config.tasks).forEach(key => {
  const task = config.tasks[key]

  // ignore tasks without URL
  if (!task.url) {
    return
  }

  // fetch the URLs using curl and store the result in the file defined in task.input
  p.shell.exec(`curl -o "${task.input}" "${task.url}"`)
})
