/**
 * Created by tutu on 15-8-18.
 */

var Constants = require("../constants/Constants");

var Chart = function() {

    return {
        getInitialState: function() {
            return {
                chart: undefined,
                option: undefined,
                dataIndex: this.props.dataIndex
            };
        },

        componentDidMount: function() {
            this.draw();
        },

        componentWillReceiveProps: function(nextProps) {
            if(this.state.dataIndex != nextProps.dataIndex){
                this.state.dataIndex = nextProps.dataIndex;
                this.setOption(this.init(nextProps.title, nextProps.data, nextProps.timeKey));
            }
        },

        resize: function() {
            if(this.state.chart) this.state.chart.resize();
        },

        draw: function() {
            var chart = this.getChart();
            var myChart;
            if(this.state.chart){
                myChart = this.state.chart;
            }else{
                myChart = EChart.init(chart, 'macarons');
            }
            if(this.state.option) myChart.setOption(this.state.option);
            this.state.chart = myChart;
        },

        getChart: function() {
            return this.refs.chart.getDOMNode();
        },

        setOption: function(option) {
            this.state.option = option;
            this.draw();
        }
    }
};

module.exports = Chart;