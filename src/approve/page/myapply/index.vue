<template>
    <div class="myapply-wrapper">
        <head-top class="header" :title='applyTitle' :go='go' v-on:resetMyApplyStatus="resetStatus"></head-top>
        <div class='tab-wrapper'>
            <div class='tab-item'>
                <a @click='changeTypeId(type_1)' :class="{active: typeId===1}">
                    <span class='tab-name'>已发起的</span>
                </a>
                <span class='middle-line'></span>

            </div>
            <div class='tab-item'>
                <a @click='changeTypeId(type_0)' :class="{active: typeId===0}">
                    <span class='tab-name'>草稿箱</span>
                </a>
                <span class='middle-line'></span>

            </div>
            <div class='tab-item'>
                <a @click='changeTypeId(type_2)' :class="{active: typeId===2}">
                    <span class='tab-name'>已归档</span>
                </a>
            </div>
        </div>
        <!--搜索 筛选-->

        <s-f-box v-show="SF.showSF" ref="sfWrapper" :ifAble="SF.ifAble"
                 :fTips="SF.fTips"
                 :ifShowTipsWrapper="ifShowTipsWrapper"
                 :ifShowWrapper="ifShowWrapper"
                 @showSPage="showSPage"
                 @showFPage="showFPage"
                 @clearTips="clearTips"></s-f-box>

        <!--搜索页面 -->
        <search-box @searchName="searchName" v-on:hideSPage="hideSPage" v-show="SF.ifShowSPage" class="search-box-wrapper"></search-box>

        <!--筛选页面 -->
        <filter-box ref="filterBox" :entryType="entryType" :tabType="typeId"
                    @getGroupReady="getGroupReady"
                    @quickFilter="quickFilter"
                    @hideFPage="hideFPage"
                    v-show="SF.ifShowFPage"
                    class="filter-box-wrapper"></filter-box>

        <!-- 全部列表区域 -->

        <div :class="{'change-top': SF.ifShowTips, 'in-draft-top': !SF.showSF}" class="section-wrapper" v-show="showView">
            <!--有无数据 显示内容-->
            <router-view ref="draftListInit" v-if="noListShowIcon === true"
                         :entryType="entryType"
                         :draftList="draftList"
                         :launchList="launchList"
                         :filedList="filedList"
                         :typeId="typeId"
                         v-on:showNoDrafts="showNoDrafts"></router-view>
            <div class="no-wait-apply" :class="{'no-icon': SF.searchNoData}" v-if="noListShowIcon === false">
                <span class="for-search" v-show="SF.searchNoData">{{ SF.noDataText }}</span>
                <span class="des" :class="{'search-size': SF.searchNoData}" v-if="typeId === 1">{{ description }}</span>
                <span class="des" :class="{'search-size': SF.searchNoData}" v-if="typeId === 0">{{ description }}</span>
                <span class="des" :class="{'search-size': SF.searchNoData}" v-if="typeId === 2">{{ description }}</span>
            </div>
        </div>

        <!-- 应用权限关闭提示-->
        <no-Permission ></no-Permission>
        <!-- end -->
    </div>
</template>

