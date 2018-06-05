<template>
    <div class="myapproval-wrapper">
        <head-top class="header" :title='approvalTitle' :go='go' v-on:resetMyApprovalStatus="resetStatus"></head-top>

        <!--右上角操作列表-->

        <div class="more" @click="doBatchApprove" v-show="batchApproval">{{BATCH.moreContent}}</div>

        <!--待我审批 我已审批-->

        <div class='tab-wrapper'>
            <div class='tab-item'>
                <a @click="changeUrl(listType_wait)" :class="{active: listType_wait === listType}">
                    <span class='tab-name'>未审批的</span>
                    <span class='wait-apply-num' v-if="activeApproval">{{activeApproval}}</span>
                </a>
                <span class='middle-line'></span>
            </div>
            <div class='tab-item'>
                <a @click="changeUrl(listType_done)" :class="{active: listType_done === listType}">
                    <span class='tab-name'>已审批的</span>
                </a>
            </div>
        </div>

        <!--搜索 筛选-->

        <s-f-box ref="sfWrapper" :ifAble="SF.ifAble"
                 :fTips="SF.fTips"
                 :ifShowTipsWrapper="ifShowTipsWrapper"
                 :ifShowWrapper="ifShowWrapper"
                 @showSPage="showSPage"
                 @showFPage="showFPage"
                 @clearTips="clearTips"></s-f-box>

        <!--搜索页面 -->
        <search-box ref="searchBox"
                    @searchName="searchName"
                    v-on:hideSPage="hideSPage"
                    v-show="SF.ifShowSPage"
                    class="search-box-wrapper"></search-box>

        <!--筛选页面 -->
        <filter-box ref="filterBox" :entryType="entryType" :tabType="listType"
                    @quickFilter="quickFilter"
                    @hideFPage="hideFPage"
                    @getGroupReady="getGroupReady"
                    v-show="SF.ifShowFPage"
                    class="filter-box-wrapper"></filter-box>

        <!-- 全部列表区域 -->

        <div :class="{'change-top': SF.ifShowTips}" class="section-wrapper" v-show="showView">
            <router-view ref="childRouterList" v-if="noListShowIcon === false"
                         :entryType="entryType"
                         :approvalAwaitList="approvalAwaitList"
                         :approvalDoneList="approvalDoneList"
                         :searchList="SF.searchList"
                         :listType="listType"
                         :showApprovalStyle="BATCH.showApprovalStyle"
                         :ifAllBatchClicked="BATCH.ifAllBatchClicked"
                         v-on:refreshBatchNum="refreshBatchNum"></router-view>
            <div class="no-wait-apply" :class="{'no-icon': SF.searchNoData}" v-if="noListShowIcon === true">
                <span class="for-search" v-show="SF.searchNoData">{{ SF.noDataText }}</span>
                <span class="des" :class="{'search-size': SF.searchNoData}"  v-if="listType_wait === listType">{{ description }}</span>
                <span class="des" :class="{'search-size': SF.searchNoData}"  v-if="listType_done === listType">{{ description }}</span>
            </div>

        </div>

        <!--批量操作时 底部-->

        <div class="footer" v-if="listType === 0" v-show="BATCH.showApprovalStyle">
            <div class="batch-all-wrapper" @click="doBatchAll">
                <span class="batch" :class="{'in-batch': BATCH.ifAllBatchClicked}"></span>
                <span class="text-all">全选</span>
            </div>
            <span class="text-detail">{{ BATCH.batchDetail }}</span>
            <span class="button-submit" :class="{able: (BATCH.ifAllBatchClicked === true || BATCH.ifSomeoneBatch === true) && BATCH.canBatchSubmit === true}"
                  @click="batchSubmit">同意</span>
        </div>

        <!-- 应用权限关闭提示-->
        <no-Permission ></no-Permission>
        <!-- end -->
    </div>
</template>

