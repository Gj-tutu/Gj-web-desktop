//npm install express
//nodejs app.js
//DEBUG=express:* nodejs app.js

var express = require('express');
var app = express();
var setting = require('./setting');
var web = require('./router/web');
var log = require('./tools/log');

app.use([web]);

app.use(function(err, req, res, next){
    log.error(err.stack);
    next(err);
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.send(err);
});

module.exports = app;