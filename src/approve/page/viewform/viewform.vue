<template>
    <div class="view-form-wrapper">
        <head-top :title='title' :go='switchGoBack' class="header"></head-top>
        <div class="view-elements-wrapper"
             :class="{bottom_0: $route.name === 'approval-done'}">
            <div class="main">
                <title-element :approves="approves" :ownInfo="ownInfo"></title-element>
                <div class="line"></div>
                <div v-for="value in values" :is="value.componentName + '-element'" :value="value" :key="value.orderCode"></div>
            </div>
            <div class="hr_background"></div>
            <div class="flow_element_wrapper">
                <flow-element :notes="notes" :ownInfo="ownInfo" :approves="approves"></flow-element>
            </div>

        </div>
        <!--撤销 -->
        <router-link v-if="$route.name === 'apply-launch' && status === 1" :to="'/apply/launch/' + approveId + '/cancel'" replace class="do-cancel">撤销</router-link>
        <!--重新提交 -->
        <router-link v-if="$route.name === 'apply-launch' && (status === 3 || status === 4)"
                     :to="'/apply/launch/' + approveId + '/resubmit/'" replace class="do-cancel">重新提交</router-link>

        <!-- 拒绝同意-->
        <div class="button-wrapper do-cancel" v-if="$route.name === 'approval-wait' && status === 1">
            <!--转交 点击跳转到通讯录-->
            <a class="transfer" @click="transferOperation">转交</a>
            <!--拒绝 同意-->
            <a class="reject" @click="refuseOperation">拒绝</a>
            <a class="agree" @click="agreeOperation">同意</a>
        </div>

        <!-- 应用权限关闭提示-->
        <no-Permission ></no-Permission>
        <!-- end -->
    </div>
</template>

