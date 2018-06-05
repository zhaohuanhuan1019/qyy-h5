<template>
    <div class="reject-wrapper">
        <head-top :title="title" :go="go"></head-top>
        <div class="head-btn">
            <span class="confirm" @click="submit">
                确定
            </span>
        </div>
        <div class="radio-wrapper" v-for="radioList in radioLists">
            <label class="for-radio" @click="selected(radioList)">
                <span>{{ radioList }}</span>
                <input name="reason" type="radio" class="radio" :value="radioList" v-model="checked"/>
                <i :class="{add: activeName == radioList}"></i>
            </label>
        </div>
        <div class="reason-title">{{ reasonTitle }}</div>
        <div class="reason">
            <textarea :placeholder="placeholder"
                      @input="countNum" ref="text"
                      v-model.trim="rejectReason"></textarea>
        </div>
        <div class="num">
            <span :class="{maxed: maxColored}">{{ num }}</span>/5000
        </div>

        <!-- 应用权限关闭提示-->
        <no-Permission ></no-Permission>
        <!-- end -->
    </div>
</template>

<script type="text/ecmascript-6">
    import headTop from 'approve/components/header/header';
    import {Toast} from 'mint-ui';

    export default{
        components: {
            headTop
        },
        data () {
            return {
                go: '/approval/wait/' + this.$route.params.approveId,
                title: '拒绝原因',
                otherReason: '其他原因',
                reasonTitle: '请填写拒绝原因',
                placeholder: '请在此输入(非必填)',
                radioLists: [],
                activeName: '',
                reasonSelected: true,
                checked: '',
                rejectReason: '',
                num: 0,
                canConfirm: true,
                maxColored: false

            };
        },
        methods: {
            selected (radioList) {
                this.activeName = radioList;
                this.reasonSelected = true;
            },
            countNum () {
                let length = this.rejectReason.length;
                this.num = length >= 5000 ? 5000 : length;

                if (length >= 5000) {
                    this.maxColored = true;
                    this.rejectReason = this.rejectReason.substring(0, 5000);

                    let instance = Toast('最多可输入5000个字符');
                    setTimeout(() => {
                        instance.close();
                    }, 2000);
                } else {
                    this.maxColored = false;
                }
            },
            submit () {
                if (this.canConfirm) {
                    this.canConfirm = false;

                    let self = this;
                    let params = {
                        companyId: window.companyId,
                        approveId: [this.$route.params.approveId],
                        result: false,
                        reason: this.activeName,
                        opinion: this.rejectReason,
                        isSingle: true
                    };
                    this.$http({
                        url: '/approve/doApproveTask',
                        method: 'POST',
                        headers: window.headers,
                        body: JSON.stringify(params)
                    }).then((res) => {
                        if (res.body.code === 0) {
                            let instance = Toast('审批已拒绝');
                            setTimeout(() => {
                                instance.close();
                                self.$router.replace('/approval/wait/');
                            }, 2000);
                        } else {
                            let instance = Toast(res.body.msg);
                            setTimeout(() => {
                                instance.close();
                                self.$router.replace('/approval/wait/');
                            }, 2000);
                        }
                    }, (res) => {
                        this.canConfirm = true;

                        let instance = Toast('提交失败');
                        setTimeout(() => {
                            instance.close();
                            self.$router.replace(self.go);
                        }, 2000);
                    });
                }
            }
        },
        created () {
            let self = this;
            self.$http({
                url: '/approve/quickSelect',
                method: 'GET',
                headers: window.headers,
            }).then((res) => {
                if (res.body.code === 0) {
                    self.radioLists = res.body.data.list || [];
                    self.activeName = res.body.data.list[0] || '';
                }
            }, (res) => {
            });
        },
    };
</script>

<style lang="scss" type="text/css" rel="stylesheet/scss" scoped>
    @import '../../../../common/css/mixin';

    .reject-wrapper {
        @include reason-page();

        .reason {
            top: 2.2rem;
        }

        .reason-title {
            box-sizing: border-box;
            padding: 0 .16rem;
            font-size: .16rem;
            line-height: .65rem;
            color: #333333;
        }

    }

    .radio-wrapper {
        width: 100%;
        height: .65rem;
        box-sizing: border-box;
        padding: 0 .16rem;

        .for-radio {
            position: relative;
            display: inline-block;
            width: 100%;
            height: 100%;
            line-height: .65rem;
            border-bottom: 1px solid #EBEBEB;

            & > span {
                font-size: .16rem;
                color: #333333;
            }

            & > i {
                position: absolute;
                right: 0;
                top: .26rem;

                &.add {
                    display: inline-block;
                    width: .16rem;
                    height: .11rem;
                    @include bg-image('../../../../../static/image/select');
                    background-repeat: no-repeat;
                    background-size: .16rem .1rem;
                }
            }
        }

        .radio {
            visibility: hidden;
        }
    }
</style>
