import Vue from 'vue';
import VueX from 'vuex';
import mutations from './mutations';
import * as actions from './actions';
import {loadSearch} from 'approve/js/cache';
import module_attence from './module_attence';

Vue.use(VueX);

const state = {
    staffsListFromAddress: [],
    canSave: false,
    canSubmit: false,
    saveFlow: false,
    submitFlow: false,
    quitCheck: false,
    quitCheckCreate: false,
    value: {},
    elements: [],
    reason: '',
    myApplyTypeId: 1,
    // myApplyPath: '/apply/launch/',
    // myApprovalUrl: '/approve/myTasks?pageSize=10000&companyId=',
    // myApprovalPath: '/approval/wait/',
    approveListType: 0,
    stuffsFlag: true, // 标志全员信息是否请求
    homeFlag: true, // 标志是否请求主页类型列表
    searchHistory: loadSearch(),
};

export default new VueX.Store({
    state,
    mutations,
    actions,
    modules:{
        attence:module_attence
    },
});
