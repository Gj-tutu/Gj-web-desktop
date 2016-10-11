/**
 * Created by tutu on 15-8-17.
 */

var Dispatcher = require('../dispatchers/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Constants = require('../constants/Constants');

var EleNotice = {

    elementList: {},

    handleList: {},

    addElement: function(key) {
        this.elementList[key] = assign({}, EventEmitter.prototype);
    },

    removeElement: function(key) {
        this.elementList[key] = undefined;
        for(var handle in this.handleList){
            this.removeHandle(key, handle)
        }
    },

    getElement: function(key){
        return this.elementList[key];
    },

    emit: function(key, action, data) {
        var element = this.getElement(key);
        if(element){
            return element.emit(action, data);
        }else{
            return false;
        }
    },

    addListener: function(key, action, callback) {
        var element = this.getElement(key);
        if(element){
            this.addHandle(key, action);
            return element.addListener(action, callback);
        }
        else{
            return false;
        }
    },

    removeListener: function(key, action, callback) {
        var element = this.getElement(key);
        if(element){
            this.removeHandle(key, action);
            return element.removeListener(action, callback);
        }else{
            return false;
        }
    },

    addHandle: function(key, action) {
        if(!this.handleList[action]) this.handleList[action] = [];
        this.handleList[action].push(key);
    },

    removeHandle: function(key, action) {
        if(!this.handleList[action] || this.handleList[action].length <= 0) return;
        for(var i=0;i<this.handleList[action].length;i++){
            if(this.handleList[action][i] == key){
                this.handleList[action].splice(i,1);
                return;
            }
        }
    },

    handleNotice: function(action, data) {
        if(!this.handleList[action] || this.handleList[action].length <= 0) return;
        for(var i=0;i<this.handleList[action].length;i++){
            this.emit(this.handleList[action][i], action, data);
        }
    },

    dispatcherIndex: Dispatcher.register(function(payload) {
        var action = payload.action;
        var type = payload.type;
        var data = payload.data;
        switch(type) {
            case Constants.notice.NOTICE:
                EleNotice.handleNotice(action, data);
                break;
        }
    })

};
module.exports = EleNotice;
