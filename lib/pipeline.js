const combineStreams = require('./combine-streams')
const evalTemplateString = require('./eval-template-string')
const filename = require('./filename')
const jsonData = require('./json-data')
const p = require('barnard59')
const parseCsvw = require('./parse-csvw')
const parseGeoJson = require('./parse-geojson')
const runBash = require('./run-bash')

/**
 * Wrapper for require for resolving paths relative to the package root
 * @param name The name of module to require
 * @returns {*} The export of the module
 */
function customRequire (name) {
  if (name.slice(0, 1) !== '.') {
    return require(name)
  } else {
    return require(filename(name))
  }
}

/**
 * Map of available operations in the pipeline
 */
const operations = {
  'bash.run': runBash,
  'custom.jsonData': jsonData,
  'csvw.parse': parseCsvw,
  'file.read': p.file.read,
  'file.write': p.file.write,
  'filter': (name) => p.filter(customRequire(name)),
  'flatten': p.flatten,
  'geojson.parse': parseGeoJson,
  'map': (name) => p.map(customRequire(name)),
  'ntriples.serialize': p.ntriples.serialize
}

/**
 * Combines all steps into a single pipeline Duplex stream
 * @param steps All step details (operations and parameters)
 * @param context The this context which will be used to evaluate the parameters and the operations
 * @returns {Promise.<Stream>} The pipeline Duplex stream
 */
function pipeline (steps, context) {
  return Promise.all(steps.map(step => {
    if (!(step.operation in operations)) {
      return Promise.reject(new Error(`unknown operation ${step.operation}`))
    }

    const operation = operations[step.operation]

    const args = (step.arguments || []).map(arg => {
      return evalTemplateString(arg, {require: customRequire}, context)
    })

    return Promise.resolve().then(() => {
      return operation.apply(context, args)
    })
  })).then(streams => {
    return combineStreams(streams)
  })
}

module.exports = pipeline
