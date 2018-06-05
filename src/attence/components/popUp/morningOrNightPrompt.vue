<template>
    <transition name="fade">
        <div class="pop_warp" v-show="show">
            <div class="content animated slideInUp">
                <div class="pop_2">
                    <i :class="{ morning: isActive === 1, 'night': isActive === 2, 'supplement': isActive === 3 }"></i>
                    <p class="sign">{{tips}}</p>
                    <p class="time">{{time}}</p>
                    <div class="known" @click="know">知道了</div>
                </div>
            </div>
        </div>
    </transition>
</template>


<script>
    import Bus from 'common/js/bus.js';
    import {mapState,mapMutations,mapGetters,mapActions} from 'vuex';
    export default {
        props: [],
        data () {
            return {
                show: true,
            };
        },
        computed: {
            /*从公共状态中拿到的数据--start*/
                sureTime(){
                    return this.$store.state.attence.sureTime;
                },
                isShowMorningNight(){
                    return this.$store.state.attence.morningNight.isShow;
                },
                getdata_today(){
                    return this.$store.getters.getdata_today;
                },
                beforeClick_clockCommute(){
                    return this.$store.state.attence.beforeClick_clockCommute;
                },
                isShowCircle(){
                    return this.$store.state.attence.isShowCircle;
                },
                isShowregister(){
                    return this.$store.state.attence.isShowregister;
                },
                supplementShow() {
                    return this.$store.state.attence.supplementShow;
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
            /*从公共状态中拿到的数据--end*/
            tips () {
                if (this.beforeClick_clockCommute == 1) {
                    return '签到成功';
                } else if (this.beforeClick_clockCommute == 2) {
                    return '签退成功';
                } else {
                    return '补卡成功';
                }
            },
            time(){
                if (this.beforeClick_clockCommute == 1) {
                    return this.firstClockTime;
                } else if (this.beforeClick_clockCommute == 2) {
                    return this.secondClockTime;
                } else {
                    return this.firstClockTime;
                }
            },
            isActive () {
                if (this.beforeClick_clockCommute == 1) {
                    return 1;
                }else if (this.beforeClick_clockCommute == 2) {
                    return 2;
                } else {
                    return 3;
                }
            },

        },
        methods: {
            ...mapMutations([
            	'change_register',
                'change_supplementAble',
                'change_sureTime',
                'change_morningNight',
                'change_clockCommute',
                'change_circle',
                'change_listData',
                'getDate_List']),
            ...mapActions(['change_sureTimeAction','change_morningNightAction','change_clockCommuteAction','change_circleAction','change_listDataAction','change_registerAction','change_isShowUpdateClickAction','change_supplementShowAction','change_isShowfileAction','change_isDateErrAction']),
            gettime () {
                let myDate = new Date();
                let h = myDate.getHours();
                let m = myDate.getMinutes();
                let s = myDate.getSeconds();
                if (h < 10) {
                    h = '0' + h;
                }
                if (m < 10) {
                    m = '0' + m;
                }
                if (s < 10) {
                    s = '0' + s;
                }
                this.times = h + ':' + m + ':' + s;
                setInterval(() => {
                    let myDate = new Date();
                    let h = myDate.getHours();
                    let m = myDate.getMinutes();
                    let s = myDate.getSeconds();
                    if (h < 10) {
                        h = '0' + h;
                    }
                    if (m < 10) {
                        m = '0' + m;
                    }
                    if (s < 10) {
                        s = '0' + s;
                    }
                    this.times = h + ':' + m + ':' + s;
                }, 1000);
            },
            getDate_List() {
                let self = this;
                // 请求list接口
                let GetAttendanceDate = window.GetAttendanceDate;
                self.$http(
                        {
                            url: '/attend/user/record/list',
                            method: 'POST',
                            body: JSON.stringify(
                                    {
                                        'srcFlag':window.headers.clientOs,
                                        'record': {
                                            'cid': GetAttendanceDate.companyId,
                                            'clockDate': self.getdata_today,
                                            'uid': GetAttendanceDate.staffId,
                                            // 'uname': GetAttendanceDate.staffName,
                                            'deptId': GetAttendanceDate.deptId,
                                            // 'deptName': GetAttendanceDate.deptName
                                        }
                                    }
                            ),
                            headers: window.headers,
                            timeout: 3000
                        }
                ).then((res) => {
                    res = res.body;
                    if(res.code == 0 && res.data.off && res.data.on){
                        console.log('list列表中返回的data中有数据');
                        self.change_listDataAction(res.data);
                    }else {
                        /*控制err弹窗显示和内容--start*/
                        self.change_isDateErrAction(true);
                        self.change_isShowfileAction(true);
                        /*控制err弹窗显示和内容--end*/
                    }

                }, (res) => {
                    /*控制err弹窗显示和内容--start*/
                    self.change_isDateErrAction(false);
                    self.change_isShowfileAction(true);
                    /*控制err弹窗显示和内容--end*/
                });
            },
            closePrompt (callback) {
                let self = this;
                let timer = setTimeout(() => {
                    self.show = false;
                    clearTimeout(timer);
                    callback && callback();
                }, 1500);
            },
            know () {
                /*关闭moring弹窗*/
				this.change_morningNightAction(false);
                /*关闭moring弹窗*/

                /*处理打签到卡逻辑--start*/
                if(this.beforeClick_clockCommute == 1){
                    this.change_clockCommuteAction(2);//签到变签退
                }
                /*处理打签到卡逻辑--end*/

                /*处理打签退卡逻辑--start*/
                if(this.beforeClick_clockCommute == 2){
                    this.change_circleAction(false);//隐藏circle元素
                    this.getDate_List();
                }
                /*处理打签退卡逻辑--end*/

                if(this.beforeClick_clockCommute == 3){ }
            }
        },
        mounted () {
            this.gettime();
        }
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    @import '../../../common/css/mixin';
    @import '../../../../static/css/animate';

    .pop_warp {
        display: flex;
        align-items: center;
        justify-content: center;
        .animated {
            animation-duration: 0.5s;
        }
    }

    .content {
        margin: 0 auto;
        width: 2.7rem;
        min-height: 2.04rem;
        background: #fff;
        border-radius: 0.13rem;
        transform: translate3d(0, 0, 0);
        .pop_2 {
            text-align: center;
            i {
                display: inline-block;
                width: 0.9rem;
                height: 0.8rem;
                background-size: 100% 100%;
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                right: 0;
                margin:auto;
                margin-top: -0.4rem;
                &.night {
                    @include bg-image('return_success');
                }
                &.morning {
                    @include bg-image('Sign_in');
                }
                &.supplement {
                    @include bg-image('supplement');
                }
            }
            .tips_1 {
                font-family: PingFangSC-Regular;
                font-size: 0.14rem;
                color: #949494;
                letter-spacing: 0px;
                height: 0.2rem;
                line-height: 0.2rem;
            }
            .time {
                font-family: DINCond-Bold;
                font-size: 26px;
                color: #929292;
                letter-spacing: 0;
                height: 0.3rem;
                line-height: 0.3rem;
                padding-bottom: 0.13rem;
                @include border-1px(#ccc);
            }
            .sign {
                font-family:PingFang-SC-Medium;
                font-size: 24px;
                color: #2E2E2E;
                margin-top: 0.75rem;
                margin-bottom: 0.04rem;
                height: 0.33rem;
                line-height: 0.33rem;
            }
            .known{
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #448FE2;
                height: 0.48rem;
                line-height: 0.48rem;
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