<script>
    import headTop from 'approve/components/header/header';
    import SFBox from 'approve/components/searchfilter/sf';
    import searchBox from 'approve/components/searchfilter/searchbox';
    import filterBox from 'approve/components/searchfilter/filterBox';
    import { Toast, MessageBox } from 'mint-ui';
    import jsBridge from 'common/js/jsbridge';
    import {mapMutations} from 'vuex';
    import {approveMixin} from 'approve/js/mixin';

    export default {
        mixins: [approveMixin],
        components: {
            headTop,
            SFBox,
            searchBox,
            filterBox
        },
        data () {
            return {
                toAppJson: {
                    code: 0,
                    msg: '',
                    data: {
                        companyId : 1 // 1需要返回companyId
                    }
                },
                entryType: 0,
                approvalTitle: '我的审批',
                description: '',
                go: 'approvalToHome',
                unDoUrl: '/approve/myTasks',
                doneUrl: '/approve/myFinishedTask',
                path_0: '/approval/wait/',
                path_1: '/approval/done/',
                approvalAwaitList: [],
                approvalDoneList: [],
                listType_wait: 0,
                listType_done: 1,
                listType: this.$store.state.approveListType, // 列表类型 0: 待我审批
                noListShowIcon: null, // 暂无icon
                activeApproval: 0,
                showView: true,
                alreadyBack: false,
                SF: { // 搜索筛选数据
                    ifShowSPage: false,
                    ifShowFPage: false,
                    searchList: [],
                    fTips: '',
                    ifShowTips: false,
                    ifAble: true,
                    searchNoData: false,
                    noDataText: '搜索结果: 共0条',
                    params2Batch: {}
                },
                BATCH: { // 批量数据
                    showApprovalStyle: false, // 控制选择按钮
                    batchDetail: null, // 选中的
                    batchNum: null,
                    ifAllBatchClicked: false, // 是否点击了全选 可进行批量处理 :true
                    moreContent: '批量同意',
                    ifShowCancel: false, // 不显示 取消
                    ifSomeoneBatch: false, // 是否选择了任意个大于0 :true
                    canBatchSubmit: true // 能否重复点击同意
                }
            };
        },
        created () {
        	this.alreadyBack = false;
            this.initData(this.listType);
        },
        computed: {
            batchApproval () {
                return this.listType === this.listType_wait && this.approvalAwaitList.length > 0
            }
        },
        methods: {
            ...mapMutations([
                'SAVE_APPROVETYPE'
            ]),
            async searchName (name) {
                let obj = this.getUrl_Path(this.listType);
                let params = {
                    companyId: window.companyId,
                    pageSize: 10000,
                    authName: name
                };
                let s_f = 0;
                let body = await this.getApprovalFormLists(obj.url, params, s_f);

            },
            async quickFilter (params, tips, ifRefresh) {
                let obj = this.getUrl_Path(this.listType);
                let s_f = 1;
                let body;
                this.SF.fTips = '筛选条件: ' + tips;
                this.SF.params2Batch = params;

                if (ifRefresh) {
                    this.initData(this.listType);
                } else {
                    params.companyId = window.companyId;
                    params.pageSize = 10000;
                    body = await this.getApprovalFormLists(obj.url, params, s_f);
                    if (body.code === 0) {
                        this.SF.ifShowTips = true;
                    }
                }
            },
            clearTips () {
            	this.SF.fTips = '';
                this.SF.ifShowTips = false;
                this.initData(this.listType);

            },
            doBatchApprove () {
                // 控制 显示取消  批量同意
//                console.log(this.SF.ifShowSPage+'+++'+this.SF.ifShowFPage +'+++'+this.noListShowIcon)
                /*赵欢欢修改---解决点击搜索按钮后再批量同意按钮无反应问题*/
                if (/*this.SF.ifShowSPage ||*/ this.SF.ifShowFPage || this.noListShowIcon === true) {
                	return false;
                } else {
                    if (this.BATCH.ifShowCancel) {
                        this.BATCH.moreContent = '批量同意';
                        this.BATCH.showApprovalStyle = false;
                        this.$refs.childRouterList.checkedLists = [];
                    } else {
                        this.BATCH.moreContent = '取消';
                        this.BATCH.ifAllBatchClicked = false;
                        this.BATCH.showApprovalStyle = true;
                        this.BATCH.batchNum = 0;
                        this.BATCH.batchDetail = '请选择审批单';
                        this.$refs.childRouterList.checkedLists = [];
                    }

                    this.BATCH.ifShowCancel = !this.BATCH.ifShowCancel;
                }

            },
            refreshBatchNum (num) {
                if (0 < num && num <= this.approvalAwaitList.length) {
                    this.BATCH.ifSomeoneBatch = true;
                } else {
                    this.BATCH.ifSomeoneBatch = false;
                }
                if (num == this.approvalAwaitList.length) {
                    this.BATCH.ifAllBatchClicked = true;
                } else {
                    this.BATCH.ifAllBatchClicked = false;
                }
                this.BATCH.batchNum = num;
                this.BATCH.batchDetail = '已选' + this.BATCH.batchNum + '个审批单';
            },
            submit () {
                this.BATCH.canBatchSubmit = false;
                let params = {
                    companyId: window.companyId,
                    approveId: this.$refs.childRouterList.checkedLists,
                    result: true,
                    opinion: '',
                    isSingle: false
                };

                this.$http({
                    url: '/approve/doApproveTask',
                    method: 'POST',
                    headers: window.headers,
                    body: JSON.stringify(params)
                }).then((res) => {
                    let sendLength = this.$refs.childRouterList.checkedLists.length;
                    this.BATCH.ifAllBatchClicked = false;
                    this.$refs.childRouterList.checkedLists = [];

                    if (res.body.code === 0) {
                        let successLength = res.body.data.list.length;
                        if (sendLength > successLength) {
                            let fileLength = sendLength -successLength;
                            let instance = Toast(fileLength +'条失败');
                            setTimeout(() => {
                                instance.close();
                                this.BATCH.canBatchSubmit = true;
                            }, 2000);
                        } else {
                            let instance = Toast('审批已同意');
                            setTimeout(() => {
                                instance.close();
                                this.BATCH.canBatchSubmit = true;
                            }, 2000);
                        }
                        // 刷新列表
                        this.refreshData(this.unDoUrl);

                    } else {
                        let instance = Toast(res.body.msg);
                        setTimeout(() => {
                            instance.close();
                            this.BATCH.canBatchSubmit = true;
                        }, 2000);
                    }
                    this.BATCH.batchDetail = '请选择审批单';
                    this.BATCH.batchNum = 0;
                    this.BATCH.ifAllBatchClicked =false;
                    this.BATCH.ifSomeoneBatch = false;
                }, (res) => {
                    this.BATCH.ifAllBatchClicked = false;
                    this.$refs.childRouterList.checkedLists = [];

                    let instance = Toast(res.body.msg);
                    setTimeout(() => {
                        instance.close();
                        this.BATCH.canBatchSubmit = true;
                    }, 2000);
                    this.BATCH.batchDetail = '请选择审批单';
                    this.BATCH.batchNum = 0;
                    this.BATCH.ifAllBatchClicked =false;
                    this.BATCH.ifSomeoneBatch = false;
                });
            },
            batchSubmit () {
                if (this.BATCH.ifAllBatchClicked || this.BATCH.ifSomeoneBatch) {
                    // 提交数据
                    if (this.BATCH.canBatchSubmit) {
                        this.submit();
                    }
                }
            },
            doBatchAll () { // 全选按钮点击事件
                if (this.BATCH.ifAllBatchClicked) {
                    this.BATCH.batchNum = 0;
                    this.BATCH.batchDetail = '请选择审批单';
                    this.$refs.childRouterList.checkedLists = [];
                    this.$store.state.AllBatchClicked = false;
                } else {
                    this.BATCH.batchNum = this.approvalAwaitList.length;
                    this.BATCH.batchDetail = '已选' + this.BATCH.batchNum + '个审批单';
                    this.$store.state.AllBatchClicked = true;
                    this.$refs.childRouterList.checkedLists = [];
                    this.approvalAwaitList.forEach((item, index) => {
                        this.$refs.childRouterList.checkedLists.push(item.approveId);
                    })
                }

                this.BATCH.ifAllBatchClicked = !this.BATCH.ifAllBatchClicked;
            },
            clearBatchStatus () {
                this.BATCH.showApprovalStyle = false;
                this.BATCH.ifShowCancel = false;
                this.BATCH.moreContent = '批量同意';
            },
            changeUrl (type) {
            	this.$refs.sfWrapper.ifActive = false;
                this.SF.ifShowTips = false;
                this.noListShowIcon = null;

                this.SAVE_APPROVETYPE(type);
                this.listType = type;

                this.hideSPage();
                this.hideFPage();

                if (this.listType_done === type) {
                    this.BATCH.showApprovalStyle = false;
                }
                if (this.listType_wait === type) {
                    this.clearBatchStatus();
                }

                this.initData(type);
            },
            getApprovalFormLists (url, params, s_f) {
                this.SF.searchNoData = false;
                this.noListShowIcon = null;

                // 筛选结果上进行批量
                if (this.SF.ifShowTips) {
                    params = Object.assign(params, this.SF.params2Batch);
                }

                return new Promise((resolve, reject) => {
                    this.$http({
                        url: url,
                        method: 'GET',
                        headers: window.headers,
                        params: params
                    }).then((res) => {
                        if (res.body.code === 0) {
                            if (res.body.data.list.length) {
                                this.noListShowIcon = false;

                                let list = res.body.data.list;
                                if (s_f === 0) { // 搜索
                                    let name = params.authName;
                                    let reg = new RegExp('('+name+')', 'gi');
                                    let htmlStr = "<span style='color: #4590E4'>" + name + "</span>";
                                    for (let i = 0; i < list.length; i++) {
                                        let item = list[i];
                                        item.approves.ownerName = item.approves.ownerName.replace(reg, htmlStr);
                                    }
                                }

                                if (url === this.unDoUrl) {
                                    this.approvalAwaitList = list;
                                }
                                if (url === this.doneUrl) {
                                    this.approvalDoneList = list;
                                }
                            } else {
                                if (s_f === 0) { // 搜索
                                    this.SF.searchNoData = true;
                                    this.description = '没有符合条件的数据';

                                } else if (s_f === 1) { // 筛选
                                    this.description = '没有符合条件的数据';

                                } else {
                                    if (url === this.unDoUrl) {
                                        this.description = '暂无未审批事项';

                                        if (this.SF.ifShowTips) {
                                            this.description = '没有符合条件的数据';
                                        }
                                    }
                                    if (url === this.doneUrl) {
                                        this.description = '暂无已审批事项';
                                    }
                                }

                                this.noListShowIcon = true;
                            }

                            resolve(res.body);
                        } else {
                            this.noListShowIcon = null;
                        }
                    }, (res) => {
                        this.noListShowIcon = null;
                    });
                });
            },
            resetStatus () {
            	this.alreadyBack = true;
                this.$store.state.approveListType = this.listType_wait;
                this.$router.replace('/home');
            },
            getUrl_Path (type) {
                let path,
                    url;

                if (this.listType_done === type) {
                    path = this.path_1;
                    url = this.doneUrl;
                }
                if (this.listType_wait === type) {
                    path = this.path_0;
                    url = this.unDoUrl;
                }
                return {
                	url: url,
                    path: path
                };
            },
            async initData (type) {
            	let obj = this.getUrl_Path(type);

                let params = {
                    companyId: window.companyId,
                    pageSize: 10000
                };

                let approvalData = await this.getApprovalFormLists(obj.url, params);

                if (type === this.listType_wait) {
                    this.activeApproval = approvalData.data.list.length > 99 ? '99+' : approvalData.data.list.length;
                }
                if (!this.alreadyBack) {
                    this.$router.replace(obj.path);
                }
            },
            async refreshData (url) {
                let params = {
                    companyId: window.companyId,
                    pageSize: 10000
                };

                let approvalData = await this.getApprovalFormLists(url, params);
                if (approvalData.data.list.length <= 0) {
                    this.BATCH.showApprovalStyle = false;
                    this.BATCH.ifShowCancel = false;
                    this.BATCH.moreContent = '批量同意';
                }
                this.activeApproval = approvalData.data.list.length > 99 ? '99+' : approvalData.data.list.length;
            }
        }
    };

