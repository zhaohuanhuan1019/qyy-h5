<template>
    <div class="head-wrapper">
        <span class="back" @click="backTo">
        </span>
        <span class="title">
            {{ lessThan15 }}
        </span>
    </div>
</template>

<script>
    import jsBridge from 'common/js/jsbridge';

    export default {
        props: ['title', 'go'],
        mounted () {
        	// 安卓 控制全局物理返回键页面跳转
            WebViewJavascriptBridge.registerHandler("functionInJs", () => {
                this.backTo();
            });
        },
        computed: {
            lessThan15 () {
                if (this.title) {
                    return this.title.length <= 15 ? this.title : this.title.substring(0, 14) + '...';
                }
            }
        },
        methods: {
            backTo () {
                if (!this.go) {
                	// this.$router.back 会触发onpopstate
                    this.$router.back();
                } else if (this.go === 'app') { // home返回
                	this.$emit('backToApp');
                } else if (this.go === 'toHome') { // 创建表单页面返回
                    this.$emit('ifLeave');
                } else if(this.go === 'draftToList'){ // 草稿编辑页面返回
                    this.$emit('doBack');
                } else if (this.go === 'applyToHome') { // 申请列表页返回
                	this.$emit('resetMyApplyStatus');
                } else if (this.go === 'approvalToHome') { // 审批列表页返回
                    this.$emit('resetMyApprovalStatus');
                } else if (this.go === 'transfer') { // 转交备注页面的返回
                    this.$emit('back2MailList');
                } else { // 页面传go 返回
                    this.$router.replace(this.go);
                }
            }
        }
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    @import '../../../common/css/mixin';

    .head-wrapper {
        width: 100%;
        height: .44rem;
        position: relative;
        background-color: #4590E4;
        text-align: center;
        line-height: .44rem;
        color: #ffffff;

        .back {
            width: .37rem;
            height: .44rem;
            position: absolute;
            left: 0;
            display: inline-block;
            @include bg-image('../../../../static/image/return');
            background-repeat: no-repeat;
            background-size: .09rem .16rem;
            background-position: center;
        }

        .title {
            width: 100%;
            display: inline-block;
            font-size: .18rem;
        }
    }
</style>