<script type="text/ecmascript-6">
    import headTop from 'approve/components/header/header';
    import elements from 'approve/js/viewelements';
    import jsBridge from 'common/js/jsbridge';
    import { Toast } from 'mint-ui';

    export default{
        components: {
            headTop,
            titleElement: elements.titleElement,
            groupDateElement: elements.groupDateElement,
            textareaElement: elements.textareaElement,
            flowElement: elements.flowElement
        },
        data () {
            return {
                approveId: null,
                formData: {},
                approves: {},
                curApproveId: null,
                approveFlow:'',
                title: '',
                status: '',
                values: [],
                ownInfo: {
                    staffInfoToUser: [],
                    staffName: ''
                },
                ownerId: '',
                notes: [] // 渲染flow组件的流程
            };
        },
        computed: { // 全员信息
            staffsList () {
                return this.$store.state.staffsListFromAddress;
            },
            switchGoBack () {
                if (this.$route.name === 'apply-launch') {
                    this.$store.state.myApplyTypeId = 1;
                    this.$store.state.myApplyPath = '/apply/launch/';
                    return '/apply/launch/';
                } else if (this.$route.name === 'apply-filed') {
                    this.$store.state.myApplyTypeId = 2;
                    this.$store.state.myApplyPath = '/apply/filed/';
                    return '/apply/filed/';
                } else if (this.$route.name === 'approval-wait') {
                    this.$store.state.myApprovalUrl = '/approve/myTasks?pageSize=10000&companyId=';
                    this.$store.state.myApprovalPath = '/approval/wait/';
                    return '/approval/wait/';
                } else if (this.$route.name === 'approval-done') {
                    this.$store.state.myApprovalUrl = '/approve/myFinishedTask?pageSize=10000&companyId=';
                    this.$store.state.myApprovalPath = '/approval/done/';
                    return '/approval/done/';
                } else {
                    return '/home';
                }
            }
        },
        methods: {
            getViewFormData (approveId) {
                return new Promise((resolve, reject) => {
                    this.$http({
                        url: '/approve/view',
                        method: 'GET',
                        params: {
                            companyId: window.companyId,
                            approveId: approveId
                        },
                        headers: window.headers
                    }).then((res) => {
                        resolve(res.body);

                    }, (res) => {
                    });
                });
            },
            // 操作按钮预处理  未完

            async transferOperation () {
                let formData = await this.getViewFormData(this.approveId);
                let status = formData.data.approves.status;
                let curApproveId = formData.data.approves.curApprovers ?
                    JSON.parse(formData.data.approves.curApprovers).staffId : formData.data.approves.curApprovers;

                if (formData.code === 0 && status === 1 && curApproveId === this.curApproveId) {
                	this.toMailList();
                } else {
                	this.alertMsg(status, curApproveId);
                }
            },
            async agreeOperation () {
                let formData = await this.getViewFormData(this.approveId);
                let status = formData.data.approves.status;
                let curApproveId = formData.data.approves.curApprovers ?
                    JSON.parse(formData.data.approves.curApprovers).staffId : formData.data.approves.curApprovers;

                if (formData.code === 0 && status === 1 && curApproveId === this.curApproveId) {
                    this.toAgreeReason();
                } else {
                    this.alertMsg(status, curApproveId);
                }
            },
            async refuseOperation () {
                let formData = await this.getViewFormData(this.approveId);
                let status = formData.data.approves.status;
                let curApproveId = formData.data.approves.curApprovers ?
                    JSON.parse(formData.data.approves.curApprovers).staffId : formData.data.approves.curApprovers;

                if (formData.code === 0 && status === 1 && curApproveId === this.curApproveId) {
                    this.toRefuseReason();
                } else {
                    this.alertMsg(status, curApproveId);
                }
            },
            toAgreeReason () {
                let path = '/approval/wait/' + this.approveId + '/agree';
                this.$router.replace(path);
            },
            toRefuseReason () {
                let path = '/approval/wait/' + this.approveId + '/reject';
                this.$router.replace(path);
            },
            // status	int	状态 0：草稿，1：审批中，2：已完成，3：已终止，4：已撤销，5：已归档
            alertMsg (status, curApproveId) {
                // 已撤销
                if (status === 4) {
                    let instance = Toast('该审批单已撤销');
                    setTimeout(() => {
                        instance.close();
                        this.$router.replace('/approval/wait/');
                    }, 2000);
                } else if (status === 2 || status === 3 || (status === 1 && curApproveId !== this.curApproveId)) {
                    let instance = Toast('该审批单状态已更改，暂无法操作');
                    setTimeout(() => {
                        instance.close();
                    this.$router.replace('/approval/wait/');
                    }, 2000);
                } else {
                    let instance = Toast('该审批单状态已更改，暂无法操作');
                    setTimeout(() => {
                        instance.close();
                    this.$router.replace('/approval/wait/');
                    }, 2000);
                }
            },
            compare (property) {  // 元素排序
                return function (a, b) {
                    let value1 = a[property];
                    let value2 = b[property];
                    return value1 - value2;
                };
            },
            elementType (name) {
                if (name === 'groupDate') {
                    return 'groupDateElement';
                }
                return 'textareaElement';
            },
            async toMailList () {
                let staffData = await jsBridge.getStuffInfo();
                let staffName = '';
                // 如果选择了并返回了 代理人
                if (staffData.staffId) {
                    for (let i = 0; i < this.staffsList.length; i++) {
                        let staffItem = this.staffsList[i];

                        if (Number(staffData.staffId) === Number(staffItem.id)) {
                            staffName = staffItem.staffName;
                        }
                    }

                    let path = '/approval/wait/' + this.approveId + '/transfer?staffId=' + staffData.staffId + "&staffName=" + staffName;
                    this.$router.replace(path)
                }
            }
        },
        created () {
            this.approveId = this.$route.params.approveId;

            (async () => {
                let formData = await this.getViewFormData(this.approveId);
                if (formData.code === 0) {
                    this.title = formData.data.approves.formName;
                    this.approves = formData.data.approves || {};
                    // 操作按钮预处理
                    if (this.$route.name === 'approval-wait') {
                        this.curApproveId = JSON.parse(formData.data.approves.curApprovers).staffId;
                    }
                    this.approveFlow = formData.data.approveFlow;
                    this.ownerId = formData.data.approves.ownerId || '';
                    let notes = formData.data.notes || [];
                    for (let i = 0; i < notes.length; i++) {  // 匹配代理人信息
                        let notesItem = notes[i];
                        notesItem.staffInfoToUser = [];

                        if (this.staffsList) {
                            for (let j = 0; j < this.staffsList.length; j++) {
                                let staffItem = this.staffsList[j];

                                // 当前节点已经处理过 节点审批人信息
                                if (notesItem.id) {
                                    if (Number(notesItem.ownerId) === Number(staffItem.id)) {
                                        notesItem.staffName = staffItem.staffName;
                                        if (staffItem.partTime === 0) { // 主职位
                                            notesItem.staffInfoToUser.unshift(staffItem);
                                        } else { // 兼职
                                            notesItem.staffInfoToUser.push(staffItem);
                                        }
                                    }
                                    // 当前节点未处理 节点审批人信息
                                } else {
                                    if (Number(notesItem.assignNow) === Number(staffItem.id)) {
                                        notesItem.staffName = staffItem.staffName;
                                        if (staffItem.partTime === 0) { // 主职位
                                            notesItem.staffInfoToUser.unshift(staffItem);
                                        } else { // 兼职
                                            notesItem.staffInfoToUser.push(staffItem);
                                        }
                                    }
                                }

                                // 发起表单人的个人信息
                                if (formData.data.approves.ownerId == staffItem.id) {
                                    this.ownInfo.staffName = staffItem.staffName;
                                    if (staffItem.partTime === 0) { // 主职位
                                        this.ownInfo.staffInfoToUser.unshift(staffItem);
                                    } else { // 兼职
                                        this.ownInfo.staffInfoToUser.push(staffItem);
                                    }
                                }
                            }
                        }
                    }
                    this.notes = notes;
                    this.status = Number(formData.data.approves.status); // 获取表单状态
                    let values = formData.data.values.map(function (value) {
                        if (value.typeName === 'groupDate') {
                            value.componentName = 'groupDate';
                        } else {
                            value.componentName = 'textarea';
                        }
                        return value;
                    });

                    this.values = values.sort(this.compare('orderCode')); // 排序后的元素
                }
            })();
        }
    };
