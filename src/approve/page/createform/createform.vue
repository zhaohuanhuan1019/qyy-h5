<template>
    <div class="form-wrapper" v-if="userTasks.length">
        <v-header :title="title" :go="go" class="header" v-on:ifLeave="confirmGo"></v-header>
        <div class="elements-wrapper">
            <div class="main">
                <div v-for="element in flowElements" :is="element.typeName + '-element'" :element="element"
                     :key="element.orderCode"></div>
            </div>
            <div class="range_content">
                 <range :urgencyLevel=urgencyLevel @setLevel="setLevel"></range>
            </div>

            <flow-element v-if="userTasks.length" :userTasks="userTasks"></flow-element>
        </div>
        <v-submit class="footer" v-on:doSave="sendSaveData"></v-submit>

        <!-- 应用权限关闭提示-->
        <no-Permission ></no-Permission>
        <!-- end -->
    </div>
</template>

<script type="text/ecmascript-6">
    import vHeader from 'approve/components/header/header';
    import vSubmit from 'approve/components/footer/savesubmit';
    import elements from 'approve/js/createelements'; // 创建表单 组件
    import {mapMutations} from 'vuex';
    import {Toast, MessageBox } from 'mint-ui';

    export default{
        components: {
            vHeader,
            vSubmit,
            dateElement: elements.dateElement,
            groupDateElement: elements.groupDateElement,
            numberElement: elements.numberElement,
            radioElement: elements.radioElement,
            textElement: elements.textElement,
            textareaElement: elements.textareaElement,
            flowElement: elements.flowElement,
            checkboxElement: elements.checkboxElement,
            Range: elements.Range
        },
        data () {
            return {
            	ifComfirmLeave: 0,
                flowElements: [],
                flowId: null,
                key: null,
                flowData: null,
                keyData: null,
                userTasks: [],
                title: null,
                go: 'toHome',
                urgencyLevel: 0,
                // 以下是保存申请单数据
                formData: {
                    isSubmit: null,
                    approves: {
                        typeId: null,
                        cid: null,
                        urgencyLevel: 0
                    },
                    values: [],
                    assigneeInfo: {
                        assigneeInfo: []
                    }
                }
            };
        },
        computed: {
            staffsList () {
                return this.$store.state.staffsListFromAddress;
            }
        },
        created () {
            let self = this;
            this.RESET_SAVE();
            this.flowId = this.$route.query.flowId;
            this.key = this.$route.query.key;
            this.formData.approves.typeId = this.$route.query.flowId; // 表单类型id

            function getFlow () {
                return new Promise(function (resolve, reject) {
                    self.$http({
                        url: '/approve/setting/flow/view?companyId=' + window.companyId + '&flowId=' + self.flowId,
                        method: 'GET',
                        headers: window.headers
                    }).then((res) => {
                        if (res.body.code === 0) {
                        resolve(res.body);
                    }
                }, (res) => {
                    });
                });

            };

            function getKey () {
                return new Promise(function (resolve, reject) {
                self.$http({
                    url: '/approve/act/view?companyId=' + window.companyId + '&flowId=' + self.flowId + '&key=' + self.key,
                    method: 'GET',
                    headers: window.headers
                }).then((res) => {
                        if (res.body.code === 0) {
                            resolve(res.body);
                        }
                    }, (res) => {
                    });
                });
            };

            (async function () {
                let flow = await getFlow();
                let key = await getKey();
                self.title = flow.data.form.typeName;
                self.flowData = flow.data; // 元素数据
                self.formData.approves.cid = flow.data.companyId;  // 表单 公司id
                self.flowElements = flow.data.form.elements.sort(self.compare('orderCode')); // 排序后的元素
                self['SAVE_ELEMENT'](flow.data.form.elements);
                self.keyData = key.data; // 流程数据
                let userTasks = key.data.process.userTasks || [];
                for (let i = 0; i < userTasks.length; i++) {  // 匹配代理人信息
                    let taskItem = userTasks[i];
                    taskItem.staffInfoToUser = [];

                    if (self.staffsList) {
                        for (let j = 0; j < self.staffsList.length; j++) {
                            let staffItem = self.staffsList[j];
                            if (Number(taskItem.assignee) === Number(staffItem.id)) {
                                taskItem.staffName = staffItem.staffName;
                                if (staffItem.partTime === 0) { // 主职位
                                    taskItem.staffInfoToUser.unshift(staffItem);
                                } else { // 兼职
                                    taskItem.staffInfoToUser.push(staffItem);
                                }
                            }
                        }
                    }
                }
                self.userTasks = userTasks; // 整合代理人信息后的流程数据
            })();
        },
        methods: {
            ...mapMutations([
                'SAVE_ELEMENT',
                'RESET_SAVE'
            ]),
            setLevel (level) {
            	this.formData.approves.urgencyLevel = level;
            	console.log(level, 'set-level----------');
            },
            confirmGo () {
                let self = this;
                if (this.$store.state.quitCheckCreate && this.ifComfirmLeave === 0 && (this.$store.state.canSave || this.$store.state.ifLeaveForGroupDate)) {
                    // 弹框
                    MessageBox.confirm('你正在发起审批，是否离开').then(action => {
                        self.go = '/home';
                        self.$router.replace(self.go);
                    });
                } else {
                    self.go = '/home';
                    self.$router.replace(self.go);
                }

                this.$store.state.quitCheckCreate = false;

            },
            compare (property) {  // 元素排序
                return function (a, b) {
                    let value1 = a[property];
                    let value2 = b[property];
                    return value1 - value2;
                };
            },
            saveValueToArr () { // 保存元素组件的值
                let saveValueArr = [];
                for (let element of this.flowElements) {
                    let value = element.typeName + '_' + element.orderCode;
                    saveValueArr.push(this.$store.state.value[value]);
                }
                return saveValueArr;
            },
            // 保存-提交方法 msg = false为保存 true为提交
            async sendSaveData (msg) {
                let self = this;
                self.formData.isSubmit = msg;
                self.formData.values = self.saveValueToArr(msg);
                self.formData.assigneeInfo.assigneeInfo = JSON.stringify(self.$store.state.assigneeInfo); // 字符串格式
                // 要提交或保存的数据
                let data = self.formData;
                this.$http({
                    url: '/approve/add',
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: window.headers,
                    emulateJSON: true
                }).then((res) => {
                if (!msg) {
                    // 保存成功
                    if (res.body.code === 0) {
                    	self.ifComfirmLeave = 1; // 保存过
                        let instance = Toast('已保存到草稿箱');
                        setTimeout(() => {
                            instance.close();
                        }, 2000);
                    } else {
                        self.ifComfirmLeave = 0; //
                        let instance = Toast(res.body.msg);
                        setTimeout(() => {
                            instance.close();
                            self.$router.replace('/home');
                        }, 2000);
                    }
                }
                if (msg) {
                    // 提交成功
                    if (res.body.code === 0) {
                        self.ifComfirmLeave = 1; // 保存过
                        let instance = Toast('申请提交成功');
                        setTimeout(() => {
                            instance.close();
                            self.$router.replace('/apply/launch/' + res.body.data.approveId);
                        }, 2000);
                    } else {
                        self.ifComfirmLeave = 0; //
                        let instance = Toast(res.body.msg);
                        setTimeout(() => {
                            instance.close();
                            self.$router.replace('/home');
                        }, 2000);
                    }
                }
                self.formData.values = []; // 重置values
            }, (res) => {
                    self.ifComfirmLeave = 0; //
                    if (!msg) {
                        // 保存失败
                        let instance = Toast('保存草稿失败');
                        setTimeout(() => {
                            instance.close();
                        }, 2000);
                    }
                    if (msg) {
                        // 提交失败
                        let instance = Toast('申请提交失败');
                        setTimeout(() => {
                            instance.close();
                        }, 2000);
                    }
                    self.formData.values = [];
                });
            }
        }
    };
</script>

<style lang="scss" type="text/css" rel="stylesheet/scss" scoped>
    @import '../../../common/css/mixin';

    .form-wrapper {
        width: 100%;
        height: 100%;
        font-size: .12rem;

        .header {
            height: .44rem;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 100;
        }

        .elements-wrapper {
            width: 100%;
            position: absolute;
            top: .44rem;
            bottom: 0;
            padding-bottom: .45rem;
            background:#fff;
            -webkit-overflow-scrolling: touch;

            .main {
                overflow: hidden;
                padding: .06rem .16rem 0 .16rem;
                box-sizing: border-box;
                background-color: #ffffff;
                div:nth-last-of-type(1){
                    @include border-no;
                }
            }
            .range_content{
                padding: 0 0.16rem;
                border-top:0.1rem solid #F3F4F5;
                border-bottom:0.1rem solid #F3F4F5;
                background:#fff;
            }
        }

        .footer {
            height: .45rem;
            position: fixed;   //ios 上滑问题
            bottom: 0;
            left: 0;
            background-color: #ffffff;
        }
    }
</style>
