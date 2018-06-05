<template>
    <div class="agree-wrapper">
        <head-top :title="title" :go="go"></head-top>
        <div class="head-btn">
        <span class="confirm" @click="submit">
            确定
        </span>
        </div>
        <div class="reason">
        <textarea :placeholder="placeholder"
                  @input="countNum" ref="text"
                  v-model.trim="agreeReason"></textarea>
        </div>
        <div class="num"><span :class="{maxed: maxColored}">{{ num }}</span>/5000</div>

        <!-- 应用权限关闭提示-->
        <no-Permission ></no-Permission>
        <!-- end -->
    </div>
</template>

<script type="text/ecmascript-6">
    import headTop from 'approve/components/header/header';
    import { Toast } from 'mint-ui';

    export default{
        components: {
            headTop
        },
        data () {
            return {
                go: '/approval/wait/' + this.$route.params.approveId,
                title: '同意原因',
                placeholder: '请填写同意意见(非必填)',
                agreeReason: '',
                num: 0,
                canConfirm: true,
                maxColored: false
            };
        },
        methods: {
            countNum () {
                let length = this.agreeReason.length;
                this.num = length >= 5000 ? 5000 : length;

                if (length >= 5000) {
                    this.maxColored = true;
                    this.agreeReason = this.agreeReason.substring(0, 5000);

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
                        result: true,
                        reason: '',
                        opinion: this.agreeReason,
                        isSingle: true
                    };
                    this.$http({
                        url: '/approve/doApproveTask',
                        method: 'POST',
                        headers: window.headers,
                        body: JSON.stringify(params)
                    }).then((res) => {
                        if (res.body.code === 0) {
                            let instance = Toast('审批已同意');
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
        }
    };
</script>

<style lang="scss" type="text/css" rel="stylesheet/scss" scoped>
    @import '../../../../common/css/mixin';

    .agree-wrapper {
        @include reason-page();
    }
</style>
