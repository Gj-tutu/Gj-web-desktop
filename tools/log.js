/**
 * Created by tutu on 15-11-14.
 */

var setting = require("../setting");
var all = 0;
var debug = 1;
var info = 2;
var warn = 3;
var error = 4;

function argument(string, arg){
    var argument = Array.prototype.slice.call(arg);
    argument.unshift(string);
    return argument;
}

var Log = {
    info: function(){
        if(setting.logLevel <= info && setting.logLevel != all) return;
        console.info.apply(console, argument("\033[34;1m [info] \033[0m", arguments));
    },

    warn : function(){
        if(setting.logLevel <= warn && setting.logLevel != all) return;
        console.warn.apply(console, argument("\033[33;1m [warn] \033[0m", arguments));
    },

    debug: function(){
        if(setting.logLevel <= debug && setting.logLevel != all) return;
        console.log.apply(console, argument("\033[36;1m [debug] \033[0m", arguments));
    },

    error: function(){
        if(setting.logLevel <= error && setting.logLevel != all) return;
        console.error.apply(console, argument("\033[31;1m [error] \033[0m", arguments));
    }
};
module.exports = Log;
