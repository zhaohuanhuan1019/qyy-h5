<template>
    <div class="apply-list-wrapper" ref="applyListWrapper">
        <ul>
            <li  v-for="item in applyList" class="item-li">
                <router-link :to="path + item.approveId" class="item">
                    <abstract :item="item" :entryType="entryType" :tabType="typeId"></abstract>
                </router-link>
            </li>

        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import format from 'common/js/dateformat';
    import abstract from 'common/components/abstract';

    export default {
        props: {
            filedList: {
                type: Array
            },
            launchList: {
                type: Array
            },
            typeId: {
                type: Number
            },
            entryType: { // 0 - 我已审批 待我审批入口 ,1 - 我发起的入口
                type: Number
            }
        },
        data () {
            return {
                path: ''
            };
        },
        components: {
            abstract
        },
        filters: {
            formatDate (date) {
                Date.prototype.Format = format;
                return new Date(Number(date)).Format('yyyy-MM-dd HH:mm');
            }
        },
        computed: {
            applyList () {
            	if (this.typeId === 1) {
                    this.path = '/apply/launch/';
                    return this.launchList;
                }
                if (this.typeId === 2) {
                    this.path = '/apply/filed/';
                    return this.filedList;
                }
            }
        }
    };
</script>

<style lang="scss" type="text/css" rel="stylesheet/scss" scoped>
    @import '../../../../common/css/mixin';

    .apply-list-wrapper {
        -webkit-overflow-scrolling: touch;
        font-size: .12rem;
        background-color: #ffffff;
    }

    .item-li {
        position: relative;
        display: block;
        box-sizing: border-box;
        width: 100%;
        border-top: 1px solid #e7e7ed;
    }

    .item {
        display: inline-block;
        width: 100%;
        padding: 0 .16rem;
        box-sizing: border-box;
    }
</style>
