const fs = require('fs')
const path = require('path')

/**
 * Reads and parses the config file
 * @returns object The config
 */
function read () {
  return Promise.resolve(JSON.parse(fs.readFileSync(path.join(__dirname, '../rhein-ues-weil-config.json')).toString()))
}

module.exports = {
  read
}
