<template>
    <div class="apply-list-wrapper">
        <ul class="list">
            <li v-for="(item, index) in returnApplyList" class="item-li" :id="'id-' + item.approveId">
                <router-link :to="path + item.approveId" class="item" :id="'a-' + item.approveId">
                    <abstract :item="item" :entryType="entryType" :tabType="typeId"></abstract>
                </router-link>
                <p class="delete" style="-webkit-box-orient: vertical;" @click="deleteItem(item.approveId)">
                    <span class="text">
                        删除
                    </span>
                </p>
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    import format from 'common/js/dateformat';
    import {Toast} from 'mint-ui';
    import abstract from 'common/components/abstract';

    export default {
        props: {
            draftList: {
                type: Array
            },
            typeId: {
                type: Number
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
                id: '',
                path: '/apply/draft/'
            };
        },
        computed: {
            returnApplyList	() {
            	this.initScrollLeft();
            	return this.draftList;
            }
        },
        methods: {
        	initScrollLeft () {
                let self = this;
                setTimeout(self.$nextTick(function () {
                    // 侧滑显示删除按钮
                    let expansion = null; // 是否存在展开的list
                    let container = document.querySelectorAll('.list li.item-li a.item');
                    for (let i = 0; i < container.length; i++) {
                        let x, y, X, Y, swipeX, x2;
                        container[i].addEventListener('touchstart', function (event) {
                            x = event.changedTouches[0].pageX;
                            y = event.changedTouches[0].pageY;
                            swipeX = true;
                            if (expansion) {   // 判断是否展开，如果展开则收起
                                expansion.className = 'item';
                            }
                        });
                        container[i].addEventListener('touchmove', function (event) {
                            X = event.changedTouches[0].pageX;
                            Y = event.changedTouches[0].pageY;
                            if (X - x > 10) {   // 右滑
                                event.preventDefault();
                            }
                            if (x - X > 10) {   // 左滑
                                event.preventDefault();
                            }
                        });
                        container[i].addEventListener('touchend', function (event) {
                            if (x2 === x) {
                                return;
                            }
                            // 左右滑动
                            if (swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0) {
                                // 阻止事件冒泡
                                event.stopPropagation();
                                this.nextElementSibling.style.background = '#E2421B';
                                if (X - x > 10) {   // 右滑
                                    event.preventDefault();
                                    this.className = 'item';    // 右滑收起
                                }
                                if (x - X > 10) {   // 左滑
                                    event.preventDefault();
                                    this.className = 'swipe-left item';   // 左滑展开
                                    expansion = this;
                                }
                            }
                        });
                    }
                }), 0);
            },
            deleteItem (approveId) {
        		let self = this;
                let element = document.getElementById('id-' + approveId);
                this.id = approveId;
                this.$http({
                    url: '/approve/delete?companyId=' + window.companyId +'&approveId=' + approveId,
                    method: 'GET',
                    headers: window.headers
                }).then((res) => {
                    if (res.body.code === 0) {
                        let instance = Toast('草稿删除成功');
                        element.remove();
                        setTimeout(() => {
                            instance.close();
                        }, 2000);
                        self.$http({
                            url: '/approve/list?companyId=' + window.companyId + '&pageSize=10000&typeId=0',
                            method: 'GET',
                            headers: window.headers
                        }).then((res) => {
                            if (res.body.code === 0) {
                                self.returnApplyList = res.body.data.list;
                                if (res.body.data.page.totalRecord === 0) {
                                	self.$emit('showNoDrafts');
                                }
                            }
                        }, (res) => {
                                self.$emit('showNoDrafts');
                            });
                        }
                }, (res) => {
                    let instance = Toast('草稿删除失败');
                    let item = document.getElementById('a-' + approveId);
                    item.className = 'item';
                    setTimeout(() => {
                        instance.close();
                    }, 2000);
                });
            }
        },
        filters: {
            formatDate (date) {
                Date.prototype.Format = format;
                return new Date(date).Format('yyyy-MM-dd HH:mm');
            }
        }
    };
</script>

<style lang="scss" type="text/css" rel="stylesheet/scss" scoped>
    @import '../../../../common/css/mixin';

    .apply-list-wrapper {
        /*position: absolute;*/
        /*left: 0;*/
        /*right: 0;*/
        -webkit-overflow-scrolling: touch;
        font-size: .12rem;
    }

    .item-li {
        position: relative;
        display: block;
        box-sizing: border-box;
        width: 100%;
        border-top: 1px solid #e7e7ed;
        .item {
            display: block;
            box-sizing: border-box;
            width: 100%;
            padding: 0 .16rem;
            background: #fff;
            -webkit-transition: all 0.3s linear;
            transition: all 0.3s linear;
            position: relative;
            z-index: 1;
        }
    }

    .delete {
        width: .8rem;
        color: #fff;
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 0;
        font-style: normal;
        font-size: .15rem;

        .text {
            width: 100%;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translate(0,-50%);
            text-align: center;
        }
    }

    .swipe-left {
        transform: translateX(-.8rem);
        -webkit-transform: translateX(-.8rem);

        .content {
            margin-right: 0 !important;
        }
    }
</style>
