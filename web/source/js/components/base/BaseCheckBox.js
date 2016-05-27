/**
 * Created by tutu on 15-8-26.
 */

var Actions = require('../../actions/Actions');
var Element = require("../../mixins/Element");
var Default = require("../../mixins/Default");

var BaseCheckBox = React.createClass({

    mixins: [Element(), Default()],

    getInitialState: function() {
        this.setAction(Actions);
        return {data: this.props.data, action: this.props.action, name: this.props.name};
    },

    render: function() {
        return (
            <div className="base-checkbox form-group">
                {this.state.data.map(this.setItem)}
            </div>
        );
    },

    setItem: function(item) {
        return (
            <div className="checkbox">
                <label className="checkbox-inline">
                    <input type="checkbox" onChange={this.handleClick}
                           value={item.value} name={this.state.name} />{item.title}
                </label>
            </div>
        );
    },

    handleClick: function(event) {
        this.send(this.state.action, this.state.data);
    }
});

module.exports = BaseCheckBox;