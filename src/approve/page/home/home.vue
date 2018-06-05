<template>
    <div class="home-wrapper" >
        <head-top :go="go" :title="title" v-on:backToApp="backToApp" class="header" ></head-top>
        <div class="approve-wrapper" v-if="resolved">
            <div class="my-main">
                <div class="link-item approval">
                    <router-link to="/approval/wait">
                        <div class="icon">
                            <span class='wait-apply-num' v-if="myTasksCount">{{myTasksCount}}</span>
                        </div>
                        <span class="text">待我审批</span>
                    </router-link>
                </div>
                <div class="link-item apply">
                    <router-link to="/apply/launch">
                        <div class="icon"></div>
                        <span class="text">我发起的</span>
                    </router-link>
                </div>
            </div>
            <div class="category-wrapper" v-if="resolved">
                <ul>
                    <li class="category" v-for="(category, index) in modules">
                        <div class="cate-head">
                            <div class="cate-wrapper">
                                <div class="category-title">
                                    <p class="group">{{ category.name | ifTooLong }}
                                        <span class="num">({{category.flows.length}})</span>
                                    </p>
                                </div>
                                <div class="category-control" v-show="category.flows.length > 3" @click="toggleOpen(index)"></div>
                            </div>
                        </div>

                        <div class="cate-content">
                            <ul>
                                <li class="module" v-for="flow in category.flows">
                                    <router-link
                                        :to="{path: '/apply/' + flow.typeId + '/create/', query: { flowId: flow.id, key: flow.procdefId}}">
                                        <div class="content">
                                            <img :src="baseUrl + flow.icon + png"/>
                                            <p>{{ flow.name | ifMoreThan5 }}</p>
                                        </div>
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>

        </div>
        <!-- 应用权限关闭提示-->
        <no-Permission ></no-Permission>
        <!-- end -->
    </div>
</template>

