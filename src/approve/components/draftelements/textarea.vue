<template>
    <div class="textarea-wrapper clearFix">
        <div class="title fl">
            <div class="title-text">{{ element.title }}</div>
        </div>
        <div class="textarea border-1px fr">
            <textarea id="textarea" :placeholder="placeholder" @input="saveValue" ref="text"
                      v-model.trim="textareaData.value"></textarea>
            <div class="num"><span :class="{'zero': zeroColored, maxed: maxColored}">{{ numCount }}</span>/5000</div>
        </div>
        <div class="clear"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapMutations} from 'vuex';
    import { Toast } from 'mint-ui';

    export default{
        data () {
            return {
                num: 0,
                textareaData: {
                    formId: this.element.formId,  // 表单ID
                    elementId: this.element.elementId,  // 元素类型ID
                    approveId: this.element.approveId, // 审批单id
                    valueId: this.element.valueId,
                    title: this.element.title,
                    placeholder: this.element.placeholder,
                    isMust: this.element.isMust,
                    format: this.element.format,
                    orderCode: this.element.orderCode,
                    typeName: this.element.typeName,
                    formElementId: this.element.formElementId, // 元素ID
                    formElementCode: this.element.formElementCode,
                    value: this.element.value
                },
                maxColored: false,
                zeroColored: true
            };
        },
        props: {
            element: {
                type: Object
            }
        },
        mounted () {
            if (this.element.value) {
                this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = true;
            } else {
                this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = false;
            }
            this.SAVE_TEXTAREA(this.textareaData); // 存储
        },
        computed: {
            placeholder: function(){
                if(this.element.placeholder){
                    if(this.element.isMust){
                        return this.element.placeholder;
                    } else {
                        return this.element.placeholder + '(选填)';
                    }
                } else {
                    if(this.element.isMust){
                        return '请输入';
                    } else {
                        return '请输入(选填)';
                    }
                }
            }
        },
        watch:{
            num:{
                handler(curVal,oldVal){
                    if(curVal===oldVal){

                    }else{
                        this.$store.state.quitCheck = true;
                    }
                },
                deep:true
            }
        },
        methods: {
            ...mapMutations([
                'SAVE_TEXTAREA'
            ]),
            saveValue () {  // 判断输入得值并保存   保存按钮状态
                let length = this.textareaData.value.length;

                this.num = length >= 5000 ? 5000 : length;

                if (length == 0) {
                    this.zeroColored = true;
                } else {
                    this.zeroColored = false;
                }

                if (length >= 5000) {
                    this.maxColored = true;
                    this.textareaData.value = this.textareaData.value.substring(0, 5000);
                    let instance = Toast('最多可输入5000个字符');
                    setTimeout(() => {
                        instance.close();
                    }, 2000);
                } else {
                    this.maxColored = false;
                }

                if (this.textareaData.value.length > 0) {
                    this.textareaData.value = this.textareaData.value + ''; // String
                    this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = true;
                } else {
                    this.textareaData.value = '';
                    this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = false;
                }
                this.SAVE_TEXTAREA(this.textareaData); // 存储
            }
        }
    };
</script>

<style lang="scss" type="text/css" rel="stylesheet/scss" scoped>
    @import '../../../common/css/mixin';
    @import '../../../common/css/index';

    .textarea-wrapper {
        box-sizing: border-box;
        width: 100%;
        padding-top: .2rem;
        padding-bottom: 0.2rem;
        font-family: PingFangSC-Regular;
        @include border-1px(#EBEBEB);
        .clear{
            clear: both;
        }

        .title {
            width:0.66rem;
            .title-text {
                width: 100%;
                line-height: .22rem;
                font-size: .16rem;
                text-align: right;
                color: #999;
            }
        }
        .textarea {
            width: calc(100% - 0.82rem);

            & > textarea {
                    resize: none;
                    outline: none;
                    width: 100%;
                    height: 1.1rem;
                    /*min-height: .76rem;*/
                    border: none;
                    padding: 0 0 .14rem 0;
                    line-height: .22rem;
                    font-size: .16rem;
                    color: #333;
                    text-align: justify;
                    word-break:break-all;
                    // white-space: pre;

                &::-webkit-input-placeholder {
                    color: #cccccc;
                    text-overflow: ellipsis;
                    font-family: PingFangSC-Regular,Helvetica,Arial,sans-serif;
                    font-size: .16rem;

                }
                &:-moz-placeholder,
                &::-moz-placeholder,
                &:-ms-input-placeholder {
                    color: #cccccc !important;
                    text-overflow: ellipsis;
                    font-family: PingFangSC-Regular,Helvetica,Arial,sans-serif;
                    font-size: .16rem;

                }

            }
            .num{
                text-align:right;
                font-size: .12rem;
                line-height: .17rem;
                color:  #cccccc;

                & > span {
                    color: #333333;
                }

                .zero {
                    color:  #cccccc;
                }

                .maxed {
                    color: #FF3434;
                }
            }
        }
    }
</style>