</script>

<style lang='scss' type='text/css' rel='stylesheet/scss' scoped>
    .view-form-wrapper {
        width: 100%;
        height: 100%;
        font-size: .12rem;
        background: #fff;
    }

    .header {
        height: .44rem;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 100;
    }

    .view-elements-wrapper {
        width: 100%;
        position: absolute;
        top: .44rem;
        bottom: .45rem;
        background: #fff;
        /*overflow-y: scroll;*/
        -webkit-overflow-scrolling: touch;

        &.bottom_0 {
            bottom: 0;
        }
        .main {
            overflow: hidden;
            padding: 0 .16rem;
            box-sizing: border-box;
            .line{
                border: 1px solid #EEEEEE;
                margin-bottom: 0.1rem;
            }
        }
        .hr_background{
            background: #F3F4F5;
            width: 100%;
            height: 0.1rem;
        }
        .flow_element_wrapper{
            padding: 0 .16rem;
            box-sizing: border-box;
        }
    }

    // footer  组件
    .footer {
        height: .45rem;
        position: fixed;   //ios 上滑问题
        bottom: 0;
        left: 0;
    }

    // 撤销按钮
    .do-cancel {
        display: inline-block;
        width: 100%;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 100;
        height: .45rem;
        background-color: #ffffff;
        line-height: .45rem;
        font-size: .16rem;
        text-align: center;
        color: #4590E4;
        border-top: 1px solid #dfdfdf;
    }

    // 拒绝 同意
    .button-wrapper {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        height: 0.45rem;

        .agree, .reject, .transfer {
            width: 33.33%;
            float: left;
            background: #ffffff;
            display: inline-block;
            box-sizing: border-box;
            line-height: 0.45rem;
            text-align: center;
            font-size: 0.16rem;
            color: #4590E4;
            border-right: 1px solid #dfdfdf;
        }

        .agree {
            border-right: none;
        }
    }
</style>
