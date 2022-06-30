import clownface from 'clownface'
import fetch from 'nodeify-fetch'
import rdf from 'rdf-ext'
import fromFile from 'rdf-utils-fs/fromFile.js'
import { Readable } from 'readable-stream'
import * as ns from './namespaces.js'

class GenerateOgdVoid extends Readable {
  constructor () {
    super({ objectMode: true })

    this.done = false
  }

  async _read () {
    if (this.done) {
      return
    }

    this.done = true

    const staticVoid = await this.readStaticVoid()
    const cubes = staticVoid.out(ns.dcterms.subject)

    for (const cube of cubes.toArray()) {

      const id = (cube.value.match(/[0-9]+$/) || [])[0]

      if (!id) {
        continue
      }

      for (const quad of await this.generate({ id })) {
        this.push(quad)
      }
    }

    this.push(null)
  }

  async readStaticVoid () {
    const term = ns.bs('.well-known/void')
    const quadStream = fromFile('./input/static/void-static.ttl')
    const dataset = await rdf.dataset().import(quadStream)

    return clownface({ dataset, term })
  }

  async fetchJson ({ id }) {
    const url = `https://data.bs.ch/api/datasets/1.0/${id}/`
    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(await res.text())
    }

    return res.json()
  }

  createDataset ({ json }) {
    const id = json.datasetid
    const term = ns.bs(`cube/${id}`)
    const ptr = clownface({ dataset: rdf.dataset(), term })

    ptr
      .addOut(ns.rdf.type, ns.void.Dataset)
      .addOut(ns.dcterms.title, json.metas.title)
      .addOut(ns.dcterms.publisher, ns.bs('org/fachstelle-ogd'))
      .addOut(ns.dcterms.creator, json.metas.dcat.creator)
      .addOut(ns.dcterms.contributor, ns.bs('org/zazuko'))
      .addOut(ns.dcterms.created, rdf.literal(json.metas.dcat.created, ns.xsd.date))
      .addOut(ns.dcterms.modified, rdf.literal(json.metas.modified, ns.xsd.date))

    for (const keyword of json.metas.keyword) {
      ptr.addOut(ns.dcterms.subject, keyword)
    }

    return ptr.dataset
  }

  async generate ({ id }) {
    return this.createDataset({ json: await this.fetchJson({ id }) })
  }
}

function factory () {
  return new GenerateOgdVoid()
}

export default factory
