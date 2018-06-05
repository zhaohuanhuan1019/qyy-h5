<template>
    <div class="calendar">
        <head-top></head-top>
        <div class="scroll-wrapper" ref="scroll-wrapper">
            <div>
                <div id="box" class="date-wrapper">
                    <table class='cld-w'>
                        <thead>
                        <tr>
                            <th>日</th>
                            <th>一</th>
                            <th>二</th>
                            <th>三</th>
                            <th>四</th>
                            <th>五</th>
                            <th>六</th>
                        </tr>
                        </thead>
                        <tbody id="calendar-tbody" :value="nowDate.year + '-' + nowDate.month + '-' + nowDate.day">
                        <tr v-for="(rows, index) in dateArr">
                            <td v-for="item in rows" v-if="item.flag">
                            </td>
                            <td v-if="!item.flag" v-for="(item, index) in rows" :class="item.className"
                                :value="item.value" @click.stop="showContent">
                                <div>{{item.day}}</div>
                                <span class="dian"></span>
                            </td>
                            <td v-if="dateArr.length === index + 1 && rows.length > 0" v-for="item in spaceArr"></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="down-box" ref="scrollArea">
                    <div class="anonymous" v-show="noRecord">暂无考勤记录</div>
                    <div class="clock-situation" v-show="timeShow">
                        <div class="list-box">
                            <clock-content></clock-content>
                            <i class="absent" v-show="absent"></i>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <foot :number="number"></foot>
        <div v-show='isShowLoading' id="loading"><i></i></div>

        <pop-up v-show='isShow' @moreMap='startPosition2'></pop-up>
        <net-Unusual v-show="isShowfile"></net-Unusual>
        <sign-prompt v-show='prompt' @click.native="closesign" ref="sign"></sign-prompt>
        <before-late v-show='isShowClockConfirm'></before-late>
        <morning-night v-show="isShowMorningNight"></morning-night>
        <no-Permission ></no-Permission>
    </div>
