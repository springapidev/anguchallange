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

// Load the YAML parser module
require( 'js-yaml' );

// Load the YAML format config file
var fileContent = require( inFileName );
console.log(JSON.stringify(fileContent, null, "    "));