<script>
    import {mapMutations, mapActions} from 'vuex';
    import headTop from 'approve/components/header/header';
    import jsBridge from 'common/js/jsbridge';
    import {Toast} from 'mint-ui';

    export default {
        components: {
            headTop
        },
        data () {
            return {
                go: 'app',
                title: '审批',
                baseUrl: '../../../../static/image/',
                png: '@2x.png',
                modules: [],
                companyId: window.companyId || '',
                myTasksCount: 0,
                overLengthArr: [],
                toAppJson: {
                    code: 0,
                    msg: '',
                    data: {
                        companyId : 1 // 1需要返回companyId
                    }
                },
                resolved: false
            };
        },
        computed: {
            ifShow () {
                return this.$store.state.ifShow;
            }
        },
        created () {

//            this.isOpenAppstore(2);//调用是否开通该应用的接口(2--代表是审批模块)

            let self = this;
            jsBridge.getExtra(JSON.stringify(this.toAppJson)).then( (value) => {
                let companyId = value.companyId;
                // 获取header
                jsBridge.getHeader().then((value) => {
                    this.$http({
                        url: '/approve/setting/flow/list',
                        params: {
                            companyId: companyId
                        },
                        method: 'GET',
                        headers: value
                    }).then((res) => {
                        if (res.body.code === 0) {
                            this.resolved = true;
                            self.modules = res.body.data.list;

                            for (let i = 0; i < res.body.data.list.length; i++) {
                                let item = res.body.data.list[i];
                                if (item.flows.length > 3) {
                                    this.overLengthArr[i] = 0; // 此分类处于收起状态
                                } else {
                                    this.overLengthArr[i] = 2; // 此分类暂无状态
                                }
                            }
                        } else {
                            let instance = Toast(res.body.msg);
                            setTimeout(() => {
                                instance.close();
                            }, 2000);
                        }
                    }, (res) => {
//                        let instance = Toast('');
//                        setTimeout(() => {
//                            instance.close();
//                        }, 2000);
                    });
                });
            });

            jsBridge.getExtra(JSON.stringify(this.toAppJson)).then( (value) => {
                this.companyId = value.companyId;
                jsBridge.getHeader().then( (value) => {
                    // 待我审批数
                    this.$http({
                        url: '/approve/myTasksCount?companyId=' + this.companyId,
                        method: 'GET',
                        headers: value
                    }).then((res) => {
                        if (res.body.code === 0) {
                            this.myTasksCount = res.body.data.count > 99 ? '99+' : res.body.data.count;
                        }
                    }, (res) => {
                    });
                });
            });
        },
        mounted () {
            let self = this;

            // 通讯录员工列表
            function getStaffList () {
                return new Promise(function (resolve, reject) {
                    jsBridge.getExtra(JSON.stringify(self.toAppJson)).then(function (value) {
                        let companyId = value.companyId;
                        let data = {companyId: companyId};
                        jsBridge.getHeader().then(function (value) {
                            self.$http({
                                url: '/v1/staff/list',
                                method: 'POST',
                                body: JSON.stringify(data),
                                headers: value
                            }).then((res) => {
                                if (res.body.code === 0) {
                                    self.$store.state.stuffsFlag = false;
                                    resolve(res.body.data.list);
                                } else {
                                    self.$store.state.stuffsFlag = true;
                                }
                            }, (res) => {
                                self.$store.state.stuffsFlag = true;
                            });
                        });
                    });
                });
            }

            if (self.$store.state.stuffsFlag) {
                (async function () {
                    let stuffsList = await getStaffList() || []; // 通讯录员工列表
                    self.SAVE_STAFFLIST(stuffsList);
                })();
            }
        },
        methods: {
            ...mapMutations([
                'SAVE_STAFFLIST'
            ]),
            ...mapActions([
            	'isOpenAppstore'
            ]),
            toggleOpen (index) {
                let control = document.getElementsByClassName('category-control')[index];
                let content = document.getElementsByClassName('cate-content')[index];

                if (this.overLengthArr[index] === 0) {
                    content.className = 'cate-content open';
                    control.className = 'category-control open';
                    this.overLengthArr[index] = 1;
                } else {
                    content.className = 'cate-content';
                    control.className = 'category-control';
                    this.overLengthArr[index] = 0;
                }
            },
            backToApp () {
                jsBridge.requestBack().then(() => {
                    this.$store.state.stuffsFlag = true;
                });
            }
        },
        filters: {
            ifMoreThan5 (name) {
            	return name.length > 5 ? name.substring(0, 4) + '...' : name;
            },
            ifTooLong (name) {
                return name.length > 15 ? name.substring(0, 14) + '...' : name;
            }
        }
    }
    ;
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    @import '../../../common/css/mixin';
    $color: #4590E4;
    $color2: #333333;


    .home-wrapper {
        width: 100%;
        height: 100%;
        font-size: .12rem;
        background-color: #F3F4F5;
    }

    .header {
        position: fixed !important;
        left: 0;
        top: 0;
        z-index: 100;
    }

    .approve-wrapper {
        width: 100%;
        position: absolute;
        top: .44rem;
        bottom: auto;


        &.overflow-hidden {
            overflow: hidden;
            bottom: 0;
        }
    }

    .my-main {
        width: 100%;
        height: 1.28rem;
        background-color: #ffffff;

        .link-item {
            width: 50%;
            height: 100%;
            float: left;
            position: relative;

            text-align: center;

            & > a {
                display: inline-block;
                box-sizing: border-box;
                width: 100%;
                height: 100%;
                color: $color2;

                .icon {
                    width: .6rem;
                    height: .6rem;
                    background-size: .6rem;
                    background-repeat: no-repeat;
                }

                .text {
                    font-size: .16rem;
                    line-height: .22rem;
                }
            }

            &.approval {
                .text {
                    position: absolute;
                    left: .78rem;
                    bottom: .2rem;
                }

                .icon {
                    position: absolute;
                    left: .8rem;
                    top: .2rem;
                    @include bg-image('../../../../static/image/myapprovel');

                }

                .wait-apply-num {
                    position: absolute;
                    top: 0;
                    right: .08rem;
                    padding: .02rem;
                    min-width: .14rem;
                    height: .14rem;
                    line-height: .16rem;
                    background: #FF5A5A;
                    border-radius: .14rem;
                    color: #ffffff;
                    font-size: .1rem;
                }
            }

            &.apply {

                .text {
                    position: absolute;
                    right: .78rem;
                    bottom: .2rem;
                }

                .icon {
                    position: absolute;
                    right: .8rem;
                    top: .2rem;
                    @include bg-image('../../../../static/image/myapply');
                }

            }
        }
    }

    .category-wrapper {
        background-color: #F3F4F5;

        .category {
            width: 100%;
            margin-top: .1rem;

            .cate-head {
                $titleHeight: .42rem;

                box-sizing: border-box;
                padding: 0 .12rem;
                background-color: #ffffff;


                .cate-wrapper {
                    position: relative;
                    border-bottom: 1px solid #EEEEEE;
                }

                .category-title {
                    display: inline-block;
                    height: $titleHeight;

                    .group {
                        font-size: .16rem;
                        line-height: $titleHeight;
                        color: $color2;
                    }

                    .num {
                        margin-left: .03rem;
                    }
                }
                .category-control {
                    height: $titleHeight;
                    width: .31rem;
                    display: inline-block;
                    position: absolute;
                    top: 0;
                    right: 0;
                    line-height: $titleHeight;
                    font-size: .15rem;
                    color: $color;
                    @include bg-image('../../../../static/image/homeopen');
                    background-size: .15rem;
                    background-repeat: no-repeat;
                    background-position: .16rem .14rem;

                    &.open {
                        @include bg-image('../../../../static/image/homeclose');
                    }
                }
            }
        }


    }

    .cate-content {
        background-color: #ffffff;
        height: 1.25rem;
        overflow: hidden;

        &.open {
            height: auto;
        }

        .module {
            display: inline-block;
            box-sizing: border-box;
            width: 1.25rem;
            height: 1.25rem;
            overflow: hidden;


            & > a {
                display: inline-block;
                padding: .32rem 0 .25rem 0;
                box-sizing: border-box;
                width: 100%;
                height: 100%;
            }

            .content {
                width: 100%;
                height: 100%;
                text-align: center;

                img {
                    width: .4rem;
                    height: .4rem;
                }

                p {
                    margin-top: .08rem;
                    font-size: .14rem;
                    color: #757678;
                    line-height: .2rem;
                }
            }
        }
    }

</style>
