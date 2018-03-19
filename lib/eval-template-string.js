/**
 * Dynamic ES6 template string evaluation
 * @param content The template string
 * @param params The parameters as key values in an object
 * @param context The this context for the evaluation
 * @returns string The result of the evaluation
 */
function evalTemplateString (content, params, context) {
  const keys = Object.keys(params || {})
  const values = keys.map(key => params[key])
  const template = Function(keys, 'return `' + content + '`') // eslint-disable-line no-new-func

  return template.apply(context, values)
}

module.exports = evalTemplateString
