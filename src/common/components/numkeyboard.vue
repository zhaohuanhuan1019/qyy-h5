<template>
    <div class="pay-box" v-show="ifShowKB">
        <div>
            <!--keyboard-->
            <transition name="slide">
                <div class="key-box">
                    <div class="item v-1px-t">
                        <div class="key v-close"
                             @touchstart="close($event)"
                             @touchend="inputEnd($event)"
                        >关闭
                        </div>
                    </div>
                    <div class="item v-1px-t" v-for="(item, i) in keyList" :key="i">
                        <div class="key"
                             v-for="(val, key) in item"
                             :key="key"
                             @touchstart="inputStart(val, $event)"
                             @touchend="inputEnd($event)" :class="{'v-1px-l':key!=0}">
                            {{val}}
                        </div>
                    </div>
                    <div class="item v-1px-t">
                        <div class="key" style="background: #e8e8e8"
                             @touchstart="inputStart('.', $event)"
                             @touchend="inputEnd($event, 'dot')"
                        >.
                        </div>
                        <div class="key v-1px-l"
                             @touchstart="inputStart(0, $event)"
                             @touchend="inputEnd($event)"
                        >0
                        </div>
                        <div class="key v-1px-l" style="background: #e8e8e8"
                             @touchstart="del($event)"
                             @touchend="inputEnd($event,'del')"
                        >-
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'vue-num-keyboard',
        props: {
            highlightColor: {// 高亮颜色
                type: String,
                default: '#ccc'
            },
            maxLength: { // 最大长度
                type: Number,
                default: 20
            },
            ifShow: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                val: [],
                keyList: [
                    [1, 2, 3],
                    [4, 5, 6],
                    [7, 8, 9]
                ]
            }
        },
        computed: {
            ifShowKB () {
            	return this.ifShow;
            }
        },
        methods: {
            inputEnd (e, d) {
                this.unhighLight(e.currentTarget, d)
            },
            // 恢复默认
            unhighLight (ele, d) {
                if (d) {
                    ele.style.backgroundColor = '#e8e8e8'
                } else {
                    ele.style.backgroundColor = '#fff'
                }

            },
            // 高亮
            highlight (ele) {
                ele.style.backgroundColor = this.highlightColor
            },
            // 用户输入
            inputStart (val, e) {
                console.log(val, '输入的值----------')

                if (this.val.length <= this.maxLength) {
                    this.val.push(val);
                console.log(this.val, '所有的值----------')

                } else {
                    console.log(this.val, '最长----------')
                }
                this.$emit('numEnd', this.val.join(''));

                // 设置高亮
                this.highlight(e.currentTarget)
            },
            del () {
                if (this.val.length > 0) {
                    this.val.pop()
                }
                this.$emit('numEnd', this.val.join(''));
            },
            close () {
                this.$emit('hideKb');
            }
        }

    }
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    $keyH: .5rem;
    $size: .18rem;

    .pay-box {
        box-sizing: border-box;
        z-index: 500;
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 5*$keyH;
        overflow-x: hidden;
        overflow-y: hidden;
        background-color: rgba(0, 0, 0, .5);
        > div {
            position: absolute;
            width: 100%;
            height: 5*$keyH;
            left: 0;
            bottom: 0;
            background-color: #fff;
        }
    }

    .v-1px-t, .v-1px-l, .v-1px {
        position: relative;
    }

    .v-1px-t:before {
        z-index: 112;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 1px;
        content: '';
        border-top: 1px solid #c7c7c7;
        transform: scaleY(.5);
        color: #c7c7c7;
        transform-origin: 0 0;
    }

    .v-1px-l:before {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 1px;
        content: '';
        border-left: 1px solid #c7c7c7;
        transform: scaleX(.5);
        color: #c7c7c7;
        transform-origin: 0 0;
    }

    .v-1px:before {
        position: absolute;
        left: 0;
        top: 0;
        width: 200%;
        height: 200%;
        content: '';
        border: 1px solid #c7c7c7;
        transform: scale(.5);
        color: #c7c7c7;
        transform-origin: left top;
    }

    /*键盘盒子*/
    .key-box {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        font-size: $size;
        color: #363636;
        .item {
            display: flex;
            text-align: center;
            line-height: $keyH;
            height: $keyH;
        }
        .key {
            cursor: pointer;
            width: 100%;
            height: 100%;
            flex: 1;
        }

        .v-close {
            text-align: right;
            color: #4a90e2;
        }

    }
</style>
