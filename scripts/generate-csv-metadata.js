const config = require('../lib/config').read()
const createCsvMetadata = require('../lib/csv-metadata').create
const filename = require('../lib/filename')
const fs = require('fs')
const p = require('barnard59')

p.shell.mkdir('-p', 'input/')

Object.keys(config.tasks).forEach(key => {
  const task = config.tasks[key]

  // only create new CSVW Metadata files
  if (p.shell.test('-f', filename(task['csv-metadata']))) {
    return
  }

  // the input file is required to generate the CSVW Metadata file
  if (!p.shell.test('-f', task.input)) {
    return console.error(`file ${task.input} does not exist`)
  }

  console.log(`generate csv-metadata for ${key}`)

  // generate the CSVW Metadata object with the given base IRIs
  const metadata = createCsvMetadata(task.input,
    'http://ld.statistik.bs.ch/dataset/',
    'http://ld.statistik.bs.ch/property/', {
      columns: config.columns
    })

  // resolve the absolute path and store the CSVW Metadata object
  fs.writeFileSync(filename(task['csv-metadata']), JSON.stringify(metadata, null, '  '))
})