<script type='text/ecmascript-6'>
    import headTop from 'approve/components/header/header';
    import SFBox from 'approve/components/searchfilter/sf';
    import searchBox from 'approve/components/searchfilter/searchbox';
    import filterBox from 'approve/components/searchfilter/filterBox';
    import {mapMutations} from 'vuex';
    import jsBridge from 'common/js/jsbridge';
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
                entryType: 1,
                type_0: 0, // 草稿
                type_1: 1, // 我发起的
                type_2: 2, // 已归档
                path_0: '/apply/draft/',  // 初始化路由
                path_1: '/apply/launch/',   // 初始化路由
                path_2: '/apply/filed/',   // 初始化路由
                typeId: this.$store.state.myApplyTypeId,
                applyTitle: '我的申请',
                description: '',
                go: 'applyToHome',
                noListShowIcon: null,
                draftList: [],
                launchList: [],
                filedList: [],
                showView: true,
                alreadyBack: false,
                SF: { // 搜索筛选数据
                    ifShowSPage: false,
                    ifShowFPage: false,
                    searchList: [],
                    fTips: '',
                    ifShowTips: false,
                    ifAble: false,
                    searchNoData: false,
                    noDataText: '搜索结果: 共0条',
                    showSF: true
                }
            };
        },
        created () {
    		this.alreadyBack = false;
            if (this.typeId === this.type_0) {
                this.SF.showSF = false;
            } else {
                this.SF.showSF = true;
            }
//            console.log(this.SF.showSF);

            this.initData(this.typeId);
        },
        methods: {
            ...mapMutations([
            	'SAVE_TYPEID'
            ]),
            clearTips () {
                this.SF.fTips = '';
                this.SF.ifShowTips = false;
                this.initData(this.typeId);

            },
            showNoDrafts () {
            	this.noListShowIcon = false; // 删完草稿显示暂无icon
            },
            changeTypeId (type) {
//            	console.log(type, 'type----------')
//                console.log(this.typeId, 'this.typeId===========')
            	if (type === this.type_0) {
            		this.SF.showSF = false;
                } else {
                    this.SF.showSF = true;
                }
                this.$refs.sfWrapper.ifActive = false;
                this.SF.ifShowTips = false;
                this.noListShowIcon = null;

            	this.SAVE_TYPEID(type);
                this.typeId = type;

                this.hideSPage();
                this.hideFPage();

                this.initData(type);

                if (type === 0) {
                    let toAppJson = {
                        code: 0,
                        msg: '',
                        data: {
                            draftsClick: 1, // 控制草稿首次提示
                        }
                    };
                    jsBridge.getExtra(JSON.stringify(toAppJson));
                }
            },
            async searchName (name) {
                let params = {
                    companyId: window.companyId,
                    pageSize: 10000,
                    typeId: this.typeId,
                    authName: name
                };
                let s_f = 0;
                let body = await this.getApprovalFormLists(params, s_f);
            },
            async quickFilter (params, tips, ifRefresh) {
                let s_f = 1;
                let body;
                this.SF.fTips = '筛选条件: ' + tips;

                if (ifRefresh) {
                    this.initData(this.typeId);
                } else {
                    params.companyId = window.companyId;
                    params.pageSize = 10000;
                    params.typeId = this.typeId;
                    body = await this.getApprovalFormLists(params, s_f);

                    if (body.code === 0) {
                        this.SF.ifShowTips = true;
                    }
                }
            },
            getUrl_Path (type) {
                let path;

                if (this.type_0 === type) {
                    path = this.path_0;
                }
                if (this.type_1 === type) {
                    path = this.path_1;
                }
                if (this.type_2 === type) {
                    path = this.path_2;
                }
                return path;
            },
            async initData (type) {
                let path = this.getUrl_Path(type);

                let params = {
                    companyId: window.companyId,
                    pageSize: 10000,
                    typeId: type
                };

                let approvalData = await this.getApprovalFormLists(params);

                if (!this.alreadyBack) {
                    this.$router.replace(path); // 点击跳转
                }
            },
            getApprovalFormLists (params, s_f) {
                this.SF.searchNoData = false;
                this.noListShowIcon = null;

                return new Promise((resolve, reject) => {
                    this.$http({
                        url: '/approve/list',
                        method: 'GET',
                        headers: window.headers,
                        params
                    }).then((res) => {
                        if (res.body.code === 0) {

                            if (res.body.data.list.length) {
                                this.noListShowIcon = true;

                                if (params.typeId === 0) {
                                    this.draftList = res.body.data.list;
                                }
                                if (params.typeId === 1) {
                                    this.launchList = res.body.data.list;
                                }
                                if (params.typeId === 2) {
                                    this.filedList = res.body.data.list;
                                }
                            } else {
                                if (s_f === 0) { // 搜索 我发起的入口930无搜索
                                    this.SF.searchNoData = true;
                                    this.description = '没有符合条件的数据';

                                } else if (s_f === 1) { // 筛选
                                    this.description = '没有符合条件的数据';

                                } else {
                                    if (params.typeId === 0) {
                                        this.description = '暂无草稿';

                                    }
                                    if (params.typeId === 1) {
                                        this.description = '暂无我发起的事项';

                                    }
                                    if (params.typeId === 2) {
                                        this.description = '暂无已归档事项';

                                    }
                                }

                                this.noListShowIcon = false;
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
                this.$store.state.myApplyTypeId = this.type_1;
                this.$router.replace('/home');
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

    .myapply-wrapper {
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
        position:fixed;
        top: $headerHeight;
        box-sizing: border-box;
        line-height: $tapHeight;
        text-align: center;
        z-index: 100;
        background-color: #F3F4F5;


        .tab-item {
            position: relative;
            width: 33.33%;
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
                font-size: 0.16rem;
                color: #9A9A9B;

                .tab-name {
                    display: inline-block;
                    box-sizing: border-box;
                    width: 100%;
                    height: $tapHeight;
                    font-size: .16rem;
                }

                &.active {
                    color: #4A90E2;

                    .tab-name {
                        box-sizing: border-box;
                        border-bottom: 2px solid #4590E4;
                    }
                }
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

        &.in-draft-top {
            top: $sfTop;
        }
    }

    .no-wait-apply {
        position: relative;
        /*position: absolute;*/
        /*bottom: 0;*/
        /*top: .99rem;*/
        /*left: 0;*/
        /*right: 0;*/
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

    .search-box-wrapper {
        position: fixed;
        top: $sfTop + .87rem;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 99;
        background-color: #ffffff;
    }

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
