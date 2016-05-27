 /**
 * Created by tutu on 15-8-26.
 */

var Element = require("../../mixins/Element");
var Default = require("../../mixins/Default");
var classNames = require("classnames");
var Constants = require("../../constants/Constants");
var assign = require('object-assign');

var ModulePage = React.createClass({

    mixins: [Element(), Default()],

    data: {length: 5},

    getInitialState: function() {
        return {
            maxNum: this.props.maxNum,
            page: this.props.page,
            num: this.props.num,
            maxPage: Math.ceil(this.props.maxNum / this.props.num)
        };
    },

    componentWillReceiveProps: function(nextProps) {
        if(this.state.page != nextProps.page){
            this.setState({
                page: nextProps.page
            });
        }
        if(this.state.maxNum != nextProps.maxNum){
            this.setState({
                maxNum: nextProps.maxNum,
                maxPage: Math.ceil(nextProps.maxNum / nextProps.num)
            });
        }
        if(this.state.num != nextProps.num){
            this.setState({
                num: nextProps.num,
                maxPage: Math.ceil(nextProps.maxNum / nextProps.num)
            });
        }
    },

    render: function() {
        if(!this.state.maxPage || !this.state.page) return (<nav className="module-page"></nav>);
        var preClassName = classNames({disabled: this.state.page <= 1});
        var nextClassName = classNames({disabled: this.state.page >= this.state.maxPage});
        var pageList = [];
        var qj = Math.floor(this.data.length/2);
        for(var i=1;i<=this.state.maxPage;i++){
            if(i == this.state.page){
                pageList.push(i);continue;
            }
            if(i < this.state.page && this.state.page - i < this.data.length){
                pageList.push(i);continue;
            }
            if(i > this.state.page && i - this.state.page <= this.data.length){
                if(pageList.length < this.data.length){
                    pageList.push(i);continue;
                }else if(i - this.state.page <= qj){
                    pageList.shift();
                    pageList.push(i);
                }
            }
        }
        return (
            <nav className="module-page">
                <ul className="pagination">
                    <li className={preClassName} onClick={this.topPage}>
                        <a href="javascript:void(0);" aria-label="Top">
                            <span className="glyphicon glyphicon-fast-backward" aria-hidden="true"></span></a></li>
                    <li className={preClassName} onClick={this.prePage}>
                        <a href="javascript:void(0);" aria-label="Previous">
                            <span className="glyphicon glyphicon-backward" aria-hidden="true"></span></a></li>
                    {pageList.map(this.setPage)}
                    <li className={nextClassName} onClick={this.nextPage}>
                        <a href="javascript:void(0);" aria-label="Next">
                            <span className="glyphicon glyphicon-forward" aria-hidden="true"></span></a></li>
                    <li className={nextClassName} onClick={this.lastPage}>
                        <a href="javascript:void(0);" aria-label="Last">
                            <span className="glyphicon glyphicon-fast-forward" aria-hidden="true"></span></a></li>
                </ul>
            </nav>
        );
    },

     setPage: function(item, index) {
         var className = classNames({active: item == this.state.page});
         return <li className={className} key={index} onClick={this.selectPage}><a href="javascript:void(0);">{item}</a></li>;
     },

    topPage: function() {
        if(this.state.page <= 1) return;
        this._actionPage(1);
    },

    lastPage: function() {
        if(this.state.page >= this.state.maxPage) return;
        this._actionPage(this.state.maxPage);
    },

    prePage: function() {
        if(this.state.page <= 1) return;
        this._actionPage(this.state.page - 1);
    },

    nextPage: function() {
        if(this.state.page >= this.state.maxPage) return;
        this._actionPage(this.state.page + 1);
    },

    selectPage: function(event) {
        var page = event.target.text;
        if(page == this.state.page) return;
        this._actionPage(page);
    },

    _actionPage: function(page) {
        this.handle(Constants.handle.PAGE, page);
    }
});

module.exports = ModulePage;