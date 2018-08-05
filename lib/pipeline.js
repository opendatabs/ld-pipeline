const bashCmd = require('./bash-cmd')
const combineStreams = require('./combine-streams')
const evalTemplateString = require('./eval-template-string')
const file = require('./file')
const filename = require('./filename')
const ftp = require('./ftp')
const json = require('./json')
const jsonData = require('./json-data')
const nullStream = require('./null')
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

function subPipeline (name) {
  const task = Object.assign({}, this.global.tasks[name], {global: this.global})

  return pipeline(task.steps, task)
}

function subPipelineForEach (name, property) {
  return p.map(obj => {
    const parentArgs = {}

    parentArgs[property] = obj

    const task = Object.assign({}, this.global.tasks[name], {global: this.global}, parentArgs)

    return pipeline(task.steps, task).then(stream => p.run(stream)).then(() => `${parentArgs[property]}\n`)
  })
}

/**
 * Map of available operations in the pipeline
 */
const operations = {
  'bash.cmd': bashCmd,
  'bash.run': runBash,
  'custom.jsonData': jsonData,
  'csvw.parse': parseCsvw,
  'file.read': p.file.read,
  'file.write': file.write,
  'filter': (name) => p.filter(customRequire(name)),
  'flatten': p.flatten,
  'ftp.list': ftp.list,
  'ftp.read': ftp.read,
  'ftp.rename': ftp.rename,
  'geojson.parse': parseGeoJson,
  'json.stringify': json.stringify,
  'map': (name) => p.map(customRequire(name)),
  'ntriples.serialize': p.ntriples.serialize,
  'null': nullStream,
  'pipeline.run': subPipeline,
  'pipeline.forEach': subPipelineForEach,
  'stdout': () => process.stdout,
  'turtle.parse': p.ntriples.parse
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
      const str = evalTemplateString(arg, {require: customRequire}, context)

      try {
        return JSON.parse(str)
      } catch (e) {
        return str
      }
    })

    return Promise.resolve().then(() => {
      return operation.apply(context, args)
    })
  })).then(streams => {
    return combineStreams(streams)
  })
}

module.exports = pipeline
