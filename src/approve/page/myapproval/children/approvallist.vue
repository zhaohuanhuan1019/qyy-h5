<template>
    <div class="list-wrapper" ref="listWrapper" :class="{bottom: showStyle}">
        <ul>
            <li v-for="item in approvalList" class="li-batch-parent">
                <div class="batch-wrapper" v-if="reListType === 0" v-show="showStyle"
                     @click="doBatchSingleone(item.approveId)" :class="{'in-batch': resetIfAllBatch(item.approveId)}">
                </div>
                <router-link :to="path + item.approveId" class="item" :class="{resetPadByBatch: showStyle}">
                    <abstract :item="item" :entryType="entryType" :tabType="listType"></abstract>
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
            approvalDoneList: {
                type: Array
            },
            approvalAwaitList: {
                type: Array
            },
            listType: {
            	type: Number
            },
            showApprovalStyle: {
            	type: Boolean
            },
            ifAllBatchClicked: {
            	type: Boolean
            },
            entryType: { // 0 - 我已审批 待我审批入口 ,1 - 我发起的入口
                type: Number
            }
        },
        components: {
            abstract
        },
        data () {
            return {
//                id: 1,
                path: '',
                ifSomeoneBatch: null, // 是否选择了任意个大于0 :true
                batchSomeoneNum: this.approvalAwaitList.length,
                checkedLists: [],
                batchOne: null
            };
        },
        created () {
            this.$store.state.bacth = {};
        },
        methods: {
            resetIfAllBatch (index) {
                return this.checkedLists.indexOf(index) > -1
            },
        	selectAll () {
        		let self = this;
        		self.approvalAwaitList.forEach(function (item, index) {
        			self.checkedLists.push(item.approveId);
                })
            },
            doBatchSingleone (index) {
                if (this.checkedLists.indexOf(index) > -1) {
                    this.checkedLists.splice(this.checkedLists.indexOf(index), 1);
                } else {
                    this.checkedLists.push(index);
                }

                this.batchSomeoneNum = this.checkedLists.length;
                this.$emit('refreshBatchNum', this.batchSomeoneNum);
            }
        },
        filters: {
            formatDate (date) {
                Date.prototype.Format = format;
                return new Date(date).Format('yyyy-MM-dd HH:mm');
            }
        },
        computed: {
            approvalList () {
                if (this.listType === 0) {
                	this.path = '/approval/wait/';
                	return this.approvalAwaitList;
                }
                if (this.listType === 1) {
                    this.path = '/approval/done/';
                    return this.approvalDoneList;
                }
            },
            ifAllBatchClickedComputed () {
                return this.ifAllBatchClicked;
            },
            showStyle () {
            	return this.showApprovalStyle;
            },
            reListType () {
            	return this.listType;
            }
        }
    };
</script>

<style lang="scss" type="text/css" rel="stylesheet/scss" scoped>
    @import '../../../../common/css/mixin';

    .list-wrapper {
        /*position: absolute;*/
        /*top: .99rem;*/
        /*left: 0;*/
        /*right: 0;*/
        -webkit-overflow-scrolling: touch;
        font-size: .12rem;
        background-color: #ffffff;

        &.bottom {
            margin-bottom: .54rem;
        }
    }

    .li-batch-parent {
        position: relative;
        display: block;
        box-sizing: border-box;
        width: 100%;
        border-top: 1px solid #e7e7ed;


        .batch-wrapper {
            position: absolute;
            left: 0;
            display: inline-block;
            width: .22rem;
            height: .22rem;
            z-index: 90;
            padding: .21rem .14rem .25rem .16rem;
            background-size: .2rem;
            background-repeat: no-repeat;
            background-position: center;
            @include bg-image('../../../../../static/image/notinbatch');

            &.in-batch {
                @include bg-image('../../../../../static/image/inbatch');
            }
        }
    }

    .item {
        display: block;
        box-sizing: border-box;
        padding: 0 .16rem;

        &.resetPadByBatch {
            /*position: absolute;*/
            padding: 0 .16rem 0 .48rem;
            /*left: .5rem;*/
            /*right: 0;*/
        }
    }
</style>
