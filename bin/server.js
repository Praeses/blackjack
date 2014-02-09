#!/usr/bin/env node
// create the global logger
var Log = require('fuzelog');
global.logger = new Log({
    level: 'debug',
    name: 'blackjack_server',  // Category name, shows as %c in pattern

    // FileStream to log to (can be file name or a stream)
    file:  './server.log',
    fileFlags: 'w',             // Flags used in fs.createWriteStream to
                                //   create log file
    consoleLogging: true,       // Flag to direct output to console
    colorConsoleLogging: true,  // Flag to color output to console

    // Usage of the log4js layout
    logMessagePattern: '[%d{ISO8601}] [%p] %c - %m{1}'
});

// start the rest api
require('../lib/restApi');
