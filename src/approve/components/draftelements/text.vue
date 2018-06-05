<template>
    <div class="text-wrapper clearFix">
        <div class="title fl">
            <span class="content" style="-webkit-box-orient: vertical;">{{ element.title }}</span>
        </div>
        <div class="text fl">
            <input type="text" :placeholder="placeholder"
                                 v-model.trim="textValueObj.value"
                                 maxlength="20"
                                 @input="saveInputValue"></div>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex';
    export default {
        props: {
            element: {
                type: Object
            }
        },
        data () {
            return {
                // input 组件的相关信息
                textValueObj: {
                    formId: this.element.formId,
                    elementId: this.element.elementId,
                    approveId: this.element.approveId,
                    valueId: this.element.valueId,
                    title: this.element.title,
                    placeholder: this.element.placeholder,
                    isMust: this.element.isMust,
                    format: this.element.format,
                    orderCode: this.element.orderCode,
                    typeName: this.element.typeName,
                    formElementId: this.element.formElementId,
                    formElementCode: this.element.formElementCode,
                    value: this.element.value
                }
            };
        },
        computed:{
            valueChange(){
                return this.textValueObj.value
            },
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
            valueChange:{
                handler(curVal,oldVal){
                    if(curVal===oldVal){

                    }else{
                        this.$store.state.quitCheck = true;
                    }
                },
                deep:true
            }
        },
        mounted () {
            if (this.element.value) {
                this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = true;
            } else {
                this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = false;
            }
            this.SAVE_INPUTTEXT(this.textValueObj);
        },
        methods: {
            ...mapMutations([
                'SAVE_INPUTTEXT'
            ]),
            saveInputValue () {
                if (this.textValueObj.value.length > 0) {
                    this.textValueObj.value = this.textValueObj.value + '';
                    this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = true;
                } else {
                    this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = false;
                    this.textValueObj.value = '';
                }
                this.SAVE_INPUTTEXT(this.textValueObj);
            }
        }
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    @import "../../../common/css/mixin";

    .text-wrapper {
        width: 100%;
        height: .64rem;
        box-sizing: border-box;
        @include border-1px(#EBEBEB);

        .title {
            width:0.66rem;
            height: .64rem;
            text-align:right;
            line-height: .22rem;
            font-family: PingFangSC-Regular;
            font-size: 0.16rem;
            color: #999999;
            letter-spacing: 0;
            margin-left: -0.02rem;
            display: flex;
            justify-content: center;
            align-items:center;
            .content{
                width:0.66rem;
                max-height: 0.44rem;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
            }
        }

        .text {
            margin-left:0.18rem;
            width: calc(100% - 0.84rem);
            height: 100%;
            position: relative;
            input {
                width: 100%;
                position: absolute;
                left: 0;
                top: 50%;
                transform: translate(0,-50%);
                height: 0.22rem;
                outline: none;
                line-height: .22rem;
                font-size: 0.16rem;
                color: #333;

                @include single-line;


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
        }
    }
</style>
