/**
 * Created by tutu on 15-8-26.
 */

var Element = require("../../mixins/Element");
var Default = require("../../mixins/Default");
var Constants = require("../../constants/Constants");

var ToolbarItem = React.createClass({

    mixins: [Element(), Default()],

    render: function() {
        return (
            <div className="toolbar-item" onClick={this._click}>{this.props.name}</div>
        );
    },

    _click: function() {
        this.event(Constants.event.ADD_WORK, {type: this.props.type});
    }
});

module.exports = ToolbarItem;