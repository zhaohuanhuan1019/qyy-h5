<template>
    <div class="head-wrapper">
        <span class="back" @click="backTo">
        </span>
        <span class="title">
            {{lessThan15}}
        </span>
    </div>
</template>

<script>
    import jsBridge from 'common/js/jsbridge';

    export default {
        props: ['title', 'go'],
        mounted () {
        	// 安卓 控制全局物理返回键页面跳转
            /*WebViewJavascriptBridge.registerHandler("workNoticeReadReportNativeToJs", () => {
                alert(1111);
                this.readReport();
            });*/
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
                if (this.go == 'app') {// 返回上报并且退出到app
                    jsBridge.requestBack().then(function () {});
                }
            },
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
