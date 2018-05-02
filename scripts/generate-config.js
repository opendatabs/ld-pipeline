const config = require('../lib/config').read()
const writeConfig = require('../lib/config').write

Object.keys(config.tasks).forEach(key => {
  const task = config.tasks[key]

  if (!task.url) {
    console.log(`adding url to ${key}`)

    task.url = `https://raw.githubusercontent.com/StataBS/indikatoren/master/data/${key}.tsv`
  }

  if (!task.input) {
    console.log(`adding input to ${key}`)

    task.input = `tmp/${key}.tsv`
  }

  if (!task['csv-metadata']) {
    console.log(`adding csv-metadata ${key}`)

    task['csv-metadata'] = `input/${key}.csv-metadata.json`
  }

  if (!task.output) {
    console.log(`adding output to ${key}`)

    task.output = `target/${key}.nt`
  }

  if (!task.steps) {
    console.log(`adding steps to ${key}`)

    task.steps = [{
      operation: 'file.read',
      arguments: [
        '${this.input}' // eslint-disable-line no-template-curly-in-string
      ]
    }, {
      operation: 'csvw.parse',
      arguments: [
        '${this[\'csv-metadata\']}', // eslint-disable-line no-template-curly-in-string
        'file://${this.input.match(/[^/]*\\.tsv/)}' // eslint-disable-line no-template-curly-in-string
      ]
    }, {
      operation: 'filter',
      arguments: [
        './input/filter-not-undefined.js'
      ]
    }, {
      operation: 'ntriples.serialize'
    }, {
      operation: 'file.write',
      arguments: [
        '${this.output}' // eslint-disable-line no-template-curly-in-string
      ]
    }]
  }
})

// write the updated config
writeConfig(config)
