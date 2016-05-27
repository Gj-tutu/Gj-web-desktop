/**
 * Created by tutu on 15-8-17.
 */

var Dispatcher = require('../dispatchers/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Constants = require('../constants/Constants');

var ComNotice = {

    componentList: {},

    addComponent: function(key) {
        this.componentList[key] = assign({}, EventEmitter.prototype);
    },

    removeComponent: function(key) {
        this.componentList[key] = undefined;
    },

    getComponent: function(key){
        return this.componentList[key];
    },

    emit: function(key, action, data) {
        var component = this.getComponent(key);
        if(component){
            return component.emit(action, data);
        }else{
            return false;
        }
    },

    once: function(key, action, callback) {
        var component = this.getComponent(key);
        if(component){
            return component.once(action, callback);
        }else{
            return false;
        }
    },

    addListener: function(key, action, callback) {
        var component = this.getComponent(key);
        if(component){
            return component.addListener(action, callback);
        }else{
            return false;
        }
    },

    removeListener: function(key, action, callback) {
        var component = this.getComponent(key);
        if(component){
            return component.removeListener(action, callback);
        }else{
            return false;
        }
    },

    handleReply: function(key, action, data, callback) {
        var result = this.emit(key, action, data);
        if(typeof callback === "function") callback(result);
    },

    handleNoReply: function(key, action, data) {
        this.emit(key, action, data);
    },

    dispatcherIndex: Dispatcher.register(function(payload) {
        var action = payload.action;
        var type = payload.type;
        var callback = payload.callback;
        var key = payload.key;
        var data = payload.data;
        switch(type) {
            case Constants.notice.REPLY:
                ComNotice.handleReply(key, action, data, callback);
                break;
            case Constants.notice.NO_REPLY:
                ComNotice.handleNoReply(key, action, data);
                break;
        }
    })

};
module.exports = ComNotice;