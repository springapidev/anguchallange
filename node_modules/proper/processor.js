/**
 * Property graph processing engine
 *
 * To use this processor engine, load the module, and call the `run()` function
 * with the appropriate configuration setting like the following sample shows:
 *    var engine = require('proper');
 *    engine.run( getConfiguration() );
 *    
 */
(function() {
    var verbose = false;
    var engine = this;
    var fs = require('fs');
    var jsyaml = require('js-yaml');
    var mmconv = require(__dirname + '/mmconv.js');
    var mmToLatex = require(__dirname + '/mmToLatex.js');

    /**
     * Generic reader plugin for yaml format PGL files.
     * @param  {string} graphFileName The full pathname of the input file
     * @return {Object}               The content of the input file, that is a graph representation
     */
    this.pglYamlReader = function( context ) {
        var graphFileName = context.fileName;
        // Load the YAML parser module

        // Load the 'should' module for validation
        require( 'should' );

        // Load the YAML format graph file
        var graphFile = require( graphFileName );

        // TODO: Do validation
        // graphFile.should.be.a( 'object' );

        // TODO: Merge graphFile data with this.graph
        for ( var property in graphFile ) {
            if ( graphFile.hasOwnProperty(property) ) {
                this.graph[property] = graphFile[property];
            }
        }

        verbose && console.log(JSON.stringify(this, null, "    "));
        return this;
    };

    this.oladoTemplateWriter = function( context ) {
        var graphFile = this.graph;
        var template = fs.readFileSync(context.templateFile,'utf-8');
        var doT = require('dot');
        doT.templateSettings.strip = false;
        console.log( doT.template(template)(graphFile) );
        fs.writeFileSync( context.fileName, doT.template(template)(graphFile) );

        return graphFile;
    }

    /**
     * Generic writer plugin for dot format graphs
     * @param  {[type]} graphFile The graph representation with its `_config`
     * @return {[type]}           The original graph representation (`graphFile`)
     */
    this.pglDotWriter = function( context ) {
        var graphFile = this.graph;
        var config = graphFile['_config'];
        var graph = graphFile;

        var template = fs.readFileSync(__dirname + '/templates/graphviz.dot','utf-8');
        var doT = require('dot');
        doT.templateSettings.strip = false;

        var digraph = {
            title: config._title,
            nodes: [],
            edges: []
        };

        for ( var node in graph ) {
            if ( graph.hasOwnProperty(node) && node[0] !== '_' ) {
                var domain = graph[node]['_domain'] || 'default';
                var graphConfig = config['_domains'][domain] || config['_domains']['_default'];

                var dnode = {
                    name: node,
                    shape: graphConfig['_shape'],
                    color: graphConfig['_color'],
                    label: graph[node]['_label'] || node || '',
                    properties: []
                };

                if ( graph[node]['_properties'] ) {
                    graph[node]['_properties'].forEach(function(property) {
                        dnode.properties.push(property);
                    });
                }

                digraph.nodes.push(dnode);

                var relations = graph[node]['_relations'];
                if ( relations ) {
                    for ( var relation in relations ) {
                        if ( relations.hasOwnProperty(relation) ) {

                            var edge = {
                                type: relations[relation].type || 'default',
                                from: node,
                                to: relations[relation]['_target'],
                                tailLabel: relations[relation]['_tail'] || '',
                                headLabel: relations[relation]['_head'] || '',
                                relLabel: relations[relation]['_label'] || relation || ''
                            };

                            if ( relations[relation]['_properties'] ) {
                                relations[relation]['_properties'].forEach(function(property) {
                                    edge.properties.push(property);
                                });
                            }

                            digraph.edges.push(edge);
                        }
                    }
                }
            }
        }

        // console.log( doT.template(template)(digraph) );
        fs.writeFileSync( context.fileName, doT.template(template)(digraph) );

        return graphFile;
    };

    /**
     * Generic writer plugin for markdown format outputs
     * @param  {[type]} graphFile The graph representation with its `_config`
     * @return {[type]}           The original graph representation (`graphFile`)
     */
    this.pglMdWriter = function( context ) {
        var graphFile = this.graph;
        var config = graphFile['_config'];
        var graph = graphFile;

        var template = fs.readFileSync(__dirname + '/templates/markdown.md','utf-8');
        var doT = require('dot');
        doT.templateSettings.strip = false;

        var digraph = {
            title: config._title,
            nodes: [],
            edges: []
        };

        for ( var node in graph ) {
            if ( graph.hasOwnProperty(node) && node[0] !== '_' ) {
                var domain = graph[node]['_domain'] || 'default';
                var graphConfig = config['_domains'][domain] || config['_domains']['_default'];

                var dnode = {
                    name: node,
                    description: graph[node]['_description'] || ' ',
                    domain: graph[node]['_domain'] || 'default',
                    label: graph[node]['_label'] || node || '',
                    properties: []
                };

                if ( graph[node]['_properties'] ) {
                    graph[node]['_properties'].forEach(function(property) {
                        dnode.properties.push(property);
                    });
                }

                digraph.nodes.push(dnode);

                var relations = graph[node]['_relations'];
                if ( relations ) {
                    for ( var relation in relations ) {
                        if ( relations.hasOwnProperty(relation) ) {

                            var edge = {
                                type: relations[relation].type || 'default',
                                from: node,
                                to: relations[relation]['_target'],
                                tailLabel: relations[relation]['_tail'] || '',
                                headLabel: relations[relation]['_head'] || '',
                                relLabel: relations[relation]['_label'] || relation || ''
                            };

                            if ( relations[relation]['_properties'] ) {
                                relations[relation]['_properties'].forEach(function(property) {
                                    edge.properties.push(property);
                                });
                            }

                            digraph.edges.push(edge);
                        }
                    }
                }
            }
        }

        // console.log( doT.template(template)(digraph) );
        fs.writeFileSync( context.fileName, doT.template(template)(digraph) );

        return graphFile;
    };

    this.freemindReader = function (context) {

        var graphFileName = context.fileName;
        // Load the YAML parser module

        // Load the 'should' module for validation
        require( 'should' );

        // Load the freemind format graph file
        var graphFile = mmconv.mmToJson( graphFileName, false );

        // TODO: Do validation
        // graphFile.should.be.a( 'object' );

        // TODO: Merge graphFile data with this.graph
        for ( var property in graphFile ) {
            if ( graphFile.hasOwnProperty(property) ) {
                this.graph[property] = graphFile[property];
            }
        }

        verbose && console.log(JSON.stringify(this, null, "    "));
        return this;
    };

    this.latexWriter = function (context) {
        return mmToLatex.latexWriter(this.graph.map, context.fileName);
    };

    /**
     * Definition of processors to select one, based om `fileType`
     * @type {Object}
     */
    var processors = {
        'preprocessor' : {
            '/application/yaml' : this.pglYamlReader,
            '/application/pgl-yaml' : this.pglYamlReader,
            '/application/freemind' : this.freemindReader
        },
        'processor' : {
        },
        'postprocessor' : {
            '/application/olado-dot' : this.oladoTemplateWriter,
            '/application/pgl-dot' : this.pglDotWriter,
            '/application/pgl-markdown' : this.pglMdWriter,
            '/application/x-latex' : this.latexWriter
        }
    };

    /**
     * Runs a set of processors using their configurations
     * @param  {Array} processingQueue  The processor set with their configuration data
     * @return {Object}                 The result graph of processing
     */
    var runProcessors = function(processingQueue, phase) {
        var that = this;

        verbose && console.log('phase is: ' + phase, processors);
        processingQueue.forEach(function(context) {
            var processor = processors[phase][context.fileType];

            verbose && console.log('runProcessor with ', that, context );
            context.graph = processor.apply(that, [context]);
        });
        return that;
    };

    /**
     * Run the property graph processor engine
     * @param  {Object} config The configuration settings for the engine
     */
    exports.run = function( config ) {
        runProcessors.apply(
            runProcessors.apply(
                runProcessors.apply( {
                        graph: {}
                    },
                    [config.preprocessors, 'preprocessor'] ), // Run preprocessors
                [config.processors, 'processor'] ),  // Run processors
            [config.postprocessors, 'postprocessor'] );  // Run postprocessors
    };

})();
