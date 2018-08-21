const c = require('../lib/indikatoren-config')
const createCsvMetadata = require('../lib/csv-metadata').create
const filename = require('../lib/filename')
const fs = require('fs')
const p = require('barnard59')

c.read().then(config => {
  p.shell.mkdir('-p', 'tmp/indikatoren-input-metadata')

  Object.keys(config.tasks).forEach(key => {
    const task = config.tasks[key]

    // ignore abstract tasks
    if (task.abstract) {
      return
    }

    // ignore tasks which don't point to a JSON description
    if (!task['json-data']) {
      return
    }

    // JSON description file
    const json = JSON.parse(fs.readFileSync(task['json-data']).toString())

    // read delimiter from JSON description file
    const delimiter = json.delimiter

    // read table schema from JSON description file
    const tableSchema = json.tableSchema

    // generate the CSVW Metadata object with the given base IRIs
    const metadata = createCsvMetadata(task.input,
      'https://ld.data-bs.ch/dataset/',
      'https://ld.data-bs.ch/property/', {
        delimiter,
        tableSchema
      })

    // resolve the absolute path and store the CSVW Metadata object
    fs.writeFileSync(filename(task['csv-metadata']), JSON.stringify(metadata, null, '  '))
  })
})
