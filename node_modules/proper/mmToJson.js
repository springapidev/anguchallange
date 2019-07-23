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
require('./mmconv').mmToJson( inFileName, true );
