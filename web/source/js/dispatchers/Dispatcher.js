var assign = require('object-assign');
var Constants = require('../constants/Constants');

var _callbacks = [];

var Dispatcher = function() {};
Dispatcher = assign({}, Dispatcher, {

    /**
     * Register a Store's callback so that it may be invoked by an action.
     * @param {function} callback The callback to be registered.
     * @return {number} The index of the callback within the _callbacks array.
     */
    register: function(callback) {
        _callbacks.push(callback);
        return _callbacks.length - 1; // index
    },

    /**
     * dispatch
     * @param  {object} payload The data from the action.
     */
    dispatch: function(payload) {
        _callbacks.forEach(function(callback, i) {
            callback(payload)
        });
    },

    sendMessage: function(action, type, data, key, callback) {
        this.dispatch({
            action: action,
            type: type,
            key: key,
            data: data,
            callback: callback
        });
    },

    dataHandle: function(store, type, data, ComKey) {
        this.dispatch({
            store: store,
            type: type,
            ComKey: ComKey,
            data: data
        });
    },

    reply: function(action, data, comKey, callback) {
        this.sendMessage(action, Constants.notice.REPLY, data, comKey, callback);
    },

    noReply: function(action, data, comKey) {
        this.sendMessage(action, Constants.notice.NO_REPLY, data, comKey, null);
    },

    notice: function(action, data) {
        this.sendMessage(action, Constants.notice.NOTICE, data, null, null);
    },

    storeSave: function(store, data) {
        this.dataHandle(store, Constants.storeHandle.SAVE, data, null, null);
    },

    storeDelete: function(store, data) {
        this.dataHandle(store, Constants.storeHandle.DELETE, data, null, null);
    },

    storeGet: function(store, data, comKey) {
        this.dataHandle(store, Constants.storeHandle.GET, data, comKey);
    }
});

module.exports = Dispatcher;