<template>
    <transition name="fade">
        <div class="pop_warp">
            <div class="content">
                <div class="pop_1">
                    <div class="tips_top">
                        <div class="sign-img"></div>
                        <p class="tips_3">左右滑动可以切换月份</p>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    @import '../../../common/css/mixin';

    .content {
        margin: 1.36rem auto 0;
        .pop_1 {
            .tips_top{
                text-align: center;
                .sign-img{
                    width:1.17rem;
                    height: 1.4rem;
                    margin: 0 auto;
                    @include bg-image('slip');
                    background-size: 65% auto;
                    background-repeat: no-repeat;
                    background-position: center center;
                }
                .tips_3{
                    font-family: PingFangSC-Regular;
                    font-size: 0.14rem;
                    color: #FFFFFF;
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
