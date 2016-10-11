/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	(function (){
	    var Web = __webpack_require__(1);
	    var app = __webpack_require__(24);

	    React.render(React.createElement(Web, null), app.container);
	})();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-19.
	 */

	var Workspace = __webpack_require__(2);
	var Toolbar = __webpack_require__(33);
	var Component = __webpack_require__(20);
	var Default = __webpack_require__(14);

	var Web = React.createClass({displayName: "Web",

	    mixins: [Component(), Default()],

	    render: function() {
	        return (
	            React.createElement("div", null, 
	                React.createElement(Workspace, {gKey: this.getGKey()}), 
	                React.createElement(Toolbar, {gKey: this.getGKey()})
	            )
	        );
	    }
	});

	module.exports = Web;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-19.
	 */

	var Works = __webpack_require__(3);
	var Component = __webpack_require__(20);
	var Element = __webpack_require__(6);
	var Default = __webpack_require__(14);
	var Constants = __webpack_require__(11);
	var uuid = __webpack_require__(7);

	var Workspace = React.createClass({displayName: "Workspace",

	    mixins: [Component(), Element(), Default()],

	    data: {
	        size: {top: 10,left:10,width:400,height:400},
	        selectId: undefined,
	        isFull: false
	    },

	    moduleList: [],

	    getInitialState: function() {
	        return {list: this.moduleList};
	    },

	    componentWillMount: function() {
	        this.watch(Constants.event.ADD_WORK, this.addWork);
	        this.watch(Constants.event.DEL_WORK, this.delWork);
	        this.watch(Constants.event.CHANGE_WORK_SIZE, this.recordSize);
	        this.watch(Constants.event.WORK_MOUSE_STYLE, this.setCursor);
	        this.watch(Constants.event.SELECT_WORK, this.selectWork);
	    },

	    componentDidMount: function() {
	        var workspace = this.getWorkspace();
	        var width = workspace.clientWidth;
	        var height = workspace.clientHeight;
	        this.data.size.top = height/2 - this.data.size.height/2;
	        this.data.size.left = width/2 - this.data.size.width/2;
	        this.addChangeFullListener(workspace);
	    },

	    render: function() {
	        return (
	            React.createElement("div", {className: "workspace", ref: "workspace", onMouseMove: this.mouseMoveHandle, 
	                 onMouseOver: this.mouseOverHandle, onMouseOut: this.mouseOutHandle, 
	                 onMouseUp: this.mouseUpHandle, onMouseDown: this.mouseDownHandle}, 
	                this.state.list.map(this.setHtml), 
	                React.createElement("div", {className: "full-item"}, React.createElement("span", {className: "glyphicon glyphicon-fullscreen", onClick: this.openFull}))
	            )
	        );
	    },

	    openFull: function() {
	        if(this.data.isFull) return;
	        var workspace = this.getWorkspace();
	        if (workspace.requestFullscreen) {
	            workspace.requestFullscreen();
	        } else if (workspace.mozRequestFullScreen) {
	            workspace.mozRequestFullScreen();
	        } else if (workspace.webkitRequestFullScreen) {
	            workspace.webkitRequestFullScreen();
	        }
	    },

	    closeFull: function() {
	        if(!this.data.isFull) return;
	        var workspace = this.getWorkspace();
	        if (workspace.exitFullscreen) {
	            workspace.exitFullscreen();
	        } else if (workspace.mozCancelFullScreen) {
	            workspace.mozCancelFullScreen();
	        } else if (workspace.webkitCancelFullScreen) {
	            workspace.webkitCancelFullScreen();
	        }
	    },

	    changeFull: function(event) {
	        this.data.isFull = this.data.isFull ? false : true;
	        var self = this;
	        this.setState({isFull: this.data.isFull}, function(){
	            setTimeout(function(){self.event(Constants.event.CHANGE_FULL, self.data.isFull)}, 10);
	        });
	    },

	    addChangeFullListener: function(workspace) {
	        workspace.addEventListener("webkitfullscreenchange", this.changeFull);
	        workspace.addEventListener("fullscreenchange", this.changeFull);
	        workspace.addEventListener("msfullscreenchange", this.changeFull);
	        workspace.addEventListener("mozfullscreenchange", this.changeFull);
	    },

	    addWork: function(data) {
	        var type = data.type;
	        var data = data.data ? data.data : {};
	        var inType = false;
	        for(var i in Constants.workType){
	            if(type == Constants.workType[i]) inType = true;
	        }
	        if(!inType) return;

	        this.moduleList.push(
	            {type: type, size: this.data.size, workId: uuid.get(), data: data}
	        );
	        this.data.selectId = this.moduleList.length - 1;
	        this.setState({list: this.moduleList});
	    },

	    delWork: function(data) {
	        this.moduleList.splice(this.getWorkIndex(data.workId), 1);
	        this.data.selectId = this.moduleList.length - 1;
	        this.setState({list: this.moduleList});
	    },

	    selectWork: function(data) {
	        var index = this.getWorkIndex(data.workId);
	        if(index == this.data.selectId) return;
	        var item = this.moduleList.splice(index, 1);
	        this.moduleList.push(item[0]);
	        this.setState({list: this.moduleList});
	    },

	    recordSize: function(data) {
	        this.moduleList[this.getWorkIndex(data.workId)].size = data.size;
	    },

	    getWorkIndex: function(workId) {
	        for(var i=0;i<this.moduleList.length;i++) {
	            if (this.moduleList[i].workId == workId) return i;
	        }
	    },

	    setCursor: function(style) {
	        var workspace = this.getWorkspace();
	        workspace.style.cursor = style;
	    },

	    setHtml: function(item, index) {
	        var selected = this.data.selectId == index ? true : false;
	        return Works.render(item, this.getGKey(), selected);
	    },

	    getWorkspace: function() {
	        return this.refs.workspace.getDOMNode();
	    },

	    mouseMoveHandle: function(event) {
	        this.event(Constants.event.WORK_MOUSE_POSITION, event);
	    },

	    mouseOutHandle: function(event) {
	        this.event(Constants.event.WORK_MOUSE_OUT, event);
	    },

	    mouseOverHandle: function(event) {
	        this.event(Constants.event.WORK_MOUSE_IN, event);
	    },

	    mouseUpHandle: function(event) {
	        this.event(Constants.event.WORK_MOUSE_UP, event);
	    },

	    mouseDownHandle: function(event) {
	        this.event(Constants.event.WORK_MOUSE_DOWN, event);
	    }
	});

	module.exports = Workspace;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-19.
	 */

	var Demo = __webpack_require__(4);
	var Constants = __webpack_require__(11);

	var workMap = {};
	workMap[Constants.workType.DEMO] = Demo;

	var Works = {
	    render: function (workItem, gKey, selected){
	        if (workMap[workItem.type]){
	            return React.createElement(workMap[workItem.type],
	                {gKey: gKey, size: workItem.size, key: workItem.workId, selected: selected, workId: workItem.workId})
	        }else{
	            return "";
	        }
	    }
	};

	module.exports = Works;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-26.
	 */

	var ModuleFrame = __webpack_require__(5);
	var ModuleTable = __webpack_require__(16);
	var Component = __webpack_require__(20);
	var Element = __webpack_require__(6);
	var Default = __webpack_require__(14);
	var Work = __webpack_require__(22);
	var Constants = __webpack_require__(11);
	var log = __webpack_require__(23);

	var Demo = React.createClass({displayName: "Demo",

	    mixins: [Component(), Element(), Default(), Work()],

	    propTypes: {
	        workId: React.PropTypes.string.isRequired
	    },

	    data: {
	        title: "demo"
	    },

	    getDefaultProps: function() {
	        return {

	        };
	    },

	    getInitialState: function() {
	        return {
	            size: this.props.size,
	            workId: this.props.workId,
	            selected: this.props.selected,
	            data: [],
	            loading: false,
	            dataIndex: 0
	        };
	    },

	    componentWillMount: function() {
	        this.getDemo();
	    },

	    render: function() {
	        return (
	            React.createElement("div", {className: "demo"}, 
	                React.createElement(ModuleFrame, {gKey: this.getGKey(), size: this.state.size, selected: this.state.selected, 
	                             title: this.data.title, loading: this.state.loading}, 
	                    React.createElement("div", null)
	                )
	            )
	        );
	    },

	    openChart: function(data) {
	        this.event(Constants.event.ADD_WORK, {type: Constants.workType.CHART, data: data});
	    },

	    getDemo: function(data) {
	        var self = this;
	        this.getData(Constants.store.DEMO, data, function(){
	            self.loading();
	        }, function(result){
	            console.log(1);
	            self.loaded();
	        });
	    },

	    refresh: function() {
	        this.getDemo();
	    }
	});

	module.exports = Demo;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-26.
	 */

	var Element = __webpack_require__(6);
	var Default = __webpack_require__(14);
	var Constants = __webpack_require__(11);
	var assign = __webpack_require__(10);
	var classNames = __webpack_require__(15);

	var ModuleFrame = React.createClass({displayName: "ModuleFrame",

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
	            React.createElement("div", {className: className, style: style, onMouseMove: this._mouseMove, 
	                 onMouseDown: this._mouseDown, onMouseDownCapture: this._select, onMouseOver: this._mouseOver, onMouseOut: this._mouseOut}, 
	                React.createElement("div", {className: "header", onMouseOver: this._mouseOverHeader, 
	                    onMouseOut: this._mouseOutHeader, onMouseDown: this._mouseDownHeader}, 
	                    this.state.title, 
	                    React.createElement("div", {className: "action-group", onMouseOver: this._stopPropagation, 
	                         onMouseOut: this._stopPropagation, onMouseDown: this._stopPropagation}, 
	                        React.createElement("div", {className: "act-min", style: {display: "none"}, onClick: this._actionMin}, 
	                            React.createElement("span", {className: "glyphicon glyphicon-minus"})
	                        ), 
	                        React.createElement("div", {className: "act-max", style: this.state.isMax ? {display: "none"} : {}, onClick: this._actionMax}, 
	                            React.createElement("span", {className: "glyphicon glyphicon-resize-full"})
	                        ), 
	                        React.createElement("div", {className: "act-rec", style: this.state.isMax ? {} : {display: "none"}, onClick: this._actionRecovery}, 
	                            React.createElement("span", {className: "glyphicon glyphicon-resize-small"})
	                        ), 
	                        React.createElement("div", {className: "act-ref", onClick: this._actionRefresh}, 
	                            React.createElement("span", {className: "glyphicon glyphicon-refresh"})
	                        ), 
	                        React.createElement("div", {className: "act-close", onClick: this._actionClose}, 
	                            React.createElement("span", {className: "glyphicon glyphicon-remove"})
	                        )
	                    )
	                ), 
	                React.createElement("div", {className: "data", onMouseOver: this._stopPropagation, 
	                    onMouseOut: this._stopPropagation}, 
	                    this.state.loading ? "" : children.map(function (child) {
	                        return child
	                    })
	                )
	            )
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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-18.
	 */

	var uuid = __webpack_require__(7);
	var EleNotice = __webpack_require__(8);
	var Actions = __webpack_require__(13);
	var Constants = __webpack_require__(11);

	var Element = function() {

	    return {
	        elementKey: undefined,

	        componentWillMount: function() {
	            this.elementKey = uuid.get();
	            EleNotice.addElement(this.elementKey);
	            this.parComponentKey = this.props.gKey;
	        },

	        componentWillUnmount: function() {
	            EleNotice.removeElement(this.elementKey);
	        },

	        onStoreHandle: function(store, handle, before, after) {
	            this.watchs(store+handle, {BEFORE: before, AFTER: after});
	        },

	        watchs: function(event, callbacks) {
	            var item;
	            for(item in Constants.listen){
	                if(callbacks[item]) this.watch(event+Constants.listen[item], callbacks[item]);
	            }
	        },

	        watch: function(event, callback) {
	            EleNotice.addListener(this.elementKey, event, callback);
	        },

	        unWatch: function(event, callback) {
	            EleNotice.removeListener(this.elementKey, event, callback);
	        },

	        storeHandle: function(store, handle, data) {
	            Actions.storeHandle(store, handle, data);
	        },

	        event: function(event, data) {
	            Actions.event(event, data);
	        },

	        handle: function(handle, data, callback) {
	            Actions.handle(this.parComponentKey, handle, data, callback);
	        },

	        collect: function(action, callback) {
	            this.watch(this.parComponentKey+action, callback);
	        }
	    }
	};

	module.exports = Element;

/***/ },
/* 7 */
/***/ function(module, exports) {

	/**
	 * Created by tutu on 15-8-19.
	 */

	var uuid = {
	    randMath: function() {
	        var b = new Array(16);
	        for (var i = 0, r; i < 16; i++) {
	            if ((i & 0x03) == 0) r = Math.random() * 0x100000000;
	            b[i] = r >>> ((i & 0x03) << 3) & 0xff;
	        }
	        return b;
	    },
	    uuidParse: function(buf, offset){
	        var _byteToHex = [];
	        var _hexToByte = {};
	        for (var i = 0; i < 256; i++) {
	            _byteToHex[i] = (i + 0x100).toString(16).substr(1);
	            _hexToByte[_byteToHex[i]] = i;
	        }
	        var i = offset || 0, bth = _byteToHex;
	        return  bth[buf[i++]] + bth[buf[i++]] +
	            bth[buf[i++]] + bth[buf[i++]] +
	            bth[buf[i++]] + bth[buf[i++]] +
	            bth[buf[i++]] + bth[buf[i++]] +
	            bth[buf[i++]] + bth[buf[i++]];
	    },
	    get: function(){
	        var rnds = this.randMath();
	        rnds[6] = (rnds[6] & 0x0f) | 0x40;
	        rnds[8] = (rnds[8] & 0x3f) | 0x80;
	        return this.uuidParse(rnds);;
	    }
	};

	module.exports = uuid;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-17.
	 */

	var Dispatcher = __webpack_require__(9);
	var EventEmitter = __webpack_require__(12).EventEmitter;
	var assign = __webpack_require__(10);
	var Constants = __webpack_require__(11);

	var EleNotice = {

	    elementList: {},

	    handleList: {},

	    addElement: function(key) {
	        this.elementList[key] = assign({}, EventEmitter.prototype);
	    },

	    removeElement: function(key) {
	        this.elementList[key] = undefined;
	        for(var handle in this.handleList){
	            this.removeHandle(key, handle)
	        }
	    },

	    getElement: function(key){
	        return this.elementList[key];
	    },

	    emit: function(key, action, data) {
	        var element = this.getElement(key);
	        if(element){
	            return element.emit(action, data);
	        }else{
	            return false;
	        }
	    },

	    addListener: function(key, action, callback) {
	        var element = this.getElement(key);
	        if(element){
	            this.addHandle(key, action);
	            return element.addListener(action, callback);
	        }
	        else{
	            return false;
	        }
	    },

	    removeListener: function(key, action, callback) {
	        var element = this.getElement(key);
	        if(element){
	            this.removeHandle(key, action);
	            return element.removeListener(action, callback);
	        }else{
	            return false;
	        }
	    },

	    addHandle: function(key, action) {
	        if(!this.handleList[action]) this.handleList[action] = [];
	        this.handleList[action].push(key);
	    },

	    removeHandle: function(key, action) {
	        if(!this.handleList[action] || this.handleList[action].length <= 0) return;
	        for(var i=0;i<this.handleList[action].length;i++){
	            if(this.handleList[action][i] == key){
	                this.handleList[action].splice(i,1);
	                return;
	            }
	        }
	    },

	    handleNotice: function(action, data) {
	        if(!this.handleList[action] || this.handleList[action].length <= 0) return;
	        for(var i=0;i<this.handleList[action].length;i++){
	            this.emit(this.handleList[action][i], action, data);
	        }
	    },

	    dispatcherIndex: Dispatcher.register(function(payload) {
	        var action = payload.action;
	        var type = payload.type;
	        var data = payload.data;
	        switch(type) {
	            case Constants.notice.NOTICE:
	                EleNotice.handleNotice(action, data);
	                break;
	        }
	    })

	};
	module.exports = EleNotice;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var assign = __webpack_require__(10);
	var Constants = __webpack_require__(11);

	var _callbacks = [];

	var Dispatcher = function() {};
	Dispatcher = assign({}, Dispatcher, {

	    /**
	     * Register a Store's callback so that it may be invoked by an action.
	     * @param {function} callback The callback to be registered.
	     * @return {number} The index of the callback within the _callbacks array.
	     */
	    register: function(callback) {
	        _callbacks.push(callback);
	        return _callbacks.length - 1; // index
	    },

	    /**
	     * dispatch
	     * @param  {object} payload The data from the action.
	     */
	    dispatch: function(payload) {
	        _callbacks.forEach(function(callback, i) {
	            callback(payload)
	        });
	    },

	    sendMessage: function(action, type, data, key, callback) {
	        this.dispatch({
	            action: action,
	            type: type,
	            key: key,
	            data: data,
	            callback: callback
	        });
	    },

	    dataHandle: function(store, action, data, ComKey) {
	        this.dispatch({
	            store: store,
	            action: action,
	            ComKey: ComKey,
	            data: data
	        });
	    },

	    reply: function(action, data, comKey, callback) {
	        this.sendMessage(action, Constants.notice.REPLY, data, comKey, callback);
	    },

	    noReply: function(action, data, comKey) {
	        this.sendMessage(action, Constants.notice.NO_REPLY, data, comKey, null);
	    },

	    notice: function(action, data) {
	        this.sendMessage(action, Constants.notice.NOTICE, data, null, null);
	    },

	    storeHandle: function(store, action, data, comKey) {
	        this.dataHandle(store, action, data, comKey);
	    }
	});

	module.exports = Dispatcher;


/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	/* eslint-disable no-unused-vars */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (e) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * Created by tutu on 15-8-17.
	 */

	var Constants = {

	    notice: {
	        REPLY: "reply",
	        NO_REPLY: "no_reply",
	        NOTICE: "notice"
	    },

	    handle: {
	        REFRESH: "refresh",
	        CLOSE: "close",
	        CHECK: "check",
	        CLICK: "click",
	        RESIZE: "reSize",
	        MAX: "max",
	        MIN: "min",
	        PAGE: "page",
	        OPEN: "open"
	    },

	    event: {
	        WORK_MOUSE_POSITION: "mousePosition",
	        WORK_MOUSE_IN: "mouserIn",
	        WORK_MOUSE_OUT: "mouseOut",
	        WORK_MOUSE_UP: "mouseUp",
	        WORK_MOUSE_DOWN: "mouseDown",
	        WORK_MOUSE_STYLE: "mouseStyle",
	        ADD_WORK: "addWork",
	        DEL_WORK: "deleteWork",
	        CHANGE_WORK_SIZE: "changeWorkSize",
	        SELECT_WORK: "selectWork",
	        CHANGE_FULL: "changeFull"
	    },

	    listen: {
	        BEFORE: ":before",
	        AFTER: ":after"
	    },

	    storeAction: {
	        HANDLE: "handle"
	    },

	    storeActionType: {
	        SAVE: "save",
	        GET: "get",
	        DELETE: "delete"
	    },

	    store: {
	        DEMO: "demo"
	    },

	    workType: {
	        DEMO: "demo",
	        CHART: "chart"
	    }
	};

	module.exports = Constants;


/***/ },
/* 12 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-17.
	 */

	var Dispatcher = __webpack_require__(9);
	var Constants = __webpack_require__(11);

	var Actions = {
	    dispatcher: Dispatcher,

	    handle: function(comKey, handle, data, callback) {
	        this.dispatcher.reply(handle, data, comKey, callback);
	    },

	    event: function(event, data) {
	        this.dispatcher.notice(event, data);
	    },

	    storeHandle: function(store, action, data, comKey) {
	        this.dispatcher.storeHandle(store, action, data, comKey);
	    },

	    storeNotice: function(store, handle, listen, data) {
	        this.dispatcher.notice(store+handle+listen, data);
	    },

	    storeNoReply: function(comKey, store, handle, listen, data) {
	        this.dispatcher.noReply(store+handle+listen, data, comKey);
	    },

	    comNotice: function(ComKey, action, data) {
	        this.dispatcher.notice(ComKey+action, data);
	    }
	};

	module.exports = Actions;


/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * Created by tutu on 15-8-18.
	 */

	var Default = function() {
	    return {
	        getGKey: function(){
	            return this.componentKey ? this.componentKey : this.parComponentKey;
	        }
	    }
	};

	module.exports = Default;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2016 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
	/* global define */

	(function () {
		'use strict';

		var hasOwn = {}.hasOwnProperty;

		function classNames () {
			var classes = [];

			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;

				var argType = typeof arg;

				if (argType === 'string' || argType === 'number') {
					classes.push(arg);
				} else if (Array.isArray(arg)) {
					classes.push(classNames.apply(null, arg));
				} else if (argType === 'object') {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				}
			}

			return classes.join(' ');
		}

		if (typeof module !== 'undefined' && module.exports) {
			module.exports = classNames;
		} else if (true) {
			// register as 'classnames', consistent with npm package name
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return classNames;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			window.classNames = classNames;
		}
	}());


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	 /**
	 * Created by tutu on 15-8-26.
	 */

	var Element = __webpack_require__(6);
	var Default = __webpack_require__(14);
	var BaseButton = __webpack_require__(17);
	var BaseButtonGroup = __webpack_require__(18);
	var ModulePage = __webpack_require__(19);

	var ModuleTable = React.createClass({displayName: "ModuleTable",

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
	            React.createElement("div", {className: "module-table"}, 
	                React.createElement("table", {className: "table table-hover"}, 
	                    React.createElement("thead", null, 
	                        this.setHead(data.header)
	                    ), 
	                    React.createElement("tbody", null, 
	                        data.line.map(this.setLine)
	                    )
	                ), 
	                React.createElement(ModulePage, {gKey: this.getGKey(), maxNum: this.state.maxNum, num: this.state.num, page: this.state.page})
	            )
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
	                return React.createElement(BaseButtonGroup, {gKey: this.getGKey(), buttons: buttons});
	            }else {
	                return React.createElement(BaseButton, {gKey: this.getGKey(), data: id, status: status, 
	                                   action: data.action, title: data.title});
	            }
	    },

	    setHead: function(itemList, index) {
	        return React.createElement("tr", {key: index}, itemList.map(this.setTh));
	    },

	    setLine: function(itemList, index) {
	        return React.createElement("tr", {key: index}, itemList.map(this.setTd));
	    },

	    setTh: function(item, index) {
	        return React.createElement("th", {key: index}, item);
	    },

	    setTd: function(item, index) {
	        if(item.type == 'text') {
	            return React.createElement("td", {key: index}, item.value);
	        }else if(item.type == 'button') {
	            return React.createElement("td", {key: index}, this.setBtn(item.id, item.value));
	        }
	    }
	});

	module.exports = ModuleTable;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-26.
	 */

	var Actions = __webpack_require__(13);
	var Element = __webpack_require__(6);
	var Default = __webpack_require__(14);

	var BaseButton = React.createClass({displayName: "BaseButton",

	    mixins: [Element(), Default()],

	    getInitialState: function() {
	        return {data: this.props.data, action: this.props.action, status: this.props.status, title: this.props.title};
	    },

	    render: function() {
	        return (
	            React.createElement("a", {href: "javascript: void(0);", className: "Base-button btn btn-default btn-xs", 
	               onClick: this.handleClick}, this.state.title)
	        );
	    },

	    handleClick: function() {
	        this.handle(this.state.action, this.state.data);
	    }
	});

	module.exports = BaseButton;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-26.
	 */

	var BaseButton = __webpack_require__(17);
	var Element = __webpack_require__(6);
	var Default = __webpack_require__(14);

	var BaseButtonGroup = React.createClass({displayName: "BaseButtonGroup",

	    mixins: [Element(), Default()],

	    render: function() {
	        return (
	            React.createElement("div", {className: "base-button-group btn-group"}, 
	                this.props.buttons.map(this.setButton)
	            )
	        );
	    },

	    setButton: function(item) {
	        return React.createElement(BaseButton, {data: item.data, action: item.action, title: item.title, status: item.status});
	    }
	});

	module.exports = BaseButtonGroup;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	 /**
	 * Created by tutu on 15-8-26.
	 */

	var Element = __webpack_require__(6);
	var Default = __webpack_require__(14);
	var classNames = __webpack_require__(15);
	var Constants = __webpack_require__(11);
	var assign = __webpack_require__(10);

	var ModulePage = React.createClass({displayName: "ModulePage",

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
	        if(!this.state.maxPage || !this.state.page) return (React.createElement("nav", {className: "module-page"}));
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
	            React.createElement("nav", {className: "module-page"}, 
	                React.createElement("ul", {className: "pagination"}, 
	                    React.createElement("li", {className: preClassName, onClick: this.topPage}, 
	                        React.createElement("a", {href: "javascript:void(0);", "aria-label": "Top"}, 
	                            React.createElement("span", {className: "glyphicon glyphicon-fast-backward", "aria-hidden": "true"}))), 
	                    React.createElement("li", {className: preClassName, onClick: this.prePage}, 
	                        React.createElement("a", {href: "javascript:void(0);", "aria-label": "Previous"}, 
	                            React.createElement("span", {className: "glyphicon glyphicon-backward", "aria-hidden": "true"}))), 
	                    pageList.map(this.setPage), 
	                    React.createElement("li", {className: nextClassName, onClick: this.nextPage}, 
	                        React.createElement("a", {href: "javascript:void(0);", "aria-label": "Next"}, 
	                            React.createElement("span", {className: "glyphicon glyphicon-forward", "aria-hidden": "true"}))), 
	                    React.createElement("li", {className: nextClassName, onClick: this.lastPage}, 
	                        React.createElement("a", {href: "javascript:void(0);", "aria-label": "Last"}, 
	                            React.createElement("span", {className: "glyphicon glyphicon-fast-forward", "aria-hidden": "true"})))
	                )
	            )
	        );
	    },

	     setPage: function(item, index) {
	         var className = classNames({active: item == this.state.page});
	         return React.createElement("li", {className: className, key: index, onClick: this.selectPage}, React.createElement("a", {href: "javascript:void(0);"}, item));
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

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-18.
	 */

	var uuid = __webpack_require__(7);
	var ComNotice = __webpack_require__(21);
	var Constants = __webpack_require__(11);
	var Actions = __webpack_require__(13);

	var Component = function() {

	    return {
	        componentKey: undefined,

	        componentWillMount: function() {
	            this.componentKey = uuid.get();
	            ComNotice.addComponent(this.componentKey);
	        },

	        componentWillUnmount: function() {
	            ComNotice.removeComponent(this.componentKey);
	        },

	        getData: function(store, data, before, after) {
	            this.binds(store+Constants.storeActionType.GET, {BEFORE: before, AFTER: after}, true);
	            Actions.storeHandle(store, Constants.storeActionType.GET, data, this.componentKey);
	        },

	        binds: function(action, callbacks, once) {
	            var item;
	            for(item in Constants.listen){
	                if(callbacks[item]){
	                    if(once){
	                        this.bindOnce(action+Constants.listen[item], callbacks[item]);
	                    }else{
	                        this.bind(action+Constants.listen[item], callbacks[item]);
	                    }
	                }
	            }
	        },

	        bindOnce: function(action, callback) {
	            ComNotice.once(this.componentKey, action, callback);
	        },

	        bind: function(action, callback) {
	            ComNotice.addListener(this.componentKey, action, callback);
	        },

	        unbind: function(action, callback) {
	            ComNotice.removeListener(this.componentKey, action, callback);
	        },

	        sendNotice: function(action, data) {
	            Actions.comNotice(this.componentKey, action, data);
	        }
	    }
	};

	module.exports = Component;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-17.
	 */

	var Dispatcher = __webpack_require__(9);
	var EventEmitter = __webpack_require__(12).EventEmitter;
	var assign = __webpack_require__(10);
	var Constants = __webpack_require__(11);

	var ComNotice = {

	    componentList: {},

	    addComponent: function(key) {
	        this.componentList[key] = assign({}, EventEmitter.prototype);
	    },

	    removeComponent: function(key) {
	        this.componentList[key] = undefined;
	    },

	    getComponent: function(key){
	        return this.componentList[key];
	    },

	    emit: function(key, action, data) {
	        var component = this.getComponent(key);
	        if(component){
	            return component.emit(action, data);
	        }else{
	            return false;
	        }
	    },

	    once: function(key, action, callback) {
	        var component = this.getComponent(key);
	        if(component){
	            return component.once(action, callback);
	        }else{
	            return false;
	        }
	    },

	    addListener: function(key, action, callback) {
	        var component = this.getComponent(key);
	        if(component){
	            return component.addListener(action, callback);
	        }else{
	            return false;
	        }
	    },

	    removeListener: function(key, action, callback) {
	        var component = this.getComponent(key);
	        if(component){
	            return component.removeListener(action, callback);
	        }else{
	            return false;
	        }
	    },

	    handleReply: function(key, action, data, callback) {
	        var result = this.emit(key, action, data);
	        if(typeof callback === "function") callback(result);
	    },

	    handleNoReply: function(key, action, data) {
	        this.emit(key, action, data);
	    },

	    dispatcherIndex: Dispatcher.register(function(payload) {
	        var action = payload.action;
	        var type = payload.type;
	        var callback = payload.callback;
	        var key = payload.key;
	        var data = payload.data;
	        switch(type) {
	            case Constants.notice.REPLY:
	                ComNotice.handleReply(key, action, data, callback);
	                break;
	            case Constants.notice.NO_REPLY:
	                ComNotice.handleNoReply(key, action, data);
	                break;
	        }
	    })

	};
	module.exports = ComNotice;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-18.
	 */

	var uuid = __webpack_require__(7);
	var Constants = __webpack_require__(11);

	var Work = function() {

	    return {

	        loading: function() {
	            this.setState({loading:true});
	        },

	        loaded: function() {
	            this.setState({loading:false});
	        },

	        componentWillReceiveProps: function(nextProps) {
	            if(this.state.selected != nextProps.selected){
	                this.setState({
	                    selected: nextProps.selected
	                });
	            }
	        },

	        componentWillMount: function() {
	            this.bind(Constants.handle.REFRESH, this._actionRefresh);
	            this.bind(Constants.handle.CLOSE, this._actionClose);
	            this.bind(Constants.handle.RESIZE, this._actionReSize);
	            this.bind(Constants.handle.CLICK, this._actionClick);
	        },

	        _actionClick: function() {
	            this.event(Constants.event.SELECT_WORK, {workId: this.state.workId});
	        },

	        _actionReSize: function(data) {
	            this.event(Constants.event.CHANGE_WORK_SIZE, {workId: this.state.workId, size: data.size});
	            this.sendNotice(Constants.handle.RESIZE, data);
	        },

	        _actionRefresh: function() {
	            if(this.refresh && typeof this.refresh === "function") this.refresh();
	        },

	        _actionClose: function() {
	            this.event(Constants.event.DEL_WORK, {workId: this.state.workId});
	        }
	    }
	};

	module.exports = Work;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-11-14.
	 */

	var app = __webpack_require__(24);

	var all = 0;
	var debug = 1;
	var info = 2;
	var warn = 3;
	var error = 4;

	function argument(string, style, arg){
	    var argument = Array.prototype.slice.call(arg);
	    argument.unshift(style);
	    argument.unshift("%c "+string);
	    return argument;
	}

	var Log = {
	    info: function(){
	        if(app.logLevel <= info && app.logLevel != all) return;
	        console.info.apply(console, argument("[info]", "color:blue;font-weight: bold;", arguments));
	    },

	    warn : function(){
	        if(app.logLevel <= warn && app.logLevel != all) return;
	        console.warn.apply(console, argument("[warn]", "color:orange;font-weight: bold;", arguments));
	    },

	    debug: function(){
	        if(app.logLevel <= debug && app.logLevel != all) return;
	        console.log.apply(console, argument("[debug]", "color:cornflowerblue;font-weight: bold;", arguments));
	    },

	    error: function(){
	        if(app.logLevel <= error && app.logLevel != all) return;
	        console.error.apply(console, argument("[error]", "color:red;font-weight: bold;", arguments));
	    }
	};
	module.exports = Log;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-11-11.
	 */
	__webpack_require__(25);

	var app = {
	    container: document.getElementById('container'),
	    logLevel: 0
	};

	module.exports = app;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-17.
	 */

	var storeList = ['DemoStore'];

	var Store = {
	    init: function() {
	        storeList.map((item, index)=>{
	            __webpack_require__(26)("./"+item)
	        });
	    }
	};

	module.exports = Store.init();


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./DefaultStore": 27,
		"./DefaultStore.js": 27,
		"./DemoStore": 32,
		"./DemoStore.js": 32,
		"./Store": 25,
		"./Store.js": 25
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 26;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-17.
	 */

	var Constants = __webpack_require__(11);
	var Actions = __webpack_require__(13);
	var StoreNotice = __webpack_require__(28);
	var Promise = __webpack_require__(29);

	var Store = {

	    init: function() {
	        StoreNotice.addStore(this);
	    },

	    destroy: function() {
	        StoreNotice.removeStore(this.name);
	    },

	    before: function(action, data, key) {
	        if(key){
	            Actions.storeNoReply(key, this.name, action, Constants.listen.BEFORE, data);
	        }else{
	            Actions.storeNotice(this.name, action, Constants.listen.BEFORE, data);
	        }
	    },

	    after: function(action, data, key) {
	        if(key){
	            Actions.storeNoReply(key, this.name, action, Constants.listen.AFTER, data);
	        }else{
	            Actions.storeNotice(this.name, action, Constants.listen.AFTER, data);
	        }
	    },

	    handle: function(action, data, key) {
	        this.before(action, data, key);
	        var self = this;
	        this.process(action, data).then(function(request){
	            self.after(action, self.result(null, request), key);
	        }).catch(function(error){
	            self.after(action, self.result(error, null), key);
	        });
	    },

	    result: function(error, request) {
	        if(error){
	            return {status: 1, result: error}
	        }
	        return {status: 0, result: request}
	    }
	};

	module.exports = Store;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-17.
	 */

	var Dispatcher = __webpack_require__(9);
	var EventEmitter = __webpack_require__(12).EventEmitter;
	var assign = __webpack_require__(10);
	var Constants = __webpack_require__(11);

	var StoreNotice = {

	    storeList: {},

	    addStore: function(store) {
	        this.storeList[store.name] = store;
	    },

	    removeStore: function(name) {
	        this.storeList[name] = undefined;
	    },

	    getStore: function(name){
	        return this.storeList[name];
	    },

	    handle: function(name, action, data, ComKey) {
	        var store = this.getStore(name);
	        if(store) store.handle(action, data, ComKey);
	    },

	    dispatcherIndex: Dispatcher.register(function(payload) {
	        var store = payload.store;
	        var action = payload.action;
	        var ComKey = payload.ComKey;
	        var data = payload.data;
	        StoreNotice.handle(store, action, data, ComKey);
	    })

	};
	module.exports = StoreNotice;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var require;/* WEBPACK VAR INJECTION */(function(process, global) {/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
	 * @version   3.3.1
	 */

	(function (global, factory) {
	     true ? module.exports = factory() :
	    typeof define === 'function' && define.amd ? define(factory) :
	    (global.ES6Promise = factory());
	}(this, (function () { 'use strict';

	function objectOrFunction(x) {
	  return typeof x === 'function' || typeof x === 'object' && x !== null;
	}

	function isFunction(x) {
	  return typeof x === 'function';
	}

	var _isArray = undefined;
	if (!Array.isArray) {
	  _isArray = function (x) {
	    return Object.prototype.toString.call(x) === '[object Array]';
	  };
	} else {
	  _isArray = Array.isArray;
	}

	var isArray = _isArray;

	var len = 0;
	var vertxNext = undefined;
	var customSchedulerFn = undefined;

	var asap = function asap(callback, arg) {
	  queue[len] = callback;
	  queue[len + 1] = arg;
	  len += 2;
	  if (len === 2) {
	    // If len is 2, that means that we need to schedule an async flush.
	    // If additional callbacks are queued before the queue is flushed, they
	    // will be processed by this flush that we are scheduling.
	    if (customSchedulerFn) {
	      customSchedulerFn(flush);
	    } else {
	      scheduleFlush();
	    }
	  }
	};

	function setScheduler(scheduleFn) {
	  customSchedulerFn = scheduleFn;
	}

	function setAsap(asapFn) {
	  asap = asapFn;
	}

	var browserWindow = typeof window !== 'undefined' ? window : undefined;
	var browserGlobal = browserWindow || {};
	var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
	var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

	// test for web worker but not in IE10
	var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

	// node
	function useNextTick() {
	  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
	  // see https://github.com/cujojs/when/issues/410 for details
	  return function () {
	    return process.nextTick(flush);
	  };
	}

	// vertx
	function useVertxTimer() {
	  return function () {
	    vertxNext(flush);
	  };
	}

	function useMutationObserver() {
	  var iterations = 0;
	  var observer = new BrowserMutationObserver(flush);
	  var node = document.createTextNode('');
	  observer.observe(node, { characterData: true });

	  return function () {
	    node.data = iterations = ++iterations % 2;
	  };
	}

	// web worker
	function useMessageChannel() {
	  var channel = new MessageChannel();
	  channel.port1.onmessage = flush;
	  return function () {
	    return channel.port2.postMessage(0);
	  };
	}

	function useSetTimeout() {
	  // Store setTimeout reference so es6-promise will be unaffected by
	  // other code modifying setTimeout (like sinon.useFakeTimers())
	  var globalSetTimeout = setTimeout;
	  return function () {
	    return globalSetTimeout(flush, 1);
	  };
	}

	var queue = new Array(1000);
	function flush() {
	  for (var i = 0; i < len; i += 2) {
	    var callback = queue[i];
	    var arg = queue[i + 1];

	    callback(arg);

	    queue[i] = undefined;
	    queue[i + 1] = undefined;
	  }

	  len = 0;
	}

	function attemptVertx() {
	  try {
	    var r = require;
	    var vertx = __webpack_require__(31);
	    vertxNext = vertx.runOnLoop || vertx.runOnContext;
	    return useVertxTimer();
	  } catch (e) {
	    return useSetTimeout();
	  }
	}

	var scheduleFlush = undefined;
	// Decide what async method to use to triggering processing of queued callbacks:
	if (isNode) {
	  scheduleFlush = useNextTick();
	} else if (BrowserMutationObserver) {
	  scheduleFlush = useMutationObserver();
	} else if (isWorker) {
	  scheduleFlush = useMessageChannel();
	} else if (browserWindow === undefined && "function" === 'function') {
	  scheduleFlush = attemptVertx();
	} else {
	  scheduleFlush = useSetTimeout();
	}

	function then(onFulfillment, onRejection) {
	  var _arguments = arguments;

	  var parent = this;

	  var child = new this.constructor(noop);

	  if (child[PROMISE_ID] === undefined) {
	    makePromise(child);
	  }

	  var _state = parent._state;

	  if (_state) {
	    (function () {
	      var callback = _arguments[_state - 1];
	      asap(function () {
	        return invokeCallback(_state, child, callback, parent._result);
	      });
	    })();
	  } else {
	    subscribe(parent, child, onFulfillment, onRejection);
	  }

	  return child;
	}

	/**
	  `Promise.resolve` returns a promise that will become resolved with the
	  passed `value`. It is shorthand for the following:

	  ```javascript
	  let promise = new Promise(function(resolve, reject){
	    resolve(1);
	  });

	  promise.then(function(value){
	    // value === 1
	  });
	  ```

	  Instead of writing the above, your code now simply becomes the following:

	  ```javascript
	  let promise = Promise.resolve(1);

	  promise.then(function(value){
	    // value === 1
	  });
	  ```

	  @method resolve
	  @static
	  @param {Any} value value that the returned promise will be resolved with
	  Useful for tooling.
	  @return {Promise} a promise that will become fulfilled with the given
	  `value`
	*/
	function resolve(object) {
	  /*jshint validthis:true */
	  var Constructor = this;

	  if (object && typeof object === 'object' && object.constructor === Constructor) {
	    return object;
	  }

	  var promise = new Constructor(noop);
	  _resolve(promise, object);
	  return promise;
	}

	var PROMISE_ID = Math.random().toString(36).substring(16);

	function noop() {}

	var PENDING = void 0;
	var FULFILLED = 1;
	var REJECTED = 2;

	var GET_THEN_ERROR = new ErrorObject();

	function selfFulfillment() {
	  return new TypeError("You cannot resolve a promise with itself");
	}

	function cannotReturnOwn() {
	  return new TypeError('A promises callback cannot return that same promise.');
	}

	function getThen(promise) {
	  try {
	    return promise.then;
	  } catch (error) {
	    GET_THEN_ERROR.error = error;
	    return GET_THEN_ERROR;
	  }
	}

	function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
	  try {
	    then.call(value, fulfillmentHandler, rejectionHandler);
	  } catch (e) {
	    return e;
	  }
	}

	function handleForeignThenable(promise, thenable, then) {
	  asap(function (promise) {
	    var sealed = false;
	    var error = tryThen(then, thenable, function (value) {
	      if (sealed) {
	        return;
	      }
	      sealed = true;
	      if (thenable !== value) {
	        _resolve(promise, value);
	      } else {
	        fulfill(promise, value);
	      }
	    }, function (reason) {
	      if (sealed) {
	        return;
	      }
	      sealed = true;

	      _reject(promise, reason);
	    }, 'Settle: ' + (promise._label || ' unknown promise'));

	    if (!sealed && error) {
	      sealed = true;
	      _reject(promise, error);
	    }
	  }, promise);
	}

	function handleOwnThenable(promise, thenable) {
	  if (thenable._state === FULFILLED) {
	    fulfill(promise, thenable._result);
	  } else if (thenable._state === REJECTED) {
	    _reject(promise, thenable._result);
	  } else {
	    subscribe(thenable, undefined, function (value) {
	      return _resolve(promise, value);
	    }, function (reason) {
	      return _reject(promise, reason);
	    });
	  }
	}

	function handleMaybeThenable(promise, maybeThenable, then$$) {
	  if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
	    handleOwnThenable(promise, maybeThenable);
	  } else {
	    if (then$$ === GET_THEN_ERROR) {
	      _reject(promise, GET_THEN_ERROR.error);
	    } else if (then$$ === undefined) {
	      fulfill(promise, maybeThenable);
	    } else if (isFunction(then$$)) {
	      handleForeignThenable(promise, maybeThenable, then$$);
	    } else {
	      fulfill(promise, maybeThenable);
	    }
	  }
	}

	function _resolve(promise, value) {
	  if (promise === value) {
	    _reject(promise, selfFulfillment());
	  } else if (objectOrFunction(value)) {
	    handleMaybeThenable(promise, value, getThen(value));
	  } else {
	    fulfill(promise, value);
	  }
	}

	function publishRejection(promise) {
	  if (promise._onerror) {
	    promise._onerror(promise._result);
	  }

	  publish(promise);
	}

	function fulfill(promise, value) {
	  if (promise._state !== PENDING) {
	    return;
	  }

	  promise._result = value;
	  promise._state = FULFILLED;

	  if (promise._subscribers.length !== 0) {
	    asap(publish, promise);
	  }
	}

	function _reject(promise, reason) {
	  if (promise._state !== PENDING) {
	    return;
	  }
	  promise._state = REJECTED;
	  promise._result = reason;

	  asap(publishRejection, promise);
	}

	function subscribe(parent, child, onFulfillment, onRejection) {
	  var _subscribers = parent._subscribers;
	  var length = _subscribers.length;

	  parent._onerror = null;

	  _subscribers[length] = child;
	  _subscribers[length + FULFILLED] = onFulfillment;
	  _subscribers[length + REJECTED] = onRejection;

	  if (length === 0 && parent._state) {
	    asap(publish, parent);
	  }
	}

	function publish(promise) {
	  var subscribers = promise._subscribers;
	  var settled = promise._state;

	  if (subscribers.length === 0) {
	    return;
	  }

	  var child = undefined,
	      callback = undefined,
	      detail = promise._result;

	  for (var i = 0; i < subscribers.length; i += 3) {
	    child = subscribers[i];
	    callback = subscribers[i + settled];

	    if (child) {
	      invokeCallback(settled, child, callback, detail);
	    } else {
	      callback(detail);
	    }
	  }

	  promise._subscribers.length = 0;
	}

	function ErrorObject() {
	  this.error = null;
	}

	var TRY_CATCH_ERROR = new ErrorObject();

	function tryCatch(callback, detail) {
	  try {
	    return callback(detail);
	  } catch (e) {
	    TRY_CATCH_ERROR.error = e;
	    return TRY_CATCH_ERROR;
	  }
	}

	function invokeCallback(settled, promise, callback, detail) {
	  var hasCallback = isFunction(callback),
	      value = undefined,
	      error = undefined,
	      succeeded = undefined,
	      failed = undefined;

	  if (hasCallback) {
	    value = tryCatch(callback, detail);

	    if (value === TRY_CATCH_ERROR) {
	      failed = true;
	      error = value.error;
	      value = null;
	    } else {
	      succeeded = true;
	    }

	    if (promise === value) {
	      _reject(promise, cannotReturnOwn());
	      return;
	    }
	  } else {
	    value = detail;
	    succeeded = true;
	  }

	  if (promise._state !== PENDING) {
	    // noop
	  } else if (hasCallback && succeeded) {
	      _resolve(promise, value);
	    } else if (failed) {
	      _reject(promise, error);
	    } else if (settled === FULFILLED) {
	      fulfill(promise, value);
	    } else if (settled === REJECTED) {
	      _reject(promise, value);
	    }
	}

	function initializePromise(promise, resolver) {
	  try {
	    resolver(function resolvePromise(value) {
	      _resolve(promise, value);
	    }, function rejectPromise(reason) {
	      _reject(promise, reason);
	    });
	  } catch (e) {
	    _reject(promise, e);
	  }
	}

	var id = 0;
	function nextId() {
	  return id++;
	}

	function makePromise(promise) {
	  promise[PROMISE_ID] = id++;
	  promise._state = undefined;
	  promise._result = undefined;
	  promise._subscribers = [];
	}

	function Enumerator(Constructor, input) {
	  this._instanceConstructor = Constructor;
	  this.promise = new Constructor(noop);

	  if (!this.promise[PROMISE_ID]) {
	    makePromise(this.promise);
	  }

	  if (isArray(input)) {
	    this._input = input;
	    this.length = input.length;
	    this._remaining = input.length;

	    this._result = new Array(this.length);

	    if (this.length === 0) {
	      fulfill(this.promise, this._result);
	    } else {
	      this.length = this.length || 0;
	      this._enumerate();
	      if (this._remaining === 0) {
	        fulfill(this.promise, this._result);
	      }
	    }
	  } else {
	    _reject(this.promise, validationError());
	  }
	}

	function validationError() {
	  return new Error('Array Methods must be provided an Array');
	};

	Enumerator.prototype._enumerate = function () {
	  var length = this.length;
	  var _input = this._input;

	  for (var i = 0; this._state === PENDING && i < length; i++) {
	    this._eachEntry(_input[i], i);
	  }
	};

	Enumerator.prototype._eachEntry = function (entry, i) {
	  var c = this._instanceConstructor;
	  var resolve$$ = c.resolve;

	  if (resolve$$ === resolve) {
	    var _then = getThen(entry);

	    if (_then === then && entry._state !== PENDING) {
	      this._settledAt(entry._state, i, entry._result);
	    } else if (typeof _then !== 'function') {
	      this._remaining--;
	      this._result[i] = entry;
	    } else if (c === Promise) {
	      var promise = new c(noop);
	      handleMaybeThenable(promise, entry, _then);
	      this._willSettleAt(promise, i);
	    } else {
	      this._willSettleAt(new c(function (resolve$$) {
	        return resolve$$(entry);
	      }), i);
	    }
	  } else {
	    this._willSettleAt(resolve$$(entry), i);
	  }
	};

	Enumerator.prototype._settledAt = function (state, i, value) {
	  var promise = this.promise;

	  if (promise._state === PENDING) {
	    this._remaining--;

	    if (state === REJECTED) {
	      _reject(promise, value);
	    } else {
	      this._result[i] = value;
	    }
	  }

	  if (this._remaining === 0) {
	    fulfill(promise, this._result);
	  }
	};

	Enumerator.prototype._willSettleAt = function (promise, i) {
	  var enumerator = this;

	  subscribe(promise, undefined, function (value) {
	    return enumerator._settledAt(FULFILLED, i, value);
	  }, function (reason) {
	    return enumerator._settledAt(REJECTED, i, reason);
	  });
	};

	/**
	  `Promise.all` accepts an array of promises, and returns a new promise which
	  is fulfilled with an array of fulfillment values for the passed promises, or
	  rejected with the reason of the first passed promise to be rejected. It casts all
	  elements of the passed iterable to promises as it runs this algorithm.

	  Example:

	  ```javascript
	  let promise1 = resolve(1);
	  let promise2 = resolve(2);
	  let promise3 = resolve(3);
	  let promises = [ promise1, promise2, promise3 ];

	  Promise.all(promises).then(function(array){
	    // The array here would be [ 1, 2, 3 ];
	  });
	  ```

	  If any of the `promises` given to `all` are rejected, the first promise
	  that is rejected will be given as an argument to the returned promises's
	  rejection handler. For example:

	  Example:

	  ```javascript
	  let promise1 = resolve(1);
	  let promise2 = reject(new Error("2"));
	  let promise3 = reject(new Error("3"));
	  let promises = [ promise1, promise2, promise3 ];

	  Promise.all(promises).then(function(array){
	    // Code here never runs because there are rejected promises!
	  }, function(error) {
	    // error.message === "2"
	  });
	  ```

	  @method all
	  @static
	  @param {Array} entries array of promises
	  @param {String} label optional string for labeling the promise.
	  Useful for tooling.
	  @return {Promise} promise that is fulfilled when all `promises` have been
	  fulfilled, or rejected if any of them become rejected.
	  @static
	*/
	function all(entries) {
	  return new Enumerator(this, entries).promise;
	}

	/**
	  `Promise.race` returns a new promise which is settled in the same way as the
	  first passed promise to settle.

	  Example:

	  ```javascript
	  let promise1 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 1');
	    }, 200);
	  });

	  let promise2 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 2');
	    }, 100);
	  });

	  Promise.race([promise1, promise2]).then(function(result){
	    // result === 'promise 2' because it was resolved before promise1
	    // was resolved.
	  });
	  ```

	  `Promise.race` is deterministic in that only the state of the first
	  settled promise matters. For example, even if other promises given to the
	  `promises` array argument are resolved, but the first settled promise has
	  become rejected before the other promises became fulfilled, the returned
	  promise will become rejected:

	  ```javascript
	  let promise1 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 1');
	    }, 200);
	  });

	  let promise2 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      reject(new Error('promise 2'));
	    }, 100);
	  });

	  Promise.race([promise1, promise2]).then(function(result){
	    // Code here never runs
	  }, function(reason){
	    // reason.message === 'promise 2' because promise 2 became rejected before
	    // promise 1 became fulfilled
	  });
	  ```

	  An example real-world use case is implementing timeouts:

	  ```javascript
	  Promise.race([ajax('foo.json'), timeout(5000)])
	  ```

	  @method race
	  @static
	  @param {Array} promises array of promises to observe
	  Useful for tooling.
	  @return {Promise} a promise which settles in the same way as the first passed
	  promise to settle.
	*/
	function race(entries) {
	  /*jshint validthis:true */
	  var Constructor = this;

	  if (!isArray(entries)) {
	    return new Constructor(function (_, reject) {
	      return reject(new TypeError('You must pass an array to race.'));
	    });
	  } else {
	    return new Constructor(function (resolve, reject) {
	      var length = entries.length;
	      for (var i = 0; i < length; i++) {
	        Constructor.resolve(entries[i]).then(resolve, reject);
	      }
	    });
	  }
	}

	/**
	  `Promise.reject` returns a promise rejected with the passed `reason`.
	  It is shorthand for the following:

	  ```javascript
	  let promise = new Promise(function(resolve, reject){
	    reject(new Error('WHOOPS'));
	  });

	  promise.then(function(value){
	    // Code here doesn't run because the promise is rejected!
	  }, function(reason){
	    // reason.message === 'WHOOPS'
	  });
	  ```

	  Instead of writing the above, your code now simply becomes the following:

	  ```javascript
	  let promise = Promise.reject(new Error('WHOOPS'));

	  promise.then(function(value){
	    // Code here doesn't run because the promise is rejected!
	  }, function(reason){
	    // reason.message === 'WHOOPS'
	  });
	  ```

	  @method reject
	  @static
	  @param {Any} reason value that the returned promise will be rejected with.
	  Useful for tooling.
	  @return {Promise} a promise rejected with the given `reason`.
	*/
	function reject(reason) {
	  /*jshint validthis:true */
	  var Constructor = this;
	  var promise = new Constructor(noop);
	  _reject(promise, reason);
	  return promise;
	}

	function needsResolver() {
	  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	}

	function needsNew() {
	  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	}

	/**
	  Promise objects represent the eventual result of an asynchronous operation. The
	  primary way of interacting with a promise is through its `then` method, which
	  registers callbacks to receive either a promise's eventual value or the reason
	  why the promise cannot be fulfilled.

	  Terminology
	  -----------

	  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
	  - `thenable` is an object or function that defines a `then` method.
	  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
	  - `exception` is a value that is thrown using the throw statement.
	  - `reason` is a value that indicates why a promise was rejected.
	  - `settled` the final resting state of a promise, fulfilled or rejected.

	  A promise can be in one of three states: pending, fulfilled, or rejected.

	  Promises that are fulfilled have a fulfillment value and are in the fulfilled
	  state.  Promises that are rejected have a rejection reason and are in the
	  rejected state.  A fulfillment value is never a thenable.

	  Promises can also be said to *resolve* a value.  If this value is also a
	  promise, then the original promise's settled state will match the value's
	  settled state.  So a promise that *resolves* a promise that rejects will
	  itself reject, and a promise that *resolves* a promise that fulfills will
	  itself fulfill.


	  Basic Usage:
	  ------------

	  ```js
	  let promise = new Promise(function(resolve, reject) {
	    // on success
	    resolve(value);

	    // on failure
	    reject(reason);
	  });

	  promise.then(function(value) {
	    // on fulfillment
	  }, function(reason) {
	    // on rejection
	  });
	  ```

	  Advanced Usage:
	  ---------------

	  Promises shine when abstracting away asynchronous interactions such as
	  `XMLHttpRequest`s.

	  ```js
	  function getJSON(url) {
	    return new Promise(function(resolve, reject){
	      let xhr = new XMLHttpRequest();

	      xhr.open('GET', url);
	      xhr.onreadystatechange = handler;
	      xhr.responseType = 'json';
	      xhr.setRequestHeader('Accept', 'application/json');
	      xhr.send();

	      function handler() {
	        if (this.readyState === this.DONE) {
	          if (this.status === 200) {
	            resolve(this.response);
	          } else {
	            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
	          }
	        }
	      };
	    });
	  }

	  getJSON('/posts.json').then(function(json) {
	    // on fulfillment
	  }, function(reason) {
	    // on rejection
	  });
	  ```

	  Unlike callbacks, promises are great composable primitives.

	  ```js
	  Promise.all([
	    getJSON('/posts'),
	    getJSON('/comments')
	  ]).then(function(values){
	    values[0] // => postsJSON
	    values[1] // => commentsJSON

	    return values;
	  });
	  ```

	  @class Promise
	  @param {function} resolver
	  Useful for tooling.
	  @constructor
	*/
	function Promise(resolver) {
	  this[PROMISE_ID] = nextId();
	  this._result = this._state = undefined;
	  this._subscribers = [];

	  if (noop !== resolver) {
	    typeof resolver !== 'function' && needsResolver();
	    this instanceof Promise ? initializePromise(this, resolver) : needsNew();
	  }
	}

	Promise.all = all;
	Promise.race = race;
	Promise.resolve = resolve;
	Promise.reject = reject;
	Promise._setScheduler = setScheduler;
	Promise._setAsap = setAsap;
	Promise._asap = asap;

	Promise.prototype = {
	  constructor: Promise,

	  /**
	    The primary way of interacting with a promise is through its `then` method,
	    which registers callbacks to receive either a promise's eventual value or the
	    reason why the promise cannot be fulfilled.
	  
	    ```js
	    findUser().then(function(user){
	      // user is available
	    }, function(reason){
	      // user is unavailable, and you are given the reason why
	    });
	    ```
	  
	    Chaining
	    --------
	  
	    The return value of `then` is itself a promise.  This second, 'downstream'
	    promise is resolved with the return value of the first promise's fulfillment
	    or rejection handler, or rejected if the handler throws an exception.
	  
	    ```js
	    findUser().then(function (user) {
	      return user.name;
	    }, function (reason) {
	      return 'default name';
	    }).then(function (userName) {
	      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
	      // will be `'default name'`
	    });
	  
	    findUser().then(function (user) {
	      throw new Error('Found user, but still unhappy');
	    }, function (reason) {
	      throw new Error('`findUser` rejected and we're unhappy');
	    }).then(function (value) {
	      // never reached
	    }, function (reason) {
	      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
	      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
	    });
	    ```
	    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
	  
	    ```js
	    findUser().then(function (user) {
	      throw new PedagogicalException('Upstream error');
	    }).then(function (value) {
	      // never reached
	    }).then(function (value) {
	      // never reached
	    }, function (reason) {
	      // The `PedgagocialException` is propagated all the way down to here
	    });
	    ```
	  
	    Assimilation
	    ------------
	  
	    Sometimes the value you want to propagate to a downstream promise can only be
	    retrieved asynchronously. This can be achieved by returning a promise in the
	    fulfillment or rejection handler. The downstream promise will then be pending
	    until the returned promise is settled. This is called *assimilation*.
	  
	    ```js
	    findUser().then(function (user) {
	      return findCommentsByAuthor(user);
	    }).then(function (comments) {
	      // The user's comments are now available
	    });
	    ```
	  
	    If the assimliated promise rejects, then the downstream promise will also reject.
	  
	    ```js
	    findUser().then(function (user) {
	      return findCommentsByAuthor(user);
	    }).then(function (comments) {
	      // If `findCommentsByAuthor` fulfills, we'll have the value here
	    }, function (reason) {
	      // If `findCommentsByAuthor` rejects, we'll have the reason here
	    });
	    ```
	  
	    Simple Example
	    --------------
	  
	    Synchronous Example
	  
	    ```javascript
	    let result;
	  
	    try {
	      result = findResult();
	      // success
	    } catch(reason) {
	      // failure
	    }
	    ```
	  
	    Errback Example
	  
	    ```js
	    findResult(function(result, err){
	      if (err) {
	        // failure
	      } else {
	        // success
	      }
	    });
	    ```
	  
	    Promise Example;
	  
	    ```javascript
	    findResult().then(function(result){
	      // success
	    }, function(reason){
	      // failure
	    });
	    ```
	  
	    Advanced Example
	    --------------
	  
	    Synchronous Example
	  
	    ```javascript
	    let author, books;
	  
	    try {
	      author = findAuthor();
	      books  = findBooksByAuthor(author);
	      // success
	    } catch(reason) {
	      // failure
	    }
	    ```
	  
	    Errback Example
	  
	    ```js
	  
	    function foundBooks(books) {
	  
	    }
	  
	    function failure(reason) {
	  
	    }
	  
	    findAuthor(function(author, err){
	      if (err) {
	        failure(err);
	        // failure
	      } else {
	        try {
	          findBoooksByAuthor(author, function(books, err) {
	            if (err) {
	              failure(err);
	            } else {
	              try {
	                foundBooks(books);
	              } catch(reason) {
	                failure(reason);
	              }
	            }
	          });
	        } catch(error) {
	          failure(err);
	        }
	        // success
	      }
	    });
	    ```
	  
	    Promise Example;
	  
	    ```javascript
	    findAuthor().
	      then(findBooksByAuthor).
	      then(function(books){
	        // found books
	    }).catch(function(reason){
	      // something went wrong
	    });
	    ```
	  
	    @method then
	    @param {Function} onFulfilled
	    @param {Function} onRejected
	    Useful for tooling.
	    @return {Promise}
	  */
	  then: then,

	  /**
	    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
	    as the catch block of a try/catch statement.
	  
	    ```js
	    function findAuthor(){
	      throw new Error('couldn't find that author');
	    }
	  
	    // synchronous
	    try {
	      findAuthor();
	    } catch(reason) {
	      // something went wrong
	    }
	  
	    // async with promises
	    findAuthor().catch(function(reason){
	      // something went wrong
	    });
	    ```
	  
	    @method catch
	    @param {Function} onRejection
	    Useful for tooling.
	    @return {Promise}
	  */
	  'catch': function _catch(onRejection) {
	    return this.then(null, onRejection);
	  }
	};

	function polyfill() {
	    var local = undefined;

	    if (typeof global !== 'undefined') {
	        local = global;
	    } else if (typeof self !== 'undefined') {
	        local = self;
	    } else {
	        try {
	            local = Function('return this')();
	        } catch (e) {
	            throw new Error('polyfill failed because global object is unavailable in this environment');
	        }
	    }

	    var P = local.Promise;

	    if (P) {
	        var promiseToString = null;
	        try {
	            promiseToString = Object.prototype.toString.call(P.resolve());
	        } catch (e) {
	            // silently ignored
	        }

	        if (promiseToString === '[object Promise]' && !P.cast) {
	            return;
	        }
	    }

	    local.Promise = Promise;
	}

	polyfill();
	// Strange compat..
	Promise.polyfill = polyfill;
	Promise.Promise = Promise;

	return Promise;

	})));
	//# sourceMappingURL=es6-promise.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(30), (function() { return this; }())))

/***/ },
/* 30 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 31 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-17.
	 */

	var DefaultStore = __webpack_require__(27);
	var Constants = __webpack_require__(11);
	var assign = __webpack_require__(10);

	var DemoStore = assign({

	    name: Constants.store.DEMO,

	    process: function (data) {
	        return new Promise(function(resolve, reject){
	            return setTimeout(function(){
	                resolve(data);
	            }, 1000);
	        });
	    }

	}, DefaultStore);

	module.exports = DemoStore.init();

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-26.
	 */

	var ToolbarList = __webpack_require__(34);
	var Component = __webpack_require__(20);
	var Element = __webpack_require__(6);
	var Default = __webpack_require__(14);
	var Constants = __webpack_require__(11);

	var modules = [];
	modules.push({name: "DEMO", type: Constants.workType.DEMO});

	var Toolbar = React.createClass({displayName: "Toolbar",

	    mixins: [Component(), Element(), Default()],

	    moduleList: [],

	    componentWillMount: function() {
	        for(var i in modules){
	            this.moduleList.push(modules[i]);
	        }
	    },

	    render: function() {
	        return (
	            React.createElement("div", {className: "toolbar"}, 
	                React.createElement(ToolbarList, {gKey: this.getGKey(), moduleList: this.moduleList})
	            )
	        );
	    }
	});

	module.exports = Toolbar;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-26.
	 */

	var ToolbarItem = __webpack_require__(35);
	var Component = __webpack_require__(20);
	var Element = __webpack_require__(6);
	var Default = __webpack_require__(14);
	var Constants = __webpack_require__(11);

	var ToolbarList = React.createClass({displayName: "ToolbarList",

	    mixins: [Element(), Default()],

	    render: function() {
	        return (
	            React.createElement("div", {className: "toolbar-list"}, 
	                this.props.moduleList.map(this.setItem)
	            )
	        );
	    },

	    setItem: function(item, index) {
	        return React.createElement(ToolbarItem, {gKey: this.getGKey(), key: index, name: item.name, type: item.type})
	    }
	});

	module.exports = ToolbarList;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-26.
	 */

	var Element = __webpack_require__(6);
	var Default = __webpack_require__(14);
	var Constants = __webpack_require__(11);

	var ToolbarItem = React.createClass({displayName: "ToolbarItem",

	    mixins: [Element(), Default()],

	    render: function() {
	        return (
	            React.createElement("div", {className: "toolbar-item", onClick: this._click}, this.props.name)
	        );
	    },

	    _click: function() {
	        this.event(Constants.event.ADD_WORK, {type: this.props.type});
	    }
	});

	module.exports = ToolbarItem;

/***/ }
/******/ ]);