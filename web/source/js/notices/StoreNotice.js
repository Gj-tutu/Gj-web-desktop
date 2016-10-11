/**
 * Created by tutu on 15-8-17.
 */

var Dispatcher = require('../dispatchers/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Constants = require('../constants/Constants');

var StoreNotice = {

    storeList: {},

    addStore: function(store) {
        this.storeList[store.name] = store;
    },

    removeStore: function(name) {
        this.storeList[name] = undefined;
    },

    getStore: function(name){
        return this.storeList[name];
    },

    handle: function(name, action, data, ComKey) {
        var store = this.getStore(name);
        if(store) store.handle(action, data, ComKey);
    },

    dispatcherIndex: Dispatcher.register(function(payload) {
        var store = payload.store;
        var action = payload.action;
        var ComKey = payload.ComKey;
        var data = payload.data;
        StoreNotice.handle(store, action, data, ComKey);
    })

};
module.exports = StoreNotice;
