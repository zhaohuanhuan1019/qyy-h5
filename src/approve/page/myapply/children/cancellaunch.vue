<template>
    <div class="cancel-wrapper">
        <head-top :title="title" :go="go"></head-top>
        <div class="head-btn">
            <span class="confirm" @click="submit">
                确定
            </span>
        </div>
        <div class="reason">
            <textarea :placeholder="placeholder"
                      @input="countNum" ref="text"
                      v-model.trim="cancelReason"></textarea>
        </div>
        <div class="num"><span :class="{maxed: maxColored}">{{ num }}</span>/5000</div>

        <!-- 应用权限关闭提示-->
        <no-Permission ></no-Permission>
        <!-- end -->
    </div>
</template>

<script type="text/ecmascript-6">
    import headTop from 'approve/components/header/header';
    import {Toast} from 'mint-ui';

    export default {
        components: {
            headTop
        },
        data () {
            return {
            	go: '/apply/launch/' + this.$route.params.approveId,
                title: '撤销原因',
                placeholder: '请填写撤销原因',
                cancelReason: '',
                num: 0,
                canConfirm: true,
                maxColored: false
            };
        },
        methods: {
            countNum () {
                let length = this.cancelReason.length;
                this.num = length >= 5000 ? 5000 : length;

                if (length >= 5000) {
                    this.maxColored = true;
                    this.cancelReason = this.cancelReason.substring(0, 5000);

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
                    if (this.cancelReason.length) {
                        this.canConfirm = false;

                        let self = this;
                        let data = {
                            approveId: [this.$route.params.approveId],
                            opinion: this.cancelReason,
                            companyId: window.companyId
                        };
                        this.$http({
                            url: '/approve/undo',
                            method: 'POST',
                            headers: window.headers,
                            body: JSON.stringify(data),
                            emulateJSON: true
                        }).then((res) => {
                            if (res.body.code === 0) {
                                let instance = Toast('撤销成功');
                                setTimeout(() => {
                                    instance.close();
                                    self.$router.replace('/apply/launch/')
                                }, 2000);
                            } else {
                                let instance = Toast(res.body.msg);
                                setTimeout(() => {
                                    instance.close();
                                    self.$router.replace('/apply/launch/')
                                }, 2000);
                            }
                        }, (res) => {
                            this.canConfirm = true;

                            let instance = Toast('撤销失败');
                            setTimeout(() => {
                                instance.close();
                                self.$router.go(self.go);
                            }, 2000);
                        });
                    } else {
                        let instance = Toast('请填写撤销原因');
                        setTimeout(() => {
                            instance.close();
                        }, 2000);
                    }
                }
            }
        }
    };
</script>

<style lang="scss" type="text/css" rel="stylesheet/scss" scoped>
    @import '../../../../common/css/mixin';

    .cancel-wrapper {
        @include reason-page();
    }
</style>
