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
