<template>
    <div class="filter-box" v-show="getGroupOK">
        <section class="query-group">
            <div class="group-title">{{ queryTime.title }}</div>
            <div class="group-list-wrapper">
                <ul>
                    <li @click="choose(queryTime.id, item.id, item.name)" v-for="item in queryTime.group" class="item column_2"
                        :class="{is_choose: resolveTimeCss(item.id)}"
                        >{{ item.name }}</li>

                </ul>
            </div>
        </section>
        <section class="query-group">
            <div class="group-title">{{ queryGroup.title }}</div>
            <div class="group-list-wrapper">
                <ul>
                    <li @click="choose(queryGroup.id, item.id, item.name)" v-for="item in queryGroup.group" class="item"
                        :class="[column_N, {is_choose: resolveGroupCss(item.id)}]"
                    >{{ item.name }}</li>

                </ul>
            </div>
        </section>
        <section class="query-group" v-show="entryType === 1">
            <div class="group-title">{{ queryStatus.title }}</div>
            <div class="group-list-wrapper">
                <ul>
                    <li @click="choose(queryStatus.id, item.id, item.name)" v-for="item in queryStatus.group" class="item column_2"
                        :class="{is_choose: resolveStatusCss(item.id)}"
                    >{{ item.name }}</li>

                </ul>
            </div>
        </section>
        <section class="query-group">
            <div class="group-title">{{ queryAgency.title }}</div>
            <div class="group-list-wrapper">
                <ul>
                    <li @click="choose(queryAgency.id, item.id, item.name)" v-for="item in queryAgency.group" class="item column_2"
                        :class="{is_choose: resolveAgencyCss(item.id)}"
                    >{{ item.name }}</li>

                </ul>
            </div>
        </section>
        <footer class="filter-footer">
            <div class="reset" @click="reset">重置</div>
            <div class="confirm" @click="confirm">确认</div>
        </footer>
    </div>

</template>

