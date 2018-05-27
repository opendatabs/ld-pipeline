const expandConfig = require('./expand-config')
const fs = require('fs')
const path = require('path')

/**
 * Reads and parses the config file
 * @returns object The config
 */
function read (options) {
  options = options || {}

  const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json')).toString())

  if (!options.skipExpand) {
    return expandConfig(config)
  } else {
    return Promise.resolve(config)
  }
}

/**
 * Updates the config file
 * @param config Updated version of the config
 */
function write (config) {
  fs.writeFileSync(path.join(__dirname, '../config.json'), JSON.stringify(config, null, '  '))
}

module.exports = {
  read,
  write
}
