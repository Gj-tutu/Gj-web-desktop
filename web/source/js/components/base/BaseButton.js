/**
 * Created by tutu on 15-8-26.
 */

var Actions = require('../../actions/Actions');
var Element = require("../../mixins/Element");
var Default = require("../../mixins/Default");

var BaseButton = React.createClass({

    mixins: [Element(), Default()],

    getInitialState: function() {
        return {data: this.props.data, action: this.props.action, status: this.props.status, title: this.props.title};
    },

    render: function() {
        return (
            <a href="javascript: void(0);" className="Base-button btn btn-default btn-xs"
               onClick={this.handleClick}>{this.state.title}</a>
        );
    },

    handleClick: function() {
        this.handle(this.state.action, this.state.data);
    }
});

module.exports = BaseButton;