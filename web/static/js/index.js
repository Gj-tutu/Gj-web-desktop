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
	    var app = __webpack_require__(23);
	    app.init();

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
	var Component = __webpack_require__(19);
	var Default = __webpack_require__(13);

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

	var Demo = __webpack_require__(3);
	var Component = __webpack_require__(19);
	var Element = __webpack_require__(5);
	var Default = __webpack_require__(13);
	var Constants = __webpack_require__(10);
	var uuid = __webpack_require__(6);

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
	        switch (item.type){
	            case Constants.workType.DEMO:
	                return React.createElement(Demo, {gKey: this.getGKey(), size: item.size, key: item.workId, 
	                                  selected: selected, workId: item.workId});
	                break;
	        }
	        return;
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
	 * Created by tutu on 15-8-26.
	 */

	var ModuleFrame = __webpack_require__(4);
	var ModuleTable = __webpack_require__(15);
	var Component = __webpack_require__(19);
	var Element = __webpack_require__(5);
	var Default = __webpack_require__(13);
	var Work = __webpack_require__(21);
	var Constants = __webpack_require__(10);
	var log = __webpack_require__(22);

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
	            self.loaded();
	        });
	    },

	    refresh: function() {
	        this.getDemo();
	    }
	});

	module.exports = Demo;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-26.
	 */

	var Element = __webpack_require__(5);
	var Default = __webpack_require__(13);
	var Constants = __webpack_require__(10);
	var assign = __webpack_require__(9);
	var classNames = __webpack_require__(14);

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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-18.
	 */

	var uuid = __webpack_require__(6);
	var EleNotice = __webpack_require__(7);
	var Actions = __webpack_require__(12);
	var Constants = __webpack_require__(10);

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
/* 6 */
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-17.
	 */

	var Dispatcher = __webpack_require__(8);
	var EventEmitter = __webpack_require__(11).EventEmitter;
	var assign = __webpack_require__(9);
	var Constants = __webpack_require__(10);

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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var assign = __webpack_require__(9);
	var Constants = __webpack_require__(10);

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

	    dataHandle: function(store, type, data, ComKey) {
	        this.dispatch({
	            store: store,
	            type: type,
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

	    storeSave: function(store, data) {
	        this.dataHandle(store, Constants.storeHandle.SAVE, data, null, null);
	    },

	    storeDelete: function(store, data) {
	        this.dataHandle(store, Constants.storeHandle.DELETE, data, null, null);
	    },

	    storeGet: function(store, data, comKey) {
	        this.dataHandle(store, Constants.storeHandle.GET, data, comKey);
	    }
	});

	module.exports = Dispatcher;

/***/ },
/* 9 */
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
/* 10 */
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

	    storeHandle: {
	        SAVE: "Save",
	        DELETE: "Delete",
	        GET: "Get"
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
/* 11 */
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
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-17.
	 */

	var Dispatcher = __webpack_require__(8);
	var Constants = __webpack_require__(10);

	var Actions = {
	    dispatcher: Dispatcher,

	    handle: function(comKey, handle, data, callback) {
	        this.dispatcher.reply(handle, data, comKey, callback);
	    },

	    event: function(event, data) {
	        this.dispatcher.notice(event, data);
	    },

	    getData: function(comKey, store, data) {
	        this.dispatcher.storeGet(store, data, comKey);
	    },

	    storeHandle: function(store, handle, data) {
	        this.dispatcher["store"+handle](store, data);
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
/* 13 */
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
/* 14 */
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	 /**
	 * Created by tutu on 15-8-26.
	 */

	var Element = __webpack_require__(5);
	var Default = __webpack_require__(13);
	var BaseButton = __webpack_require__(16);
	var BaseButtonGroup = __webpack_require__(17);
	var ModulePage = __webpack_require__(18);

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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-26.
	 */

	var Actions = __webpack_require__(12);
	var Element = __webpack_require__(5);
	var Default = __webpack_require__(13);

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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-26.
	 */

	var BaseButton = __webpack_require__(16);
	var Element = __webpack_require__(5);
	var Default = __webpack_require__(13);

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
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	 /**
	 * Created by tutu on 15-8-26.
	 */

	var Element = __webpack_require__(5);
	var Default = __webpack_require__(13);
	var classNames = __webpack_require__(14);
	var Constants = __webpack_require__(10);
	var assign = __webpack_require__(9);

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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-18.
	 */

	var uuid = __webpack_require__(6);
	var ComNotice = __webpack_require__(20);
	var Constants = __webpack_require__(10);
	var Actions = __webpack_require__(12);

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
	            this.binds(store+Constants.storeHandle.GET, {BEFORE: before, AFTER: after}, true);
	            Actions.getData(this.componentKey, store, data);
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-17.
	 */

	var Dispatcher = __webpack_require__(8);
	var EventEmitter = __webpack_require__(11).EventEmitter;
	var assign = __webpack_require__(9);
	var Constants = __webpack_require__(10);

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
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-18.
	 */

	var uuid = __webpack_require__(6);
	var Constants = __webpack_require__(10);

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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-11-14.
	 */

	var app = __webpack_require__(23);

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
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-11-11.
	 */

	var app = {
	    init: function(){
	        var store = __webpack_require__(24);

	        store.init();
	    },
	    container: document.getElementById('container'),
	    logLevel: 0
	};

	module.exports = app;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-17.
	 */

	function initStore(item, index) {
	    item.init();
	}
	var storeList = [
	    __webpack_require__(25)
	];

	var Store = {
	    init: function() {
	        storeList.map(initStore);
	    }
	};

	module.exports = Store;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-17.
	 */

	var DefaultStore = __webpack_require__(26);
	var Constants = __webpack_require__(10);
	var assign = __webpack_require__(9);

	var DemoStore = assign({

	    name: Constants.store.DEMO,

	    handleSave: function (data) {
	        return;
	    },

	    handleDel: function (data) {
	        return;
	    },

	    handleGet: function (data) {
	        return new Promise(function(resolve, reject){
	            return setTimeout(function(){
	                resolve(data);
	            }, 1000);
	        });
	    }
	}, DefaultStore);

	module.exports = DemoStore;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-17.
	 */

	var Constants = __webpack_require__(10);
	var Actions = __webpack_require__(12);
	var StoreNotice = __webpack_require__(27);
	var Promise = __webpack_require__(28);
	var app = __webpack_require__(23);

	var Store = {

	    init: function() {
	        StoreNotice.addStore(this);
	    },

	    destroy: function() {
	        StoreNotice.removeStore(this.name);
	    },

	    before: function(handle, data, key) {
	        if(key){
	            Actions.storeNoReply(key, this.name, handle, Constants.listen.BEFORE, data);
	        }else{
	            Actions.storeNotice(this.name, handle, Constants.listen.BEFORE, data);
	        }
	    },

	    after: function(handle, data, key) {
	        if(key){
	            Actions.storeNoReply(key, this.name, handle, Constants.listen.AFTER, data);
	        }else{
	            Actions.storeNotice(this.name, handle, Constants.listen.AFTER, data);
	        }
	    },

	    save: function(data) {
	        this.before(Constants.storeHandle.SAVE, data);
	        var self = this;
	        this.handleSave(data).then(function(request){
	            self.after(Constants.storeHandle.SAVE, this.successRequest(request));
	        }).catch(function(request){
	            self.after(Constants.storeHandle.SAVE, this.errorRequest(request));
	        });
	    },

	    delete: function(data) {
	        this.before(Constants.storeHandle.DELETE, data);
	        var self = this;
	        this.handleDel(data).then(function(request){
	            self.after(Constants.storeHandle.DELETE, this.successRequest(request));
	        }).catch(function(request){
	            self.after(Constants.storeHandle.DELETE, this.errorRequest(request));
	        });
	    },

	    get: function(data, key) {
	        this.before(Constants.storeHandle.GET, data, key);
	        var self = this;
	        this.handleGet(data).then(function(request){
	            self.after(Constants.storeHandle.GET, self.successRequest(request), key);
	        }).catch(function(request){
	            self.after(Constants.storeHandle.GET, self.errorRequest(request), key);
	        });
	    },

	    successRequest: function(request) {
	        return {status: 0, result: request}
	    },

	    errorRequest: function(request) {
	        return {status: 1, result: request}
	    }
	};

	module.exports = Store;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-17.
	 */

	var Dispatcher = __webpack_require__(8);
	var EventEmitter = __webpack_require__(11).EventEmitter;
	var assign = __webpack_require__(9);
	var Constants = __webpack_require__(10);

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

	    handleSave: function(name, data) {
	        var store = this.getStore(name);
	        if(store) store.save(data);
	    },

	    handleGet: function(name, data, ComKey) {
	        var store = this.getStore(name);
	        if(store) store.get(data, ComKey);
	    },

	    handleDelete: function(name, data) {
	        var store = this.getStore(name);
	        if(store) store.delete(data);
	    },

	    dispatcherIndex: Dispatcher.register(function(payload) {
	        var store = payload.store;
	        var type = payload.type;
	        var ComKey = payload.ComKey;
	        var data = payload.data;
	        switch(type) {
	            case Constants.storeHandle.SAVE:
	                StoreNotice.handleSave(store, data);
	                break;
	            case Constants.storeHandle.DELETE:
	                StoreNotice.handleDelete(store, data);
	                break;
	            case Constants.storeHandle.GET:
	                StoreNotice.handleGet(store, data, ComKey);
	                break;
	        }
	    })

	};
	module.exports = StoreNotice;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var require;var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(process, global, module) {/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
	 * @version   3.2.1
	 */

	(function() {
	    "use strict";
	    function lib$es6$promise$utils$$objectOrFunction(x) {
	      return typeof x === 'function' || (typeof x === 'object' && x !== null);
	    }

	    function lib$es6$promise$utils$$isFunction(x) {
	      return typeof x === 'function';
	    }

	    function lib$es6$promise$utils$$isMaybeThenable(x) {
	      return typeof x === 'object' && x !== null;
	    }

	    var lib$es6$promise$utils$$_isArray;
	    if (!Array.isArray) {
	      lib$es6$promise$utils$$_isArray = function (x) {
	        return Object.prototype.toString.call(x) === '[object Array]';
	      };
	    } else {
	      lib$es6$promise$utils$$_isArray = Array.isArray;
	    }

	    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
	    var lib$es6$promise$asap$$len = 0;
	    var lib$es6$promise$asap$$vertxNext;
	    var lib$es6$promise$asap$$customSchedulerFn;

	    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
	      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
	      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
	      lib$es6$promise$asap$$len += 2;
	      if (lib$es6$promise$asap$$len === 2) {
	        // If len is 2, that means that we need to schedule an async flush.
	        // If additional callbacks are queued before the queue is flushed, they
	        // will be processed by this flush that we are scheduling.
	        if (lib$es6$promise$asap$$customSchedulerFn) {
	          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
	        } else {
	          lib$es6$promise$asap$$scheduleFlush();
	        }
	      }
	    }

	    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
	      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
	    }

	    function lib$es6$promise$asap$$setAsap(asapFn) {
	      lib$es6$promise$asap$$asap = asapFn;
	    }

	    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
	    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
	    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
	    var lib$es6$promise$asap$$isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

	    // test for web worker but not in IE10
	    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
	      typeof importScripts !== 'undefined' &&
	      typeof MessageChannel !== 'undefined';

	    // node
	    function lib$es6$promise$asap$$useNextTick() {
	      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
	      // see https://github.com/cujojs/when/issues/410 for details
	      return function() {
	        process.nextTick(lib$es6$promise$asap$$flush);
	      };
	    }

	    // vertx
	    function lib$es6$promise$asap$$useVertxTimer() {
	      return function() {
	        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
	      };
	    }

	    function lib$es6$promise$asap$$useMutationObserver() {
	      var iterations = 0;
	      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
	      var node = document.createTextNode('');
	      observer.observe(node, { characterData: true });

	      return function() {
	        node.data = (iterations = ++iterations % 2);
	      };
	    }

	    // web worker
	    function lib$es6$promise$asap$$useMessageChannel() {
	      var channel = new MessageChannel();
	      channel.port1.onmessage = lib$es6$promise$asap$$flush;
	      return function () {
	        channel.port2.postMessage(0);
	      };
	    }

	    function lib$es6$promise$asap$$useSetTimeout() {
	      return function() {
	        setTimeout(lib$es6$promise$asap$$flush, 1);
	      };
	    }

	    var lib$es6$promise$asap$$queue = new Array(1000);
	    function lib$es6$promise$asap$$flush() {
	      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
	        var callback = lib$es6$promise$asap$$queue[i];
	        var arg = lib$es6$promise$asap$$queue[i+1];

	        callback(arg);

	        lib$es6$promise$asap$$queue[i] = undefined;
	        lib$es6$promise$asap$$queue[i+1] = undefined;
	      }

	      lib$es6$promise$asap$$len = 0;
	    }

	    function lib$es6$promise$asap$$attemptVertx() {
	      try {
	        var r = require;
	        var vertx = __webpack_require__(31);
	        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
	        return lib$es6$promise$asap$$useVertxTimer();
	      } catch(e) {
	        return lib$es6$promise$asap$$useSetTimeout();
	      }
	    }

	    var lib$es6$promise$asap$$scheduleFlush;
	    // Decide what async method to use to triggering processing of queued callbacks:
	    if (lib$es6$promise$asap$$isNode) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
	    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
	    } else if (lib$es6$promise$asap$$isWorker) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
	    } else if (lib$es6$promise$asap$$browserWindow === undefined && "function" === 'function') {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertx();
	    } else {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
	    }
	    function lib$es6$promise$then$$then(onFulfillment, onRejection) {
	      var parent = this;

	      var child = new this.constructor(lib$es6$promise$$internal$$noop);

	      if (child[lib$es6$promise$$internal$$PROMISE_ID] === undefined) {
	        lib$es6$promise$$internal$$makePromise(child);
	      }

	      var state = parent._state;

	      if (state) {
	        var callback = arguments[state - 1];
	        lib$es6$promise$asap$$asap(function(){
	          lib$es6$promise$$internal$$invokeCallback(state, child, callback, parent._result);
	        });
	      } else {
	        lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
	      }

	      return child;
	    }
	    var lib$es6$promise$then$$default = lib$es6$promise$then$$then;
	    function lib$es6$promise$promise$resolve$$resolve(object) {
	      /*jshint validthis:true */
	      var Constructor = this;

	      if (object && typeof object === 'object' && object.constructor === Constructor) {
	        return object;
	      }

	      var promise = new Constructor(lib$es6$promise$$internal$$noop);
	      lib$es6$promise$$internal$$resolve(promise, object);
	      return promise;
	    }
	    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
	    var lib$es6$promise$$internal$$PROMISE_ID = Math.random().toString(36).substring(16);

	    function lib$es6$promise$$internal$$noop() {}

	    var lib$es6$promise$$internal$$PENDING   = void 0;
	    var lib$es6$promise$$internal$$FULFILLED = 1;
	    var lib$es6$promise$$internal$$REJECTED  = 2;

	    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

	    function lib$es6$promise$$internal$$selfFulfillment() {
	      return new TypeError("You cannot resolve a promise with itself");
	    }

	    function lib$es6$promise$$internal$$cannotReturnOwn() {
	      return new TypeError('A promises callback cannot return that same promise.');
	    }

	    function lib$es6$promise$$internal$$getThen(promise) {
	      try {
	        return promise.then;
	      } catch(error) {
	        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
	        return lib$es6$promise$$internal$$GET_THEN_ERROR;
	      }
	    }

	    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
	      try {
	        then.call(value, fulfillmentHandler, rejectionHandler);
	      } catch(e) {
	        return e;
	      }
	    }

	    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
	       lib$es6$promise$asap$$asap(function(promise) {
	        var sealed = false;
	        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
	          if (sealed) { return; }
	          sealed = true;
	          if (thenable !== value) {
	            lib$es6$promise$$internal$$resolve(promise, value);
	          } else {
	            lib$es6$promise$$internal$$fulfill(promise, value);
	          }
	        }, function(reason) {
	          if (sealed) { return; }
	          sealed = true;

	          lib$es6$promise$$internal$$reject(promise, reason);
	        }, 'Settle: ' + (promise._label || ' unknown promise'));

	        if (!sealed && error) {
	          sealed = true;
	          lib$es6$promise$$internal$$reject(promise, error);
	        }
	      }, promise);
	    }

	    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
	      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
	        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
	      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
	        lib$es6$promise$$internal$$reject(promise, thenable._result);
	      } else {
	        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
	          lib$es6$promise$$internal$$resolve(promise, value);
	        }, function(reason) {
	          lib$es6$promise$$internal$$reject(promise, reason);
	        });
	      }
	    }

	    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable, then) {
	      if (maybeThenable.constructor === promise.constructor &&
	          then === lib$es6$promise$then$$default &&
	          constructor.resolve === lib$es6$promise$promise$resolve$$default) {
	        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
	      } else {
	        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
	          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
	        } else if (then === undefined) {
	          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
	        } else if (lib$es6$promise$utils$$isFunction(then)) {
	          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
	        } else {
	          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
	        }
	      }
	    }

	    function lib$es6$promise$$internal$$resolve(promise, value) {
	      if (promise === value) {
	        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFulfillment());
	      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
	        lib$es6$promise$$internal$$handleMaybeThenable(promise, value, lib$es6$promise$$internal$$getThen(value));
	      } else {
	        lib$es6$promise$$internal$$fulfill(promise, value);
	      }
	    }

	    function lib$es6$promise$$internal$$publishRejection(promise) {
	      if (promise._onerror) {
	        promise._onerror(promise._result);
	      }

	      lib$es6$promise$$internal$$publish(promise);
	    }

	    function lib$es6$promise$$internal$$fulfill(promise, value) {
	      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

	      promise._result = value;
	      promise._state = lib$es6$promise$$internal$$FULFILLED;

	      if (promise._subscribers.length !== 0) {
	        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
	      }
	    }

	    function lib$es6$promise$$internal$$reject(promise, reason) {
	      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
	      promise._state = lib$es6$promise$$internal$$REJECTED;
	      promise._result = reason;

	      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
	    }

	    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
	      var subscribers = parent._subscribers;
	      var length = subscribers.length;

	      parent._onerror = null;

	      subscribers[length] = child;
	      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
	      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

	      if (length === 0 && parent._state) {
	        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
	      }
	    }

	    function lib$es6$promise$$internal$$publish(promise) {
	      var subscribers = promise._subscribers;
	      var settled = promise._state;

	      if (subscribers.length === 0) { return; }

	      var child, callback, detail = promise._result;

	      for (var i = 0; i < subscribers.length; i += 3) {
	        child = subscribers[i];
	        callback = subscribers[i + settled];

	        if (child) {
	          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
	        } else {
	          callback(detail);
	        }
	      }

	      promise._subscribers.length = 0;
	    }

	    function lib$es6$promise$$internal$$ErrorObject() {
	      this.error = null;
	    }

	    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

	    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
	      try {
	        return callback(detail);
	      } catch(e) {
	        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
	        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
	      }
	    }

	    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
	      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
	          value, error, succeeded, failed;

	      if (hasCallback) {
	        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

	        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
	          failed = true;
	          error = value.error;
	          value = null;
	        } else {
	          succeeded = true;
	        }

	        if (promise === value) {
	          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
	          return;
	        }

	      } else {
	        value = detail;
	        succeeded = true;
	      }

	      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
	        // noop
	      } else if (hasCallback && succeeded) {
	        lib$es6$promise$$internal$$resolve(promise, value);
	      } else if (failed) {
	        lib$es6$promise$$internal$$reject(promise, error);
	      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
	        lib$es6$promise$$internal$$fulfill(promise, value);
	      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
	        lib$es6$promise$$internal$$reject(promise, value);
	      }
	    }

	    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
	      try {
	        resolver(function resolvePromise(value){
	          lib$es6$promise$$internal$$resolve(promise, value);
	        }, function rejectPromise(reason) {
	          lib$es6$promise$$internal$$reject(promise, reason);
	        });
	      } catch(e) {
	        lib$es6$promise$$internal$$reject(promise, e);
	      }
	    }

	    var lib$es6$promise$$internal$$id = 0;
	    function lib$es6$promise$$internal$$nextId() {
	      return lib$es6$promise$$internal$$id++;
	    }

	    function lib$es6$promise$$internal$$makePromise(promise) {
	      promise[lib$es6$promise$$internal$$PROMISE_ID] = lib$es6$promise$$internal$$id++;
	      promise._state = undefined;
	      promise._result = undefined;
	      promise._subscribers = [];
	    }

	    function lib$es6$promise$promise$all$$all(entries) {
	      return new lib$es6$promise$enumerator$$default(this, entries).promise;
	    }
	    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
	    function lib$es6$promise$promise$race$$race(entries) {
	      /*jshint validthis:true */
	      var Constructor = this;

	      if (!lib$es6$promise$utils$$isArray(entries)) {
	        return new Constructor(function(resolve, reject) {
	          reject(new TypeError('You must pass an array to race.'));
	        });
	      } else {
	        return new Constructor(function(resolve, reject) {
	          var length = entries.length;
	          for (var i = 0; i < length; i++) {
	            Constructor.resolve(entries[i]).then(resolve, reject);
	          }
	        });
	      }
	    }
	    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
	    function lib$es6$promise$promise$reject$$reject(reason) {
	      /*jshint validthis:true */
	      var Constructor = this;
	      var promise = new Constructor(lib$es6$promise$$internal$$noop);
	      lib$es6$promise$$internal$$reject(promise, reason);
	      return promise;
	    }
	    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;


	    function lib$es6$promise$promise$$needsResolver() {
	      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	    }

	    function lib$es6$promise$promise$$needsNew() {
	      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	    }

	    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
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
	      var promise = new Promise(function(resolve, reject) {
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
	          var xhr = new XMLHttpRequest();

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
	    function lib$es6$promise$promise$$Promise(resolver) {
	      this[lib$es6$promise$$internal$$PROMISE_ID] = lib$es6$promise$$internal$$nextId();
	      this._result = this._state = undefined;
	      this._subscribers = [];

	      if (lib$es6$promise$$internal$$noop !== resolver) {
	        typeof resolver !== 'function' && lib$es6$promise$promise$$needsResolver();
	        this instanceof lib$es6$promise$promise$$Promise ? lib$es6$promise$$internal$$initializePromise(this, resolver) : lib$es6$promise$promise$$needsNew();
	      }
	    }

	    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
	    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
	    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
	    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
	    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
	    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
	    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;

	    lib$es6$promise$promise$$Promise.prototype = {
	      constructor: lib$es6$promise$promise$$Promise,

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
	      var result;

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
	      var author, books;

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
	      then: lib$es6$promise$then$$default,

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
	      'catch': function(onRejection) {
	        return this.then(null, onRejection);
	      }
	    };
	    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;
	    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
	      this._instanceConstructor = Constructor;
	      this.promise = new Constructor(lib$es6$promise$$internal$$noop);

	      if (!this.promise[lib$es6$promise$$internal$$PROMISE_ID]) {
	        lib$es6$promise$$internal$$makePromise(this.promise);
	      }

	      if (lib$es6$promise$utils$$isArray(input)) {
	        this._input     = input;
	        this.length     = input.length;
	        this._remaining = input.length;

	        this._result = new Array(this.length);

	        if (this.length === 0) {
	          lib$es6$promise$$internal$$fulfill(this.promise, this._result);
	        } else {
	          this.length = this.length || 0;
	          this._enumerate();
	          if (this._remaining === 0) {
	            lib$es6$promise$$internal$$fulfill(this.promise, this._result);
	          }
	        }
	      } else {
	        lib$es6$promise$$internal$$reject(this.promise, lib$es6$promise$enumerator$$validationError());
	      }
	    }

	    function lib$es6$promise$enumerator$$validationError() {
	      return new Error('Array Methods must be provided an Array');
	    }

	    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
	      var length  = this.length;
	      var input   = this._input;

	      for (var i = 0; this._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
	        this._eachEntry(input[i], i);
	      }
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
	      var c = this._instanceConstructor;
	      var resolve = c.resolve;

	      if (resolve === lib$es6$promise$promise$resolve$$default) {
	        var then = lib$es6$promise$$internal$$getThen(entry);

	        if (then === lib$es6$promise$then$$default &&
	            entry._state !== lib$es6$promise$$internal$$PENDING) {
	          this._settledAt(entry._state, i, entry._result);
	        } else if (typeof then !== 'function') {
	          this._remaining--;
	          this._result[i] = entry;
	        } else if (c === lib$es6$promise$promise$$default) {
	          var promise = new c(lib$es6$promise$$internal$$noop);
	          lib$es6$promise$$internal$$handleMaybeThenable(promise, entry, then);
	          this._willSettleAt(promise, i);
	        } else {
	          this._willSettleAt(new c(function(resolve) { resolve(entry); }), i);
	        }
	      } else {
	        this._willSettleAt(resolve(entry), i);
	      }
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
	      var promise = this.promise;

	      if (promise._state === lib$es6$promise$$internal$$PENDING) {
	        this._remaining--;

	        if (state === lib$es6$promise$$internal$$REJECTED) {
	          lib$es6$promise$$internal$$reject(promise, value);
	        } else {
	          this._result[i] = value;
	        }
	      }

	      if (this._remaining === 0) {
	        lib$es6$promise$$internal$$fulfill(promise, this._result);
	      }
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
	      var enumerator = this;

	      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
	        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
	      }, function(reason) {
	        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
	      });
	    };
	    function lib$es6$promise$polyfill$$polyfill() {
	      var local;

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

	      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
	        return;
	      }

	      local.Promise = lib$es6$promise$promise$$default;
	    }
	    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

	    var lib$es6$promise$umd$$ES6Promise = {
	      'Promise': lib$es6$promise$promise$$default,
	      'polyfill': lib$es6$promise$polyfill$$default
	    };

	    /* global define:true module:true window: true */
	    if ("function" === 'function' && __webpack_require__(32)['amd']) {
	      !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return lib$es6$promise$umd$$ES6Promise; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined' && module['exports']) {
	      module['exports'] = lib$es6$promise$umd$$ES6Promise;
	    } else if (typeof this !== 'undefined') {
	      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
	    }

	    lib$es6$promise$polyfill$$default();
	}).call(this);


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(29), (function() { return this; }()), __webpack_require__(30)(module)))

/***/ },
/* 29 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
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
	    var timeout = setTimeout(cleanUpNextTick);
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
	    clearTimeout(timeout);
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
	        setTimeout(drainQueue, 0);
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
/* 30 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 31 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by tutu on 15-8-26.
	 */

	var ToolbarList = __webpack_require__(34);
	var Component = __webpack_require__(19);
	var Element = __webpack_require__(5);
	var Default = __webpack_require__(13);
	var Constants = __webpack_require__(10);

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
	var Component = __webpack_require__(19);
	var Element = __webpack_require__(5);
	var Default = __webpack_require__(13);
	var Constants = __webpack_require__(10);

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

	var Element = __webpack_require__(5);
	var Default = __webpack_require__(13);
	var Constants = __webpack_require__(10);

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