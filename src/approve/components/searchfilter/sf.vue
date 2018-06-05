<template>
    <div>
        <div class='search-filter-wrapper' v-show="ifShowWrapper">
            <div class='tab-item' @click="toShowSPage">
                <a>
                    <span class="icon_s" :class="{disabled: !ifAble}"></span>
                    <span class='tab-name' :class="{disabled: !ifAble}">搜索</span>
                </a>
            </div>
            <div class='tab-item' @click="toShowFPage">
                <a>
                    <span class="icon_f" :class="{active: ifActive}"></span>
                    <span class='tab-name' :class="{active: ifActive}">筛选</span>
                </a>
            </div>
        </div>

        <!-- 筛选条件 -->
        <div class='filter-tips' v-show="ifShowTipsWrapper">
            <span class="tips">{{ fTips }}</span>
            <span @click="toClearTips" class='clear-tips'>清空</span>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
    	props: {
            ifShowTipsWrapper: {
            	type: Boolean
            },
            ifShowWrapper: {
            	type: Boolean
            },
            ifAble: {
                type: Boolean
            },
            fTips: {
            	type: String
            }
        },
        data () {
            return {
                ifActive: false
            };
        },
        methods: {
            toShowSPage () {
            	if (this.ifAble) {
                    this.$emit('showSPage');
                    this.ifActive = false;
                }
            },
            toShowFPage () {
                this.$emit('showFPage');
                this.ifActive = true;
            },
            toClearTips () {
                this.$emit('clearTips');
                this.ifActive = false;
            }
        }
    }
</script>

<style lang="scss" type="text/css" rel="stylesheet/scss" scoped>
    @import '../../../common/css/mixin';

    $headerHeight: .44rem;
    $tapHeight: .55rem;
    $sfHeight: .47rem;
    $sfTop: $headerHeight + $tapHeight;
    $tipHeight: .4rem;

    .search-filter-wrapper {
        width: 100%;
        height: $sfHeight;
        position: fixed;
        top: $sfTop;
        box-sizing: border-box;
        line-height: $sfHeight;
        text-align: center;
        z-index: 100;
        background-color: #ffffff;

        .tab-item {
            position: relative;
            width: 50%;
            display: inline-block;
            float: left;

            & > a {
                position: relative;
                display: block;
                height: 100%;
                font-size: .14rem;
                color: #999999;

                .icon_s {
                    position: absolute;
                    top: .16rem;
                    left: .64rem;
                    width: .14rem;
                    height: .14rem;

                    @include bg-image('../../../../static/image/search');
                    background-size: 100%;

                    &.disabled {
                        @include bg-image('../../../../static/image/search_dis');
                    }
                }

                .icon_f {
                    position: absolute;
                    top: .16rem;
                    right: 1.1rem;
                    width: .15rem;
                    height: .17rem;

                    @include bg-image('../../../../static/image/filter_dis');
                    background-size: 100%;

                    &.active {
                        @include bg-image('../../../../static/image/filter');
                    }
                }

                .tab-name {
                    display: inline-block;
                    box-sizing: border-box;
                    height: $sfHeight;
                    font-size: .14rem;
                    color: #999999;

                    &.active {
                        color: #4590E4;
                    }

                    &.disabled {
                        color: #dddddd;
                    }
                }

                &.active {
                    color: #4A90E2;

                    .tab-name {

                    }
                }
            }
        }
    }

    .filter-tips {
        width: 100%;
        height: $tipHeight;
        position: fixed;
        top: $sfTop + $sfHeight;
        box-sizing: border-box;
        padding: 0 .6rem 0 0.16rem;
        line-height: $tipHeight;
        font-size: .14rem;
        color: #666666;
        z-index: 100;
        background-color: #F3F4F5;
        border-bottom: 1px solid #E7E7ED;

        @include single-line;

        .clear-tips {
            position: absolute;
            top: 0;
            right: .16rem;
            color: #4590E4;
            height: $tipHeight;
        }
    }
</style>
