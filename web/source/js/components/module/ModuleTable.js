 /**
 * Created by tutu on 15-8-26.
 */

var Element = require("../../mixins/Element");
var Default = require("../../mixins/Default");
var BaseButton = require('./../base/BaseButton');
var BaseButtonGroup = require('./../base/BaseButtonGroup');
var ModulePage = require('./ModulePage');

var ModuleTable = React.createClass({

    mixins: [Element(), Default()],

    dataType: ['text', 'button'],

    getInitialState: function() {
        return {data: this.setData(this.props.header, this.props.data, this.props.action),
                dataIndex: this.props.dataIndex,
                maxNum: this.props.maxNum,
                num: this.props.num,
                page: this.props.page};
    },

    componentWillReceiveProps: function(nextProps) {
        if(this.state.dataIndex != nextProps.dataIndex){
            this.setState({
                data: this.setData(nextProps.header, nextProps.data, nextProps.action),
                dataIndex: nextProps.dataIndex,
                maxNum: nextProps.maxNum,
                num: nextProps.num,
                page: nextProps.page
            });
        }
    },

    render: function() {
        var data = this.state.data;
        return (
            <div className="module-table">
                <table className="table table-hover">
                    <thead>
                        {this.setHead(data.header)}
                    </thead>
                    <tbody>
                        {data.line.map(this.setLine)}
                    </tbody>
                </table>
                <ModulePage gKey={this.getGKey()} maxNum={this.state.maxNum} num={this.state.num} page={this.state.page}></ModulePage>
            </div>
        );
    },

    setData: function(header, data, action) {
        var headerData, result, i, l, item, hasAction;
        hasAction = false;
        headerData = {};
        result = {header: [],line: []};
        if(action) hasAction = true;
        if(header.length > 0) {
            for(i=0;i<header.length;i++) {
                headerData[header[i]['key']] = i;
                result.header.push(header[i]['title']);
            }
            if(hasAction) result.header.push('操作');
        }
        if(data && data.length > 0) {
            for(i=0;i<data.length;i++) {
                item = new Array(result.header.length);
                for(l in data[i]) {
                    if(headerData[l] >= 0) item[headerData[l]] = {type: 'text', value: data[i][l]};
                }
                if(hasAction) {
                    item[result.header.length-1] = {type: 'button', id:data[i]['id'],  value:action};
                }
                result.line.push(item);
            }
        }
        return result;
    },

    setBtn: function(id, data) {
            var status = id ? '' : '';
            if(typeof(data) != "object") {
                var buttons = [];
                for(var i=0;i<data.length;i++) {
                    buttons.push({data: id, status: status, action: data[i].action, title: data[i].title});
                }
                return <BaseButtonGroup gKey={this.getGKey()} buttons={buttons} />;
            }else {
                return <BaseButton gKey={this.getGKey()} data={id} status={status}
                                   action={data.action} title={data.title} />;
            }
    },

    setHead: function(itemList, index) {
        return <tr key={index}>{itemList.map(this.setTh)}</tr>;
    },

    setLine: function(itemList, index) {
        return <tr key={index}>{itemList.map(this.setTd)}</tr>;
    },

    setTh: function(item, index) {
        return <th key={index}>{item}</th>;
    },

    setTd: function(item, index) {
        if(item.type == 'text') {
            return <td key={index}>{item.value}</td>;
        }else if(item.type == 'button') {
            return <td key={index}>{this.setBtn(item.id, item.value)}</td>;
        }
    }
});

module.exports = ModuleTable;