<template>
    <transition name="fade">
        <div class="pop_warp" transition='fade' v-show='show' @click='close2'>
            <div class="content" v-show="show2">
                <div class="pop_1">
                    <div class="tips_top">
                        <p class="tips_1">{{showText[0]}}</p>
                    </div>
                    <div class="tips_bottom" v-show="true"><span class='cancel' @click='close'>{{showText[1]}}</span><span class='sure' @click='more'>{{showText[2]}}</span>
                    </div>
                    <div class="tips_bottom" v-show="false"><span class='cancel'>{{showText[1]}}</span><span class='sure'>{{showText[2]}}</span>
                    </div>
                </div>
            </div>
            <div class="wrapper position-loading" v-show="!show2">
                <div class="img-icon"></div>
            </div>
        </div>
    </transition>
</template>

<script>
    import Bus from 'common/js/bus.js';
    import jsBridge from 'common/js/jsbridge'; // 引入jsBridge
    import {mapState,mapMutations,mapGetters,mapActions} from 'vuex';

     export default {
        props: [],
        data () {
            return {
                // isActive: true,
                hasError: false,
                show: true,
                show2: true,
            };
        },
        computed: {
            isActive(){
                return this.$store.state.attence.isActive;
            },
            isShow(){
                return this.$store.state.attence.popUp.isShow;
            },
            clockStatus(){
                return this.$store.state.attence.clockStatus;
            },
            clockCommute(){
                return this.$store.state.attence.clockCommute;
            },
            showText(){
                return this.$store.state.attence.popUp.showText;
            },
            isShowMorningNight(){
                return this.$store.state.attence.morningNight.isShow;
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
            getdata_today(){
                 return this.$store.getters.getdata_today;
            },
            sysTimes(){
                return this.$store.state.attence.sysTimes;
            },
        },
        methods: {
            ...mapMutations(['change_popIsShow','change_morningNight','change_beforeClick_clockCommute','change_clockCommute','change_circle','change_register','change_isRetroactive']),
            ...mapActions(['change_popIsShowAction','change_popshowTextAction','change_morningNightAction','change_beforeClick_clockCommuteAction','change_clockCommuteAction','change_sureTimeAction','change_circleAction','change_registerAction','change_activeAction','checkClockStatus','mapAction','startClickBtn']),
            add () {
                let self = this;
                // 请求‘确定打卡’接口
                let GetAttendanceDate = window.GetAttendanceDate;
                self.$http(
                    {
                        url: '/attend/user/record/add',
                        method: 'POST',
                        body: JSON.stringify(
                                {
                                    'srcFlag':window.headers.clientOs,
                                    'record': {
                                        'cid': GetAttendanceDate.companyId,
                                        'clockDate': self.getdata_today,
                                        'clockTime': self.sysTimes,
                                        'clockStatus': self.clockStatus,
                                        'clockCommute': self.clockCommute,
                                        'clockType': 2,
                                        'uid': GetAttendanceDate.staffId,
                                        'uname': GetAttendanceDate.staffName,
                                        'deptId': GetAttendanceDate.deptId,
                                        'deptName': GetAttendanceDate.deptName
                                    }
                                }
                            ),
                        timeout: 800,//和产品沟通接口请求延迟时间。
                        headers: window.headers
                    }
                ).then((res) => {
                    res = res.body;
                    console.log(res);
                    if (res.code === 0) {
                        /*对操作签到卡或者签退卡的处理--start*/
                            if(self.beforeClick_clockCommute == 2) { // 如果我打的是签退（就要跳到列表页，把签到时间元素隐藏）
								self.change_circleAction(false);
                            } else  { // 如果我打的是签到（还要停留在圆圈页面，把签到时间元素显示）
								self.change_circleAction(true);
                            }
                        /*对操作签到卡或者签退卡的处理--end*/

                        /*打开moring弹窗*/
							self.change_morningNightAction(true);
                        /*打开moring弹窗*/

                        /*存储后台返回的数据--start*/
                            // self.change_clockStatusAction(res.data.clockStatus);//把返回的异常标示存到公共状态中
                            self.change_sureTimeAction(res.data.record.clockTime.slice(0,5));
                        /*存储后台返回的数据--end*/
                    } else {
                        self.change_popIsShowAction(true); // 失败弹窗显示
                        self.change_popshowTextAction(['打卡失败，请稍后再试', '取消', '再试一次']);
                    }
                }, (err) => {
                    self.change_popIsShowAction(true); // 失败弹窗显示
                    self.change_popshowTextAction(['打卡失败，请稍后再试', '取消', '再试一次']);
                });
            },
            close () {
                let self = this;
                /*pop弹窗关闭--start*/
                    self.change_popIsShowAction(false); // 失败弹窗关闭
                /*pop弹窗关闭--end*/
                self.change_activeAction(false);//光效消失

                /*对左侧按钮为签到的处理--start*/
                    if (self.showText[1] === '签到') {
                        self.add();
                        /*存储点击的是什么卡*/
                            self.change_beforeClick_clockCommuteAction(1);
                        /*存储点击的是什么卡*/
                    }
                /*对左侧按钮为签到的处理--end*/
            },
            close2(ev){
                let self = this;
                console.log(ev.target.className)
                if(ev.target.className == 'pop_warp') {
                    if(self.showText[0] == '你要打什么卡') {
                        /*pop弹窗关闭--start*/
                            self.change_popIsShowAction(false); // 失败弹窗关闭
                        /*pop弹窗关闭--end*/
                    }
                }
            },
            more () {
                /*pop弹窗关闭--start*/
                    this.change_popIsShowAction(false); // 失败弹窗关闭
                /*pop弹窗关闭--end*/

                /*点击签退操作--start*/
                    if (this.showText[2] == '签退') {
                        this.add();
                         /*存储点击的是什么卡*/
                            this.change_beforeClick_clockCommuteAction(2);
                        /*存储点击的是什么卡*/
                    }
                /*点击签退操作--end*/

                /*补卡部分--start*/
                    if (this.showText[0] == '补卡失败，请稍后再试'||this.showText[0] == '补卡失败，不在考勤范围内') {
                        // this.$emit('moreMap', '重新定位');
                        this.change_isRetroactive(true);//代表补卡
                        this.startClickBtn(); // 请求打卡接口
                    }
                /*补卡部分--end*/

                /*点击打卡再试一次操作--start*/
                    if (this.showText[0] == '打卡失败，请稍后再试' ||this.showText[0] == '打卡失败，不在考勤范围内') {
                        this.change_isRetroactive(false);//不是补卡
                        this.startClickBtn(); // 请求打卡接口
                    }
                /*点击打卡再试一次操作--end*/
                /*休息时间确认打卡操作--start*/
                    if (this.showText[0] == '休息时间，是否打卡') {
                        this.change_isRetroactive(false);//不是补卡
                        this.checkClockStatus(); // 检查打卡
                    }
                /*休息时间点击确认打卡操作--end*/
            }
        },
        mounted () {
            this.hasError = !this.isActive;
        }
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    @import '../../../common/css/mixin';

    .pop_warp {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .content {
        margin: 0 auto;
        width: 2.7rem;
        min-height: 1.42rem;
        background: #fff;
        border-radius: 0.13rem;
        .pop_1 {
            .tips_top {
                text-align: center;
                padding: 0.39rem 0;
                @include border-1px(#ccc);
                .tips_1 {
                    font-family: PingFangSC-Regular;
                    font-size: 0.16rem;
                    color: #2E2E2E;
                }
            }
            .tips_bottom {
                height: 0.48rem;
                line-height: 0.48rem;
                display: flex;
                span {
                    flex: 1;
                    text-align: center;
                    font-family: PingFangSC-Regular;
                    font-size: 0.16rem;
                    color: #448FE2;
                }
                .sure {
                    @include border-left(#ccc);
                }
            }
        }
        .pop_2 {
            text-align: center;
            height: 1.82rem;
            i {
                display: inline-block;
                width: 0.9rem;
                height: 0.8rem;
                background-size: 100% 100%;
                margin-top: -0.4rem;
                margin-bottom: 0.16rem;
                &.img {
                    @include bg-image('return_success');
                }
                &.img2 {
                    @include bg-image('Sign_in');
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
                font-size: 0.42rem;
                color: #2E2E2E;
                height: 0.49rem;
                line-height: 0.49rem;
            }
            .sign {
                font-family: PingFangSC-Regular;
                font-size: 0.14rem;
                color: #2E2E2E;
                margin-bottom: 0.24rem;
                height: 0.2rem;
                line-height: 0.2rem;
            }
        }

    }

    .wrapper {
        position: absolute;
        .img-icon {
            width: .38rem;
            height: .56rem;
            margin-left: -0.19rem;
            margin-top: 250px;
            position: absolute;
            background-size: auto 100%;
            background-position: center;
            background-repeat: no-repeat;
            &.flash {
                animation-iteration-count: infinite;
            }
        }
        &.position-loading {
            .img-icon {
                width: .45rem;
                height: .45rem;
                background-image: url("../../../../static/attence-image/loading2.gif");
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
