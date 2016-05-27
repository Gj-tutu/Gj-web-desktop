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

    handleSave: function(name, data) {
        var store = this.getStore(name);
        if(store) store.save(data);
    },

    handleGet: function(name, data, ComKey) {
        var store = this.getStore(name);
        if(store) store.get(data, ComKey);
    },

    handleDelete: function(name, data) {
        var store = this.getStore(name);
        if(store) store.delete(data);
    },

    dispatcherIndex: Dispatcher.register(function(payload) {
        var store = payload.store;
        var type = payload.type;
        var ComKey = payload.ComKey;
        var data = payload.data;
        switch(type) {
            case Constants.storeHandle.SAVE:
                StoreNotice.handleSave(store, data);
                break;
            case Constants.storeHandle.DELETE:
                StoreNotice.handleDelete(store, data);
                break;
            case Constants.storeHandle.GET:
                StoreNotice.handleGet(store, data, ComKey);
                break;
        }
    })

};
module.exports = StoreNotice;