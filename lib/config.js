const fs = require('fs')
const path = require('path')

/**
 * Reads and parses the config file
 * @returns object The config
 */
function read () {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json')).toString())
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
