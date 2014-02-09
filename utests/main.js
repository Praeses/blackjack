/**
 * Driver for user tests.
 */
'use strict';
var async = require('async');
var Player = require('./player');
var path = require('path');

var players;

function userTest(player, cb) {
    logger.info('userTest for %s',player.name);
    player.act(function(err) {
        if (err) {
            logger.error('usertest %s',err.message);
            logger.error('usertest %s',err.stack);
        }
        logger.info('completed userTest for %s',player.name);
        cb(err);
    });
}

function runUserTests(cb) {
    async.eachSeries(players, userTest, function(err) {
        if (err) {
            logger.error('runUserTests %s',err.message);
            logger.error('runUserTests %s',err.stack);
        }
        // needed to work around a bug in node/async
        setTimeout(cb, 1);
    });
}

function testLoop() {
    async.whilst(
        // synch truth test to perform before each execution of runUserTests
        function() {
            return true;
        },
        runUserTests,       // async action
        function(err) {     // end action, called on error or when test is false
            if (err) {
                logger.error('async.whilst %s',err.message);
                logger.error('async.whilst %s',err.stack);
            }
            logger.info('User tests ended.');
        }
    );
}

function main() {
    // create a logger
    var Log = require('fuzelog');
    global.logger = new Log({
        level: 'debug',
        name: 'utests',            // Category name, shows as %c in pattern

        // FileStream to log to (can be file name or a stream)
        file: __dirname + '/utests.log',

        fileFlags: 'w',             // Flags used in fs.createWriteStream to
                                    //   create log file
        consoleLogging: true,       // Flag to direct output to console
        colorConsoleLogging: true,  // Flag to color output to console

        // Usage of the log4js layout
        logMessagePattern: '[%d{ISO8601}] [%p] %c - %m{1}'
    });

    // create a player
    players = [
        new Player(1,1,1),
    ];
    testLoop();
}

function startServer() {
    var targetDir = path.join(__dirname, '..');
    console.log('dir',targetDir);
    var spawn = require('child_process').spawn;
    var opts = {
        env: process.env,
        cwd: targetDir,
    };
    var server = spawn('./bin/server.js', [], opts);
    server.on('error', function(err) {
        console.error('server error: %s',err.message);
        console.error('server error: stack: ',err.stack);
        process.exit(0);
    });
    server.on('close', function (code, signal) {
        if (code)
            console.error('server process exited with code ' + code);
        if (signal)
            console.error('server process exited with signal ' + signal);
        process.exit(0);
    });
}

// run the game server
startServer();

// HACK: start after a delay - don't want to build spawn messaging
setTimeout(function() {
    main();
}, 3000);

