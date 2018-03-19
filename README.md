# statabs-data

Data pipeline to convert tsv files from the Statistisches Amt Basel-Stadt to N-Triples files.

## Usage

All scripts are configured as `npm` scripts and can be run like:

```
npm run $script
```

The `config.json` files contains the details about the conversion tasks like file URLs, local file names, CSVW Metadata and pipeline steps.

## Fetch and Convert

### fetch

The `fetch` script uses `curl` to fetch all tsv files defined in the config and stores them in the `tmp` folder.
Existing local files will be overwritten.

Config properties:

- `tasks.*.url`: URLs where the files will be fetched from
- `tasks.*.input`: Local file name where the files will be stored

### convert

The `convert` script runs all steps for all tasks.
Existing output files will be overwritten.

Config properties:
 
- `tasks.*.steps`: Details of all steps of the pipeline
- `tasks.*.input`: Local file name of the tsv files
- `tasks.*.csv-metadata`: Metadata for the CSVW parser
- `tasks.*.output`: Local output file name of the N-Triples files

## Developer Tools

The developer tools help to simplify the implementation process of new pipelines.
The tools are also configured as `npm` scripts.

### generate-config

The `generate-config` script adds missing properties of tasks and fills them with default values.
The default values are based on the task name which should be the number of the tsv file.
It should generate enough to get the fetch and convert scripts running.  
Additional manual changes could be required to filter triples or map triple values.

### generate-csv-metadata

The `generate-csv-metadata` script generates a default CSVW Metadata file based on the headers of the tsv file.
The first column is used as key for the subject URL.
All other columns are defined as Literal values.
Manual changes are usually required.
For example date columns should have proper datatype.

