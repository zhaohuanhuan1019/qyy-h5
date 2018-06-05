<template>
    <transition name="fade">
        <div class="pop_warp address-lists" transition='fade' @click="addressClose">
            <div class="content address-content" v-show="show2">
                <div class="title">以下考勤地点皆可打卡</div>
                <div class="list_warper" ref="listWrapper">
                    <ul>
                        <li class="list" v-for="name in addressNameComputed">
                            <span class="img-icon animated"></span>
                            <span class="addressName">{{name}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import Bus from 'common/js/bus.js';
    import BScroll from 'better-scroll';
    import jsBridge from 'common/js/jsbridge'; // 引入jsBridge
     export default {
        props: ['addressName', 'addresPop'],
        data () {
            return {
               // tips: ['打卡失败，不在考勤范围内', '确定要更新此打卡记录', '选择打卡', '打卡失败，请稍后再试'],
                isActive: true,
                hasError: false,
                show: true,
                show2: true,
                clockCommute: ''
            };
        },
        computed: {
            addressNameComputed () {
                if (this.addressName.length > 0 && this.addresPop) {
                    this.$nextTick(() => {
                        let addressLists = document.getElementsByClassName('address-lists')[0];
                        let addressContent = document.getElementsByClassName('address-content')[0];
                        let addressListsHeight = addressLists.offsetHeight;
                        let contentHeight = addressContent.offsetHeight;
                        addressContent.style.marginTop = (addressListsHeight - contentHeight) / 2 + 'px';
                            this.initScroll();
                    });
                }
                return this.addressName;
            },
        },
        methods: {
            initScroll () {
                this.listWrapper = new BScroll(this.$refs.listWrapper, {
                    click: true
                });
            },
            addressClose () {
                Bus.$emit('addressClose', 'addressClose');
            }
        },
        mounted () {
        }
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    @import '../../../common/css/mixin';
    @import '../../../../static/css/animate';

    /*.pop_warp {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }*/
    .content {
        margin: 0 auto;
        width: 3.15rem;
        max-height: 3.83rem;
        background: #fff;
        border-radius: 0.13rem;
        /*overflow: scroll;*/
        .title{
            text-align: center;
            font-family: PingFangSC-Semibold;
            font-size: 0.18rem;
            color: #2E2E2E;
            font-weight: bold;
            height: .57rem;
            line-height: .57rem;
            border-bottom: 1px solid #EBEBEB;
        }
        .list_warper{
            max-height: 3.25rem;
            overflow: hidden;
            .list {
                text-algin: center;
                padding: .24rem  0 .21rem 0;
                margin: 0 .23rem 0 .25rem;
                vertical-align: middle;
                display: inline-block;
                border-bottom: 1px solid #EBEBEB;

                &:last-of-type {
                    border-bottom: none;
                }

                span{
                    float: left;
                    display: inline-block;
                }
                .img-icon{
                    display: inline-block;
                    float: left;
                    width: .14rem;
                    height: .18rem;
                    margin: 0 auto;
                    background-size: auto 100%;
                    background-position: center;
                    background-repeat: no-repeat;
                    @include bg-image('../../../../static/attence-image/location2');
                    margin-right: 0.08rem;
                }
                .addressName{
                    display: inline;
                    width: 2.45rem;
                    float: right;
                    font-family: PingFangSC-Regular;
                    font-size: 0.16rem;
                    line-height: 0.22rem;
                    color: #333333;
                }
            }
        }
        .list_warper::-webkit-scrollbar{
          width: 0;
        } /* 滚动条的宽度 */
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }

    .fade-enter, .fade-leave-active {
        opacity: 0
    }


</style>
