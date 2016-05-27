/**
 * Created by tutu on 15-8-18.
 */

var uuid = require("../tools/uuid");
var Constants = require("../constants/Constants");

var Work = function() {

    return {

        loading: function() {
            this.setState({loading:true});
        },

        loaded: function() {
            this.setState({loading:false});
        },

        componentWillReceiveProps: function(nextProps) {
            if(this.state.selected != nextProps.selected){
                this.setState({
                    selected: nextProps.selected
                });
            }
        },

        componentWillMount: function() {
            this.bind(Constants.handle.REFRESH, this._actionRefresh);
            this.bind(Constants.handle.CLOSE, this._actionClose);
            this.bind(Constants.handle.RESIZE, this._actionReSize);
            this.bind(Constants.handle.CLICK, this._actionClick);
        },

        _actionClick: function() {
            this.event(Constants.event.SELECT_WORK, {workId: this.state.workId});
        },

        _actionReSize: function(data) {
            this.event(Constants.event.CHANGE_WORK_SIZE, {workId: this.state.workId, size: data.size});
            this.sendNotice(Constants.handle.RESIZE, data);
        },

        _actionRefresh: function() {
            if(this.refresh && typeof this.refresh === "function") this.refresh();
        },

        _actionClose: function() {
            this.event(Constants.event.DEL_WORK, {workId: this.state.workId});
        }
    }
};

module.exports = Work;