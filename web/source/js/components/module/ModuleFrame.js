/**
 * Created by tutu on 15-8-26.
 */

var Element = require("../../mixins/Element");
var Default = require("../../mixins/Default");
var Constants = require("../../constants/Constants");
var assign = require('object-assign');
var classNames = require("classnames");

var ModuleFrame = React.createClass({

    mixins: [Element(), Default()],

    data: {
        onOrder: false,
        resizing: false,
        moving: false,
        direction: undefined,
        startX: undefined,
        startY: undefined,
        size: {top:undefined,left:undefined,width:undefined,height:undefined},
        minSizeOn: {top: "height", left: "width"},
        minSize: {width: 250, height: 100, top: 0},
        moveList: {left:'x', top:'y'},
        sizeList: {width:'x', height:'y', left:'x', top:'y'},
        sizeChange: {e:{width: true}, s:{height: true}, w:{width:false, left:true}, n:{height:false, top:true},
            se:{width: true, height: true}, sw:{height: true, left: true, width: false},
            nw:{left: true, top: true, width: false, height: false}, ne:{top: true, width: true, height: false}}
    },

    propTypes: {
        title: React.PropTypes.string.isRequired
    },

    getDefaultProps: function() {
        return {

        };
    },

    getInitialState: function() {
        return {
            size: this.props.size,
            title: this.props.title,
            isMax: false,
            selected: this.props.selected,
            loading: this.props.loading
        };
    },

    componentWillReceiveProps: function(nextProps) {
        if(this.state.selected != nextProps.selected){
            this.setState({
                selected: nextProps.selected
            });
        }
        if(this.state.loading != nextProps.loading){
            this.setState({
               loading: nextProps.loading
            });
        }
    },

    componentWillMount: function() {

    },

    render: function() {
        var children = [];
        if(typeof(this.props.children) != "array"){
            if(this.props.children) children.push(this.props.children);
        }else{
            children = this.props.children;
        }
        var style = !this.state.isMax ? {
            top: this.state.size.top + 'px',
            left: this.state.size.left + 'px',
            width: this.state.size.width + 'px',
            height: this.state.size.height + 'px'} : {};
        var className = classNames("module-frame", {selected: this.state.selected}, {max: this.state.isMax},
            {loading: this.state.loading});
        return (
            <div className={className} style={style} onMouseMove={this._mouseMove}
                 onMouseDown={this._mouseDown} onMouseDownCapture={this._select} onMouseOver={this._mouseOver} onMouseOut={this._mouseOut}>
                <div className="header" onMouseOver={this._mouseOverHeader}
                    onMouseOut={this._mouseOutHeader} onMouseDown={this._mouseDownHeader}>
                    {this.state.title}
                    <div className="action-group" onMouseOver={this._stopPropagation}
                         onMouseOut={this._stopPropagation} onMouseDown={this._stopPropagation}>
                        <div className="act-min" style={{display: "none"}} onClick={this._actionMin}>
                            <span className="glyphicon glyphicon-minus"></span>
                        </div>
                        <div className="act-max" style={this.state.isMax ? {display: "none"} : {}} onClick={this._actionMax}>
                            <span className="glyphicon glyphicon-resize-full"></span>
                        </div>
                        <div className="act-rec" style={this.state.isMax ? {} : {display: "none"}} onClick={this._actionRecovery}>
                            <span className="glyphicon glyphicon-resize-small"></span>
                        </div>
                        <div className="act-ref" onClick={this._actionRefresh}>
                            <span className="glyphicon glyphicon-refresh"></span>
                        </div>
                        <div className="act-close" onClick={this._actionClose}>
                            <span className="glyphicon glyphicon-remove"></span>
                        </div>
                    </div>
                </div>
                <div className="data" onMouseOver={this._stopPropagation}
                    onMouseOut={this._stopPropagation}>
                    {this.state.loading ? "" : children.map(function (child) {
                        return child
                    })}
                </div>
            </div>
        );
    },

    _actionMin: function() {
        this.setState({isMin: true}, function(){
            this.recordSize({});
        });
    },

    _actionMax: function() {
        this.setState({isMax: true}, function(){
            this.recordSize({});
        });
    },

    _actionRecovery: function() {
        this.setState({isMax: false}, function(){
            this.recordSize(this.state.size);
        });
    },

    _actionRefresh: function() {
        this.handle(Constants.handle.REFRESH);
    },

    _actionClose: function() {
        this.handle(Constants.handle.CLOSE);
    },

    _stopPropagation: function(event) {
        event.stopPropagation();
    },

    _mouseOverHeader: function(event) {
        this._stopPropagation(event);
        if(this.state.isMax) return;
        if(this.data.resizing || this.data.moving) return;
        this.setMouseStyle("move");
    },

    _mouseOutHeader: function(event) {
        this._stopPropagation(event);
        if(this.state.isMax) return;
        if(this.data.resizing || this.data.moving) return;
        this.recoveryMouseStyle();
    },

    _mouseDownHeader: function(event) {
        if(this.state.isMax) return;
        this.data.moving = true;
        this.data.startX = event.screenX;
        this.data.startY = event.screenY;
        this.data.size = this.state.size;
        this.watch(Constants.event.WORK_MOUSE_POSITION, this.moving);
        this.watch(Constants.event.WORK_MOUSE_UP, this.moveOver);
    },

    _select: function() {
        this.handle(Constants.handle.CLICK);
    },

    moving: function(event) {
        var changeList = this.data.moveList;
        var change = {x:(event.screenX-this.data.startX), y:(event.screenY-this.data.startY)};
        var size = assign({}, this.data.size);
        for(var i in changeList){
            size[i] = Number(size[i]) + Number(change[changeList[i]]);
        }
        this.setSize(size);
    },

    moveOver: function(event) {
        this.data.moving = false;
        this.data.startX = undefined;
        this.data.startY = undefined;
        this.recordSize(this.state.size);
        this.unWatch(Constants.event.WORK_MOUSE_POSITION, this.moving);
        this.unWatch(Constants.event.WORK_MOUSE_UP, this.moveOver);
    },

    _mouseMove: function(event) {
        if(this.state.isMax) return;
        //TODO 修改这里的逻辑，减少判断
        if(this.data.onOrder && !this.data.resizing && !this.data.moving) this.confim(event);
    },

    _mouseDown: function(event) {
        if(this.state.isMax) return;
        if(!this.data.onOrder) return;
        this.data.resizing = true;
        this.data.startX = event.screenX;
        this.data.startY = event.screenY;
        this.data.size = this.state.size;
        this.data.direction = this.confim(event);
        this.watch(Constants.event.WORK_MOUSE_POSITION, this.changeSize);
        this.watch(Constants.event.WORK_MOUSE_UP, this.changeOver);
    },

    _mouseOver: function(event) {
        if(this.state.isMax) return;
        if(this.data.resizing || this.data.moving) return;
        this.data.onOrder = true;
        this.confim(event);
    },

    _mouseOut: function(event) {
        if(this.state.isMax) return;
        if(this.data.resizing || this.data.moving) return;
        this.data.onOrder = false;
        this.recoveryMouseStyle();
    },

    setMouseStyle: function(style) {
        this.event(Constants.event.WORK_MOUSE_STYLE, style);
    },

    recoveryMouseStyle: function() {
        this.event(Constants.event.WORK_MOUSE_STYLE, "default");
    },

    changeOver: function(event){
        this.data.onOrder = false;
        this.data.resizing = false;
        this.data.startX = undefined;
        this.data.startY = undefined;
        this.data.direction = undefined;
        this.recordSize(this.state.size);
        this.unWatch(Constants.event.WORK_MOUSE_POSITION, this.changeSize);
        this.unWatch(Constants.event.WORK_MOUSE_UP, this.changeOver);
    },

    changeSize: function(event){
        var changeList = this.data.sizeChange[this.data.direction];
        var change = {x:(event.screenX-this.data.startX),y:(event.screenY-this.data.startY)};
        var sizeList = this.data.sizeList;
        var size = assign({}, this.data.size);
        for(var i in changeList){
            size[i] = changeList[i] ? Number(size[i]) + Number(change[sizeList[i][0]]) : Number(size[i]) - Number(change[sizeList[i][0]]);
        }
        this.setSize(size);
    },

    confim: function(event) {
        var x = event.nativeEvent.offsetX;
        var y = event.nativeEvent.offsetY;
        var w = this.state.size.width;
        var h = this.state.size.height;
        var direction = this.compute(x,y,w,h);
        this.setMouseStyle(direction+'-resize');
        return(direction);
    },

    setSize: function(size) {
        var i;
        var newSize = assign({}, this.state.size);
        for(i in this.data.size){
            if(size[this.data.minSizeOn[i]] <= this.data.minSize[this.data.minSizeOn[i]]){
                continue;
            }
            if(size[i] <= this.data.minSize[i]){
                continue;
            }
            newSize[i] = size[i];
        }
        this.setState({size:newSize});
    },

    recordSize: function(size) {
        this.data.size = {top:undefined,left:undefined,width:undefined,height:undefined};
        this.handle(Constants.handle.RESIZE, {size: size});
    },

    compute: function(x,y,w,h) {
        var a = x < 10 ? 1 : 0;
        var b = y < 10 ? 1 : 0;
        var c = (w - x) < 10 ? 1 : 0;
        var d = (h - y) < 10 ? 1 : 0;
        if(a+b+c+d >= 2){
            if (a) {
                return b ? 'nw' : 'sw';
            }else{
                return b ? 'ne' : 'se';
            }
        }else{
            if (a || c) {
                return a ? 'w' : 'e';
            }else{
                return b ? 'n' : 's';
            }
        }
    }
});

module.exports = ModuleFrame;
