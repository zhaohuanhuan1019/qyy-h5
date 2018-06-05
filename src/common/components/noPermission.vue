<template>
    <transition name="fade">
        <div class="warpper" v-show='isShowNoPermission'>
            <div class="content animated slideInUp">
                <div class="pop_2">
                    <div class='img'><i></i></div>
                    <div class="tip">对不起，您没有访问权限，请联系管理员</div>
                    <div class="back" @click='backApp'>返回应用首页</div>
                </div>
            </div>
        </div>
    </transition>
</template>


<script>
    import {mapState,mapMutations,mapGetters,mapActions} from 'vuex';
    import jsBridge from 'common/js/jsbridge'; // 引入jsBridge
    export default {
        props: [],
        data () {
            return {
                
            };
        },
        computed: {
             /*从公共状态中拿到的数据--start*/
                isShowNoPermission(){
                    return this.$store.state.attence.isShowNoPermission;
                }
             /*从公共状态中拿到的数据--end*/
        },
        methods: {
            backApp(){
                jsBridge.requestBack().then(function () {});
            }
        },
        mounted () {
        }
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    @import '../css/mixin';
    @import '../../../static/css/animate';
    
    .warpper {
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        .animated {
            animation-duration: 0.5s;
        }
    }

    .content {
        margin: 0 auto;
        width: 3.15rem;
        min-height: 4.10rem;
        background: #fff;
        border-radius: 0.13rem;
        transform: translate3d(0, 0, 0);
        .pop_2 {
            text-align: center;
            .img{
                margin-top: 0.7rem;
                font-size: 0;
                i {
                    display: inline-block;
                    width: 1.22rem;
                    height: 1.22rem;
                    @include bg-image('../../../static/image/invalid');
                    background-size: 100% 100%;
                    letter-spacing: 0px;
                }
            }
            
            .tip {
                width: 1.54rem;
                height: 0.4rem;
                margin:0 auto;
                font-family: PingFangSC-Regular;
                font-size: 0.14rem;
                color: #999999;
                letter-spacing: 0px;
                line-height: 0.2rem;
                margin-top:0.23rem;
            }
            .back{
                width: 1.99rem;
                height: 0.48rem;
                line-height: 0.48rem;
                background: #4590E4;
                border-radius: 0.08rem;
                margin:0 auto;
                font-family: PingFangSC-Regular;
                font-size: 0.16rem;
                color: #FFFFFF;
                margin-top:0.52rem;
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
