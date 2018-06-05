<template>
    <div class="textarea-wrapper">
        <div class="title" style="-webkit-box-orient: vertical">{{ titleUnit }}</div>
        <span class="content" v-if="!ifShowCheckList" :class="{none: none}">{{ checkTypeName }}</span>
        <div class="content" v-if="ifShowCheckList">
            <div class="checked-list" v-for="item in checkedArr">
                <span class="option">{{ item.option }}</span>
                <span class="detail" :class="item.id | getClassName">{{ item.id | getText }}</span>
            </div>
        </div>
        <div class="clear"></div>
    </div>
</template>

<script>
    import format from 'common/js/dateformat';
    export default {
        props: {
            value: {
                type: Object
            }
        },
        data () {
            return {
            	ifShowCheckList: false,
                none: false
            };
        },
        computed: {
            checkTypeName () {
                if (this.value.typeName === 'radio') {
                    this.ifShowCheckList = false;
                    for (let item of this.value.items) {
                        if (Number(this.value.value) === item.id) {
                            let selectValue = item.item;
                            return selectValue;
                        }
                    }
                } else if (this.value.typeName === 'checkbox') {
                	this.ifShowCheckList = true;
                	// 单独处理多选组件
                    return;
                } else if (this.value.typeName === 'date') {
                    this.ifShowCheckList = false;
                    Date.prototype.Format = format;
                    return new Date(Number(this.value.value)).Format(this.value.format);
                }

                if (this.value.value) {
                	return this.value.value;
                } else {
                	this.none = true;
                	return '无';
                }
            },
            titleUnit () {
                let title = this.value.title;
                if (this.value.typeName === 'number') {
                    if (this.value.extra1 && JSON.parse(this.value.extra1).unit) {
                        let unit = '(' + JSON.parse(this.value.extra1).unit + ')';
                        return title + unit;
                    }
                }

                return title;
            },
            checkedArr () {
            	let arr = [];
            	let valueArr = this.value.value.split(',');
                for (let i = 0; i < valueArr.length; i++) {
                    let obj = {};
                    obj.id = Number(valueArr[i]);
                    obj.option = this.value.items[i].item;
                    arr.push(obj);
                }
                return arr;
            }
        },
        filters: {
            getText (id) {
            	return id > -1 ? '是' : '否';
            },
            getClassName (id) {
                return id > -1 ? 'colored' : '';
            }
        }
    };
</script>

<style lang="scss" type="text/css" rel="stylesheet/scss" scoped>
    .textarea-wrapper {
        width: 100%;
        height:auto;
        margin-bottom:0.1rem;

        .title {
            width:0.66rem;
            text-align:right;
            float:left;
            margin-right: 0.18rem;
            line-height: .22rem;
            font-family: PingFangSC-Regular;
            font-size: 0.16rem;
            color: #999999;
            letter-spacing: 0;
            margin-left: -0.02rem;

            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
        .content {
            float:left;
            width:2.53rem;
            line-height: .22rem;
            font-family: PingFangSC-Regular;
            font-size: 0.16rem;
            color: #333333;
            letter-spacing: 0;
            text-align: justify;
            word-break:break-all;
            white-space: pre-wrap;
            /*margin-bottom:0.1rem;*/

            &.none {
                color: #cccccc;
            }
            .checked-list {
                position: relative;
                line-height: .22rem;
                margin-bottom:0.1rem;

                .option {
                    display:inline-block;
                    font-size: .16rem;
                    color: #757678;
                    width:2.25rem;

                }

                .detail {
                    position: absolute;
                    top: 0;
                    right: 0;
                    font-size: .16rem;
                    color: #757678;

                    &.colored {
                        color: #4590E4;
                    }
                }
            }
        }
        .clear{
            clear:both;
        }
    }
</style>
