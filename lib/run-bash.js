const duplexify = require('duplexify')
const {spawn} = require('child_process')

/**
 * Runs a shell command and wraps stdin and stdout to a duplex stream
 * @param command Shell command which should be executed
 * @returns Stream Duplex stream connected to stdin and stdout
 */
function runBash (command) {
  let stream

  const childProcess = spawn(command, {shell: true}, () => {
    stream.push(null)
  })

  stream = duplexify(childProcess.stdin, childProcess.stdout)

  return stream
}

module.exports = runBash
