/**
 * Created by tutu on 15-8-19.
 */

var Demo = require("./work/Demo");
var Component = require("../mixins/Component");
var Element = require("../mixins/Element");
var Default = require("../mixins/Default");
var Constants = require("../constants/Constants");
var uuid = require("../tools/uuid");

var Workspace = React.createClass({

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
            <div className="workspace" ref="workspace" onMouseMove={this.mouseMoveHandle}
                 onMouseOver={this.mouseOverHandle} onMouseOut={this.mouseOutHandle}
                 onMouseUp={this.mouseUpHandle} onMouseDown={this.mouseDownHandle}>
                {this.state.list.map(this.setHtml)}
                <div className="full-item"><span className="glyphicon glyphicon-fullscreen" onClick={this.openFull}></span></div>
            </div>
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
                return <Demo gKey={this.getGKey()} size={item.size} key={item.workId}
                                  selected={selected} workId={item.workId}/>;
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