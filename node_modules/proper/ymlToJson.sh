#!/bin/bash
# The role of this simple script is to start the real application,
# that is written in JavaScript and using node.js

# Identifies the dir into the application was installed
appDir=`dirname $0`

# Run app.js under node with all the arguments got
node $appDir/ymlToJson.js $*