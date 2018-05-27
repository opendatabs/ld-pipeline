const p = require('barnard59')
const c = require('../lib/config')

const target = process.argv[2] || 'test'

c.read({skipExpand: true}).then(config => {
  p.shell.mkdir('-p', 'tmp')
  p.shell.exec(`git clone --depth=1 ${config.fetch[target].repository} tmp/input-data`)
})
