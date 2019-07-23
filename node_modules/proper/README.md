PROPER - Property graph manager utility
=======================================

## Introduction

This is a simple application to create and convert property graphs
which are represented in flat _yaml_ format.

The term _property graph_ denotes an attributed, multi-relational graph. That is, a graph where the edges are labeled and both vertices and edges can have any number of key/value properties associated with them.

The utility parses the graph, and creates an output in _dot_ format,
which can be executed via the graphviz utility. This way, you can visualize
your concepts, which are written in yaml as a DSL.

Fundamental concepts to model data:

- Use nodes to represent entities—that is,
  the things that are of interest to you in your domain.

- Use relationships to express the connections between 
  entities and establish semantic context for each entity, thereby structuring the domain.

- Use node properties to represent entity attributes, plus any necessary entity 
  meta‐data, such as timestamps, version numbers, etc.

- Use relationship properties to express the strength, 
  weight or quality of a relationship, plus any necessary relationship metadata,
  such as timestamps, version numbers, etc.

## Installation

### Install as an npm package

Execute the following command:

  npm install git+https://github.com/tombenke/proper.git

or

  npm install git+https://github.com/tombenke/proper.git#<tag>

if you want to install a specific version, for example `v0.1.0` would look like this:

  npm install git+https://github.com/tombenke/proper.git#v0.1.0

Use the `-g` switch to install to the global modules repository, if you want to use the command line utilities as well.


### install from source

Just simply clone the repository, and add the folder to the PATH.

The downloaded repository does not contain the packages required by the proper utility,
so the have to be installed via the _npm_ before the first run:

    $ cd <proper-install-dir>
    $ npm update

To use the utility, execute the ``proper.sh`` shell script
giving the graph file name as a parameter:

    $ proper.sh graph.yml

The command will outputs the results to the standard output in _dot_ format.

To get the final graphical results (for example in png format),
execute a command like the following:

    $ proper.sh concepts.yml > concepts.dot ; dot concepts.dot -Tpng > concepts.png

## Prerequisites

The graphviz utility has to be installed, in order to create graphics.

## TODO

- Markdown export
- GraphML conformity and exporter(/importer?)


## Converter utilities

Beside `proper.sh` there are some other small utilities, which converts files among
several formats, such as:

- .json (JSON)
- .mm (FreeMind mind-map xml file)
- .yml or .yaml (YAML)

Each command has one parameter, that is the name of the input file.
The results are written to the standard output:

    jsonToMm.sh sample.json > sample.mm
    mmToJson.sh sample.mm > sample.json
    ymlToJson.sh sample.yml > sample.json


## License

View the LICENSE file (MIT).

