import rdf from 'rdf-ext'
import stream from 'readable-stream'

const { Transform } = stream

class UniqueQuads extends Transform {
  constructor () {
    super({ objectMode: true })

    this.dataset = rdf.dataset()
  }

  _transform (quad, encoding, callback) {
    this.dataset.add(quad)

    callback()
  }

  _flush (callback) {
    for (const quad of this.dataset) {
      this.push(quad)
    }

    callback()
  }
}

function factory () {
  return new UniqueQuads()
}

export default factory
