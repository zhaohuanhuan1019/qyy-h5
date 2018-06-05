<template>
    <div class="number-wrapper clearFix">
        <div class="title fl">
            <span class="content" style="-webkit-box-orient: vertical;">{{ titleUnit }}</span>
        </div>
        <div class="number fl">
            <input type="text" class="numberInp" :placeholder="placeholder"
                   v-model.trim="inputNum" @input="saveNumberData"  maxlength="20">
        </div>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex';
    import { Toast } from 'mint-ui';

    export default {
        props: {
            element: {
                type: Object
            }
        },
        data () {
            return {
                inputNum: '',
                numberData: {
                    formId: this.element.formId,  // 表单ID
                    elementId: this.element.elementId,  // 元素类型ID
                    title: this.element.title,
                    placeholder: this.element.placeholder,
                    isMust: this.element.isMust,
                    format: this.element.format,
                    orderCode: this.element.orderCode,
                    typeName: this.element.typeName,
                    formElementId: this.element.id, // 元素ID
                    formElementCode: this.element.formElementCode,
                    value: ''
                }
            };
        },
        created () {
            this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = false;
            this.SAVE_NUMBER(this.numberData);
        },
        watch:{
            valueChange:{
                handler(curVal,oldVal){
                    if(curVal===oldVal){

                    }else{
                        this.$store.state.quitCheckCreate = true;
                    }
                },
                deep:true
            }
        },
        computed: {
            valueChange(){
                return this.numberData.value
            },
            titleUnit () {
                let title = this.element.title;
                if (this.element.extra1 && JSON.parse(this.element.extra1).unit) {
                    let unit = '(' + JSON.parse(this.element.extra1).unit + ')';
                    return title + unit;
                }

                return title;
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
        methods: {
            ...mapMutations([
                'SAVE_NUMBER'
            ]),
            checkFloatNumber (val){
                console.log(val, 'value========');

                let reg = new RegExp(/^[0-9]+(.[0-9]{1,2})?$/);
                console.log(reg.test(val), 'reg.test(v)========');

                let length_1 = val.length-1;
                let length_2 = val.length-2;

                if (val) {
                    if (!reg.test(val)) {

                        if (reg.test(val.substr(0,length_1))) {
                            if(val.charAt(length_1) == '.' && val.indexOf('.') == length_1) {
                                this.inputNum = val;
                                console.log(this.inputNum, 'this.inputNum===111==111===');

                            } else {
                                this.inputNum = val.substr(0,length_1);
                                console.log(this.inputNum, 'this.inputNum===111===222==');

                            }

                        } else if (reg.test(val.substr(0,length_2)) && val.charAt(length_1) == '.' && val.indexOf('.') == length_2) {
                            this.inputNum = val.substr(0,length_1);
                            console.log(this.inputNum, 'this.inputNum===444=====');
                        } else  {
                            if(val == '.' || val.substr(0,length_1) == '0.'){
                                this.inputNum = '0.';
                                console.log(this.inputNum, 'this.inputNum====222==111==');

                            } else {
                                let instance = Toast('请输入正确的数值');
                                setTimeout(() => {
                                    instance.close();
                                    this.inputNum = '';
                                }, 2000);
                                console.log(this.inputNum, 'this.inputNum====222===222=');
                            }
                        }
                    } else {
                        if(val.charAt(0) == 0 && val.charAt(1) && val.charAt(1) !== '.'){
                            let instance = Toast('请输入正确的数值');
                            setTimeout(() => {
                                instance.close();
                                this.inputNum = '';
                            }, 2000);
                            console.log(this.inputNum, 'this.inputNum====333==111==');
                        } else {
                            this.inputNum = val;
                            console.log(this.inputNum, 'this.inputNum====333==222==');
                        }
                    }
                }

            },
            saveNumberData () {
                this.checkFloatNumber(this.inputNum);

                if (this.inputNum.length > 0) {
                    this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = true;
                } else {
                    this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = false;
                }
                this.numberData.value = this.inputNum;
                this.SAVE_NUMBER(this.numberData);
            }
        }
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    @import "../../../common/css/mixin";

    .number-wrapper {
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

        .number {
            margin-left:0.18rem;
            width: calc(100% - 0.86rem);
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
