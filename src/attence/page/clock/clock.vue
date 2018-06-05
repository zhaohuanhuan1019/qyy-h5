<template>
    <div class="clock-wrapper">
        <head-top :title="title"></head-top>
        <div id='container'></div>
        <div id="tip"></div>
        <div class="main">
            <div class="position-wrapper">
                <!-- 定位中loading start -->
                <div class="wrapper position-loading" v-show="positioning">
                    <div class="img-icon"></div>
                    <div class="title_warpper">
                        <h1 class="title">定位中</h1>
                    </div>
                </div>
                <!-- 定位中loading end -->

                <!-- 定位失败 start -->
                <div class="wrapper fail-wrapper" v-show="loadfail">
                    <div class="img-icon"></div>
                    <div class="title_warpper">
                        <h1 class="title fail-title">定位失败<span class="again" @click="startPosition1"></span></h1>
                    </div>

                   <!--  <p class="position-msg">
                        <span class="result"></span>
                        <p class="address" @click="checkAddress" v-show="addressName.length !==0"><span class="address_text">考勤地点</span><span class="addressGo"></span></p>
                    </p> -->
                </div>
                <!-- 定位失败 end -->

                <!-- 进入打卡区域 start -->
                <div class="wrapper success-wrapper" v-show="positionTrue">
                    <div class="img-icon animated"></div>
                    <div class="title_warpper">
                        <h1 class="title" v-show="enterTrue">您已进入打卡范围<span class="again" @click="startPosition1"></span></h1>
                        <h1 class="title" v-show="!enterTrue">定位成功<span class="again" @click="startPosition1"></span></h1>
                    </div>

                    <p class="position-msg">
                        <span class="result"></span>
                        <!-- <span class="again" @click="startPosition1"></span> -->
                        <p class="address" @click="checkAddress" style="text-algin:center" v-show="addressName.length !==0"><span class="address_text">考勤地点</span><span class="addressGo"></span></p>
                        <!-- <p class="noPlan" v-show="addressName.length ==0">暂无考勤方案，无法打卡</p> -->
                    </p>

                </div>

                <!-- 进入打卡区域 end -->

                <!-- 打卡区域以外 start -->
                <div class="wrapper fail-wrapper" v-show="positionWrong">
                    <div class="img-icon"></div>
                    <div class="title_warpper">
                        <h1 class="title fail-title">您当前不在打卡范围内<span class="again" @click="startPosition2"></span></h1>
                    </div>

                    <p class="position-msg">
                        <span class="result"></span>
                        <!-- <span class="again" @click="startPosition2"></span> -->
                        <p class="address" @click="checkAddress" v-show="addressName.length !==0"><span class="address_text">考勤地点</span><span class="addressGo"></span></p>
                    </p>
                </div>
                <!-- 打卡区域以外 end -->
            </div>

            <div class="down-box">
                <!-- 签到时间元素 start -->
                <div class="showtime" v-show="isShowregister">
                    <span class="text">签到时间：</span>
                    <span v-if="supplementNextDay" class="next-day">次日</span>
                    <span class='time'>{{firstClockTime}}</span>
                    <span @click="supplementOnTime" v-if="supplementShow" class="supplementOn" :class="{btn: supplementAble}"
                          v-text="supplementAble ? '补卡' : '补签'"></span>
                </div>
                <!-- 签到时间元素 end -->

                <!-- circle签到按钮 start -->
                <div class="circle" id="circle" v-show="isShowCircle"
                     :class="{ start: isActive, disable: circle_disable}" @click="clockOnOff">
                    <div class="time" :class="{marginBottom: !sign}">{{initTime}}</div>
                    <div class="content" v-show="sign">{{sign}}</div>
                </div>
                <!-- circle签到按钮  end -->

                <!-- 显示数据列表  start -->
                <div class="clock-situation" v-show="!isShowCircle">
                    <clock-content></clock-content>
                </div>
                <!-- 显示数据列表  end -->
            </div>
            <div class='footer_warpper'>
            	<div class="week" v-show="!workDay">今日休息</div>
            	<div class="footer-time">{{footer_getdate}}</div>
            </div>

        </div>

        <!-- 提示弹层区 start -->

        <!-- <update v-show='update' :getdata2="getdata_today" :times='sysTimes' @sureupdate="sureupdate"></update> -->
        <!-- <out-OfTime v-show="outoftime" :schemeTime="schemeTime"></out-OfTime> -->
        <!-- <empty-Window v-show="empty" :getdata2="getdata_today" :times="sysTimes" :clockStatus="clockStatus" :clockCommute_3="clockCommute"></empty-Window> -->
        <!-- <open-position-prompt v-show='positionPromptFlag' @positionPrompt="listenPositionPrompt"></open-position-prompt> -->
        <pop-up v-show='isShow' @moreMap='startPosition2'></pop-up>

        <check-Address :addressName = "addressName" v-show="addresPop" :addresPop="addresPop"></check-Address>
        <net-Unusual v-show="isShowfile"></net-Unusual>
        <before-late v-show='isShowClockConfirm'></before-late>
        <morning-night v-show="isShowMorningNight" ref="morningNight"></morning-night>
        <no-Permission ></no-Permission>
        <!-- 提示弹层区 end -->
    </div>