<script type="text/ecmascript-6">
    export default{
    	data () {
    		return {
                getGroupOK: false,
                queryTime: {
                    id: 1,
                    title: '审批申请时间',
                    group: [
                        {id: 100, name: '全部'},
                        {id: 2, name: '今日'},
                        {id: 3, name: '本周'},
                        {id: 4, name: '本月'}
                    ],
                    selected: 100
                },
                queryGroup: {
                    id: 2,
                    title: '审批组',
                    group: [],
                    selected: 0
                },
                queryAgency: {
                    id: 3,
                    title: '紧急程度',
                    group: [
                        {id: 100, name: '全部'},
                        {id: 0, name: '一般'},
                        {id: 1, name: '较紧急'},
                        {id: 2, name: '很紧急'}
                    ],
                    selected: 100
                },
                queryStatus_all: {
                    id: 4,
                    title: '审批状态',
                    group: [
                        {id: 100, name: '全部'},
                        {id: 2, name: '已通过'},
                        {id: 3, name: '未批准'},
                        {id: 1, name: '审批中'},
                        {id: 4, name: '已撤销'}
                    ],
                    selected: 100
                },
                queryStatus_filed: {
                    id: 4,
                    title: '审批状态',
                    group: [
                        {id: 100, name: '全部'},
                        {id: 2, name: '已通过'},
                        {id: 3, name: '未批准'},
                        {id: 4, name: '已撤销'}
                    ],
                    selected: 100
                },
                column_N: null,
                params: {},
                filterTips: []
            };
        },
        props: {
            entryType: { // 0 - 我已审批 待我审批入口 ,1 - 我发起的入口
            	type: Number
            },
            tabType: { // 0-待我审批  1-我已审批  ,,, 0-草稿 1-我发起的  2-已归档
                type: Number
            }
        },
        computed: {
            _allTime () {
                return this.queryTime.selected === 100;
            },
            _allGroup () {
            	return this.queryGroup.selected === 0;
            },
            _allStatus () {
                return this.queryStatus.selected === 100;
            },
            _allAgency () {
                return this.queryAgency.selected === 100;
            },
            queryStatus () {
                if (this.entryType ===1 && this.tabType === 2) { // 已归档不显示审批中
                    return this.queryStatus_filed;
                } else {
                	return this.queryStatus_all;
                }
            }
        },
        methods: {
    		reset () {
                this.params = {};
                this.filterTips = [];
                this.queryTime.selected = 100;
                this.queryGroup.selected = 0;
                this.queryAgency.selected = 100;
                this.queryStatus.selected = 100;

            },
            getName (arr, id, forbidId) {
    			for (let item of arr.group) {
    				if (item.id === id && id !== forbidId) {
                        this.filterTips.push(item.name);
                    }
                }
            },
            getFilterTips () {
                if (this.entryType === 0) {
                    this.getName(this.queryTime, this.queryTime.selected, 100);
                    this.getName(this.queryGroup, this.queryGroup.selected, 0);
                    this.getName(this.queryAgency, this.queryAgency.selected, 100);
                } else {
                    this.getName(this.queryTime, this.queryTime.selected, 100);
                    this.getName(this.queryGroup, this.queryGroup.selected, 0);
                    this.getName(this.queryAgency, this.queryAgency.selected, 100);
                    this.getName(this.queryStatus, this.queryStatus.selected, 100);
                }
            },
            confirm () {
    			let ifRefresh;
                this.getFilterTips();
                let tips = this.filterTips.join(' ');
                this.$emit('hideFPage');
                if (this.entryType === 0) {
                    if (this._allTime && this._allGroup && this._allAgency) {
                        ifRefresh = true;
                        this.$emit('quickFilter', this.params, tips, ifRefresh);
                    } else {
                        ifRefresh = false;
                        if (Object.keys(this.params).length) {
                            this.$emit('quickFilter', this.params, tips, ifRefresh);
                        }
                    }
                } else {
                    if (this._allTime && this._allGroup && this._allStatus && this._allAgency) {
                        ifRefresh = true;
                        this.$emit('quickFilter', this.params, tips, ifRefresh);
                    } else {
                        ifRefresh = false;
                        if (Object.keys(this.params).length) {
                            this.$emit('quickFilter', this.params, tips, ifRefresh);
                        }
                    }
                }

                this.reset();
            },
            resolveTimeCss (id) {
                return this.queryTime.selected === id;
            },
            resolveTimeJs (id) {
                if (this.queryTime.selected !== id) {
                    this.queryTime.selected = id;
                }

                if (id === 100) {
                    delete this.params.startDate;
                    delete this.params.endDate;
                } else if (id === 2) {
                    let today = this.getCurrentDayFirstLast();

                    this.params.startDate = today.start;
                    this.params.endDate = today.end;
                } else if (id === 3) {
                    let week = this.getCurrentWeekFirstLast();

                    this.params.startDate = week.monday;
                    this.params.endDate = week.sunday;
                } else if (id === 4) {
                    let monthFirst = this.getCurrentMonthFirst();
                    let monthLast = this.getCurrentMonthLast();

                    this.params.startDate = monthFirst;
                    this.params.endDate = monthLast;
                }
            },
            resolveGroupCss (id) {
                return this.queryGroup.selected === id;
            },
            resolveGroupJs (id) {
                if (this.queryGroup.selected !== id) {
                    this.queryGroup.selected = id;
                }

                if (id === 0) {
                    delete this.params.flowTypeId;
                } else {
                    this.params.flowTypeId = id;
                }
            },
            resolveAgencyCss (id) {
                return this.queryAgency.selected === id;
            },
            resolveAgencyJs (id) { // 0-一般；1-较紧急；2-很紧急
                if (this.queryAgency.selected !== id) {
                    this.queryAgency.selected = id;
                }
                if (id === 100) {
                    delete this.params.urgencyLevel;
                } else {
                    this.params.urgencyLevel = id;
                }
            },
            resolveStatusCss (id) {
                return this.queryStatus.selected === id;
            },
            resolveStatusJs (id) { // 值范围：1-审批中；2-已通过；3-未批准；4-已撤销
                if (this.queryStatus.selected !== id) {
                    this.queryStatus.selected = id;
                }
                if (id === 100) {
                	delete this.params.approveStatus;
                } else {
                    this.params.approveStatus = id;
                }
            },
            choose (groupId, queryId, name) {
    			switch (groupId) {
                    case 1:
                    	this.resolveTimeJs(queryId, name);
                    	break;
                    case 2:
                    	this.resolveGroupJs(queryId, name);
                    	break;
                    case 3:
                    	this.resolveAgencyJs(queryId, name);
                        break;
                    case 4:
                    	this.resolveStatusJs(queryId, name);
                    	break;
                    default:
                    	break;
                }
            },
            getApproveGroup () {
                this.getGroupOK = false;
                this.queryGroup.group = [];
                this.$http({
                    url: '/approve/setting/type/list',
                    method: 'GET',
                    headers: window.headers,
                    params: {
                        companyId: window.companyId,
                        status: 1,
                        pageSize: 10000
                    }
                }).then((res) => {
                    if (res.body.code === 0) {
                    	let list = res.body.data.list;
                    	for (let item of list) {
                            if (item.isBind) {
                                this.queryGroup.group.push(item);
                            }
                        }
                        this.queryGroup.group.unshift({id: 0, name: '全部'});
                        this.column_N = this.queryGroup.group.length%2 > 0 ? 'column_3' : 'column_2';
                        this.getGroupOK = true;
                        this.$emit('getGroupReady');
                    }
                }, (res) => {

                });
            },
            getCurrentMonthFirst () {
                let date = new Date();
                date.setDate(1);
                let y = date.getFullYear();
                let m = date.getMonth() + 1;
                let d = date.getDate();

                return new Date(y + '/' + m + '/' + d + ' 00:00:00').getTime();
            },
            getCurrentMonthLast () {
                let date = new Date();
                let currentMonth = date.getMonth();
                let nextMonth = currentMonth + 1;
                let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
                let oneDay = 1000 * 60 * 60 * 24;
                let lastDate = new Date(nextMonthFirstDay - oneDay);
                let y = date.getFullYear();
                let m = currentMonth + 1;
                let d = lastDate.getDate();

                return new Date(y + '/' + m + '/' + d + ' 23:59:59').getTime();
            },
            getCurrentWeekFirstLast () {
                let now = new Date();
                let nowTime = now.getTime() ;
                let day = now.getDay();
                let oneDay = 1000 * 60 * 60 * 24;

                let MondayTime = nowTime - (day - 1) * oneDay;
                let SundayTime =  nowTime + (7 - day) * oneDay;


                let monday = new Date(MondayTime);
                let sunday = new Date(SundayTime);
                let y_f = monday.getFullYear();
                let m_f = monday.getMonth() + 1;
                let d_f = monday.getDate();

                let y_l = sunday.getFullYear();
                let m_l = sunday.getMonth() + 1;
                let d_l = sunday.getDate();

                monday =  new Date(y_f + '/' + m_f + '/' + d_f + ' 00:00:00').getTime();
                sunday =  new Date(y_l + '/' + m_l + '/' + d_l + ' 23:59:59').getTime();

                return {
                    monday: monday,
                    sunday: sunday
                }
            },
            getCurrentDayFirstLast () {
                let date = new Date();

                let y = date.getFullYear();
                let m = date.getMonth() + 1;
                let d = date.getDate();

                let start =  new Date(y + '/' + m + '/' + d + ' 00:00:00').getTime();
                let end =  new Date(y + '/' + m + '/' + d + ' 23:59:59').getTime();

                return {
                    start: start,
                    end: end
                }
            },
        }
    }
