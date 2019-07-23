var xm = require('xml-mapping');
fs = require('fs');

// Usage: mmToJson( '../data/myGTD.mm', true );
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

function mapChildren( node, level, mapFunction ) {
    var rval = "";
    if( isArray( node ) ) {
        node.forEach( function( childNode ) {
            rval += mapTree( childNode, level, mapFunction ) } );
    } else {
        rval = mapTree( node, level, mapFunction );
    }
//    console.log('mapChildren: ', node, rval );
    return rval;
}

function mapTree( node, level, mapFunction ) {
    var rval = mapFunction( node, level );
    if( node.node ) {
        rval += mapChildren( node.node, level+1, mapFunction );
    }
//    console.log('mapTree: ', node, rval );
    return rval;
}


function parseItemWithContent( node ) {
    var result = {
        text: ''
    };

    if( node.TEXT && node.TEXT !== undefined ) {
        result.text = node.TEXT.replace(/^- /g, '');
    }

    if( node.node ) {
        result.content = node.node;
    }

    return result;
}

function convertToText( node, level ) {
//    console.log('convertToText:', node, level );
    return node.TEXT || "";
}

function parseItemWithTextContent( node ) {
    var item = parseItemWithContent( node );
//    console.log('parseItemWithTextContent:', node, item);
    if( node.node ) {
        item.content = mapChildren( node.node, 1, convertToText );
    }

    return item;
}

function parseItem( node ) {
    if( node.TEXT && node.TEXT !== undefined ) {
        return node.TEXT.replace(/^- /g, '');
    } else {
        return "";
    }
}

function parseArray( node, pattern, parseItemFunc ) {
    var array = [];

    node.node && traverseChildren( node, function( node ) {
        if( node.TEXT && node.TEXT.match( pattern ) ) {
            node.node && traverseChildren( node.node, function( node ) {
                    array.push( parseItemFunc( node ) );
                    return false;
                }, null );
            return false;
        }
        return true;
    }, null );

    return array;
}

function traverseChildren( node, entryFunction, leaveFunction ) {
    if( isArray( node ) ) {
        node.forEach( function( childNode ) {
            traverseTree( childNode, entryFunction, leaveFunction ) } );
    } else {
        traverseTree( node, entryFunction, leaveFunction );
    }
}

function traverseTree( node, entryFunction, leaveFunction ) {
    var visitChildren = entryFunction && entryFunction( node );
    if( node.node && visitChildren ) {
        traverseChildren( node.node, entryFunction, leaveFunction );
    }
    leaveFunction && leaveFunction( node );
}

function traverseChildrenCtx( node, ctx ) {
    var siblingCtx = {
        beginChildren : ctx.beginChildren,
        endChildren : ctx.endChildren,
        entryFunction : ctx.entryFunction,
        leaveFunction : ctx.leaveFunction
    };

    ctx.beginChildren(node, siblingCtx);
    if( isArray( node ) ) {
        node.forEach( function( childNode ) {
            traverseTreeCtx( childNode, siblingCtx ) } );
    } else {
        traverseTreeCtx( node, siblingCtx );
    }
    ctx.endChildren(node, siblingCtx);
}

function traverseTreeCtx( node, ctx ) {
    var visitChildren = ctx.entryFunction && ctx.entryFunction( node, ctx );
    if( node.node && visitChildren ) {
        traverseChildrenCtx( node.node, ctx );
    }
    ctx.leaveFunction && ctx.leaveFunction( node, ctx );
}

function encode( text ) {
    var resultText = new String(text);
    return resultText.replace(/&/g,"&amp;").replace(/"/g,"&apos;");
}

/*
"node": [
    "CREATED": "1361800304987",
    "ID": "ID_509777905",
    "LINK": "https://trackspace.lhsystems.com/browse/NLMDLSY-3171.",
    "MODIFIED": "1361800304987",
    "TEXT": "Az 1-es és 2-es pontok realizálása a mi feladatunk, a visszamaradó idő, amennyit nekem kell ezzel foglalkoznom, max. 4-5 napi munka. Ezzel mi  szerintem jövő hét végére el tudunk készülni. A 3-as pont realizációjához tartozó task itt található: https://trackspace.lhsystems.com/browse/NLMDLSY-3171. Sanyi becslése szerint 3 hetes munka ez, nem sok idő lett erre lejelentve: nem tudom biztosan mennyi előrehaladás történt a dologban (tudtommal nem sok). A 3-as pontban szükség lesz a velünk való kooperációra jelenlegi meglátásom szerint, illetve ezt a munkát előkészítendő megtalálni, hogy ki/hogyan fog ezen dolgozni."
    "COLOR": "#990000",
    "FOLDED": "true", 
    "icon": {
        "BUILTIN": "button_ok"
    }
    "font": {
        "BOLD": "true",
        "NAME": "SansSerif",
        "SIZE": "12"
    }
]
*/
function startTag( node ) {
    console.log('<node ' );
    console.log(' ID="' + node.ID + '"');
    if( ! node.TEXT || node.TEXT == '' ) {
        console.log(' TEXT=""');
    }
    else {
        console.log(' TEXT="' + encode( node.TEXT ) + '"');
    }

    if( node.CREATED ) {
        console.log(' CREATED="' + encode( node.CREATED ) + '"');
    }

    if( node.MODIFIED ) {
        console.log(' MODIFIED="' + encode( node.MODIFIED ) + '"');
    }

    if( node.POSITION ) {
        console.log(' POSITION="' + encode( node.POSITION ) + '"');
    }

    if( node.LINK ) {
        console.log(' LINK="' + encode( node.LINK ) + '"');
    }

    if( node.COLOR ) {
        console.log(' COLOR="' + encode( node.COLOR ) + '"');
    }

    if( node.FOLDED ) {
        console.log(' FOLDED="' + encode( node.FOLDED ) + '"');
    }

    console.log('>');

    if( node.icon ) {
        console.log(' <icon BUILTIN="' + node.icon.BUILTIN + '"/>');
    }

    if( node.font ) {
        console.log(' <font BOLD="' + node.font.BOLD + '"' +
            ' NAME="' + node.font.NAME + '"' +
            ' SIZE="' + node.font.SIZE + '"/>');
    }

    return true;
}

function endTag( node ) {
    console.log( '</node>');
    return true;
}

function startMap() {
    console.log('<map version="0.9.0">');
    console.log('<!-- To view this file, download free mind mapping software FreeMind from http://freemind.sourceforge.net -->');
}

function endMap() {
    console.log('</map>');
}

// Usage: jsonToMm( mmToJson( '../../../myGTD/myGTD.mm', false ) );
function jsonToMm(data) {
    startMap();
    traverseTree( data.map.node, startTag, endTag );
    endMap();
}

exports.parseItemWithContent = parseItemWithContent;
exports.parseItemWithTextContent = parseItemWithTextContent;
exports.parseItem = parseItem;
exports.parseArray = parseArray;
exports.mapChildren = mapChildren;
exports.mapTree = mapTree;
exports.traverseChildren = traverseChildren;
exports.traverseTree = traverseTree;
exports.traverseChildrenCtx = traverseChildrenCtx;
exports.traverseTreeCtx = traverseTreeCtx;
exports.jsonToMm = jsonToMm;
exports.mmToJson = mmToJson;
exports.isArray = isArray;
