/**
 * Created by tutu on 15-8-18.
 */

var Constants = require("../constants/Constants");

var WorkItem = function() {

    return {

        componentWillMount: function() {
            this.collect(Constants.handle.RESIZE, this._actionReSize);
            this.watch(Constants.event.CHANGE_FULL, this._actionReSize);
        },

        _actionReSize: function(data) {
            if(this.resize && typeof this.resize === "function") this.resize(data);
        }
    }
};

module.exports = WorkItem;