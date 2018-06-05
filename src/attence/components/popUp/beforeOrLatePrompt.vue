<template>
    <transition name="fade">
        <div class="pop_warp" v-show="show">
            <div class="content">
                <div class="pop_1">
                    <div class="tips_top">
                        <p class="tips_3">
                            <span class="time">{{initTime}}</span>
                            <span class="time_tip">{{promptContent}}</span>
                        </p>
                        <div class="tips_bottom"><span class='cancel' @click='close'>取消</span><span
                            class='sure' @click="sure">确定打卡</span></div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import Bus from 'common/js/bus.js';
    import {mapState,mapMutations,mapGetters,mapActions} from 'vuex';

    export default {
        data () {
            return {
                show: true
            };
        },
        computed: {
            /*从公共状态中拿到的数据--start*/
                clockStatus(){
                    return this.$store.state.attence.clockStatus;
                },
                clockCommute(){
                    return this.$store.state.attence.clockCommute;
                },
                isShowClockConfirm(){
                    return this.$store.state.attence.clockConfirm.isShow;
                },
                initTime(){
                    return this.$store.state.attence.initTime;
                },
                firstClockTime(){
                    return this.$store.state.attence.firstClockTime;
                },
                secondClockTime(){
                    return this.$store.state.attence.secondClockTime;
                },
                isShowMorningNight(){
                    return this.$store.state.attence.morningNight.isShow;
                },
                isShowCircle(){
                    return this.$store.state.attence.isShowCircle;
                },
                isShowregister(){
                    return this.$store.state.attence.isShowregister;
                },
                beforeClick_clockCommute(){
                    return this.$store.state.attence.beforeClick_clockCommute;
                },
                getdata_today(){
                    return this.$store.getters.getdata_today;
                },
                sysTimes(){
                    return this.$store.state.attence.sysTimes;
                },
            /*从公共状态中拿到的数据--end*/

            promptContent () {
                if (this.clockStatus === 1) {
                    return '您已迟到，是否打卡？';
                } else if (this.clockStatus === 2) {
                    return '下班时间未到，是否打卡？';
                }
            }
        },
        methods: {
            ...mapMutations(['change_clockConfirm','change_firstClockTime','change_secondClockTime','change_clockCommute','change_morningNight']),
            ...mapActions(['checkList','change_clockConfirmAction','change_firstClockTimeAction','change_secondClockTimeAction','change_clockCommuteAction','change_morningNightAction','change_circleAction','change_registerAction','change_sureTimeAction','change_popIsShowAction','change_popshowTextAction']),
            close () {
                this.change_clockConfirmAction(false);//关闭BeforeLate弹窗
            },
            sure () {
                let self = this;
                let value = window.GetAttendanceDate;
                // 请求‘确定打卡’接口
                self.$http({
                        url: '/attend/user/record/add',
                        method: 'POST',
                        body: JSON.stringify(
                                {
                                    'srcFlag':window.headers.clientOs,
                                    'record': {
                                        'cid': value.companyId,
                                        'clockDate': self.getdata_today,
                                        'clockTime': self.sysTimes,
                                        'clockStatus': self.clockStatus,
                                        'clockCommute': self.clockCommute,
                                        'clockType': 2,
                                        'uid': value.staffId,
                                        'uname': value.staffName,
                                        'deptId': value.deptId,
                                        'deptName': value.deptName
                                    }
                                }
                            ),
                        headers: window.headers,
                        timeout: 5000 //和产品沟通接口请求延迟时间
                }).then((res) => {
                    res = res.body;
                    if (res.code == 0) {
                        /*BeforeLate弹窗关闭*/
                            self.change_clockConfirmAction(false);//BeforeLate弹窗关闭
                        /*BeforeLate弹窗关闭*/

                        /*存储打卡的时间*/
                            if(self.beforeClick_clockCommute == 1){
                                self.change_firstClockTimeAction(res.data.record.clockTime.slice(0,5));/*改变上班打卡时间*/
                                /*打开moring弹窗 --start*/
								self.change_morningNightAction(true);//打开moring弹窗
                                /*打开moring弹窗 --end*/
                            }else if(self.beforeClick_clockCommute ==2){
                                self.change_secondClockTimeAction(res.data.record.clockTime.slice(0,5));/*改变上班打卡时间*/
                                /*打开moring弹窗 --start*/
								self.change_morningNightAction(true);//打开moring弹窗
                                /*打开moring弹窗 --end*/
                            }
                        /*存储打卡的时间*/
                        // list 在add接口成功后再获取list接口数据
                        this.checkList(0);
                    } else {
                        self.change_popIsShowAction(true); // 失败弹窗显示
                        self.change_popshowTextAction(['打卡失败，请稍后再试', '取消', '再试一次']);
                    }
                }, (res) => {
                    self.change_popIsShowAction(true); // 失败弹窗显示
                    self.change_popshowTextAction(['打卡失败，请稍后再试', '取消', '再试一次']);
                });
        }
        },
        mounted() {
        }
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    @import '../../../common/css/mixin';
    .pop_warp {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .content {
        margin: 0 auto;
        width: 2.7rem;
        min-height: 1.42rem;
        background: #fff;
        border-radius: 0.13rem;
        .pop_1 {
            .tips_top{
                text-align: center;
                padding: 0.36rem 0 0;
                .tips_3 {
                    span {
                        display: block;
                    }
                    .time {
                        font-family: DINCond-Bold;
                        font-size: 0.42rem;
                        color: #2E2E2E;
                        letter-spacing: 0px;
                    }
                    .time_tip {
                        font-family: PingFangSC-Regular;
                        font-size: 0.18rem;
                        color: #FF6200;
                        margin-top: 0.12rem;
                    }
                }
            }

            .tips_bottom {
                height: 0.48rem;
                line-height: 0.48rem;
                display: flex;
                border-top:1px solid #ccc;
                margin-top:0.24rem;
                span {
                    flex: 1;
                    text-align: center;
                    font-family: PingFangSC-Regular;
                    font-size: 16px;
                    color: #448FE2;
                }
                .sure {
                    @include border-left(#ccc);
                }
            }
        }
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }

    .fade-enter, .fade-leave-active {
        opacity: 0
    }
</style>
