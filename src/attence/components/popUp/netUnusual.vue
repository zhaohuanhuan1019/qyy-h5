<template>
    <transition name="fade">
        <div class="pop_warp" transition='fade' v-show='show'>
            <div class="content">
                <div class="tips_1" v-show = 'isDateErr'>
                    <div class="title">服务器请求失败</div>
                    <p class="tip">服务器连接不上，请稍后重试</p>
                </div>
                <div class="tips_1" v-show = '!isDateErr'>
                    <div class="title">网络异常</div>
                    <p class="tip">加载失败，请稍后重试</p>
                </div>
               <div class="cancel">
                   <p class="sure" @click="back">确认</p>
               </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import Bus from 'common/js/bus.js';
    import jsBridge from 'common/js/jsbridge'; // 引入jsBridge
    import {mapState,mapMutations,mapGetters,mapActions} from 'vuex';
     export default {
        props: ['clockStatus', 'statusBtn', 'positionTrue', 'clockTip', 'times', 'getdata2', 'info','deviceType'],
        data () {
            return {
               // tips: ['打卡失败，不在考勤范围内', '确定要更新此打卡记录', '选择打卡', '打卡失败，请稍后再试'],
                isActive: true,
                hasError: false,
                show: true,
                clockCommute: '',
                myResult: this.clockStatus//data中新增字段
            };
        },
        computed: {
            isDateErr(){
                 return this.$store.state.attence.isDateErr;
            }
        },
        methods: {
            back() {
                jsBridge.requestBack().then(function () {});
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
        height: 1.64rem;
        background: #fff;
        border-radius: 0.13rem;
        .tips_1{
            @include border-1px(#ccc);
            .title{
                font-family: PingFangSC-Semibold;
                font-size: 0.16rem;
                color: #2E2E2E;
                margin: 0 auto;
                height: 0.22rem;
                line-height: 0.22rem;
                margin-top: 0.36rem;
                font-weight: bold;
                text-align: center;
            }
            .tip{
                padding: 0 0.25rem;
                font-family: PingFangSC-Regular;
                font-size: 0.14rem;
                color: #666666;
                width: 2.22rem;
                text-algin: center;
                height: 0.2rem;
                line-height: 0.2rem;
                margin-top: 0.12rem;
                padding-bottom: 0.26rem;
                text-align: center;
            }
        }
        .cancel{
            text-align: center;
            height: 0.22rem;
            .sure{
                text-align: center;
                height: 0.5rem;
                line-height: 0.5rem;
                font-family: PingFangSC-Regular;
                font-size: 0.16rem;
                color: #448FE2;

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
