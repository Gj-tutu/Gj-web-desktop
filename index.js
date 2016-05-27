//npm install express
//nodejs app.js
//DEBUG=express:* nodejs app.js

var app = require('./app');
var setting = require("./setting");
var log = require("./tools/log");

app.listen(setting.port, function() {
    log.info('Listening on port '+ setting.port);
});