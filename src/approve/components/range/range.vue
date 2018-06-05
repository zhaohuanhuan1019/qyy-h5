<template>
    <div class="range-wrapper">
        <div class="range-title">紧急程度</div>
        <mint-range
            v-model="rangeValue"
            :min="0"
            :max="300"
            :height="0.15"
            :step="1"
            :btn-round="false"
            :btn-width=".26"
            :value="setValue"
        >
        </mint-range>

        <div class="range-status">
            <span class="status" :class="{general: generalStatus}">一般</span>
            <span class="status" :class="{more: moreStatus}">较紧急</span>
            <span class="status" :class="{very: veryStatus}">很紧急</span>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import jsBridge from 'common/js/jsbridge';
    import mintRange from 'common/components/range';

    export default {
    	props: {
            urgencyLevel: {
    			type: Number
            }
        },
        components: {
            mintRange
        },
        data () {
            return {
                rangeValue: 0
            };
        },
        watch: {
            setLevel (newLevel) {
                this.$emit('setLevel', newLevel);
            }
        },
        computed: {
            generalStatus () {
            	return this.rangeValue <= 100;
            },
            moreStatus () {
                return 100 < this.rangeValue && this.rangeValue <= 200;
            },
            veryStatus () {
                return 200 < this.rangeValue;
            },
            setLevel () {
            	if (this.rangeValue <= 100) {
            		return 0;
                } else if (100 < this.rangeValue && this.rangeValue <= 200) {
                    return 1;

                } else if (200 < this.rangeValue) {
                    return 2;
                }
            },
            setValue () {
//            	console.log(this.urgencyLevel, 'this.urgencyLevel=========')
                if (this.urgencyLevel === 0) {
            		this.rangeValue = 100;

                } else if (this.urgencyLevel === 1) {
                    this.rangeValue = 200;

                } else if (this.urgencyLevel === 2) {
                    this.rangeValue = 300;
                }
            }
        }
    }
</script>

<style lang="scss" type="text/css" rel="stylesheet/scss" scoped>
    @import "../../../common/css/mixin";

    .range-wrapper {
        width: 100%;
        // height: .64rem;
        box-sizing: border-box;

        .range-title{
            font-family: PingFangSC-Regular;
            font-size: 0.16rem;
            color: #999999;
            letter-spacing: 0;
            margin: 0.2rem 0 0.24rem 0;
        }
        .mint-range {
            margin-top: .1rem;
        }

        .range-status {
            width:3rem;
            height:0.22rem;
            line-height:0.22rem;
            margin: auto;
            padding:0.17rem 0 0.19rem  0;

            .status {
                width: 1rem;
                text-align: center;
                display: inline-block;
                float: left;
                color: #cccccc;
                font-family: PingFangSC-Regular;
                font-size: 0.16rem;
            }

            .general {
                color: #9FCF55;
            }

            .more {
                color: #F1B20B;
            }

            .very {
                color: #FE6800;
            }
        }
    }
</style>
