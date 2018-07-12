const fs = require('fs')
const p = require('barnard59')

function readJsonFile (filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, content) => {
      if (err) {
        reject(err)
      } else {
        resolve(JSON.parse(content.toString()))
      }
    })
  })
}

function expandConfig (config) {
  return p.glob('tmp/indikatoren-input-data/metadata/single/*.json').then(filenames => {
    return Promise.all(filenames.map(filename => readJsonFile(filename)))
  }).then(jsons => {
    return jsons.filter(json => json.publishLod).map(json => json.id)
  }).then(keys => {
    keys.forEach(key => {
      const task = {}

      task.input = `tmp/indikatoren-input-data/data/${key}.tsv`
      task['csv-metadata'] = `tmp/indikatoren-input-metadata/${key}.csv-metadata.json`
      task['json-data'] = `tmp/indikatoren-input-data/metadata/single/${key}.json`
      task.output = `target/${key}.nt`
      task.steps = 'indikatoren'

      config.tasks[key] = task
    })

    return config
  })
}

module.exports = expandConfig
