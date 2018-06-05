<template>
    <transition name="fade">
        <div class="pop_warp" transition='fade' v-show='show' @click='close'>
            <div class="content">
                <div class="pop_1">
                    <div class="tips_top">
                        <p class="tips_1">你要打什么卡</p>
                        <span class="close"></span>
                    </div>
                    <div class="tips_bottom" v-show="true">
                        <span class='cancel' @click="sign_in">签到</span><span class="signout" @click="sign_out">签退</span>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import Bus from 'common/js/bus.js';
    import jsBridge from 'common/js/jsbridge'; // 引入jsBridge
    export default {
        props: ['clockStatus', 'times', 'getdata2','clockCommute_3'],
        data () {
            return {
                show: true,
                clockCommute: '',
                myResult: this.clockStatus//data中新增字段
            };
        },
        computed: {
        },
        methods: {
            add () {
                let self = this;
                // 请求‘确定打卡’接口
                jsBridge.getHeader().then(function (value) {
                    let header = value;
                    let flag = value.clientOs;
                    jsBridge.GetAttendanceDate().then(function (value) {
                        self.$http(
                            {
                                url: '/attend/user/record/add',
                                method: 'POST',
                                body: JSON.stringify(
                                        {
                                            'srcFlag':flag,
                                            'record': {
                                                'cid': value.companyId,
                                                'clockDate': self.getdata2,
                                                'clockTime': self.times,
                                                'clockStatus': self.myResult,
                                                'clockCommute': self.clockCommute,
                                                'clockType': 2,
                                                'uid': value.staffId,
                                                'uname': value.staffName,
                                                'deptId': value.deptId,
                                                'deptName': value.deptName
                                            }
                                        }
                                    ),
                                timeout: 800,//和产品沟通接口请求延迟时间。
                                headers: header
                            }
                        ).then((res) => {
                            res = res.body;
                            console.log(res);
                            if (res.code === 0) {
                                Bus.$emit('close-empty', 123);
                                Bus.$emit('suretime', res.data.record.clockTime.slice(0,5));
                                if(self.clockCommute === 2){ //代表空窗期第一次打的是签退卡
                                    if (self.clockCommute_3 === 3) {// 代表上半部分的空窗期签退卡（如果是下半部分空窗期直接弹出‘’打卡无效）
                                        // alert('该跳日历页面了')
                                        /*Bus.$emit('circleShow', 123);*/
                                        Bus.$emit('morning', self.clockCommute);
                                    }
                                }else if(self.clockCommute === 1){//代表空窗期第一次打的是签到卡
                                    if (self.clockCommute_3 === 3) {// 代表后台上半部分的空窗期签到卡
                                        // alert(333333333333333+'-----'+self.clockCommute);
                                        Bus.$emit('morning', self.clockCommute); //代表传给moring组件让其标示日出和日落的不同展现
                                        Bus.$emit('circleShow', 123);
                                    }
                                }
                            } else {
                                console.log('确定打卡失败1');
                            }
                        }, (res) => {
                            console.log('确定打卡失败2');
                            Bus.$emit('cancel', 123); //接口请求失败后处理函数
                            Bus.$emit('netFail', 123);
                        });
                    });
                });
            },
            close(ev){
                let self = this;
                console.log(ev.target.className)
                if(ev.target.className === 'pop_warp') {
                    Bus.$emit('close-empty', 123);
                }
            },
            sign_in() {
                this.clockCommute = 1;
                this.myResult = 0;
                this.add();
            },
            sign_out(){
                this.clockCommute = 2;
                this.myResult = 0;
                this.add();
            }
        },
        mounted () {
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
                .close{
                     /* @include bg-image('delete'); */
                     /*background-image: url("../../../../static/attence-image/delete");*/
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
                .signout {
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
            margin: 0 auto;
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
