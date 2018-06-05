<template>
    <div class="form-wrapper" v-if="assigneeInfo.length">
        <v-header :title="title" :go="go" class="header" v-on:doBack="backToConfirm"></v-header>
        <div class="elements-wrapper" ref="elementsWrapper">
            <div class="main">
                <div v-for="element in flowElements" :is="element.typeName + '-element'" :element="element"
                     :key="element.orderCode"></div>
            </div>
            <div class="range_content">
                <range :urgencyLevel="urgencyLevel" @setLevel="setLevel"></range>
            </div>
            <flow-element :assigneeInfo="assigneeInfo"></flow-element>
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
    import elements from 'approve/js/draftelements'; // 重新编辑组件
    import {mapMutations} from 'vuex';
    import {Toast,MessageBox} from 'mint-ui';

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
            	go: 'draftToList',
                url: '',
                flowElements: [],
                flowId: null,
                flowData: null,
                assigneeInfo: [],
                title: null,
                isCheckQuit:true,
                urgencyLevel: 0,
                // 以下是保存申请单数据
                formData: {
                    isSubmit: null,
                    approveId: null,
                    approves: {
                        typeId: null,
                        cid: null,
                        id: null,
                        urgencyLevel: null
                    },
                    values: [],
                    assigneeInfo: {
                        assigneeInfo: ''
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
            this.RESET_SAVE();

            if (this.$route.name === 'apply-resubmit') {
                this.url = '/approve/modify';
            }

            if (this.$route.name === 'apply-redraft') {
                this.url = '/approve/update';
            }
            let self = this;
            this.approveId = this.$route.params.approveId;
            function getDraftFormData () {
                return new Promise(function (resolve, reject) {
                    self.$http({
                        url: '/approve/view?companyId=' + window.companyId + '&approveId=' + self.approveId,
                        method: 'GET',
                        headers: window.headers
                    }).then((res) => {
                        if (res.body.code === 0) {
                            resolve(res.body);
                        }
                    }, (res) => {
                    });
                });
            }

            (async function () {
                let draftFormData = await getDraftFormData();
                self.title = draftFormData.data.approves.formName;
                self.flowData = draftFormData.data; // 元素数据
                self.formData.approves.cid = draftFormData.data.approves.cid;  // 公司id
                self.formData.approves.typeId = draftFormData.data.approves.typeId; // 类型id
                self.formData.approves.urgencyLevel = draftFormData.data.approves.urgencyLevel; // 紧急程度
                self.urgencyLevel = draftFormData.data.approves.urgencyLevel;
                self.formData.approves.id = draftFormData.data.approveId;
                self.formData.approveId = draftFormData.data.approveId;
                if (self.$route.name === 'apply-resubmit') { // 撤销后编辑在提交或保存
                    self.formData.approves.status = draftFormData.data.approves.status;
                    self.formData.approves.ownerId = draftFormData.data.approves.ownerId;
                    self.formData.approves.deleted = draftFormData.data.approves.deleted;
                }
                self.flowElements = draftFormData.data.values.sort(self.compare('orderCode')); // 排序后的元素

                let assigneeInfo = JSON.parse(draftFormData.data.assigneeInfo.assigneeInfo) || [];
                // 匹配代理人信息
                for (let i = 0; i < assigneeInfo.length; i++) {
                    let taskItem = assigneeInfo[i];
                    taskItem.staffInfoToUser = [];

                    if (self.staffsList) {
                        for (let j = 0; j < self.staffsList.length; j++) {
                            let staffItem = self.staffsList[j];
                            if (Number(taskItem.value) === Number(staffItem.id)) {
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
                self.assigneeInfo = assigneeInfo;
                self['SAVE_ELEMENT'](draftFormData.data.values);
            })();
        },
        methods: {
            ...mapMutations([
                'SAVE_ELEMENT',
                'RESET_SAVE'

            ]),
            setLevel (level) {
                this.formData.approves.urgencyLevel = level;
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
            backToConfirm (){//草稿内容未改变保存时弹出toast
                console.log(this.$store.state.quitCheck, 'this.$store.state.quitCheck')

                if(this.$store.state.quitCheck && this.isCheckQuit){
                    MessageBox.confirm('你正在修改草稿，是否离开').then(action => {
                        if (this.$route.name === 'apply-resubmit') {
                            this.go = '/apply/launch/';
                            this.$router.replace(this.go);
                        }

                        if (this.$route.name === 'apply-redraft') {
                            this.go = '/apply/draft/';
                            this.$router.replace(this.go);
                        }
                    });
                } else {
                    if (this.$route.name === 'apply-resubmit') {
                        this.go = '/apply/launch/';
                        this.$router.replace(this.go);
                    }

                    if (this.$route.name === 'apply-redraft') {
                        this.go = '/apply/draft/';
                        this.$router.replace(this.go);
                    }
                }
                this.$store.state.quitCheck = false;

            },
            // 保存-提交方法 msg = false为保存 true为提交
            sendSaveData (msg) {
                let self = this;
                this.isCheckQuit = false;
                this.formData.isSubmit = msg;
                this.formData.values = this.saveValueToArr(msg);
                this.formData.assigneeInfo.assigneeInfo = JSON.stringify(self.$store.state.assigneeInfo); // 字符串格式
                let data = this.formData;  // 要提交或保存的数据
                this.$http({
                    url: this.url,
                    method: 'POST',
                    headers: window.headers,
                    body: JSON.stringify(data),
                    emulateJSON: true
                }).then((res) => {
                    if (!msg) {
                        // 保存成功
                        if (res.body.code === 0) {
                            let instance = Toast('已保存到草稿箱');
                            setTimeout(() => {
                                instance.close();
                            }, 2000);
                        } else {
                            let instance = Toast(res.body.msg);
                            setTimeout(() => {
                                instance.close();
                                if (self.$route.name === 'apply-resubmit') {
                                    self.$router.replace('/apply/launch/');
                                }

                                if (self.$route.name === 'apply-redraft') {
                                    self.$router.replace('/apply/draft/');
                                }
                            }, 2000);
                        }
                    }
                    if (msg) {
                        // 提交成功
                        if (res.body.code === 0) {
                            let instance = Toast('申请提交成功');
                            setTimeout(() => {
                                instance.close();
                                self.$router.replace('/apply/launch/' + res.body.data.approveId);
                                self.$store.state.myApplyPath = '/apply/launch/';
                                self.$store.state.myApplyTypeId = 1;
                            }, 2000);
                        } else {
                            let instance = Toast(res.body.msg);
                            setTimeout(() => {
                                instance.close();
                                if (self.$route.name === 'apply-resubmit') {
                                    self.$router.replace('/apply/launch/');
                                }

                                if (self.$route.name === 'apply-redraft') {
                                    self.$router.replace('/apply/draft/');
                                }
                            }, 2000);
                        }
                    }
                    self.formData.values = []; // 重置values
                }, (res) => {
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
