var fs = require('fs');
var ftools =require('./ftools');

/**
 * JSON to FreeMind converter
 */
(function() {
    var verbose = false;

    var loadJson = function( inFileName ) {
        return JSON.parse( fs.readFileSync( inFileName, encoding='utf8' ) );
    }

    var getProperties = function(obj) {
        var properties = [];
        var name;

        for(name in obj) {
            if(obj.hasOwnProperty(name)) {
                var property = { name : name };
                if(ftools.isArray(obj[name])) {
                    property.name += " []";
                    property.type = 'Array';
                    property.properties = [];
                    obj[name].forEach(function(listItem) {
                        // console.log('    listItem', listItem, getProperties( listItem ) );
                        property.properties.push( {
                            name: "",
                            properties: getProperties( listItem )
                            } );
                    });
                        
                } else {
                    var objType = typeof obj[name];
                    if(objType == "string") {
                        property.type = 'String';
                    } else if(objType == "number")  {
                        property.type = 'Number';
                    } else if (objType == "boolean") {
                        property.type = 'Boolean';
                    } else if (objType == "object") {
                        property.type = 'Object';
                        property.properties = getProperties(obj[name]);
                    } else {
                        property.type = 'String';
                    }
                }
                properties.push(property);
            }
        }
        return properties;
    };

    var traverseProperties = function( obj ) {
        var result = {
            "TEXT": obj.name
        };

        if( obj.hasOwnProperty('properties') ) {
            if( ftools.isArray( obj.properties ) ) {
                result.node = [];
                obj.properties.forEach( function( subObj ) {
                    result.node.push( traverseProperties( subObj ) );
                });
            }
        }

        if( obj.type === 'Number' ) {
            result.COLOR = "#000099";
        } else if( obj.type === 'String' ) {
            result.COLOR = "#009900";
        } else if( obj.type === 'Boolean' ) {
            result.COLOR = "#990000";
        }


        return result;
    };

    var makeMmStructure = function(obj, rootText) {
        var nodes = [];
        if( ftools.isArray( obj ) ) {
            obj.forEach( function( subObj ) {
                nodes.push( traverseProperties( subObj ) );
            });
        }

        return {
            map: {
                node: {
                    TEXT: rootText,
                    node: nodes
                }
            }
        };
    };

    var inFileName = process.cwd() + '/';
    var pathSep = require('path').sep;

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
    // console.log( JSON.stringify( getProperties( loadJson( inFileName ) ), ' ', 4) );
    // console.log( JSON.stringify( makeMmStructure( getProperties( loadJson( inFileName ) ), "Fragment info" ), ' ', 4) );
    require('./mmconv').jsonToMm( makeMmStructure( getProperties( loadJson( inFileName ) ), process.argv[2] ), true );
})();