</template>

<script>
    // import update from 'attence/components/popUp/update';  // 更新打卡弹层
    // import outOfTime from 'attence/components/popUp/outOfTime';  // 不在时间范围弹层
    // import emptyWindow from 'attence/components/popUp/emptyWindow';  // 空窗期弹层
    // import openPositionPrompt from 'attence/components/popUp/openPositionPrompt'; // 提示开启定位弹层

    import Bus from 'common/js/bus.js';
    import headTop from 'attence/components/header/header';
    import clockContent from 'attence/components/elements/clockContent';
    import popUp from 'attence/components/popUp/popUp';  // 其他打卡弹层
    import checkAddress from 'attence/components/popUp/checkAddress';  // 查看考勤地点弹层
    import netUnusual from 'attence/components/popUp/netUnusual';  // 网络异常弹层
    import beforeLate from 'attence/components/popUp/beforeOrLatePrompt'; // 迟到早退提示弹层
    import morningNight from 'attence/components/popUp/morningOrNightPrompt'; // 早晚签到成功提示弹层
    import AMap from 'AMap'; // 引入高德地图
    import jsBridge from 'common/js/jsbridge'; // 引入jsBridge
    import {mapState,mapMutations,mapGetters,mapActions} from 'vuex';

    export default {
        data () {
            return {
                title: false,
                addresPop: false // 考勤地点弹窗显示与否
            };
        },
        components: {
            headTop,
            clockContent,
            popUp,
            checkAddress,
            beforeLate,
            morningNight,
            netUnusual,
            // emptyWindow,
            // update,
            // outOfTime,
            // openPositionPrompt,

        },
        computed:{
            // ...mapState(['']),

            /*从公共状态中拿到的数据--start*/
                circle_disable(){
                    return this.$store.state.attence.circle_disable;
                },
                isShowfile(){
                    return this.$store.state.attence.isShowfile;
                },
                isShowUpdateClick(){
                    return this.$store.state.attence.isShowUpdateClick;
                },
                schemeTime(){
                    return this.$store.state.attence.schemeTime;
                },
                schemeAddressArr(){
                    return this.$store.state.attence.schemeAddressArr;
                },
                addressName(){
                    return this.$store.state.attence.addressName;
                },
                positioning(){
                    return this.$store.state.attence.positioning;
                },
                positionTrue(){
                    return this.$store.state.attence.positionTrue;
                },
                positionWrong(){
                     return this.$store.state.attence.positionWrong;
                },
                loadfail(){
                    return this.$store.state.attence.loadfail;
                },
                enterTrue(){
                    return this.$store.state.attence.enterTrue;
                },
                isHasPlan(){
                    return this.$store.state.attence.isHasPlan;
                },
                isShow(){
                    return this.$store.state.attence.popUp.isShow;
                },
                isShowClockConfirm(){
                    return this.$store.state.attence.clockConfirm.isShow;
                },
                isShowMorningNight(){
                     return this.$store.state.attence.morningNight.isShow;
                },
                isActive(){
                    return this.$store.state.attence.isActive;
                },
                clockStatus(){
                    return this.$store.state.attence.clockStatus;
                },
                clockCommute(){
                    return this.$store.state.attence.clockCommute;
                },
                initTime(){
                    return this.$store.state.attence.initTime;
                },
                isShowCircle(){
                    return this.$store.state.attence.isShowCircle;
                },
                isShowregister(){
                    return this.$store.state.attence.isShowregister;
                },
                sureTime(){
                    return this.$store.state.attence.sureTime;
                },
                firstClockTime(){
                    return this.$store.state.attence.firstClockTime;
                },
                getdata_today(){
                     return this.$store.getters.getdata_today;
                },
                beforeClick_clockCommute(){
                    return this.$store.state.attence.beforeClick_clockCommute;
                },
                showText(){
                    return this.$store.state.attence.popUp.showText;
                },
                listData(){
                    return this.$store.state.attence.listData;
                },
                workDay(){
                    return this.$store.state.attence.workDay;
                },
                sysTimes(){
                    return this.$store.state.attence.sysTimes;
                },
                supplementAble() {
                    return this.$store.state.attence.supplementAble;
                },
                supplementShow() {
                    return this.$store.state.attence.supplementShow;
                },
                supplementNextDay () {
                    return this.$store.state.attence.supplementNextDay;
                },
            /*从公共状态中拿到的数据--end*/

            footer_getdate() { // 显示日期如”2017-5-8 周一“
                let myDate = new Date();
                let year = myDate.getFullYear();
                let month = myDate.getMonth() + 1;
                let date = myDate.getDate();
                let day = myDate.getDay();
                switch (day) {
                    case 0:
                        day = '周日';
                        break;
                    case 1:
                        day = '周一';
                        break;
                    case 2:
                        day = '周二';
                        break;
                    case 3:
                        day = '周三';
                        break;
                    case 4:
                        day = '周四';
                        break;
                    case 5:
                        day = '周五';
                        break;
                    case 6:
                        day = '周六';
                        break;
                }
                return year + '-' + month + '-' + date + '  ' + day;
            },
            sign() {
                if(this.isHasPlan == false){
                     return '无考勤方案'; // 代表此人没有考勤方案
                }else {
                    if(this.workDay == true) { //工作日字样显示
                        if (this.clockCommute == 1) {
                            return '签到';
                        } else if (this.clockCommute == 2) {
                            return '签退';
                        }
                    }else { //休息日字样显示
                        if (this.clockCommute == 1) {
                            return '';
                        } else if (this.clockCommute == 2) {
                            return '签退';
                        }
                    }
                }
            }
        },
        methods: {
            ...mapMutations(['change_calendarClicked','change_isRetroactive','change_supplementShow','change_supplementAble',"change_popIsShow",'change_active','change_clockStatus','change_clockCommute','change_clockConfirm','change_morningNight','change_initTime','change_circle','change_register','change_sureTime','change_beforeClick_clockCommute','change_popshowText','change_listData','change_workDay','change_sysTimes']),
            ...mapActions(['change_popIsShowAction','change_activeAction','change_clockStatusAction','change_clockCommuteAction','change_clockConfirmAction','change_morningNightAction','change_initTimeAction','change_circleAction','change_registerAction','change_sureTimeAction','change_beforeClick_clockCommuteAction','change_popshowTextAction','change_listDataAction','change_workDayAction','mapAction','change_sysTimesAction','change_isHasPlanAction','change_psingAction','change_loadfailAction','change_enterTrueAction','startClickBtn','checkClockStatus','change_firstClockTimeAction','checkList','change_psTrueAction','change_psWrongAction','change_isShowUpdateClickAction','change_circle_disableAction','isOpenAppstore','change_isShowfileAction']),

            checkAddress () {
                this.addresPop = true;
            },
            async startPosition1 () { // 在打卡范围内定位
                /*显示正在定位--start*/
                    if(this.positioning == false){
                        this.change_psingAction();
                    }
                /*显示正在定位--end*/

                /*隐藏定位成功--start*/
                    if(this.positionTrue ==true){
                        this.change_psTrueAction();
                    }
                /*隐藏定位成功--end*/
                /*定位失败隐藏--start*/
                    this.change_psWrongAction(false);
                /*定位失败隐藏--end*/
                /*隐藏loadfail --start*/
                    if(this.loadfail ==true){
                        this.change_loadfailAction();
                    }
                /*隐藏loadfail --end*/
                let aaa=await this.mapAction();
            },
            async startPosition2 () { // 不在打卡范围内定位
                /*显示正在定位--start*/
                    if(this.positioning == false){
                        this.change_psingAction();
                    }
                /*显示正在定位--end*/

                /*隐藏定位成功--start*/
                    if(this.positionTrue ==true){
                        this.change_psTrueAction();
                    }
                /*隐藏定位成功--end*/

                    this.change_psWrongAction(false);// 把定位失败先隐藏

                /*隐藏loadfail --start*/
                    if(this.loadfail ==true){
                        this.change_loadfailAction();
                    }
                /*隐藏loadfail --end*/

                let aaa=await this.mapAction();
            },
            supplementOnTime () {
                if (this.supplementAble) {
                    this.change_isRetroactive(true);
                    this.startClickBtn(); // 请求打卡接口
                }
            },
            clockOnOff () {
                if(this.circle_disable== false){
                    this.change_isRetroactive(false);
                    this.startClickBtn(); // 请求打卡接口
                }
            },
        },
        created () {
            /*this.isOpenAppstore(8);*///调用是否开通该应用的接口(8--线上环境代表是考勤模块)
            this.change_sysTimesAction();
            this.change_calendarClicked(false);
        },
        activated(){
        },
        mounted () {
            let self = this;

            /*调用地图方法*/
            (async ()=>{
                let aaa = await this.mapAction();
                this.checkList(0);//请求list接口
            })();


            /*显示正在定位--start*/
                if(this.positioning == false){
                   this.change_psingAction();
                }
            /*显示正在定位--end*/
            /*隐藏定位失败--start*/
               this.change_psWrongAction(false);
                /*隐藏定位成功--start*/
                if(this.positionTrue == true){
                   this.change_psTrueAction();
                }
                /*隐藏定位成功--end*/
            /*隐藏定位失败--end*/
            this.change_circle_disableAction(true);//设置圆圈为不可点击状态

            Bus.$on('addressClose', (text) => { // 考勤地址弹窗关闭
                this.addresPop = false;
            });
        }
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    @import '../../../common/css/mixin';
    @import '../../../../static/css/animate';


    #container {
        width: 100%;
        height: 50%;
        display: none;
    }

    .clock-wrapper {
        width: 100%;
        height: 100%;
        overflow: hidden;
        .main {
            width: 100%;
            height: 93%;
            .position-wrapper {
                width: 100%;
                height: 2.18rem;
                .wrapper {
                    padding-top: .72rem;
                    .img-icon {
                        width: .38rem;
                        height: .56rem;
                        margin: 0 auto;
                        background-size: auto 100%;
                        background-position: center;
                        background-repeat: no-repeat;
                        &.flash {
                            animation-iteration-count: infinite;
                        }
                    }
                    &.fail-wrapper {
                        .img-icon {
                            @include bg-image('../../../../static/attence-image/not_location');
                        }
                    }
                    &.success-wrapper {
                        .img-icon {
                            @include bg-image('../../../../static/attence-image/location');
                        }
                    }
                    &.position-loading {
                        .img-icon {
                            width: .45rem;
                            height: .45rem;
                            background-image: url("../../../../static/attence-image/loading.gif");
                        }
                    }
                    .title_warpper{
                        margin-bottom: 0.08rem;
                        margin-top: .18rem;
                        height: 0.3rem;
                        line-height: 0.3rem;
                        /*background: red;*/
                        .title {
                            font-family: PingFangSC-Regular;
                            font-size: 0.22rem;
                            color: #4590E4;
                            text-align: center;
                            &.fail-title {
                                color: #FF6200;
                            }
                            & > span {
                                font-family: PingFangSC-Regular;
                                font-size: 0.14rem;
                                color: #666666;
                                text-align: center;
                                vertical-align: middle;
                                height: .16rem;
                                line-height: .16rem;
                                display: inline-block;
                                &.again {
                                    display:inline-block;
                                    width: .20rem;
                                    height: .20rem;
                                    @include bg-image('../../../../static/attence-image/refurbish');
                                    background-size: auto 100%;
                                    background-position: center;
                                    background-repeat: no-repeat;
                                    display: inline-block;
                                    margin-left: 0.06rem;
                                }
                            }
                        }
                    }

                    .address{
                        text-align: center;
                        padding-top: 0.04rem;
                        font-family: PingFangSC-Regular;
                        font-size: 0.14rem;
                        text-algin:center;
                        margin: 0 auto;
                        color: #4590E4;
                        padding-bottom: 0.2rem;
                        .address_text{
                            font-size: 0.14rem;
                            vertical-align: middle;
                        }
                        .addressGo{
                            display: inline-block;
                            width: 0.12rem;
                            height: 0.125rem;
                            @include bg-image('../../../../static/attence-image/next');
                            background-size: 100%;
                            margin-left: 0.04rem;
                            margin-top: -0.02rem;
                            vertical-align: middle;
                        }
                    }

                    .noPlan {
                        width: 100%;
                        text-align: center;
                        color: #FF6200;
                        font-family: PingFangSC-Regular;
                        font-size: 0.22rem;
                        margin-top: 0.08rem;
                    }
                    .position-msg {
                        font-size: 0;
                        text-align: center;
                        .result {
                            font-family: PingFangSC-Regular;
                            font-size: 0.14rem;
                            color: #666666;
                            text-align: center;
                            vertical-align: middle;
                            height: .16rem;
                            line-height: .16rem;
                            display: inline-block;
                            max-width: 250px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            /*visibility: hidden;*/
                        }
                    }
                }
            }
            .down-box {
                position: relative;
                width: 100%;
                height: 2.82rem;
                margin-top: 0.29rem;

                .showtime {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 0.38rem;
                    text-align: center;
                    margin:0 auto;
                    font-size: 0.16rem;
                    line-height: 0.38rem;

                    span{
                    	height: 0.38rem;
                    }
                    .text{
                        display: inline-block;
                        font-size: 0.16rem;
                        letter-spacing: 0;
                        margin-top: -0.01rem;
                        margin-right: .1rem;
                        color: #333333;
                        line-height: 0.38rem;

                    }
                    .time{
                        display: inline-block;
                        font-size: 0.2rem;
                        color: #2E2E2E;
                        letter-spacing: 0;
                        line-height: 0.38rem;

                    }
                    .next-day {
                        display: inline-block;
                        position: relative;
                        top: -.04rem;
                        height: .16rem;
                        line-height: .17rem;
                        margin-top: .11rem;
                        margin-right: 0.07rem;
                        padding: 0 .05rem;
                        background-color: #FB9D4D;
                        border-radius: .1rem;
                        font-size: .1rem;
                        color: #FFFFFF;

                    }

                    .supplementOn {
                        display: inline-block;
                        position: relative;
                        top: -.02rem;
                        font-size: .14rem;
                        color: #FF6200;
                        margin-left: .22rem;
                        line-height: 0.38rem;


                        &.btn {
                            display: inline-block;
                            width: .7rem;
                            height: .36rem;
                            border: 1px solid #4590E4;
                            border-radius: 1rem;
                            color: #4590E4;
                        }
                    }
                }
                .circle {
                    width: 1.6rem;
                    height: 1.6rem;
                    font-size: 0;
                    box-sizing: border-box;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin-top: -0.8rem;
                    margin-left: -0.8rem;
                    border: 0.05rem solid #4590E4;
                    text-align: center;
                    border-radius: 50%;
                    &.disable {
                        opacity: 0.36;
                    }
                    &.disable2 {
                        opacity: 0.36;
                    }
                    &.start {
                        background-image: url("../../../../static/attence-image/run.gif");
                        background-size: auto 100%;
                        background-position: center;
                        background-repeat: no-repeat;
                        border: none;
                    }
                    .time {
                        font-family: DINCond-Bold;
                        font-size: 0.42rem;
                        color: #4590E4;
                        margin-top: 0.45rem;
                        height: 0.59rem;
                        line-height: 0.59rem;
                        /*background: red;*/
                        &.marginBottom {
                            margin-bottom: 0;
                        }
                    }
                    .content {
                        /*background: green;*/
                        font-family: PingFangSC-Regular;
                        font-size: 0.22rem;
                        color: #4590E4;
                        height: 0.22rem;
                    }
                }
                .clock-situation {
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                    .list {
                        &:last-child {
                            margin-bottom: 0.27rem;
                        }
                    }
                }
            }
        }
        .footer_warpper{
        	height: 0.4rem;
        	position: fixed;
            left: 0;
            right: 0;
            bottom: 0.1rem;
            .week{
	            width: 100%;
	            height: 0.18rem;
	            line-height: 0.18rem;
	            text-align: center;
	            font-family: PingFangSC-Regular;
	            font-size: 0.13rem;
	            color: #666666;
	            letter-spacing: 0;
	            margin-top: 0.05rem;
	            float: left;
	        }
	        .footer-time {
	            width:100%;
	            text-align: center;
	            font-family: PingFangSC-Regular;
	            font-size: 0.13rem;
	            color: #666666;
	            letter-spacing: 0;
	            font-weight: 500;
	            height: 0.18rem;
	            line-height: 0.18rem;
	            margin-top:0.03rem;
	            float: left;
	        }
        }
        .pop_warp {
            background: rgba(0, 0, 0, 0.7);
            position: fixed;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 100;
        }
    }
</style>