</template>
<script>
    import Bus from 'common/js/bus.js';
    import headTop from 'attence/components/header/header';
    import clockContent from 'attence/components/elements/clockContent';  // 打卡详细信息组件
    import foot from 'attence/components/footer/footer';  // footer
    import signPrompt from 'attence/components/popUp/signPrompt'; // 手势弹层
    import BScroll from 'better-scroll'; // 局部滚动
    import popUp from 'attence/components/popUp/popUp';  // 其他打卡弹层
    import netUnusual from 'attence/components/popUp/netUnusual';  // 网络异常弹层
    import beforeLate from 'attence/components/popUp/beforeOrLatePrompt'; // 迟到早退提示弹层
    import morningNight from 'attence/components/popUp/morningOrNightPrompt'; // 早晚签到成功提示弹层
    import jsBridge from 'common/js/jsbridge'; // 引入jsBridge
    import {mapState,mapMutations,mapGetters,mapActions} from 'vuex';

    export default {
        data () {
            return {
                titleValue: '',
                prompt: false,
                absent: false,
                noRecord: false,
                timeShow: true,
                dateArr: [],
                nowDate: {},
                divArr: [],
                divArrLength: 0,
                spaceArr: [],
                tbodyHeight: 0,
                yAndm: '',
                allTimeArr: [], //代表从月视图接口中每天的上下班的打卡数据
                yesterday_update:'',//昨天的更新打卡显示与否
                heightArr: [],        // 存储高度值
                number: '', // 代表迟到，早退。。。次数
                clickdata: '', // 点击获取日期
            };
        },
        components: {
            popUp,
            headTop,
            clockContent,
            foot,
            signPrompt,
            beforeLate,
            morningNight,
            netUnusual,
        },
        computed: {
            /*从公共状态中拿到的数据--start*/
                listData(){
                    return this.$store.state.attence.listData;
                },
                isShowUpdateClick(){
                    return this.$store.state.attence.isShowUpdateClick;
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
                isShowLoading(){
                    return this.$store.state.attence.isShowLoading;
                },
                title_tip(){
                    return this.$store.state.attence.title_tip;
                },
                isShowfile(){
                    return this.$store.state.attence.isShowfile;
                },
            /*从公共状态中拿到的数据--end*/
            get_yesterday() { //得到的是昨天的日期时间戳
                let myDate = new Date();
                let year = myDate.getFullYear();
                let month = myDate.getMonth() + 1;
                let date = myDate.getDate() - 1;
                if (month < 10) {
                    month = '0' + month;
                }
                if (date < 10) {
                    date = '0' + date;
                }
                let a = year + '/' + month + '/' + date;
                return new Date(a).getTime();
            },
        },
        methods: {
            ...mapMutations([
            	'change_calendarClicked'
            ]),
            ...mapActions([
            	'change_sysTimesAction',
                'change_clockCommuteAction',
                'change_listDataAction',
                'change_isShowUpdateClickAction',
                'checkList',
                'change_titleTipAction',
                'change_isShowfileAction',
                'change_isDateErrAction',
            ]),
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
                // alert(aaa)
            },
            monthNum() {
                let myDate = new Date();
                let year = myDate.getFullYear();
                let m = myDate.getMonth() + 1;
                if (m < 10) {
                    m = '0' + m;
                }else{
                    m=m.toString()
                }
                this.yAndm = year + m;
            },
            listAtdRecord (){
                // 请求月视图接口
                let self = this;
                self.yAndm = Number(self.yAndm)
                jsBridge.getHeader().then(function (value) {
                    let header =value;
                    let flag = Number(value.clientOs);
                    jsBridge.GetAttendanceDate().then(function (value) {
                        self.$http({
                                url: '/attend/user/record/listAtdRecord',
                                method: 'POST',
                                body: JSON.stringify({
                                            'cid': value.companyId,
                                            'month': self.yAndm,
                                            'srcFlag':flag,
                                            'uid': value.staffId,
                                            'deptId': value.deptId
                                }),
                                headers: header,
                                timeout: 5000 //和产品沟通接口请求延迟时间。
                        }).then((res) => {
                            if(res.body.code ==0){
                                self.change_clockCommuteAction(res.body.data.clockCommute);
                                self.number = res.body.data.recordMonthStat;
                                let recordDayStats = res.body.data.recordDayStats;
                                self.yesterday_update = res.body.data.yestodayOfUpdated;

                                if(recordDayStats){
                                    if(recordDayStats.length == 0){
                                        for (let i = 0; i < self.divArr.length; i++) {
                                            self.divArr[i].parentNode.lastChild.style.background = 'none';

                                            let value = self.divArr[i].parentNode.getAttribute('value').split('-').join('/');
                                            value = (new Date(value)).getTime();

                                            /*给昨天添加点击样式--start*/
                                            if(self.get_yesterday == value){
                                                self.divArr[i].setAttribute('id', 'on');
                                            }
                                            /*给昨天添加点击样式--end*/
                                        }
                                        self.noRecord = true;
                                        self.absent = false;
                                        self.timeShow = false;
                                    } else {
                                        self.allTimeArr =[]; // 每次循环push之前把allTimeArr数组清空
                                        for(let j = 0; j < recordDayStats.length; j++) {
                                            // alert('把所有天的上下班时间存起来');
                                            let params={
                                                "clockDate":recordDayStats[j].clockDate,
                                                "onTime":recordDayStats[j].onTime,
                                                "onTimeStatus":recordDayStats[j].onTimeStatus,
                                                "offTime":recordDayStats[j].offTime,
                                                "offTimeStatus":recordDayStats[j].offTimeStatus,
                                                "onTimeCommute": recordDayStats[j].onTimeCommute,
                                                "offTimeCommute": recordDayStats[j].offTimeCommute,
                                                "retroactive": recordDayStats[j].retroactive,
                                            };
                                            self.allTimeArr.push(params);
                                        }
                                        console.log('self.allTimeArr::::::', self.allTimeArr);

                                        /*找到昨天的打卡数据--start*/
                                        let if_get_yesterday = false;
                                            for(let i=0;i<self.allTimeArr.length;i++){
                                                console.log('this.allTimeArr[i]===================', self.allTimeArr[i])
                                                if(self.allTimeArr[i].clockDate === self.get_yesterday){
                                                    if_get_yesterday = true;
                                                    let json = {
                                                        on:{
                                                            clockStatus:self.allTimeArr[i].onTimeStatus,
                                                            clockTime:self.allTimeArr[i].onTime,
                                                            nextDay: self.allTimeArr[i].onTimeCommute === 4,
                                                            retroactive: self.allTimeArr[i].retroactive
                                                        },
                                                        off:{
                                                            clockStatus:self.allTimeArr[i].offTimeStatus,
                                                            clockTime:self.allTimeArr[i].offTime,
                                                            nextDay: self.allTimeArr[i].offTimeCommute === 5
                                                        }
                                                    };
                                                    self.change_listDataAction(json);
                                                    // 控制昨天更新打卡按钮是否显示
                                                    if (res.body.data.yestodayOfUpdated === true) {
                                                        self.change_isShowUpdateClickAction(true);
                                                    } else {
                                                        self.change_isShowUpdateClickAction(false);
                                                    }
                                                    console.log(self.listData, '昨天---------------------')
                                                    break;
                                                }
                                            }

                                            if (!if_get_yesterday) {
                                                self.noRecord = true;
                                                self.absent = false;
                                                self.timeShow = false;
                                            }

                                        /*找到昨天的打卡数据--end*/

                                        for (let i = 0; i < self.divArr.length; i++) {
                                            let value = self.divArr[i].parentNode.getAttribute('value').split('-').join('/');
                                            value = (new Date(value)).getTime();

                                            /*给昨天添加点击样式--start*/
                                            if(self.get_yesterday == value){
                                                self.divArr[i].setAttribute('id', 'on');
                                            }
                                            /*给昨天添加点击样式--end*/

                                            /*给相应的日期添加对应的标识--start*/
                                            for (let j = 0; j < recordDayStats.length; j++) {
                                                if(recordDayStats[j].clockDate == value) {
                                                    self.divArr[i].setAttribute('hasData','1');
                                                    //打卡状态(0:正常 1:迟到 2:早退 3:未打卡 5:暂无数据 6:无出勤计划)
                                                    if(recordDayStats[j].offTimeStatus ==0 && recordDayStats[j].onTimeStatus == 0 || recordDayStats[j].offTimeStatus ==6 && recordDayStats[j].onTimeStatus == 6 ||recordDayStats[j].offTimeStatus ==0 && recordDayStats[j].onTimeStatus == 6 ||recordDayStats[j].offTimeStatus ==6 && recordDayStats[j].onTimeStatus == 0){

                                                        self.divArr[i].parentNode.lastChild.style.background = '#71E350';//绿  => 信息正常
                                                    }else if(recordDayStats[j].offTimeStatus ==5 && recordDayStats[j].onTimeStatus == 5){
                                                        //暂无数据
                                                    }else if(recordDayStats[j].offTimeStatus ==3 && recordDayStats[j].onTimeStatus == 3){
                                                        self.divArr[i].parentNode.lastChild.style.background = '#FF8622';//红  => 异常
                                                        self.divArr[i].parentNode.firstChild.setAttribute('absent','1');
                                                        /*给昨天添加旷工样式--start*/
                                                        if(self.get_yesterday === value){
                                                            self.absent = true;
                                                        }
                                                        /*给昨天添加旷工样式--end*/
                                                    }else {
                                                       // this.divArr[i].parentNode.lastChild.style.background = 'none';
                                                        self.divArr[i].parentNode.lastChild.style.background = '#FF8622';//红  => 异常
                                                    }
                                                }
                                            }
                                            /*给相应的日期添加对应的标识--end*/
                                        }
                                    }
                                }
                            }else if(res.body.code==501018){//无考勤方案下
                                self.number = {lateTimes:0,earlyTimes:0,absentTimes:0,unclockTimes:0};
                                self.change_isShowUpdateClickAction(false);
                            }else {
                                /*控制err弹窗显示和内容--start*/
                                self.change_isDateErrAction(true);
                                self.change_isShowfileAction(true);
                                /*控制err弹窗显示和内容--end*/
                            }
                        }, (res) => {
                            /*控制err弹窗显示和内容--start*/
                            self.change_isDateErrAction(false);
                            self.change_isShowfileAction(true);
                            /*控制err弹窗显示和内容--end*/
                        });
                    })
                })
                    
                
            },
            init () {
                let calendar = document.getElementById('calendar-tbody');
                this.divArr = calendar.getElementsByTagName('div');
                this.divArrLength = this.divArr.length;

                for (let i = 0; i < this.divArrLength; i++) { // 循环拼成想要的时间格式
                    let year = this.divArr[i].parentNode.getAttribute('value').split('-')[0];
                    let month = this.divArr[i].parentNode.getAttribute('value').split('-')[1];
                    let day = this.divArr[i].parentNode.getAttribute('value').split('-')[2];
                    if (month < 10) {
                        month = '0' + this.divArr[i].parentNode.getAttribute('value').split('-')[1];
                    }
                    if (day < 10) {
                        day = '0' + this.divArr[i].parentNode.getAttribute('value').split('-')[2];
                    }
                    let d = year + '-' + month + '-' + day;
                    this.divArr[i].parentNode.setAttribute('value', d);
                }

                this.listAtdRecord();// 请求月视图接口
            },
            /*点击每一天的方法--start*/
            showContent (event) {
                let target = event.target;

                for (let i = 0; i < this.divArrLength; i++) {
                    this.divArr[i].setAttribute('id', '');
                }
                if (target.nodeName === 'DIV') { // 如果点击的元素是DIV的话
                    /*给点击的元素加白色样式以及拿到该元素上面的日期--start*/
                        target.setAttribute('id', 'on');
                        let dateArr = target.parentNode.getAttribute('value').replace(/-/g, '/');
                        this.clickdata = parseInt(new Date(dateArr).getTime());
                    /*给点击的元素加白色样式以及拿到该元素上面的日期--end*/

                    /*处理点击的是以前-今天-将来功能--start*/
                        if (target.parentNode.className === 'cld-day') { // 点击以后时间
                            this.noRecord = true;
                            this.absent = false;
                            this.timeShow = false;
                        }

                        if (target.parentNode.className === 'cld-old') {  // 点击之前时间
                            console.log(this.allTimeArr)
                            if(target.getAttribute('hasData')) { // 点击的这个元素存在数据
                                for(let i=0; i<this.allTimeArr.length; i++) { // 循环所有有记录天的打卡时间与状态数组allTimeArr
                                    if(this.allTimeArr[i].clockDate === this.clickdata) { // 判断如果点击的这天的日期和其中的一条日期匹配
                                        if(this.allTimeArr[i].onTimeStatus == 3 && this.allTimeArr[i].offTimeStatus == 3) {//旷工）
                                            this.absent = true;
                                            this.noRecord = false;
                                            this.timeShow = true;
                                            let json = {
                                                on:{
                                                    clockStatus:3,
                                                    clockTime:'',
                                                    nextDay: false,
                                                    retroactive: false

                                                },
                                                off:{
                                                    clockStatus:3,
                                                    clockTime:'',
                                                    nextDay: false

                                                }
                                            }
                                            this.change_listDataAction(json);
                                            console.log('--on_clockStatus--'+this.listData.on.clockStatus+'--on_clockTime--'+this.listData.on.clockTime+'--off_clockStatus--'+this.listData.off.clockStatus+'--off_clockTime--'+this.listData.off.clockTime)
                                        }else { //代表这天没旷工（就显示时间列表）
                                            this.absent = false;
                                            this.noRecord = false;
                                            this.timeShow = true;

                                            let json = {
                                                on:{
                                                    clockStatus:this.allTimeArr[i].onTimeStatus,
                                                    clockTime:this.allTimeArr[i].onTime,
                                                    nextDay: this.allTimeArr[i].onTimeCommute === 4,
                                                    retroactive: this.allTimeArr[i].retroactive

                                                },
                                                off:{
                                                    clockStatus:this.allTimeArr[i].offTimeStatus,
                                                    clockTime:this.allTimeArr[i].offTime,
                                                    nextDay: this.allTimeArr[i].offTimeCommute === 5

                                                }
                                            };
                                            this.change_listDataAction(json);
                                            console.log('--on_clockStatus--'+this.listData.on.clockStatus+'--on_clockTime--'+this.listData.on.clockTime+'--off_clockStatus--'+this.listData.off.clockStatus+'--off_clockTime--'+this.listData.off.clockTime)
                                        }
                                        if(this.clickdata ==this.get_yesterday){//判断昨天的更新是否显示
                                            //alert(this.yesterday_update+'--------')
                                            this.change_isShowUpdateClickAction(this.yesterday_update);
                                        }else {
                                            this.change_isShowUpdateClickAction(false);
                                        }
                                    }
                                }
                            }else {// 点击的这个元素不存在数据
                                this.absent = false;
                                this.noRecord = true;
                                this.timeShow = false;
                            }
                        }
                        if (target.parentNode.className === 'cld-cur') { // 点击当天时间
                            this.noRecord = false;
                            this.absent = false;
                            this.timeShow = true;
                            this.change_calendarClicked(false);

                            this.checkList(1); // 1 请求接口 listByMonthView
                        }
                    /*处理点击的是以前-今天-将来功能--end*/
                }
                if (target.nodeName === 'TD') { // 如果点击的元素是TD的话
                    target.firstChild.setAttribute('id', 'on');
                    let dateArr = target.getAttribute('value').replace(/-/g, '/');
                    this.clickdata = new Date(dateArr).getTime();
                    if (target.className === 'cld-day') { // 点击以后时间
                        this.noRecord = true;
                        this.absent = false;
                        this.timeShow = false;
                    }
                    if (target.className === 'cld-old') {  // 点击之前时间
                        if(target.firstChild.getAttribute('hasData')) { // 点击的元素存在数据
                            for(let i=0; i<this.allTimeArr.length; i++) { // 循环所有有记录天的打卡时间与状态数组allTimeArr
                                if(this.allTimeArr[i].clockDate === this.clickdata) { // 判断如果点击的这天的日期和其中的一条日期匹配
                                    if(this.allTimeArr[i].onTimeStatus === 3 && this.allTimeArr[i].offTimeStatus === 3) {// 如果这天的上班和下班状态都是3（未打卡即旷工）
                                        this.absent = true;
                                        this.noRecord = false;
                                        this.timeShow = true;
                                        let json = {
                                            on:{
                                                clockStatus:3,
                                                clockTime:'',
                                                nextDay: false,
                                                retroactive: false

                                            },
                                            off:{
                                                clockStatus:3,
                                                clockTime:'',
                                                nextDay: false

                                            }
                                        }
                                        this.change_listDataAction(json);
                                        console.log('--on_clockStatus--'+this.listData.on.clockStatus+'--on_clockTime--'+this.listData.on.clockTime+'--off_clockStatus--'+this.listData.off.clockStatus+'--off_clockTime--'+this.listData.off.clockTime)
                                    }else { //代表这天没旷工（就显示时间列表）
                                        // alert('而且没有旷工哦')
                                        this.absent = false;
                                        this.noRecord = false;
                                        this.timeShow = true;

                                        let json = {
                                            on:{
                                                clockStatus:this.allTimeArr[i].onTimeStatus,
                                                clockTime:this.allTimeArr[i].onTime,
                                                nextDay: this.allTimeArr[i].onTimeCommute === 4,
                                                retroactive: this.allTimeArr[i].retroactive

                                            },
                                            off:{
                                                clockStatus:this.allTimeArr[i].offTimeStatus,
                                                clockTime:this.allTimeArr[i].offTime,
                                                nextDay: this.allTimeArr[i].offTimeCommute === 5

                                            }
                                        }
                                        this.change_listDataAction(json);
                                        console.log('--on_clockStatus--'+this.listData.on.clockStatus+'--on_clockTime--'+this.listData.on.clockTime+'--off_clockStatus--'+this.listData.off.clockStatus+'--off_clockTime--'+this.listData.off.clockTime)
                                    }
                                    if(this.clickdata ==this.get_yesterday){
                                        this.change_isShowUpdateClickAction(this.yesterday_update);
                                    }else {
                                        this.change_isShowUpdateClickAction(false);
                                    }
                                }
                            }
                        }else {// 点击的元素不存在数据
                            this.absent = false;
                            this.noRecord = true;
                            this.timeShow = false;
                        }
                    }
                    if (target.className === 'cld-cur') { // 点击当天时间
                        this.noRecord = false;
                        this.absent = false;
                        this.timeShow = true;
                        this.change_calendarClicked(false);

                        this.checkList(1);
                    }
                }
            },
            /*点击每一天的方法--end*/
            changeHeight () {
                let timer = null;
                clearInterval(timer);
                let arr = this.heightArr;
                // console.log(arr);
                let div = document.getElementById('box');
                let preHeight = arr[0];
                let nextHeight = arr[1];
                // alert(preHeight + '====' + nextHeight);
                if (preHeight !== nextHeight && typeof nextHeight === 'number') {
                // alert(preHeight + '====' + nextHeight);
                    timer = setInterval(() => {
                        if (preHeight > nextHeight) {
                            let num = preHeight--;
                            // console.log(num, '------------------------');
                            div.style.height = num + 50 + 'px';
                            if (num === nextHeight) {
                                clearInterval(timer);
                            }
                        } else {
                            let num = preHeight++;
                            div.style.height = num + 50 + 'px';
                            // console.log(num, '--------------ddddd----------');
                            if (num === nextHeight) {
                                clearInterval(timer);
                            }
                        }
                    }, 1);
                }
            },
            closesign () {
                this.prompt = false;
            },
            getMonthDaysNum (_year, _month) {
            	let monthDay  = 0;

                switch (_month) {
                    case 1:
                        monthDay = 31;
                        break;
                    case 2:
                        if (this.runNian(_year)) {
                            monthDay = 29;
                        } else {
                            monthDay = 28;
                        }
                        break;
                    case 3:
                        monthDay = 31;
                        break;
                    case 4:
                        monthDay = 30;
                        break;
                    case 5:
                        monthDay = 31;
                        break;
                    case 6:
                        monthDay = 30;
                        break;
                    case 7:
                        monthDay = 31;
                        break;
                    case 8:
                        monthDay = 31;
                        break;
                    case 9:
                        monthDay = 30;
                        break;
                    case 10:
                        monthDay = 31;
                        break;
                    case 11:
                        monthDay = 30;
                        break;
                    case 12:
                        monthDay = 31;
                        break;
                }; // 判断月份来得到运年或者平年的每月有多少天

                return monthDay;
            },
            // 判断闰年
            runNian (_year) {
                if (_year % 400 === 0 || (_year % 4 === 0 && _year % 100 !== 0)) {
                    return true;
                } else {
                    return false;
                }
            },
            getFirstDay (_year, _month) {
                let allDay;
                let y = _year - 1;
                allDay = y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + 1;
                // console.log(allDay);
                for (let i = 1; i < _month; i++) {
                    switch (i) {
                        case 1:
                            allDay += 31;
                            break;
                        case 2:
                            if (this.runNian(_year)) {
                                allDay += 29;
                            } else {
                                allDay += 28;
                            }
                            break;
                        case 3:
                            allDay += 31;
                            break;
                        case 4:
                            allDay += 30;
                            break;
                        case 5:
                            allDay += 31;
                            break;
                        case 6:
                            allDay += 30;
                            break;
                        case 7:
                            allDay += 31;
                            break;
                        case 8:
                            allDay += 31;
                            break;
                        case 9:
                            allDay += 30;
                            break;
                        case 10:
                            allDay += 31;
                            break;
                        case 11:
                            allDay += 30;
                            break;
                        case 12:
                            allDay += 31;
                            break;
                    }
                }
                return allDay % 7;
            },
            showCalendar (_year, _month, _day, firstDay) {
                let i = 0;
                let _className = '';
                let today = new Date();
                // 月份的天数
                let monthDay = this.getMonthDaysNum(_year, _month);
                this.titleValue = _year + '-' + _month + '-' + _day; // header的value
                // this.title = _year + '年' + _month + '月'; // header的日期
                this.change_titleTipAction(_year + '年' + _month + '月');// header的日期
                // 滑动时改变的年月赋值给月视图要传的月份
                if (_month < 10) {
                    this.yAndm = _year + '0' + _month;
                } else {
                    this.yAndm = _year + _month.toString();
                }
                this.nowDate.year = _year;
                this.nowDate.month = _month;
                this.nowDate.day = _day;
                // 显示当前月的天数
                let arr = [];
                for (i = 1; i <= monthDay; i++) { // 循环目前显示的这个月的所有天
                    // console.log(_year + '----' + _month + '----' + i + '----');
                    // 当日的日期
                    let obj = {};
                    if (i === 1) { // 判断这个月的第一天
                        for (let m = 1; m <= firstDay; m++) { // 循环次数为这个月第一天是星期几
                            let spaceOBJ = {};
                            spaceOBJ.flag = true;
                            arr.push(spaceOBJ);
                        } // 循环第一天为星期几,就循环几次,在前面插入几个空格
                        // console.log(arr);
                    }
                    if (_year === today.getFullYear() && _month === today.getMonth() + 1 && i === today.getDate()) {
                        _className = 'cld-cur';   // 当日添加类名
                    } else if (_year < today.getFullYear() || (_year === today.getFullYear() && _month <= today.getMonth()) || (_year === today.getFullYear() && _month === today.getMonth() + 1 && i < today.getDate())) {
                        _className = 'cld-old'; // 当日之前的日期添加类名
                    } else {  // 其他普通的日期
                        _className = 'cld-day'; // 当日之后的日期添加类名
                    }
                    // 判断节假日
                    /* if ((_month === 1 || _month === 10 && i === 1 || _month === 5) && i === 1) { // 判断每年的五一，给这一天添加类名
                     _className = 'holiday'; // 当年的元旦，五一和十一号添加类名
                     console.log(getFirstDay(_year, _month) + '--------这是代表星期几');
                     let weekday = getFirstDay(_year, _month);
                     switch (weekday) {
                     case 1:
                     alert('节假日为周一，放假周六，日，一这三天');
                     break;
                     case 2:
                     alert('节假日为周二，放假周日，一，二这三天');
                     break;
                     case 3:
                     alert('节假日为周三，放假周一，二，三这三天');
                     break;
                     case 4:
                     alert('节假日为周四，放假周四，五，六这三天');
                     break;
                     case 5:
                     alert('节假日为周五，放假周五，六，日这三天');
                     break;
                     case 6:
                     alert('节假日为周六，放假周六，日，一这三天');
                     break;
                     case 0:
                     alert('节假日为周日，放假周六，日，一这三天');
                     break;
                     }
                     } */
                    // 其他大于当月的月份的相同日期（为了让点击下一月的时候，相同的日期增加cld-cur类）
                    if (_day === i && (_year === today.getFullYear() && _month === today.getMonth() + 1)) {
                        _className = 'cld-cur';
                    }
                    obj.className = _className;
                    obj.value = _year + '-' + _month + '-' + i;
                    obj.day = i;
                    // 把日期存在对应的value
                    arr.push(obj);
                    if (arr.length === 7) {
                        this.dateArr.push(arr);
                        // console.log(rows, '+++++++++++++++++++++++++++++rows' + i);
                        arr = [];
                    }
                    if (i === monthDay) {
                        if (arr.length > 0) {
                            this.dateArr.push(arr);
                            let length = arr.length;
                            for (let m = length; m < 7; m++) {
                                this.spaceArr.push(m);
                            }
                        }
                    }
                }
            },
            // 显示年月日
            showDate (_year, _month, _day) {
                let date = '';
                let firstDay = this.getFirstDay(_year, _month, _day);
                if (_day !== 0) {
                    date = _year + '年' + _month + '月' + _day + '日';
                } else {
                    date = 'No Choose.';
                }
                this.titleValue = _year + '-' + _month + '-' + _day; // header的value
                // this.title = date; // header的日期
                this.change_titleTipAction(date);// header的日期
                this.showCalendar(_year, _month, _day, firstDay);         // 调用日历显示函数
            },
            // 下一月
            preMonth(_year, _month, _day) {
                this.dateArr = [];
                this.spaceArr = [];
                if (_month === 12) {
                    this.showDate(_year + 1, 1, _day);
                }else {
                    this.showDate(_year, _month + 1, _day);
                }
                for(let i=0;i<this.divArr.length;i++){
                    this.divArr[i].parentNode.firstChild.setAttribute('absent','0');
                    this.divArr[i].parentNode.lastChild.style.background = 'none';
                }
                this.listAtdRecord();//调用月视图接口
            },
            // 上一月
            nextMonth(_year, _month, _day) {
                this.dateArr = [];
                this.spaceArr = [];
                if (_month === 1) {
                    this.showDate(_year - 1, 12, _day);
                } else {
                    this.showDate(_year, _month - 1, _day);
                }
                //
                for(let i=0;i<this.divArr.length;i++){
                    this.divArr[i].parentNode.firstChild.setAttribute('absent','0');
                    this.divArr[i].parentNode.lastChild.style.background = 'none';
                }
                this.listAtdRecord();//调用月视图接口
            },
            // 返回角度
            GetSlideAngle(dx, dy) {
                return Math.atan2(dy, dx) * 180 / Math.PI;
            },
            // 根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
            GetSlideDirection(startX, startY, endX, endY) {
                let dy = startY - endY;
                let dx = endX - startX;
                let result = 0;

                // 如果滑动距离太短
                if (Math.abs(dx) < 50 && Math.abs(dy) < 50) {
                    return result;
                }

                let angle = this.GetSlideAngle(dx, dy);
                if (angle >= -45 && angle < 45) {
                    result = 4;
                } else if (angle >= 45 && angle < 135) {
                    result = 1;
                } else if (angle >= -135 && angle < -45) {
                    result = 2;
                } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
                    result = 3;
                }
                return result;
            },
        },
        created () {
        	let vueThis = this;
            // 滑动处理
            let startX, startY;
            // 获取当天的年月日
            let today = new Date();
            let _year = today.getFullYear();
            let _month = today.getMonth() + 1;
            let _day = today.getDate();
            let firstDay = this.getFirstDay(_year, _month);
            // 显示日历
            this.showCalendar(_year, _month, _day, firstDay);

            this.$nextTick(() => {
                let tbody = document.getElementById('calendar-tbody');
                tbody.addEventListener('touchstart', function (ev) {
                    startX = ev.touches[0].pageX;
                    startY = ev.touches[0].pageY;
                    vueThis.tbodyHeight = tbody.offsetHeight;
                    // 获取dom更新后的$('#calendar-tbody')的高度
                    vueThis.heightArr = [];
                    let height = tbody.offsetHeight;// 获取tbody的高度
                    vueThis.heightArr.push(height);// 把tbody的高度扔进heightArr数组中
                }, false);
                tbody.addEventListener('touchend', function (ev) {
                    let dayArr = this.getAttribute('value').split('-');//例：2017-6-16
                    let endX, endY;
                    endX = ev.changedTouches[0].pageX;
                    endY = ev.changedTouches[0].pageY;
                    let direction = vueThis.GetSlideDirection(startX, startY, endX, endY);
                    let clickMonth = parseInt(dayArr[1]);
                    let clickYear = parseInt(dayArr[0]);
                    let nowMonth = parseInt(new Date().getMonth() + 1);
                    let nowYear = parseInt(new Date().getFullYear());
                    switch (direction) {
                        case 0:
                            break;
                        case 1:
                            break;
                        case 2:
                            break;
                        case 3:
                            if( clickYear < nowYear || clickMonth<nowMonth ){
                                vueThis.preMonth(dayArr[0] - 0, dayArr[1] - 0, dayArr[2] - 0);
                            }
                            break;
                        case 4:
                            vueThis.nextMonth(dayArr[0] - 0, dayArr[1] - 0, dayArr[2] - 0);
                            break;
                        default:
                    }
                }, false);
            });
            /*调用native方法判断是否需要弹出浮层--开始*/
                let toAppJson = {
                    code: 0,
                    msg: '',
                    data: {
                        isFirstInAttendance: 1, // 控制滑动首次提示
                    }
                };
                jsBridge.getExtra(JSON.stringify(toAppJson)).then((value) => {
                    if (value.isFirstInAttendance === 1) {
                        this.prompt = true;
                    } else {
                        this.prompt = false;
                    }
                });
            /*调用native方法判断是否需要弹出浮层--结束*/
            setTimeout(() => {
                this.init();
            }, 20);
        },
        updated (e) {
            let calendar = document.getElementById('calendar-tbody');
            let div = calendar.getElementsByTagName('div');
            this.divArr = div;
            this.divArrLength = this.divArr.length;
            for (let i = 0; i < this.divArrLength; i++) {
                this.divArr[i].className = ''; // 每次组件更新后把所有的div的class清空
            }
            // 每次组件更新后获取$('#calendar-tbody')的高度
            let height = calendar.offsetHeight;
            this.heightArr.push(height);
        },
        watch: {
            title_tip() {
                this.$nextTick(() => {
                    this.changeHeight();
                })
            }
        },
        mounted () {
            this.monthNum();

            /*添加better-scroll滚动--start*/
                /*let this = this;
                setTimeout(this.$nextTick(() => {
                    this.initScroll();
                }), 100);
                this.$nextTick(() => {
                    this.scrollWarpper = new BScroll(this.$refs['scroll-wrapper'], {
                        click: true
                    });
                });*/
            /*添加better-scroll滚动--end*/
        }
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    @import '../../../common/css/mixin';

    .dian {
        display: block;
        border-radius: 50%;
        width: 0.05rem;
        height: 0.05rem;
        left: 50%;
        bottom: -0.1rem;
        margin-left: 47%;
    }

    .calendar {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        .scroll-wrapper {
            position: absolute;
            top: 0.44rem;
            bottom: 0.64rem;
            width: 100%;
            overflow-y: scroll;
            .date-wrapper {
                padding-bottom: 0.1rem;
                background: #4590E4;
                color: #fff;
                .cld-w {
                    width: 100%;
                }
            }
            &::-webkit-scrollbar{
                width: 0;
            }
        }
        #loading{
            position: fixed;
            left:0;
            top:0;
            z-index: 100;
            width:100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            i{
                display: inline-block;
                width: 0.45rem;
                height: 0.45rem;
                position: absolute;
                left: 50%;
                top:50%;
                margin-top: -0.225rem;
                margin-left: -0.225rem;
                background-image: url("../../../../static/attence-image/loading2.gif");
                background-size: 100%;
            }
        }
    }

    .down-box {
        height: 2.51rem;
        overflow: hidden;
        .anonymous {
            font-family: PingFangSC-Regular;
            font-size: 0.24rem;
            color: #929292;
            margin: 0 auto;
            line-height: 2.51rem;
            text-align: center;
        }
        .list-box{
            position: relative;
            .absent {
                display: inline-block;
                width:1.2rem;
                height: 0.99rem;
                position: absolute;
                right: 0;
                top:50%;
                margin-top: -0.5rem;
                @include bg-image('../../../../static/attence-image/absent');
                background-size: 100%;
            }
        }

        .clock-situation {
            width: 100%;
            padding:0 0.18rem;
            box-sizing: border-box;
            .list {
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }

    .date-wrapper .cld-w thead tr,
    .date-wrapper .cld-w tbody tr {
        height: .4rem;
        line-height: .4rem;
        text-align: center;
    }

    .date-wrapper .cld-w thead tr th,
    .date-wrapper .cld-w tbody tr td div {
        font-family: PingFangSC-Semibold;
        font-size: .16rem;
        font-weight: 600;
        color: #fff;
    }

    .date-wrapper .cld-w tbody tr td.cld-old div,
    .date-wrapper .cld-w tbody tr td.cld-day div,
    .date-wrapper .cld-w tbody tr td.cld-cur div {
        display: inline-block;
        width: .24rem;
        height: .24rem;
        line-height: .24rem;
        vertical-align: middle;
        background: none;
        border-radius: 50%;
        position: relative;
    }

    .date-wrapper .cld-w tbody tr td.cld-cur div {
        border: 1px solid #fff;
        box-sizing: border-box;
    }

    /*把没过日期点隐藏掉*/
    .date-wrapper .cld-w tbody tr td.cld-cur .dian,
    .date-wrapper .cld-w tbody tr td.cld-day .dian {
        display: none;
    }

    .active {
        &:after {
            position: absolute;
            content: '';
            border-radius: 50%;
            background: #71E350;
            width: 0.05rem;
            height: 0.05rem;
            left: 50%;
            bottom: -0.1rem;
            margin-left: -2.5px;
        }
    }

    /*.active2{
        &:after {
            position: absolute;
            content: '';
            border-radius: 50%;
            background: #FF8622;
            width: 0.05rem;
            height: 0.05rem;
            left: 50%;
            bottom: -0.1rem;
            margin-left: -2.5px;
        }
    }*/
    #active2 {
        background: red;
    }

    #on {
        background: #fff;
        color: #4590E4;
    }

    /*.date-wrapper .cld-w tbody tr td.cld-day div.on,
    .date-wrapper .cld-w tbody tr td.cld-cur div.on,
    .date-wrapper .cld-w tbody tr td.cld-old div.on {
        background: #fff;
        color: #4590E4;
    }*/

    .date-wrapper .cld-w thead tr th:first-child,
    .date-wrapper .cld-w tbody tr td:first-child,
    .date-wrapper .cld-w thead tr th:last-child,
    .date-wrapper .cld-w tbody tr td:last-child {
        div {
            color: #A9CCF2 !important;
            &:after {
                background: #A9CCF2;
            }
        }
    }

    .pop_warp {
        background: rgba(0, 0, 0, 0.7);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
</style>
