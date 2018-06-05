<template>
    <div class="flow-wrapper">
        <h1 class="title">审批流程</h1>
        <div class="flow-item" v-for="userTask in userTasks">
            <div class="job-wrapper">
                <h1>
                    <span class="circle" :style="{backgroundColor: randomColor(userTask.staffName)}">{{ userTask.staffName | takeLastTwo}}</span>
                </h1>
            </div>
            <div class="detail-wrapper">
                <div class="detail-header" style="-webkit-box-orient:vertical">
                    <span class="userTask-staff">{{ userTask.name }}{{ userTask.staffName | staffName( userTask.name)}}</span>
                    <div class="edit-wrapper">
                        <span class="edit"
                              @click="addOrEditItem(userTask.id, userTask.isAssigneeChoice)"
                              :class="{able: userTask.isAssigneeChoice && userTask.assignee,
                               add: userTask.isAssigneeChoice && !userTask.assignee}">
                        </span>
                        <span class="delete" :class="{able: userTask.isPromoterDelete}"
                              @click="doDeleteItem(userTask.id, userTask.isPromoterDelete, userTask.name)">
                        </span>
                    </div>
                </div>
                <div class="detail">
                    <div class="inline-wrap">
                        <div class="block-wrap" v-for="staffInfoToUser in userTask.staffInfoToUser">
                            <div class="inline-wrap">
                                <div class="block-wrap">
                                    <span class="department" :class="{'padding-right': staffInfoToUser.partTime === 1}">
                                    {{ staffInfoToUser | staffInfoShow }}
                                        <!--兼职 icon-->
                                        <span v-if="staffInfoToUser.partTime" class="partTime_1"></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex';
    import jsBridge from 'common/js/jsbridge';
    import {Toast, MessageBox} from 'mint-ui';

    export default {
        props: {
            userTasks: {
                type: Array
            }
        },
        data () {
            return {
                assigneeInfo: []
            };
        },
        computed: {
            staffsList () {
                return this.$store.state.staffsListFromAddress;
            }
        },
//        watch:{
//            flag(){
//                this.$store.state.quitCheck = !this.$store.state.quitCheck;
//            }
//        },
        filters: {
            staffInfoShow (obj) {
            	let staffObj = obj || {};
            	return staffObj.deptName + '-' + staffObj.dutyName;
            },
            takeLastTwo (name) {
                if (name) {
                    return name.substr(-2);
                } else {
                    return '';
                }
            },
            staffName (name, taskName) {
            	if (taskName) {
                    if (name) {
                        return ' - ' + name;
                    } else {
                        return '';
                    }
                } else {
            		return ' - 暂无审批人';
                }
            }
        },
        methods: {
            ...mapMutations([
                'SAVE_ASSIGNEE',
                'ONLY_JUDGE'
            ]),
            randomColor (name) {
                if (name) {
                    let colorArr = ['#b2dbf3', '#81dbee', '#a6e6c2', '#68c6aa', '#f8b186', '#f693bf', '#b5b4e3', '#c280d3'];
                    let index = Math.floor((Math.random() * colorArr.length));

                    return colorArr[index];
                } else {
                    return '#eeeeee';
                }
            },
            doDeleteItem (id, ifDelete, userTaskName) { // 删除
                if (ifDelete) {

                    MessageBox.confirm('确认删除该节点？').then(action => {
                        for (let i = 0; i < this.userTasks.length; i++) {
                            if (this.userTasks[i].id === id) {
                                this.userTasks.splice(i, 1); // 删除
                            }
                        }



                        this.assigneeInfo = this.userTasks.map(function (item, index, arr) {
                            let userTaskObj = {};
                            userTaskObj.taskId = item.id;
                            userTaskObj.assignee = '${' + item.id + '}';
                            userTaskObj.name = item.name;
                            userTaskObj.assigneeType = item.assigneeType;
                            userTaskObj.value = item.assignee;
                            userTaskObj.isAssigneeChoice = item.isAssigneeChoice;
                            userTaskObj.isPromoterDelete = item.isPromoterDelete;
                            return userTaskObj;
                        });
                        this.SAVE_ASSIGNEE(this.assigneeInfo); // 保存
                        // 删完后
                        if (this.userTasks.length <= 0) {
                            this.$store.state.flowStatus = false;
                            this.$store.state.submitFlow = false;
                            this.$store.state.saveFlow = false;

                            let instance = Toast('审批流程不能为空');
                            setTimeout(() => {
                                instance.close();
                            }, 2000);
                        } else {
                            this.$store.state.saveFlow = true;
                            this.$store.state.flowStatus = true;

                            for (let userTask of this.assigneeInfo) {
                                if (userTask.value) {
                                    this.$store.state.submitFlow = true;
                                } else if (!userTask.isAssigneeChoice) {
                                    this.$store.state.submitFlow = true;
                                } else {
                                    this.$store.state.submitFlow = false;
                                    this.ONLY_JUDGE();

                                    return;
                                }
                            }
                        }

                        this.ONLY_JUDGE();
                    });

                }
            },
            async addOrEditItem (id, ifAddOrEdit) {
                console.log(id+'--'+ifAddOrEdit)
                // 联调 调取通讯录
                // 根据id 确定哪一条， 替换数据
                if (ifAddOrEdit) {
                    // 触发控件
                    let staffData = await jsBridge.getStuffInfo();
                    // 数据格式
                    // 如果选择了并返回了 代理人
                    if (staffData.staffId) {
                        for (let i = 0; i < this.userTasks.length; i++) {
                            if (this.userTasks[i].id === id) {
                                // 添加或者替换
                                this.userTasks[i].assignee = staffData.staffId;
                                this.userTasks[i].staffInfoToUser = [];

                                if (this.staffsList) {
                                    for (let j = 0; j < this.staffsList.length; j++) {
                                        let staffItem = this.staffsList[j];
                                        if (Number(staffData.staffId) === Number(staffItem.id)) {
                                            this.userTasks[i].staffName = staffItem.staffName;
                                            if (staffItem.partTime === 0) { // 主职位
                                                this.userTasks[i].staffInfoToUser.unshift(staffItem);
                                            } else { // 兼职
                                                this.userTasks[i].staffInfoToUser.push(staffItem);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        this.assigneeInfo = this.userTasks.map(function (item, index, arr) {
                            let userTaskObj = {};
                            userTaskObj.value = item.assignee;
                            userTaskObj.taskId = item.id;
                            userTaskObj.assignee = '${' + item.id + '}';
                            userTaskObj.name = item.name;
                            userTaskObj.assigneeType = item.assigneeType;
                            userTaskObj.isAssigneeChoice = item.isAssigneeChoice;
                            userTaskObj.isPromoterDelete = item.isPromoterDelete;
                            return userTaskObj;
                        });
                        this.SAVE_ASSIGNEE(this.assigneeInfo); // 保存
                        // 控制状态
                        for (let userTask of this.assigneeInfo) {
                            if (userTask.value) {
                                this.$store.state.submitFlow = true;
                            } else if (!userTask.isAssigneeChoice) {
                                this.$store.state.submitFlow = true;
                            } else {
                                this.$store.state.submitFlow = false;
                                this.ONLY_JUDGE();
                                return;
                            }
                        }
                        this.ONLY_JUDGE();

                    }
                }
            }
        },
        created () {

            this.assigneeInfo = this.userTasks.map(function (item, index, arr) {
                // 不能修改时保存的数据
                let userTaskObj = {};
                userTaskObj.taskId = item.id;
                userTaskObj.assignee = '${' + item.id + '}';
                userTaskObj.name = item.name;
                userTaskObj.value = item.assignee;
                userTaskObj.assigneeType = item.assigneeType;
                userTaskObj.isAssigneeChoice = item.isAssigneeChoice;
                userTaskObj.isPromoterDelete = item.isPromoterDelete;
                return userTaskObj;
            });
            this.SAVE_ASSIGNEE(this.assigneeInfo); // 保存

            // 默认流程控制保存为true
            this.$store.state.saveFlow = true;
            this.$store.state.flowStatus = true;

            for (let userTask of this.userTasks) {
                if (userTask.assignee) {
                    this.$store.state.submitFlow = true;
                } else if (!userTask.isAssigneeChoice) {
                    this.$store.state.submitFlow = true;
                } else {
                    this.$store.state.submitFlow = false;
                    this.ONLY_JUDGE();
                    return;
                }
            }
            this.ONLY_JUDGE();
        }
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    @import "../../../common/css/mixin";

    .flow-wrapper {
        padding: .06rem .16rem 0.44rem .16rem;
        box-sizing: border-box;
        /*margin-top: .1rem;*/
        background-color: #ffffff;
        width: 100%;
        font-size: 0.14rem;
        color: #333333;

        .title {
            margin: .24rem 0 .09rem 0;
            /*font-size: 0.18rem;*/
            line-height: .25rem;
            font-family: PingFangSC-Regular;
            font-size: .16rem;
            color: #999999;
            letter-spacing: 0;

            & > span {
                font-size: .14rem;
            }
        }

        .job-wrapper {
            align-items: center;
            display: inline-block;
            position: absolute;
            z-index: 2;

            &:after {
                clear:both;
                content:'.';
                display:block;
                width: 0;
                height: 0;
                visibility:hidden;
            }

            h1 {
                float: left;
                font-size: .16rem;
                color: #333333;
                position: relative;

                .circle {
                    $height: 0.34rem;
                    width: $height;
                    height: $height;
                    font-size: .12rem;
                    color: #ffffff;
                    display: inline-block;
                    vertical-align: top;
                    border-radius: 5px;
                    line-height: $height;
                    text-align: center;
                }
            }
        }

        .detail-header {
            height: 100%;
            @include ellipsis-line(2);

            padding-right: .8rem;

            .userTask-staff {
                font-size: 0.16rem;
                color: #333333;
            }
        }

        .edit-wrapper {
            position: absolute;
            top: 0;
            right: 0;

            .edit,
            .delete {
                width: 0.24rem;
                height: 0.24rem;
                display: inline-block;
                background-repeat: no-repeat;
                background-position: center;
            }

            .delete {
                margin-left: 0.15rem;
                background-size: cover;

                @include bg-image('../../../../static/image/delete_disabled');

                &.able {
                    @include bg-image('../../../../static/image/delete');
                }
            }

            .edit {
                background-size: cover;

                @include bg-image('../../../../static/image/edit_disabled');

                &.add {
                    @include bg-image('../../../../static/image/add');
                }

                &.able {
                    @include bg-image('../../../../static/image/edit');
                }
            }
        }

        .flow-item {
            padding-bottom: .36rem;
            position: relative;
            @include border-left(#EEEEEE);

            &:before {
                top: .12rem !important;
                left: .165rem;
            }

            &:nth-last-of-type(1) {
                &:before {
                    border-left: none !important;
                }
            }

            .detail-wrapper {
                padding-left: 0.54rem;
                /*padding-top: 0.02rem;*/
                position: relative;

                .detail {
                    overflow: hidden;
                    margin-top: .05rem;

                    .inline-wrap {
                        display: inline-block;
                        max-width: 100%;

                        .block-wrap {
                            width: 100%;
                        }
                    }
                }

                .department {
                    position: relative;
                    line-height: .2rem;
                    font-size: 0.14rem;
                    /*padding-right: 0.15rem;*/
                    color: #999999;
                    display: block;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;

                    &.padding-right {
                        padding-right: .2rem;
                    }

                    .partTime_1 {
                        position: absolute;
                        top: .018rem;
                        right: 0;
                        display: inline-block;
                        width: .15rem;
                        height: .15rem;
                        @include bg-image('../../../../static/image/parttime');
                        background-size: .15rem;
                    }
                }
            }
        }
    }
</style>
