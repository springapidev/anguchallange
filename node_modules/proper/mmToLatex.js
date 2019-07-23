var mmconv = require(__dirname + '/mmconv.js');
var fs = require('fs');
var path = require('path');

var mapOwnProperties = function(obj, func) {
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            func(obj[property]);
        }
    }
};

var startNode = function (node, fileName, siblingCtx) {

    if( node.icon ) {
        // console.log(node.icon);
        mapOwnProperties(node.icon, function(icon) {
            if(icon === 'closed') {
                // Skip this item
            } else if(icon === 'attach') {
                // Include file
                fs.appendFileSync(fileName, fs.readFileSync(path.resolve(node.TEXT)));
                return true;
            } else if(icon === 'full-1') {
                fs.appendFileSync(fileName, '\\chapter{' + node.TEXT + '}\n');
                return true;
            } else if(icon === 'full-2') {
                fs.appendFileSync(fileName, '\\section{' + node.TEXT + '}\n');
                return true;
            } else if(icon === 'full-3') {
                fs.appendFileSync(fileName, '\\subsection{' + node.TEXT + '}\n');
                return true;
            } else if(icon === 'full-4') {
                fs.appendFileSync(fileName, '\\subsubsection{' + node.TEXT + '}\n');
                return true;
            } else if(icon === 'full-5') {
                fs.appendFileSync(fileName, '\\subsubsubsection{' + node.TEXT + '}\n');
                return true;
            } else if(icon === 'licq') {
                var re = /^\{(.*)\}{1}(.*){1}$/;
                var result = node.TEXT.match(re);
                var graphicsFile = node.LINK || 'undefined.eps';
                var captionText = '';
                var label = '';
                if( result !== null && result.length >= 3) {
                    captionText = result[2];
                    label = result[1];                    
                }
                fs.appendFileSync(fileName,
                    '\\begin{figure}[h]' +
                    '\\includegraphics[width=\\textwidth,height=!]{' + graphicsFile + '}' +
                    '\\caption{' + captionText + '\\label{' + label + '}}' +
                    '\\end{figure}\n\n' );
                return true;
            } else if(icon === 'forward') {
                if( siblingCtx.itemize ) {
                } else {
                    siblingCtx.itemize = true;
                    fs.appendFileSync(fileName, '\\begin{itemize}\n');
                }
                fs.appendFileSync(fileName, '\\item ');
                fs.appendFileSync(fileName, node.TEXT + '\n\n');
                return true;
            } else if(icon === 'up') {
                if( siblingCtx.enumerate ) {
                } else {
                    siblingCtx.enumerate = true;
                    fs.appendFileSync(fileName, '\\begin{enumerate}\n');
                }
                fs.appendFileSync(fileName, '\\item ');
                fs.appendFileSync(fileName, node.TEXT + '\n\n');
                return true;
            } else if(icon === 'down') {
                if( siblingCtx.description ) {
                } else {
                    siblingCtx.description = true;
                    fs.appendFileSync(fileName, '\\begin{description}\n');
                }
                fs.appendFileSync(fileName, '\\item[');
                fs.appendFileSync(fileName, node.TEXT + '] \n\n');
                return true;
            }
        });
    } else {
        fs.appendFileSync(fileName, node.TEXT + '\n\n');
    }
    return true;
};

var endNode = function (node, fileName) {
};

var beginChildren = function (node, fileName, siblingCtx) {
    siblingCtx.itemize = false;
    siblingCtx.enumerate = false;
    siblingCtx.description = false;
};

var endChildren = function (node, fileName, siblingCtx) {
    if( siblingCtx.itemize ) {
        fs.appendFileSync(fileName, '\\end{itemize}\n');
    }
    if( siblingCtx.enumerate ) {
        fs.appendFileSync(fileName, '\\end{enumerate}\n');
    }
    if( siblingCtx.description ) {
        fs.appendFileSync(fileName, '\\end{description}\n');
    }
};

exports.latexWriter = function (map, fileName, wrapContent) {

    fs.writeFileSync(fileName,'');

    // fs.writeFileSync(fileName,
    //     '\\documentclass[12pt]{book}\n' +
    //     '\\usepackage[utf8]{inputenc}\n' +
    //     '\\usepackage{graphicx}\n' +
    //     '\\begin{document}\n');

    mmconv.traverseTreeCtx( map.node, { 
            beginChildren : function(node,ctx) { return beginChildren(node, fileName, ctx); },
            endChildren : function(node,ctx) { return endChildren(node, fileName, ctx); },
            entryFunction : function(node,ctx) { return startNode(node, fileName, ctx); },
            leaveFunction : function(node, ctx) { return endNode(node, fileName, ctx); }
        });

    // fs.appendFileSync(fileName, '\n\\end{document}\n');
};