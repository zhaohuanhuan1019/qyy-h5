import {
    SAVE_STAFFLIST,
    SAVE_GROUPTIME,
    SAVE_TEXTAREA,
    SAVE_SELECT,
    SAVE_CHECKBOX,
    SAVE_NUMBER,
    SAVE_DATE,
    SAVE_INPUTTEXT,
    RESET_SAVE,
    SAVE_ELEMENT,
    SAVE_ASSIGNEE,
    SAVE_REASON,
    RESET_REASON,
    SAVE_TYPEID,
    // SAVE_PATH,
    DO_RECALCULATE,
    ONLY_JUDGE,
    ONLY_JUDGEBYELEMENTS,
    SAVE_APPROVETYPE,
    SET_SEARCH_HISTORY
    // SAVE_DEFAULTURL,
    // SAVE_APPROVALPATH
} from './mutations-types.js';

import {
    judgeSave,
    judgeSubmit,
    judgeSubmitByElements
} from './utils';

export default{
    // 保存获取到的通讯录列表
    [SAVE_STAFFLIST] (state, staffsList) {
        state.staffsListFromAddress = staffsList;
    },
    // 重置保存提交验证状态
    [RESET_SAVE] (state) {
        state.save = {};
        state.canSave = false;
        state.canSubmit = false;
    },
    // 保存groupdate的数据
    [SAVE_GROUPTIME] (state, value) {
        let groupDate = 'groupDate_' + value.orderCode;
        state.value[groupDate] = value;
        judgeSave(state);
        judgeSubmit(state);

    },
    // 保存textarea组件信息
    [SAVE_TEXTAREA] (state, value) {
        let textarea = 'textarea_' + value.orderCode;
        state.value[textarea] = value;
        judgeSave(state);
        judgeSubmit(state);
    },
    // 保存text数据
    [SAVE_INPUTTEXT] (state, value) {
        let text = 'text_' + value.orderCode;
        state.value[text] = value;
        judgeSave(state);
        judgeSubmit(state);

    },
    // select
    [SAVE_SELECT] (state, value) {
        let radio = 'radio_' + value.orderCode;
        state.value[radio] = value;
        judgeSave(state);
        judgeSubmit(state);

    },
    // checkbox
    [SAVE_CHECKBOX] (state, value) {
        let checkbox = 'checkbox_' + value.orderCode;
        state.value[checkbox] = value;
        judgeSave(state);
        judgeSubmit(state);


    },
    // number
    [SAVE_NUMBER] (state, value) {
        let number = 'number_' + value.orderCode;
        state.value[number] = value;
        judgeSave(state);
        judgeSubmit(state);
    },
    // date
    [SAVE_DATE] (state, value) {
        let date = 'date_' + value.orderCode;
        state.value[date] = value;
        judgeSave(state);
        judgeSubmit(state);

    },
    // flow
    [SAVE_ASSIGNEE] (state, value) {
        state.assigneeInfo = value;
        judgeSave(state);
        judgeSubmit(state);
    },
    // 只判断状态
    [ONLY_JUDGE] (state) {
        judgeSave(state);
        judgeSubmit(state);
    },
    // 只判断元素对提交的控制状态
    [ONLY_JUDGEBYELEMENTS] (state) {
        judgeSubmitByElements(state);
    },
    // 计算
    [DO_RECALCULATE] (state) {
        judgeSave(state);
        judgeSubmit(state);
    },
    // 表单元素
    [SAVE_ELEMENT] (state, elements) {
        state.elements = elements;
    },
    // reason
    [SAVE_REASON] (state, reason) {
        state.reason = reason;
    },
    // 重置reason
    [RESET_REASON] (state) {
        state.reason = '';
    },
    // myapply  typeId
    [SAVE_TYPEID] (state, typeId) {
        state.myApplyTypeId = typeId;
    },
    // myapply  path
    // [SAVE_PATH] (state, path) {
    //     state.myApplyPath = path;
    // },
    // // myapproval  url
    // [SAVE_DEFAULTURL] (state, url) {
    //     state.myApprovalUrl = url;
    // },
    // // myapproval  path
    // [SAVE_APPROVALPATH] (state, path) {
    //     state.myApprovalPath = path;
    // },
    // myapproval approveListType
    [SAVE_APPROVETYPE] (state, type) {
        state.approveListType = type;
    },
    // 搜索历史
    [SET_SEARCH_HISTORY](state, history) {
        state.searchHistory = history;
    },
};
