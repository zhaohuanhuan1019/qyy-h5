<template>
    <div class="submit-wrapper">
        <div class="save" :class="{able: canSave}" @click="saveData">保存</div>
        <div class="submit" :class="{able: canSubmit}" @click="submitData">提交</div>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex';
    import { Toast } from 'mint-ui';

    export default {
        data () {
            return {
                isSubmit: false,
                isCheckSave: true,
                isCheckSubmit:true,
                isSaveDisabled:true,
                isSubmitDisabled:true
            };
        },
        computed: {
            ...mapState([
                'canSave',
                'canSubmit'
            ])
        },
        methods: {
            ...mapMutations([
                'ONLY_JUDGEBYELEMENTS'
            ]),
            saveData () {

                if (this.canSave) {
                    this.isSubmit = false;
                    this.isCheckSave=true;

                    if(this.isCheckSave){
                        // 保存数据
                        this.$emit('doSave', this.isSubmit);
                        this.isCheckSave=false;
                        this.$store.state.canSave = false;
                        this.isSaveDisabled= false;
                    }
                } else {
                    if(this.isSaveDisabled){
                        // 弹出提示
                        if (this.$store.state.saveFlow) {
                            setTimeout(() => {
                                let instance = Toast('至少填写一项');
                                setTimeout(() => {
                                    instance.close();
                                }, 500);
                            }, 500);

                        } else {
                            setTimeout(() => {
                                let instance = Toast('审批流程不能为空');
                                setTimeout(() => {
                                    instance.close();
                                }, 500);
                            }, 500);

                        }
                    }
                }

            },
            submitData () {
            	this.ONLY_JUDGEBYELEMENTS();
                if (this.canSubmit) {
                    this.isSubmit = true;
                    this.isCheckSubmit=true;
                    if(this.isCheckSubmit){
                        // 提交数据
                        this.$emit('doSave', this.isSubmit);
                        this.isCheckSubmit=false;
                        this.$store.state.canSubmit = false;
                        this.isSubmitDisabled=false
                    }
                } else {
                    if(this.isSubmitDisabled){
                        // 弹出提示
                        if (this.$store.state.canSubmitOnlyByElements) {
                            if (this.$store.state.flowStatus) {
                                // 请选择审批人
                                setTimeout(() => {
                                    let instance = Toast('请选择审批人');
                                    setTimeout(() => {
                                        instance.close();
                                    }, 500);
                                }, 500);
                            } else {
                                setTimeout(() => {
                                    let instance = Toast('审批流程不能为空');
                                    setTimeout(() => {
                                        instance.close();
                                    }, 500);
                                }, 500);
                            }
                        } else {
                            setTimeout(() => {
                                let instance = Toast('必填项不能为空');
                                setTimeout(() => {
                                    instance.close();
                                }, 500);
                            }, 500);
                        }
                    }
                }
            }
        }
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    .submit-wrapper {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        height: 0.45rem;

        .save, .submit {
            width: 50%;
            float: left;
            display: inline-block;
            box-sizing: border-box;
            line-height: 0.45rem;
            text-align: center;
            font-size: 0.16rem;
        }

        .save {
            background-color: #ffffff;
            border-top: 1px solid #dfdfdf;
            box-sizing: border-box;
            /*opacity: 0.36;*/
            color: #cccccc;

            &.able {
                color: #4590E4;
                opacity: 1;
            }
        }

        .submit {
            background-color: #cccccc;
            /*opacity: 0.36;*/
            color: #FFFFFF;

            &.able {
                background-color: #4590E4;
                opacity: 1;
            }
        }
    }
</style>
