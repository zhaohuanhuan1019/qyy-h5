<template>
    <div>
        <div class="list">
            <div class="left">
                <div class="title">签到时间<span class="status unusual">{{onClockStatus}}</span></div>
                <div class="time">
                    <span class='clock_time'>{{onClockTime}}</span><span v-show="onNextDay" class="next-day">次日</span>
                </div>
            </div>
        </div>
        <div class="list">
            <div class="left">
                <div class="title">签退时间<span class="status unusual">{{offClockStatus}}</span></div>
                <div class='time_warpper'>
                    <div class="time">
                        <span class='clock_time'>{{offClockTime}}</span><span v-show="offNextDay" class="next-day">次日</span>
                    </div>
                    <right-btn class='update_button' v-show='isShowUpdateClick' @click.native='update'></right-btn>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import Bus from 'common/js/bus.js';
    import rightBtn from 'attence/components/elements/button';
    import {mapState,mapMutations,mapGetters,mapActions} from 'vuex';
    export default {
        props: [],
        data () {
            return {
                onNextDay: false,
                offNextDay: false
            };
        },
        components: {
            rightBtn
        },
        computed: {
            /*从公共状态中拿到的数据--start*/
                listData(){
                    return this.$store.state.attence.listData;
                },
                clockCommute(){
                    return this.$store.state.attence.clockCommute;
                },
                getdata_today(){
                    return this.$store.getters.getdata_today;
                },
                beforeClick_clockCommute(){
                    return this.$store.state.attence.beforeClick_clockCommute;
                },
                isShowUpdateClick(){
                    return this.$store.state.attence.isShowUpdateClick;
                },
            /*从公共状态中拿到的数据--end*/

            /*
            * 打卡状态(0:正常 1:迟到 2:早退 3:未打卡 5:暂无数据 6:无出勤计划
            */

            onClockStatus () {
//            	console.log('this.onNextDay-----', this.onNextDay)
                if(this.listData.on){
                    let clockStatus = this.listData.on.clockStatus;
                    this.onNextDay = this.listData.on.nextDay;

                    if (clockStatus == 0) {
//                        console.log('this.onNextDay-----333333', this.onNextDay)

                        return '正常';
                    } else if (clockStatus== 1) {
                    	if (this.listData.on.retroactive) { // 补卡数据
                            console.log('this.onNextDay-----222222', this.onNextDay)
                            return '补签';
                        }
                        return '迟到';
                    } else if (clockStatus== 2) {
                        return '早退';
                    } else if (clockStatus== 3) {
                        return '未打卡';
                    } else if (clockStatus== 5) {
                        return '暂无数据';
                    } else if (clockStatus== 6) {
                        return '无出勤计划';
                    } else if (clockStatus== 8) {
                        return '签卡无效';
                    }
                }

            },
            offClockStatus () {
                if(this.listData.off){
                    let clockStatus = this.listData.off.clockStatus;
                    this.offNextDay = this.listData.off.nextDay;

                    if (clockStatus == 0) {
                        return '正常';
                    } else if (clockStatus== 1) {
                        return '迟到';
                    } else if (clockStatus== 2) {
                        return '早退';
                    } else if (clockStatus== 3) {
                        return '未打卡';
                    } else if (clockStatus== 5) {
                        return '暂无数据';
                    } else if (clockStatus== 6) {
                        return '无出勤计划';
                    } else if (clockStatus== 8) {
                        return '签卡无效';
                    }
                }
            },
            onClockTime () {
                if(this.listData.on){
                    if(this.listData.on.clockTime!==''){
                        return this.listData.on.clockTime.slice(0,5);
                    }else {
                        return '﹎';
                    }
                }else {
                    return '﹎';
                }

            },
            offClockTime () {
                if(this.listData.off){
                    if(this.listData.off.clockTime !==''){
                        return this.listData.off.clockTime.slice(0,5);
                    }else {
                       return '﹎';
                    }
                }else {
                   return '﹎';
                }

            }
        },
        methods: {
            ...mapMutations(['change_listData']),
            ...mapActions(['change_listDataAction','startClickBtn','change_isShowLoadingAction','change_isShowUpdateClickAction']),
            update(){
                if(this.$route.path == '/calendar'){
                    this.change_isShowLoadingAction(true);//显示loading
                }
                this.startClickBtn();
            }
        },
        mounted(){
        }
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    @font-face {
        font-family: 'DINCond-Bold';
        src: url('../../../../static/font/DINCond-Bold.otf') format('opentype');
        font-weight: normal;
        font-style: normal;
    }
    .list {
        padding: 0 0.24rem;
        box-sizing: border-box;
        margin-top: 0.04rem;
        height: 1.17rem;
        box-shadow: 0px 0.02rem 0.12rem 0.03rem #F5F5F5;
        margin-bottom: 0.12rem;
        .left {
            width: 100%;
            height: 1.17rem;
            .title {
                color: #929292;
                font-size: 0.14rem;
                padding-top: 0.24rem;
                height: 0.2rem;
                line-height: 0.2rem;
                .status {
                    font-size: 0.14rem;
                    &.unusual {
                        color: #FF6200;
                    }
                    margin-left: 0.05rem;
                }
            }
            .time_warpper{
                width: 100%;
                height: 0.59rem;
                line-height: 0.59rem;
                font-size: 0;
            }
            .time {
                position: relative;
                font-size: 0.42rem;
                color: #2E2E2E;
                display: inline-block;
                height: 0.59rem;
                line-height: 0.59rem;
                float: left;
                .clock_time{
                    display: inline-block;
                    height: 0.59rem;
                }
                .next-day {
                    display: inline-block;
                    padding: 0.01rem .05rem 0.01rem 0.05rem;
                    line-height: 0.18rem;
                    height: 0.16rem;
                    background-color: #FB9D4D;
                    border-radius: .1rem;
                    font-size: .1rem;
                    color: #FFFFFF;
                    vertical-align: middle;
                    margin-left: 0.08rem;
                }
            }
            .update_button{
                float: right;
            }
        }
    }
    .button{
        width:.8rem;
        height: .36rem;
        line-height: .36rem;
        border:1px solid #4590E4;
        border-radius: .18rem;
        text-align: center;
        font-family: PingFangSC-Regular;
        font-size: 0.14rem;
        color: #4590E4;
        box-sizing: border-box;
    }
</style>
