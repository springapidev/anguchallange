/**
 * Property graph manager utility:
 */
(function() {
    var verbose = false;

    var pathSep = require('path').sep;
    var inFileName = process.cwd() + pathSep;

    if( process.argv.length < 3 ) {
        console.log('ERROR: Too few arguments!');
        process.exit();
    } else {
        if( process.argv[2][0] === pathSep ) {
            inFileName = process.argv[2];
        } else {
            inFileName += process.argv[2];
        }
    }

    verbose && console.log( 'input file: ', inFileName );

    var loadGraph = function( graphFileName ) {
        // Load the YAML parser module
        var jsyaml = require( 'js-yaml' );

        // Load the should module for validation
        require( 'should' );

        // Load the YAML format config file
        var graphFile = require( graphFileName );
        // var graphFile = jsyaml.load( "app: application" );

        // graphFile.should.be.a( 'object' );

        verbose && console.log(JSON.stringify(graphFile, null, "    "));
        return graphFile;
    };

    var processGraph = function( graphFile ) {
        var config = graphFile['_config'];
        // var graph = graphFile['_graph'];
        var graph = graphFile;

        console.log('digraph g {');
        console.log('graph [label="' + config['_title'] + '" splines=true overlap=false rankdir = "TB"];');
        console.log('ratio = auto;');

        for( var node in graph ) {
            if( graph.hasOwnProperty(node) && node[0] !== '_' ) {
                var domain = graph[node]['_domain'] || 'default';
                var graphConfig = config['_domains'][domain] || config['_domains']['_default'];
                var nodeLabel = graph[node]['_label'] || node || '';

                verbose && console.log(type, graphConfig);

                var dotText = '"' + node + '" [' +
                    'shape="' + graphConfig['_shape'] + '", ' +
                    'style=filled, fillcolor="' + graphConfig['_color'] + '" ';
                dotText += 'label=<<table border=\"0\" cellborder=\"0\"><tr><td align=\"center\"><font point-size=\"10\" color=\"#000000\"><b>' + nodeLabel + '</b></font></td></tr>';
                dotText += '<tr><td align=\"center\"><font point-size=\"8\" color=\"#00008a\">';
                if( graph[node]['_properties'] ) {
                    graph[node]['_properties'].forEach(function(property) {
                        dotText += property + '<br/>';
                    });
                } else {
                    dotText += " ";
                }
                dotText += '</font></td></tr>';
                dotText += '</table>> ];';
                console.log(dotText);

                var relations = graph[node]['_relations'];
                if( relations ) {
                    for( var relation in relations ) {
                        if( relations.hasOwnProperty(relation) ) {
                            var type = relations[relation].type || 'default';
                            var from = node;
                            var to = relations[relation]['_target'];
                            var tailLabel = relations[relation]['_tail'] || '';
                            var headLabel = relations[relation]['_head'] || '';
                            var relLabel = relations[relation]['_label'] || relation || '';

                            console.log('"' + from + '" -> "' + to + '" [' );
                            console.log('taillabel="' + tailLabel + '" ');
                            console.log('headlabel="' + headLabel + '" ');
                            console.log('label=<<table border=\"0\" cellborder=\"0\"><tr><td><font point-size=\"10\"><i>' + relLabel + '</i></font></td></tr>' );
                            if(relations[relation]['_properties'] ) {
                                relations[relation]['_properties'].forEach(function(property) {
                                    console.log('<tr><td align=\"left\"><font point-size=\"8\" color=\"#00008a\">' + property + '</font></td></tr>' );
                                });
                            }
                            
                            console.log( '</table>> ];');
                        }
                    }
                }
            }
        }
        console.log('}');
    }
    processGraph( loadGraph( inFileName ) );
})();
