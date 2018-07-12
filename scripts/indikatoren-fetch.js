const p = require('barnard59')
const c = require('../lib/indikatoren-config')

const target = process.argv[2] || 'staging'

c.read({skipExpand: true}).then(config => {
  p.shell.mkdir('-p', 'tmp')
  p.shell.exec(`git clone --depth=1 ${config.fetch[target].repository} tmp/indikatoren-input-data`)
})
