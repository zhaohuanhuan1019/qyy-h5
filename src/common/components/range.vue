<template>
    <div class="mint-range" :style="{ height: height + 'rem'}" :class="{ 'mint-range--disabled': disabled }">
        <slot name="start"></slot>
        <div class="mint-range-content" ref="content" :style="{ 'margin-right': btnWidth + 'rem' }">
            <div class="mint-range-runway" :style="{ 'height': height + 'rem', right: -btnWidth + 'rem' }"></div>
            <div class="mint-range-progress" :style="{ width: (100-progress) + '%', height: height + 'rem'}"></div>
            <div class="mint-range-thumb" ref="thumb"
                 :style="{ left: progress + '%' , width: 0.26 + 'rem', height: btnHeight + 'rem', top: -(btnHeight-height)/2 + 'rem'}"
                 :class="{'thumb-round': btnRound}"
            ></div>
        </div>
        <slot name="end"></slot>
        <div class="mint-range-progress-real" :style="{ width: (100-progress) + '%', height: height + 'rem'}"></div>
    </div>
</template>

<script type="text/babel">
    import draggable from 'common/js/draggable';

    export default {
        name: 'mint-range',
        props: {
            min: { // 区间最小值
                type: Number,
                default: 0
            },
            max: {
                type: Number,
                default: 100
            },
            height: { // range高度
                type: Number,
                default: 0.1
            },
            step: { // 滑动步数
                type: Number,
                default: 1
            },
            disabled: { // 禁止滑动
                type: Boolean,
                default: false
            },
            value: { // 预设值
                type: Number
            },
            btnWidth: { // 滑块的宽
                type: Number,
                default: 0.3
            },
            btnHeight: { // 滑块的高
                type: Number,
                default: 0.26
            },
            btnRound: { // 滑块默认为圆形
                type: Boolean,
                default: true
            }
        },
        computed: {
            progress () {
                const value = this.value;
                if (typeof value === 'undefined' || value === null) return 0;
                return Math.floor((value - this.min) / (this.max - this.min) * 100);
            }
        },
        mounted () {
            const thumb = this.$refs.thumb;
            const content = this.$refs.content;
            const getThumbPosition = () => {
                const contentBox = content.getBoundingClientRect();
                const thumbBox = thumb.getBoundingClientRect();
                return {
                    left: thumbBox.left - contentBox.left,
                    top: thumbBox.top - contentBox.top,
                    thumbBoxLeft: thumbBox.left
                };
            };
            let dragState = {};
            draggable(thumb, {
                start: (event) => {
                    if (this.disabled) return;
                    const position = getThumbPosition();
                    const thumbClickDetalX = event.clientX - position.thumbBoxLeft;
                    dragState = {
                        thumbStartLeft: position.left,
                        thumbStartTop: position.top,
                        thumbClickDetalX: thumbClickDetalX
                    };
                },
                drag: (event) => {
                    if (this.disabled) return;
                    const contentBox = content.getBoundingClientRect();
                    const deltaX = event.pageX - contentBox.left - dragState.thumbStartLeft - dragState.thumbClickDetalX;
                    const stepCount = Math.ceil((this.max - this.min) / this.step);
                    const newPosition = (dragState.thumbStartLeft + deltaX) - (dragState.thumbStartLeft + deltaX) % (contentBox.width / stepCount);
                    let newProgress = newPosition / contentBox.width;
                    if (newProgress < 0) {
                        newProgress = 0;
                    } else if (newProgress > 1) {
                        newProgress = 1;
                    }
                    this.$emit('input', Math.round(this.min + newProgress * (this.max - this.min)));
                },
                end: () => {
                    if (this.disabled) return;
                    this.$emit('change', this.value);
                    dragState = {};
                }
            });
        }
    };
</script>

<style>
    .mint-range {
        width: 3rem;
        margin: 0 auto;
        position: relative;
        display: -webkit-box;
        display: -ms-flexbox;
        box-sizing: border-box;
    }

    .mint-range-content {
        position: relative;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
    }

    .mint-range-runway {
        position: absolute;
        top: 0;
        left: 0;
        background: #E6E6E6;
        border-radius: 0.1rem;
        background: -webkit-linear-gradient(left, #9FCF55 0%, #F1B20B 50%, #FE6800 100%);
    }

    .mint-range-progress,
    .mint-range-progress-real {
        position: absolute;
        display: block;
        background-color: #E6E6E6;
        /*background: -webkit-linear-gradient(left, #9FCF55 0%, #F1B20B 50%, #FE6800 100%);*/
        top: 0;
        width: 0;
        right: 0;
        border-radius: 0 0.1rem .1rem 0;
    }

    .mint-range-progress {
        opacity: 0;
    }

    .mint-range-thumb {
        position: absolute;
        left: 0;
        cursor: move;
        z-index: 2;
        border-radius: 0.06rem;
        background: url('../../../static/image/urgency.png');
        background-size: 100% 100%;
        box-shadow: 0 2px .05rem rgba(156,166,167, 0.45);
    }

    .thumb-round {
        border-radius: 100%;
    }

    .mt-range--disabled {
        opacity: .5;
    }
</style>
