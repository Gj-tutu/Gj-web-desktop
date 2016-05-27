/**
 * Created by tutu on 15-8-26.
 */

var Actions = require('../../actions/Actions');
var Element = require("../../mixins/Element");
var Default = require("../../mixins/Default");

var BaseTextInput = React.createClass({

    mixins: [Element(), Default()],

    getInitialState: function() {
        this.setAction(Actions);
        return {data: this.props.data, action: this.props.action, name: this.props.name};
    },

    render: function() {
        return (
            <div class="base-text-input form-group">
                <label class="control-label">{this.state.title}</label>
                <input type="text" class="form-control" name={this.state.name}
                       value={this.state.value} onChange={this.handleClick} />
            </div>
        );
    },

    handleClick: function(event) {
        this.send(this.state.action, event.target.value);
    }
});

module.exports = BaseTextInput;