<template>
    <div class="confirm-wrapper">
        <div class="confirm" :class="{able: canConfirm}" @click="doSubmit">确定</div>
    </div>
</template>

<script>
    export default {
        props: ['canConfirm', 'opinion'],
        methods: {
            doSubmit () {
                this.$emit('doSubmit');
            }
        }
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    .confirm-wrapper {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        height: 0.45rem;
        /*display: flex;*/

        .confirm {
            /*flex: 1;*/
            width: 100%;
            line-height: 0.45rem;
            text-align: center;
            font-size: 0.18rem;
            background: #cccccc;
            color: #fff;

            &.able {
                background-color: #4590E4;
            }
        }
    }
</style>
