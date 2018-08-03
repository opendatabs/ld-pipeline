const c = require('../lib/rhein-ues-weil-config')
const p = require('barnard59')

c.read().then(config => {
  config.target = process.argv.slice().pop() || 'staging'

  p.shell.exec(`ENDPOINT=${config.upload[config.target].graphStoreEndpoint} USER=$SPARQL_USER:$SPARQL_PASSWORD GRAPH=${config.upload[config.target].namedGraph} INPUT=input/rhein-ues-weil.nt ./scripts/upload-append.sh`)
}).then(() => {
  console.log('done')
}).catch((err) => {
  console.error(err.stack)
})
