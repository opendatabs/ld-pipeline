# statabs-data

Data pipeline to convert tsv files from the Statistisches Amt Basel-Stadt to N-Triples files.
The SPARQL interface to access the data can be found at [http://ld.data-bs.ch/sparql/](http://ld.data-bs.ch/sparql/).

## Usage

All scripts are configured as `npm` scripts and can be run like:

```
npm run $script
```

The `config.json` files contains details about the pipeline steps, file patterns, URL patterns etc.

## Fetch and Convert

### fetch

The `fetch` script clones the [StataBS/indikatoren](https://github.com/StataBS/indikatoren) repository, which contains all the tsv files and metadata.
The local copy is stored in the `tmp` folder.

### generate-csv-metadata

The `generate-csv-metadata` script generates CSVW Metadata files based JSON files from StataBS/indikatoren repository.
If the `publishLod` flag in the file with the pattern `metadata/single/*.json` is true, the CSVW Metadata will be generated.
The CSVW Metadata files are stored in the `tmp` folder.

### convert

The `convert` script runs all steps for all tasks.
Abstract tasks will be ignored.

**The `publishLod` flag is used to created dynamic tasks!**
