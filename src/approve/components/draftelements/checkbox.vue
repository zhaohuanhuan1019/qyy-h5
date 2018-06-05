<template>
    <div class="checkbox-wrapper">
        <h1 class="title">{{ element.title }}<span class="is-must" v-if="!element.isMust">(选填)</span></h1>
        <div class="checkbox-item" v-for="item in element.items">
            <span class="item-title">{{ item.item }}</span>
            <div class="checkbox">
                <label class="label-switch">
                    <input type="checkbox" v-model="checkedArr" :value="item.id" @click="saveCheckedValue()"/>
                    <div class="switch" :class="{checked: ifChecked(item.id)}"></div>
                </label>
            </div>
        </div>
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
                checkedArr: [],
                checkedData: {
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
                }
            };
        },
        mounted () {
            if (this.element.value) {
            	let valueArr = this.element.value.split(',');
            	// 初始化checkedArr
                let idArr =[];
                for (let id of valueArr) {
                    if (id > -1) {
                        idArr.push(Number(id));
                    }
                }
                this.checkedArr = idArr;
            	for (let valueId of valueArr) {
            		if (valueId > -1) {
                        this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = true;
                        break;
                    } else {
                        this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = false;
                    }
                }
            }
            this.SAVE_CHECKBOX(this.checkedData);
            if (this.element.value) {  // 初始状态
                this.checked = true;
            }
        },
        computed:{
            valueChange () {
                return this.checkedData.value
            },
            checkedIdInValues () {
                return this.element.value.split(',');
            }
        },
        watch:{
            valueChange: {
                handler (curVal,oldVal) {
                    if (curVal===oldVal) {

                    } else {
                        this.$store.state.quitCheck = true;
                    }
                },
                deep:true
            }
        },
        methods: {
            ...mapMutations([
                'SAVE_CHECKBOX'
            ]),
            saveCheckedValue () {
                for (let i = 0; i <  this.element.items.length; i++) {
                    if (this.checkedArr.length) {
                        if (this.checkedArr.indexOf(this.element.items[i].id) > -1) {
                            this.checkedIdInValues[i] = this.element.items[i].id;
                        } else {
                            this.checkedIdInValues[i] = -1;
                        }
                    } else {
                        this.checkedIdInValues[i] = -1;
                    }
                }

                if (this.checkedArr.length) {
                    this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = true;
                } else {
                    this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = false;
                }
                this.checkedData.value = this.checkedIdInValues.join(',');
                this.SAVE_CHECKBOX(this.checkedData);
            },
            ifChecked (id) {
                return this.checkedArr.indexOf(id) > -1
            }
        }
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    @import "../../../common/css/mixin";

    .checkbox-wrapper {
        width: 100%;
        padding-top: .21rem;
        box-sizing: border-box;
        @include border-1px(#EBEBEB);

        .title {
            line-height: .22rem;
            font-size: 0.16rem;
            color: #999999;

            .is-must {
                line-height: .22rem;
                font-size: 0.16rem;
                color: #cccccc;
            }
        }
    }

    .checkbox-item {
        height: .22rem;
        padding: .1rem 0;
        position: relative;

        .item-title {
            line-height: .24rem;
            font-size: 0.16rem;
            color: #999999;
            margin-right: .5rem;

            @include single-line();
        }

        .checkbox {
            position: absolute;
            top: 0.1rem;
            right: 0;

            input[type='checkbox'] {
                position: absolute;
                z-index: 10;
                width: 100%;
                height: 100%;
                opacity: 0;
            }
        }
    }

    .label-switch {
        display: inline-block;
        vertical-align: middle;
        width: .42rem;
        border-radius: .12rem;
        box-sizing: border-box;
        height: .24rem;
        position: relative;
        cursor: pointer;
        -webkit-align-self: center;
        align-self: center;
    }

    .label-switch .switch {
        width: 100%;
        height: 100%;
        border-radius: .12rem;
        box-sizing: border-box;
        background: #cccccc;
        z-index: 0;
        margin: 0;
        padding: 0;
        -webkit-appearance: none;
        -moz-appearance: none;
        -ms-appearance: none;
        appearance: none;
        border: none;
        cursor: pointer;
        position: relative;

        &:after {
            content: ' ';
            height: .19rem;
            width: .19rem;
            border-radius: .19rem;
            background: #fff;
            position: absolute;
            z-index: 2;
            top: .023rem;
            left: .026rem;
            right: auto;
        }

        &.checked {
            background: #4cd964;

            &:after {
                right: .026rem;
                left: auto;
            }
        }
    }
</style>
