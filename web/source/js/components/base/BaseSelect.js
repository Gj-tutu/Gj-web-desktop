/**
 * Created by tutu on 15-8-26.
 */

var Actions = require('../../actions/Actions');
var Element = require("../../mixins/Element");
var Default = require("../../mixins/Default");

var BaseSelect = React.createClass({

    mixins: [Element(), Default()],

    getInitialState: function() {
        this.setAction(Actions);
        return {data: this.props.data, action: this.props.action, name: this.props.name};
    },

    render: function() {
        return (
            <div className="base-select form-group">
                <select class="form-control" onChange={this.handleChange}>
                    {this.state.data.map(this.setItem)}
                </select>
            </div>
        );
    },

    setItem: function(item) {
        return <option value={item.value}>{item.title}</option>;
    },

    handleChange: function(event) {
        this.send(this.state.action, event.target.value);
    }
});

module.exports = BaseSelect;