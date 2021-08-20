import namespace from '@rdfjs/namespace'

const bs = namespace('https://ld.bs.ch/')
const bscode = namespace('https://ld.bs.ch/code/')
const bsproperty = namespace('https://ld.bs.ch/property/')
const csvw = namespace('http://www.w3.org/ns/csvw#')
const cube = namespace('https://cube.link/')
const dcat = namespace('http://www.w3.org/ns/dcat#')
const geo = namespace('http://www.opengis.net/ont/geosparql#')
const municipality = namespace('https://ld.bs.ch/boundaries/municipality/')
const rdf = namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
const schema = namespace('http://schema.org/')
const voidns = namespace('http://rdfs.org/ns/void#')
const xsd = namespace('http://www.w3.org/2001/XMLSchema#')

export {
  bs,
  bscode,
  bsproperty,
  csvw,
  cube,
  dcat,
  geo,
  municipality,
  rdf,
  schema,
  xsd,
  voidns as void
}
