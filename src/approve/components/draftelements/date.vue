<template>
    <div class="single-date-wrapper">
        <div class="title">
            <span class="content" style="-webkit-box-orient: vertical;">{{ element.title }}</span>
        </div>
        <div class="date">
            <input type="text" :value="formatedDate" @click="saveDate" readonly>
        </div>
        <span class="arrow"></span>
    </div>
</template>

<script>
    import format from 'common/js/dateformat';
    import {mapMutations} from 'vuex';
    import jsBridge from 'common/js/jsbridge';

    export default {
        props: {
            element: {
                type: Object
            }
        },
        data () {
            return {
                date: Number(this.element.value), // 从app控件获取的时间  待调
                saveDateValue: {
                    formId: this.element.formId,
                    elementId: this.element.elementId,
                    approveId: this.element.approveId, // 审批单id
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
        mounted () {
        	console.log(this.$store.state.quitCheck, 'this.$store.state.quitCheck')
            let pattern = /\D+/g;

            if (this.element.value) {
                this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = true;
            } else {
                this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = false;
            }
            this.saveDateValue.value = this.formatedDate.replace(pattern, '');
            this.$store.state.quitCheck = false;
            this.SAVE_DATE(this.saveDateValue);
        },
        methods: {
            ...mapMutations([
                'SAVE_DATE'
            ]),
            async saveDate () {
                let self = this;
                // 调app 时间控件
                let dateData = await jsBridge.getDate(self.dateType, self.date);
                this.date = dateData;
                // 如果选择并返回了时间戳
                let pattern = /\D+/g;
                if (this.formatedDate) {
                	this.saveDateValue.value = this.formatedDate.replace(pattern, '');
                    this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = true;
                } else {
                    this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = false;
                    this.saveDateValue.value = '';
                }
                this.$store.state.quitCheck = true;
                this.SAVE_DATE(this.saveDateValue);
            }
        },
        computed: {
            formatedDate () {
                let date = this.date;
                Date.prototype.Format = format;
                if (date) {
                    return new Date(Number(date)).Format(this.element.format);
                } else {
                	return '';
                }
            },
            dateType () {
                if (this.element.format.indexOf(':') > 0) {
                    return 0; // 0 默认年月日时分
                } else {
                    return 1;
                }
            }
        }
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    @import "../../../common/css/mixin";

    .single-date-wrapper {
        $left: .66rem;
        position: relative;
        width: 100%;
        height: $left;
        box-sizing: border-box;
        @include border-1px(#EBEBEB);

        .title {
            position: absolute;
            top: 0;
            left: -0.02rem;
            height: $left;
            display: inline-block;
            width: $left;
            line-height: .22rem;
            font-size: .16rem;
            color: #999999;
            display: flex;
            justify-content: center;
            align-items:center;

            .content {
                width: $left;
                max-height: 0.44rem;
                line-height: 0.22rem;
                font-size: 0.16rem;
                color: #999;
                letter-spacing: 0;

                text-align: right;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
            }

            .is-must {
                line-height: .21rem;
                font-size: .14rem;
                color: #cccccc;
            }
        }

        .date {
            margin-left: $left;

            input {
                display: inline-block;
                padding: .22rem .24rem .2rem 0;
                width: 100%;
                box-sizing: border-box;
                outline: none;
                line-height: .23rem;
                font-size: 0.16rem;
                color: #333333;
                text-align: right;

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

        .arrow {
            position: absolute;
            top: 0.25rem;
            right: 0;
            width: .08rem;
            height: .14rem;
            @include bg-image('../../../../static/image/right_more');
            background-repeat: no-repeat;
            background-size: .08rem .14rem;
        }
    }

</style>
