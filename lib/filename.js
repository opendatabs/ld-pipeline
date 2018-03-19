const path = require('path')

/**
 * Creates an absolute path for a relative path to the package root
 * @param filepath The relative path
 * @returns string The absolute path
 */
function filename (filepath) {
  return path.join(__dirname, '..', filepath)
}

module.exports = filename