</script>

<style lang='scss' type='text/css' rel='stylesheet/scss' scoped>
    @import '../../../common/css/mixin';

    $headerHeight: .44rem;
    $tapHeight: .55rem;
    $sfHeight: .47rem;
    $sfTop: $headerHeight + $tapHeight;
    $listTop: $sfTop + $sfHeight;
    $tipHeight: .4rem;

    .myapproval-wrapper {
        font-size: .12rem;
    }

    .header {
        position: fixed !important;
        left: 0;
        top: 0;
        z-index: 100;
    }

    .tab-wrapper {
        width: 100%;
        height: $tapHeight;
        position: fixed;
        top: $headerHeight;
        box-sizing: border-box;
        line-height: $tapHeight;
        text-align: center;
        z-index: 100;
        background-color: #F3F4F5;

        .tab-item {
            position: relative;
            width: 50%;
            display: inline-block;
            float: left;
            height: $tapHeight;

            .middle-line {
                position: absolute;
                top: .18rem;
                right: 0;
                width: 1px;
                height: .2rem;
                border-right: 1px solid #E7E7ED;
            }

            & > a {
                display: block;
                height: 100%;
                font-size: .16rem;
                color: #9A9A9B;

                .tab-name {
                    display: inline-block;
                    box-sizing: border-box;
                    width: 100%;
                    height: $tapHeight;
                    font-size: .16rem;
                }

                &.active {
                    color: #4990E2;

                    .tab-name {
                        box-sizing: border-box;
                        border-bottom: 2px solid #4590E4;
                    }
                }
            }

            .wait-apply-num {
                $size: .14rem;
                position: absolute;
                top: .09rem;
                right: .5rem;
                min-width: $size;
                height: $size;
                /*padding: 0 .02rem;*/
                line-height: .16rem;
                background: #FF5A5A;
                border: 1px solid #FFFFFF;
                border-radius: $size;
                color: #ffffff;
                font-size: .1rem;
            }
        }
    }

    .section-wrapper {
        position: absolute;
        bottom: 0;
        top: $listTop;
        left: 0;
        right: 0;
        background-color: #F3F4F5;

        &.change-top {
            top: $listTop + $tipHeight;
        }
    }

    .no-wait-apply {
        position: relative;
        @include bg-image('../../../../static/image/null');
        background-size: 1.1rem 1.23rem;
        background-repeat: no-repeat;
        background-position: center .74rem;
        text-align: center;

        &.no-icon {
            background-image: none;
        }

        .des {
            display: inline-block;
            margin-top: 2.06rem;
            color: #999999;
            font-size: .14rem;

            &.search-size {
                font-size: .16rem;
            }
        }

        .for-search {
            display: inline-block;
            position: absolute;
            top: .105rem;
            left: .16rem;
            color: #999999;
            font-size: .14rem;
        }
    }

    .footer {
        height: .54rem;
        position: fixed;   //ios 上滑问题
        bottom: 0;
        left: 0;
        z-index: 200;
        width: 100%;
        background-color: #FFFFFF;
        border-top: 1px solid #e6e6ed;

        .batch-all-wrapper {
            display: inline-block;
            /*width: .82rem;*/
            height: 100%;

            .batch {
                position: absolute;
                left: 0;
                display: inline-block;
                width: .22rem;
                height: .22rem;
                padding: .16rem .14rem .16rem .14rem;
                background-size: .2rem;
                background-repeat: no-repeat;
                background-position: center;
                @include bg-image('../../../../static/image/notinbatch');

                &.in-batch {
                    @include bg-image('../../../../static/image/inbatch');
                }
            }

            .text-all {
                display: inline-block;
                /*width: .32rem;*/
                height: 100%;
                line-height: .54rem;
                font-size: .16rem;
                color: #333333;
                position: absolute;
                left: .5rem;
            }
        }

        .text-detail {
            position: absolute;
            left: 0.88rem;
            top: 0;
            padding: .17rem 0;
            line-height: .20rem;
            font-size: .14rem;
            color: #999999;
        }

        .button-submit {
            line-height: .22rem;
            font-size: .16rem;
            color: #C7DDF6;
            padding: .16rem;
            position: absolute;
            right: 0;
            top: 0;

            &.able {
                color: #4590E4;
            }
        }
    }

    .more {
        height: .30rem;
        padding: .14rem .14rem 0 0;
        position: fixed;
        right: 0;
        top: 0;
        display: inline-block;
        line-height: .22rem;
        font-size: .16rem;
        color: #ffffff;
        opacity: .84;
        z-index: 100;
    }

    .search-filter-wrapper {
        width: 100%;
        height: $sfHeight;
        position: fixed;
        top: $sfTop;
        box-sizing: border-box;
        line-height: $sfHeight;
        text-align: center;
        z-index: 100;
        background-color: #ffffff;

        .tab-item {
            position: relative;
            width: 50%;
            display: inline-block;
            float: left;

            & > a {
                position: relative;
                display: block;
                height: 100%;
                font-size: .14rem;
                color: #999999;

                .icon_s {
                    position: absolute;
                    top: .16rem;
                    left: .64rem;
                    width: .14rem;
                    height: .14rem;

                    @include bg-image('../../../../static/image/search');
                    background-size: 100%;
                }

                .icon_f {
                    position: absolute;
                    top: .16rem;
                    right: 1.1rem;
                    width: .15rem;
                    height: .17rem;

                    @include bg-image('../../../../static/image/filter_dis');
                    background-size: 100%;

                    &.active {
                        @include bg-image('../../../../static/image/filter');
                    }
                }

                .tab-name {
                    display: inline-block;
                    box-sizing: border-box;
                    height: $sfHeight;
                    font-size: .14rem;
                    color: #999999;
                }

                &.active {
                    color: #4A90E2;

                    .tab-name {

                    }
                }
            }
        }
    }

    /*<!--.search-box-wrapper {-->*/
        /*<!--position: fixed;-->*/
        /*<!--top: $sfTop + .87rem;-->*/
        /*<!--left: 0;-->*/
        /*<!--right: 0;-->*/
        /*<!--bottom: 0;-->*/
        /*<!--z-index: 99;-->*/
        /*<!--background-color: #ffffff;-->*/
    /*<!--}-->*/

    .filter-box-wrapper {
        position: absolute;
        top: $sfTop;
        left: 0;
        right: 0;
        z-index: 99;
        background-color: #ffffff;
    }

    .filter-tips {
        width: 100%;
        height: $tipHeight;
        position: fixed;
        top: $sfTop + $sfHeight;
        box-sizing: border-box;
        padding: 0 .6rem 0 0.16rem;
        line-height: $tipHeight;
        font-size: .14rem;
        color: #666666;
        z-index: 100;
        background-color: #F3F4F5;

        @include single-line;

        .clear-tips {
            position: absolute;
            top: 0;
            right: .16rem;
            color: #4590E4;
            height: $tipHeight;
        }
    }

</style>
