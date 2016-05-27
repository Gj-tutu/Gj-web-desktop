/**
 * Created by tutu on 15-11-14.
 */

var app = require("../app");

var all = 0;
var debug = 1;
var info = 2;
var warn = 3;
var error = 4;

function argument(string, style, arg){
    var argument = Array.prototype.slice.call(arg);
    argument.unshift(style);
    argument.unshift("%c "+string);
    return argument;
}

var Log = {
    info: function(){
        if(app.logLevel <= info && app.logLevel != all) return;
        console.info.apply(console, argument("[info]", "color:blue;font-weight: bold;", arguments));
    },

    warn : function(){
        if(app.logLevel <= warn && app.logLevel != all) return;
        console.warn.apply(console, argument("[warn]", "color:orange;font-weight: bold;", arguments));
    },

    debug: function(){
        if(app.logLevel <= debug && app.logLevel != all) return;
        console.log.apply(console, argument("[debug]", "color:cornflowerblue;font-weight: bold;", arguments));
    },

    error: function(){
        if(app.logLevel <= error && app.logLevel != all) return;
        console.error.apply(console, argument("[error]", "color:red;font-weight: bold;", arguments));
    }
};
module.exports = Log;
