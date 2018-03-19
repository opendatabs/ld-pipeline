function filterNotUndefined (quad) {
  return typeof quad.object.value !== 'undefined'
}

module.exports = filterNotUndefined