</script>

<style lang="scss" type="text/css" rel="stylesheet/scss" scoped>
    @import "../../../common/css/mixin";

    .filter-box {
        padding: 0 .16rem .6rem .16rem;
        font-size: .14rem;
        /*margin-bottom: .15rem;*/

        .group-title {
            padding-top: .2rem;
            font-size: .16rem;
            color: #333333;
        }

        .column_2,
        .column_3 {
            @include single-line();
            $height: .44rem;

            display: inline-block;
            box-sizing: border-box;
            overflow: hidden;
            padding: 0 .12rem;
            background-color: #F3F4F5;
            height: $height;
            margin-top: .15rem;
            line-height: $height;
            border-radius: .03rem;
            text-align: center;
            font-size: .14rem;
            color: #666666;

        }

        .column_2 {
            width: 47.8%;
            margin-right: 4.4%;

            &:nth-of-type(2n) {
                margin-right: 0;
            }
        }

        .column_3 {
            width: 1.045rem;
            margin-right: .1475rem;

            &:nth-of-type(3n) {
                margin-right: 0;
            }
        }

        .is_choose {
            background-color: #8DBEF5;
            color: #ffffff;
        }

        .filter-footer {
            z-index: 100;
            width: 100%;
            height: .45rem;
            position: fixed;
            bottom: 0;
            left: 0;
            background-color: #ffffff;
            border-top: 1px solid #dfdfdf;

            .reset, .confirm {
                width: 50%;
                float: left;
                display: inline-block;
                box-sizing: border-box;
                line-height: 0.45rem;
                text-align: center;
                font-size: 0.16rem;
                color: #4590E4;
                &:active {
                    background-color: #ededed;
                }
            }

            .reset {
                border-right: 1px solid #dfdfdf;
            }
        }
    }
</style>
