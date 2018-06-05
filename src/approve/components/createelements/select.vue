<template>
    <div class="select-mask-wrapper">
        <div class="select-wrapper clearFix">
            <div class="title fl" >
                <span class="content" style="-webkit-box-orient: vertical;">{{ element.title }}</span>
            </div>
            <div class="select fr" @click="showOptions">
                <input type="text" v-model="selectedText" readonly>
                <i class="is-must" v-if="ifShowMust">(选填)</i>
                <b class="choice-select"></b>
            </div>
        </div>
        <div :id="maskWrapper" class="mask-wrapper" v-show="showMask">
            <div class="mask" ref="selectMask">
                <ul class="items">
                    <li v-for="item in element.items" @click="hideOptions(item)" class="item">
                        {{ item.item }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll';
    import {mapMutations} from 'vuex';

    export default {
        props: {
            element: {
                type: Object
            }
        },
        data () {
            return {
                showMask: false,
                selectMask: null,
                selectedText: '',
                selectData: {
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
                },
                ifSelected: false
            };
        },
        computed: {
            valueChange(){
                return this.selectData.value
            },
            maskWrapper () {
            	return 'mask-wrapper' + this.element.orderCode;
            },
            ifShowMust () {
            	if (this.ifSelected) {
            		return false;
                } else {
                    return !this.element.isMust
                }
            }
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
        methods: {
            ...mapMutations([
            	'SAVE_SELECT'
            ]),
            showOptions () {
                this.showMask = true;
                document.getElementsByClassName('submit-wrapper')[0].style.display = 'none';
                document.getElementsByClassName('header')[0].style.display = 'none';
                document.getElementsByClassName('elements-wrapper')[0].style.top = '0';
                if (this.element.items.length > 0) {

                    this.$nextTick(() => {
                        let maskWrapper = document.getElementById(this.maskWrapper);
                        let maskWrapperHeight= maskWrapper.offsetHeight;
                        let items = maskWrapper.getElementsByClassName('items')[0];
                        let mask = maskWrapper.getElementsByClassName('mask')[0];
                        let itemsHeight = items.offsetHeight;

                        if (itemsHeight >= maskWrapperHeight) {
                                mask.style.top = 0;
                        }
                        this.initScroll();
                    });
                } else {
                    document.getElementsByClassName('mask')[0].style.top = '';
                }
            },
            initScroll () {
                this.selectMask = new BScroll(this.$refs.selectMask, {
                    click: true
                });
            },
            hideOptions (item) {
                this.selectMask = null;
                this.ifSelected = true;
                if (item.id) {
                    this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = true;
                } else {
                    this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = false;
                }
                this.selectedText = item.item;
                this.selectData.value = item.id + '';
                this.SAVE_SELECT(this.selectData);
                this.showMask = false;
                document.getElementsByClassName('submit-wrapper')[0].style.display = 'block';
                document.getElementsByClassName('header')[0].style.display = 'block';
                document.getElementsByClassName('elements-wrapper')[0].style.top = '0.44rem';
            }
        },
        created () {
            this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = false;

            this.SAVE_SELECT(this.selectData);
        }
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    @import "../../../common/css/mixin";

    .select-wrapper {
        width: 100%;
        height: .64rem;
        box-sizing: border-box;
        font-family: PingFangSC-Regular;
        position: relative;
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

        .select {
            width: calc(100% - 0.7rem);
            height: 100%;
            line-height: 0.64rem;
            text-align: right;
            .is-must {
                display: inline-block;
                margin-right: 0.1rem;
                line-height: .22rem;
                font-size: .16rem;
                color: #cccccc;
                font-style: normal;
                margin-top: -0.01rem;
                vertical-align: middle;
            }
            .choice-select {
                width: 0.08rem;
                height: 0.14rem;
                vertical-align: middle;
                display: inline-block;
                margin-top: -0.04rem;
                @include bg-image('../../../../static/image/right_more');
                background-size: cover;
            }
            input {
                @include single-line();

                display: inline-block;
                height: 0.22rem;
                width: 1.75rem;
                margin-right: 0.16rem;
                margin-top: -0.01rem;
                outline: none;
                line-height: .22rem;
                font-size: 0.16rem;
                color: #333;
                text-align: right;
                vertical-align: middle;

            }
        }
    }

    .mask-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 400;
        background-color: rgba(0, 0, 0, .7);
    }

    .mask {
        position: absolute;
        bottom: 0;
        z-index: 400;
        width: 100%;
        overflow: hidden;
        background-color: #ffffff;

        .items {

            .item {
                height: .54rem;
                line-height: .54rem;
                text-align: center;
                font-size: .18rem;
                color: #333333;
            }
        }
    }
</style>
