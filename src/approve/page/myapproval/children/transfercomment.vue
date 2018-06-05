<template>
    <div class="transfer-wrapper">
        <head-top :title="title" :go="go" v-on:back2MailList="back2WaitedPage"></head-top>
        <div class="head-btn">
            <span class="confirm" @click="submit">
                确定
            </span>
        </div>
        <div class="reason">
            <textarea :placeholder="placeholder"
                      @input="countNum" ref="text"
                      v-model.trim="transferCom"></textarea>
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
                go: 'transfer',
                content: '请输入转交理由',
                canConfirm: true,
                placeholder: '请输入转交理由(非必填)',
                transferCom: '',
                num: 0,
                canConfirm: true,
                maxColored: false
        };
        },
        computed: {
            title () {
                let staffName = this.$route.query.staffName;

                return staffName ? '转交给' + staffName : '';
            }
        },
        methods: {
            back2WaitedPage () {
                this.$router.replace('/approval/wait/' + this.$route.params.approveId);
            },
            countNum () {
                let length = this.transferCom.length;
                this.num = length >= 5000 ? 5000 : length;

                if (length >= 5000) {
                    this.maxColored = true;
                    this.transferCom = this.transferCom.substring(0, 5000);

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
                        assignNow: this.$route.query.staffId,
                        approveId: this.$route.params.approveId,
                        opinion: this.transferCom
                    };
                    this.$http({
                        url: '/approve/approveTransfer',
                        method: 'POST',
                        headers: window.headers,
                        body: JSON.stringify(params)
                    }).then((res) => {
                        if (res.body.code === 0) {
                            let instance = Toast('转交成功');
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

                        let instance = Toast('转交失败');
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

    .transfer-wrapper {
        @include reason-page();
    }
</style>

