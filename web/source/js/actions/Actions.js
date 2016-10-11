/**
 * Created by tutu on 15-8-17.
 */

var Dispatcher = require('../dispatchers/Dispatcher');
var Constants = require('../constants/Constants');

var Actions = {
    dispatcher: Dispatcher,

    handle: function(comKey, handle, data, callback) {
        this.dispatcher.reply(handle, data, comKey, callback);
    },

    event: function(event, data) {
        this.dispatcher.notice(event, data);
    },

    storeHandle: function(store, action, data, comKey) {
        this.dispatcher.storeHandle(store, action, data, comKey);
    },

    storeNotice: function(store, handle, listen, data) {
        this.dispatcher.notice(store+handle+listen, data);
    },

    storeNoReply: function(comKey, store, handle, listen, data) {
        this.dispatcher.noReply(store+handle+listen, data, comKey);
    },

    comNotice: function(ComKey, action, data) {
        this.dispatcher.notice(ComKey+action, data);
    }
};

module.exports = Actions;
