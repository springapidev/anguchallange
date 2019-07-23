var xm = require('xml-mapping');
fs = require('fs');

var verbose = true;

function readJson(inFileName) {
    try
    {
        verbose && console.log( "Loading '" + inFileName + "'..." );
        return require( inFileName );
    }
    catch( e )
    {
        console.log( "Error in loading the content file:", e );
    }
}

function mmToJson( inFileName, printToConsole ) {
    var mm = fs.readFileSync( inFileName, encoding='utf8' );
    var json = xm.load(mm);
    if( printToConsole ) {
        console.log( JSON.stringify( json, null, '    ' ) );
    }
    return json;
}

function isArray(a) {
    return Object.prototype.toString.apply(a) === '[object Array]';
}

function transform( obj ) {
    if( obj.hasOwnProperty('$t') ) {
//        console.log('<', obj.$t);
        return obj.$t;
    }

    var objType = typeof obj;
    if( objType == "string" || objType == "number" || objType == "boolean") {
//        console.log('<', obj)
        return obj;
    }

    for( var name in obj ) {
        if( obj.hasOwnProperty(name) ) {
            if( isArray( obj[name] ) ) {
                var newArr = [];
                obj[name].forEach( function( nestedObj ) {
//                    console.log('> transform', name);
                    newArr.push( transform( nestedObj ) );
                });
                obj[name] = newArr;
            } else {
//                console.log('> transform', name);
                obj[name] = transform( obj[name] );
            }
        }
    }

//    console.log('<',obj);
    return obj;
}

function convXmlToJson( fromFileName ) {
    verbose && console.log( '  ...converting XML from ' + fromFileName);
//    fs.writeFileSync( toFileName, JSON.stringify( transform( mmToJson(fromFileName,false) ), ' ', 4 ), encoding='utf8' );
    return transform( mmToJson(fromFileName,false) );
}

function saveToJson( obj, toFileName ) {
    verbose && console.log( '  ...saving JSON to ' + toFileName);
    fs.writeFileSync( toFileName, JSON.stringify( obj, ' ', 4 ), encoding='utf8' );
}

/* Returns with the list of file names without the extension */
function getFileNames(path, extension)
{
    var docPath = __dirname + '/' + path;
    var fileNames = [];
    var findPattern = new RegExp("." + extension + "$");
    var replacePattern = new RegExp("." + extension + "$","g");
    fs.readdirSync( docPath ).forEach( function(fileName ) {
        if( fileName.match( findPattern ) ) {
            fileNames.push( fileName.replace( replacePattern, "" ) );
        }
    });

    verbose && console.log('Read "' + extension + '" files from ' + docPath );

    return fileNames;
}


function processFiles( config ) {
    verbose = config.verbose;
    getFileNames(config.fromDir, config.fromExt).forEach( function( fileName ) {
            var fromFileName = __dirname + '/' + config.fromDir + '/' + fileName + '.' + config.fromExt;
            var toFileName = __dirname + '/' + config.toDir + '/' + fileName + '.' + config.toExt;
            verbose && console.log( '\nprocess\n  ' + fromFileName + '\n  >> ' + toFileName);
            var obj = config.converter( fromFileName );
            config.postprocessors.forEach(function(processor) {
                if( processor.fileName == fileName ) {
                    var newObj = processor.processorFunc(obj);
                    if( processor.toFileName ) {
                        config.writer( newObj, __dirname + '/' + config.toDir + '/' + processor.toFileName + '.' + config.toExt );
                    }
                }
            });
            config.writer( obj, toFileName );
//            console.log( JSON.stringify( transform( mmToJson(fromFileName,false) ), null, '    ' ) );
        });

}

exports.isArray = isArray;
exports.readJson = readJson;
exports.processFiles = processFiles;
exports.convXmlToJson = convXmlToJson;
exports.saveToJson = saveToJson;
