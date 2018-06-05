<template>
    <transition name="fade">
        <div class="pop_warp" v-show="show">
            <div class="content">
                <div class="pop_1">
                    <div class="tips_top">
                        <div class="tips_2">
                            <p class='not_find'>无法获取位置信息</p>
                            <p class="plese">请在iPhone 的“设置－隐私－定位服务”选项中打开定位服务，并允许美办使用定位服务。</p>
                        </div>
                    </div>
                    <div class="tips_bottom"><span class='cancel' @click='close'>取消</span><span class='sure'>设置</span></div>
                </div>
            </div>
        </div>
    </transition>
</template>


<script>
export default {
    data () {
        return {
            show: true
        };
    },
    methods: {
        close () {
            this.show = false;
            this.$emit('positionPrompt', this.show);
        }
    }
};
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    @import '../../../common/css/mixin';
    .pop_warp {
        display: flex;
        align-items:center;
        justify-content:center;
    }
    .content {
        margin: 0 auto;
        width: 2.7rem;
        min-height: 1.42rem;
        background: #fff;
        border-radius: 0.13rem;
        .pop_1{
            .tips_top{
                text-align: center;
                padding: 0.36rem 0 0.3rem;
                @include border-1px(#ccc);
                .tips_1{
                    font-family: PingFangSC-Regular;
                    font-size: 0.16rem;
                    color: #2E2E2E;
                }
                .not_find{
                    font-family: PingFangSC-Semibold;
                    font-size: 0.16rem;
                    color: #2E2E2E;
                }
                .tips_2{
                    .plese{
                        padding: 0 0.24rem;
                        margin-top: 0.12rem;
                        font-family: PingFangSC-Regular;
                        font-size: 0.14rem;
                        color: #999999;
                        line-height: 0.2rem;
                    }
                }
            }
            .tips_bottom{
                height: 0.48rem;
                line-height: 0.48rem;
                display: flex;
                span{
                    flex:1;
                    text-align: center;
                    font-family: PingFangSC-Regular;
                    font-size: 0.16rem;
                    color: #448FE2;
                }
                .sure{
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
