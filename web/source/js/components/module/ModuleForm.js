/**
 * Created by tutu on 15-8-26.
 */

var Constants = require('../../constants/Constants');
var Element = require("../../mixins/Element");
var Default = require("../../mixins/Default");

var ModuleForm = React.createClass({

    mixins: [Element(), Default()],

    data: {},

    getInitialState: function() {
        this.data = this.props.data;
        return {data: this.props.data, dataType: this.props.dataType};
    },

    changeData: function (data) {

    },

    render: function() {
        return (
            <div className="module-form">
            </div>
        );
    }
});

module.exports = ModuleForm;