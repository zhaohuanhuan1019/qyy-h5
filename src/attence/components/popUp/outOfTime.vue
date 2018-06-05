<template>
    <transition name="fade">
        <div class="pop_warp" transition='fade' v-show='show'>
            <div class="content">
                <div class="pop_1" v-show='isActive'>
                    <div class="tips_top">
                        <p class="tips_1">未在考勤时间内，暂无法打卡</p>
                        <p class="tips_2">考勤时间：{{schemeTime.workOnBeforeTime}}--{{schemeTime.workOffAfterTime}}</p>
                    </div>
                    <div class="tips_bottom" v-show="true">
                        <span class='cancel' @click='close'>知道了</span>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import Bus from 'common/js/bus.js';
    export default {
        props: ['schemeTime'],
        data () {
            return {
                isActive: true,
                hasError: false,
                show: true,
                clockCommute: ''
            };
        },
        computed: {
        },
        methods: {
            close () {
                Bus.$emit('outOftime_close', 123);
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
                .tips_2 {
                    font-family: PingFangSC-Regular;
                    font-size: 0.14rem;
                    color: #2E2E2E;
                    margin-top: 0.2rem;
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
