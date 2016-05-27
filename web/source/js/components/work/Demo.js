/**
 * Created by tutu on 15-8-26.
 */

var ModuleFrame = require('./../module/ModuleFrame');
var ModuleTable = require('./../module/ModuleTable');
var Component = require("../../mixins/Component");
var Element = require("../../mixins/Element");
var Default = require("../../mixins/Default");
var Work = require("../../mixins/Work");
var Constants = require("../../constants/Constants");
var log = require("../../tools/log");

var Demo = React.createClass({

    mixins: [Component(), Element(), Default(), Work()],

    propTypes: {
        workId: React.PropTypes.string.isRequired
    },

    data: {
        title: "demo"
    },

    getDefaultProps: function() {
        return {

        };
    },

    getInitialState: function() {
        return {
            size: this.props.size,
            workId: this.props.workId,
            selected: this.props.selected,
            data: [],
            loading: false,
            dataIndex: 0
        };
    },

    componentWillMount: function() {
        this.getDemo();
    },

    render: function() {
        return (
            <div className="demo">
                <ModuleFrame gKey={this.getGKey()} size={this.state.size} selected={this.state.selected}
                             title={this.data.title} loading={this.state.loading}>
                    <div></div>
                </ModuleFrame>
            </div>
        );
    },

    openChart: function(data) {
        this.event(Constants.event.ADD_WORK, {type: Constants.workType.CHART, data: data});
    },

    getDemo: function(data) {
        var self = this;
        this.getData(Constants.store.DEMO, data, function(){
            self.loading();
        }, function(result){
            self.loaded();
        });
    },

    refresh: function() {
        this.getDemo();
    }
});

module.exports = Demo;