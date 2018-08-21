# statabs-data

Data pipeline to convert tsv files from the Statistisches Amt Basel-Stadt to N-Triples files.
The SPARQL interface to access the data can be found at [https://ld.data-bs.ch/sparql/](https://ld.data-bs.ch/sparql/).

## Usage

All scripts are configured as `npm` scripts and can be run like:

```
npm run $script
```

The `*-config.json` files contain details about the pipeline steps, file patterns, URL patterns etc.

## Scripts

### indikatoren-fetch-production, indikatoren-fetch-staging

The `indikatoren-fetch-` script clones the [Indikatoren repository](#indikatoren) into the local folder `tmp/indikatoren-input-data`.
The actual repository URL is read from the [config](#config) from the property `fetch/$TARGET/repository`.

### indikatoren-generate-csv-metadata

The `indikatoren-generate-csv-metadata` script generates CSVW Metadata files based on [Indikatoren metadata](#indikatoren-metadata).
Based on the [publishLod](#publishLod) flag the CSVW Metadata file are generated.
The generated CSVW Metadata files are stored at `tmp/indikatoren-input-metadata`.

### indikatoren-convert

The `indikatoren-convert` script runs all steps defined in the [config](#config) with the property `task/*`.
Tasks with the `abstract` property and boolean true value are ignored.
Based on the [publishLod](#publishLod) flag tasks are added during runtime.
For details see the code in `lib/indikatoren-expand-config.js`.

### indikatoren-upload-production, indikatoren-upload-staging

These scripts combine all files from all task defined in the property `output` to a single file (`tmp/output.nt`).
Dynamic tasks based on the [publishLod](#publishLod) flag are also included.
The output file is uploaded using the Graph Store protocol to the endpoint defined in the property `upload/$TARGET/graphStoreEndpoint`.
The named graph is read from the property `upload/$TARGET/namedGraph`.
The environment variables `SPARQL_USER` and `SPARQL_PASSWORD` are used for authentication.

## Convert Tasks

All tasks are defined in the [config](#config) at `tasks/*`.
The `steps` property is reserved for an array of operation descriptions, which defines the logic of the pipeline task.
Other properties can be defined to use them as variables in the operations arguments.
If the value of the `steps` property is a string, the value is used to import the steps from the task with the key equals the `steps` value.

### Operations

The operation for each step of each task is defined in the [config](#config) at `tasks/*/steps/*/operation`.
Arguments for the operations can be given in `tasks/*/steps/*/arguments`.
The argument values are evaluated as ES6 template strings.
The task (`tasks/*`) is used as `this` context for the evaluation.
Template strings can be used to defined reusable tasks.
For example properties like `input` and `output`, defined for the task, can be used as argument to read or write a file like this: `${this.input}`
Each operation returns a stream.
All streams are combined with `.pipe`.

Not all operations are covered in this documentation as most of them have already self describing operation names.

#### geojson.parse

Generates a triple with a [WKT literal](http://www.opengis.net/ont/geosparql#wktLiteral) for each feature in the given GeoJSON.

Two arguments are required:

- The IRI of the subject
- The IRI of the predicate

Both arguments are evaluated as ES6 template strings.

#### custom.jsonData

Generates metadata triples for the dataset based on the [Indikatoren metadata](#indikatoren-metadata).

Two arguments are required:

- The filename of the JSON file
- The IRI of the dataset

### CSVW Metadata

The CSVW metadata files are generated based on the [Indikatoren Metadata JSON files](#indikatoren-metadata) and some static values.
From the JSON file, the value of `delimiter` property is copied to the CSVW metadata `dialect/delimiter` property.
If the property is not defined, `\t` is used.
The `tableSchema` property from the JSON file is merged together with static values into the `tableSchema` property of the CSVW metadata.
The static values are:

- A virtual column for the type `Observation`
- A virtual column for the `dataSet` link from the observation to the dataset

It should be kept in mind that the URL properties in the CSVW metadata files are processed as [URI Templates](https://tools.ietf.org/html/rfc6570).
The syntax is different to ES6 template strings.

The following properties are required in the `tableSchema`:

#### aboutUrl

The `aboutUrl` is used as subject for the observation triples.
Therefore it should have a pattern like this: `https://ld.data-bs.ch/dataset/$DATASET_NUMBER/observation/{$CSV_KEY_COLUMN_1}-{$CSV_KEY_COLUMN_N}`
The `$CSV_KEY_COLUMN_*` is the name of the column in the CSV file.
All columns of the primary key must be included.
Static values for the key are possible.
See existing datasets for more details.

#### columns

The value of the `columns` property is an array of triples descriptions.
Each object is mapped into a triple with the `aboutUrl` as subject.
The `propertyUrl` property is used for the predicate.
The value of the `titles` property is used to identify the column, which is used as value for the triple.
If the value for the column defined in `titles` is empty for a row, the triple description will be ignored.
The `virtual` property can be set to `true` to force the triple description.
This can be used for static values.
Static values require a `valueUrl`, which is used to generate a Named Node object.
For Literal objects, the property `datatype` can be defined to use a specific datatype.

## Terminology

### Config

The configuration is read from the file `*-config.json`.
The Indikatoren config is dynamically extended based on the [publishLod](#publishLod) flag.

### Indikatoren

The Indikatoren repository contains all the input data and metadata as TSV or JSON files.

### Indikatoren Metadata

The [Indikatoren repository](#indikatoren) contains metadata for each dataset at (`metadata/single/*.json`).

### publishLod

The property `publishLod` in the [Indikatoren Metadata files](#indikatoren-metadata) controls whether the dataset will be processed in the pipeline or ignored.
JavaScript boolean logic is used to evalutate the property value.
