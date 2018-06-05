<template>
    <div class="group-date">
        <div class="date-wrapper clearFix">
            <h1 class="title fl">开始时间</h1>
            <div class="date fr" @click="addTime(start)">
                <input type="text" class="startAndend" :value="formatStartTime"  readonly />
                <b class="choice-date"></b>
            </div>
        </div>
        <div class="date-wrapper clearFix">
            <h1 class="title fl">结束时间</h1>
            <div class="date fr" @click="addTime(end)">
                <input type="text" class="startAndend" :value="formatEndTime"  readonly />
                <b class="choice-date"></b>
            </div>
        </div>
        <div class="date-wrapper clearFix">
            <h1 class="title fl">总时长
            </h1>
            <div class="date fr">
                <span class="fr">分</span>
                <input type="text" placeholder="" v-model="returnMinutes" pattern="[0-9]*" @input="calculateLength(2)" class="minute-length fr" maxlength="2">
                <span class="fr">时</span>
                <input type="text" placeholder="" v-model="returnHours" pattern="[0-9]*" @input="calculateLength(1)" class="hour-length fr" maxlength="2">
                <span class="fr">天</span>
                <input type="text"  placeholder="" v-model="returnDates" pattern="[0-9]*" @input="calculateLength(0)" class="day-length fr" maxlength="3">
            </div>
        </div>
    </div>
</template>

<script>
    import format from 'common/js/dateformat';
    import {mapMutations} from 'vuex';
    import {Toast} from 'mint-ui';
    import jsBridge from 'common/js/jsbridge';

    export default {
        props: {
            element: {
                type: Object
            }
        },
        data () {
            return {
                week: {
                    '0': '周日',
                    '1': '周一',
                    '2': '周二',
                    '3': '周三',
                    '4': '周四',
                    '5': '周五',
                    '6': '周六'
                },
                startArr: [],
                endArr: [],
                dateType: 0,
                returnDates: '',
                returnHours: '',
                returnMinutes: '',
                start: 1, //  判断开始
                end: 0,
                startTime: 0, // 从app 控件获取的时间戳
                endTime: 0,  // 从app 控件获取的时间戳
                timeObj: {}, // 用于存groupdate的时间数据
                // 保存groupdate的数据
                saveGroupDate: {
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
        computed: {
            forSaveStartTime () { // 格式化显示开始日期 保存按钮样式控制
                let date = this.startTime;

                if (date) {
                    Date.prototype.Format = format;

                    return new Date(Number(date)).Format(this.element.format || 'yyyy-MM-dd HH:mm');
                } else {
                    if (this.element.value) {
                        let value = JSON.parse(this.element.value);
                        let beginDate = value.beginDate;
                        let beginTime = value.beginTime;
                        let date = '';
                        let time = '';
                        let iosDate = '';
                        if (beginDate) {
                            if (window.headers.clientOs === '1') {
                                iosDate = beginDate.substring(0, 4) + '/' + beginDate.substring(4, 6) + '/' + beginDate.substring(6);
                            }
                            date = beginDate.substring(0, 4) + '-' + beginDate.substring(4, 6) + '-' + beginDate.substring(6);
                        }
                        if (beginTime) {
                            time = ' ' + beginTime.substring(0, 2) + ':' + beginTime.substring(2);
                        }

                        let userWeek = '';
                        if (date) {
                            if (window.headers.clientOs === '1') {
                                userWeek = this.week[new Date(iosDate + time).getDay()];
                            }
                            if (window.headers.clientOs === '2') {
                                userWeek = this.week[new Date(date + time).getDay()];
                            }
                        }
                        return date + userWeek + time; // 显示从api获取的时间
                    }
                    return '';
                }
            },
            forSaveEndTime () {  // 格式化显示结束日期 保存按钮样式控制
                let date = this.endTime;

                if (date) {
                    Date.prototype.Format = format;

                    return new Date(Number(date)).Format(this.element.format || 'yyyy-MM-dd HH:mm');
                } else {
                    if (this.element.value) {
                        let value = JSON.parse(this.element.value);
                        let endDate = value.endDate;
                        let endTime = value.endTime;
                        let date = '';
                        let time = '';
                        let iosDate = '';
                        if (endDate) {
                            if (window.headers.clientOs === '1') {
                                iosDate = endDate.substring(0, 4) + '/' + endDate.substring(4, 6) + '/' + endDate.substring(6);
                            }
                            date = endDate.substring(0, 4) + '-' + endDate.substring(4, 6) + '-' + endDate.substring(6);
                        }
                        if (endTime) {
                            time = ' ' + endTime.substring(0, 2) + ':' + endTime.substring(2);
                        }

                        let userWeek = '';
                        if (date) {
                            if (window.headers.clientOs === '1') {
                                userWeek = this.week[new Date(iosDate + time).getDay()];
                            }
                            if (window.headers.clientOs === '2') {
                                userWeek = this.week[new Date(date + time).getDay()];
                            }
                        }
                        return date + userWeek + time; // 显示从api获取的时间
                    }

                    return '';
                }
            },
            formatStartTime () { // 格式化显示开始日期 保存按钮样式控制
                let date = this.startTime;

                let dateFormatType = 'yyyy-MM-dd EE HH:mm';

                if (this.element.format) {
                    if (this.element.format.indexOf(':') > 0) {
                        dateFormatType = 'yyyy-MM-dd EE HH:mm';
                    } else {
                        dateFormatType = 'yyyy-MM-dd EE';
                    }
                }

                if (date) {
                    Date.prototype.Format = format;
                    this.$store.state.ifLeaveForGroupDate = true;

                    this.forSaveStartTime = new Date(Number(date)).Format(this.element.format || 'yyyy-MM-dd HH:mm');
                    return new Date(Number(date)).Format(dateFormatType);
                } else {
                    if (this.element.value) {
                        let value = JSON.parse(this.element.value);
                        let beginDate = value.beginDate;
                        let beginTime = value.beginTime;
                        let date = '';
                        let time = '';
                        let iosDate = '';
                        if (beginDate) {
                        	if (window.headers.clientOs === '1') {
                                iosDate = beginDate.substring(0, 4) + '/' + beginDate.substring(4, 6) + '/' + beginDate.substring(6);
                            }
                            date = beginDate.substring(0, 4) + '-' + beginDate.substring(4, 6) + '-' + beginDate.substring(6);
                        }
                        if (beginTime && dateFormatType.indexOf(':') > 0) {
                            time = ' ' + beginTime.substring(0, 2) + ':' + beginTime.substring(2);
                        }
                        if (value.days) {
                            this.returnDates = value.days;
                        } else {
                            this.returnDates = '';
                        }
                        if (value.hours) {
                            this.returnHours = value.hours;
                        } else {
                            this.returnHours = '';
                        }
                        if (value.minutes) {
                            this.returnMinutes = value.minutes;
                        } else {
                            this.returnMinutes = '';
                        }
                        if (!date && !time) {
                            this.startTime = 0;
                        } else {
                            this.startTime = new Date(date + time).getTime();
                            if (window.headers.clientOs === '1') {
                                this.startTime = new Date(iosDate + time).getTime();
                            }
                            if (window.headers.clientOs === '2') {
                                this.startTime = new Date(date + time).getTime();
                            }
                        }
                        this.$store.state.ifLeaveForGroupDate = true;

                        this.forSaveStartTime = date + time;

                        let userWeek = '';
                        if (date) {
                            if (window.headers.clientOs === '1') {
                                userWeek = this.week[new Date(iosDate + time).getDay()];
                            }
                            if (window.headers.clientOs === '2') {
                                userWeek = this.week[new Date(date + time).getDay()];
                            }
                        }
                        return date + ' ' + userWeek + time; // 显示从api获取的时间
                    }
                    this.$store.state.ifLeaveForGroupDate = false;
                    this.returnDates = '';
                    this.returnHours = '';
                    this.returnMinutes = '';

                    this.forSaveStartTime = '';

                    return '';
                }
            },
            formatEndTime () {  // 格式化显示结束日期 保存按钮样式控制
                let date = this.endTime;

                let dateFormatType = 'yyyy-MM-dd EE HH:mm';

                if (this.element.format) {
                    if (this.element.format.indexOf(':') > 0) {
                        dateFormatType = 'yyyy-MM-dd EE HH:mm';
                    } else {
                        dateFormatType = 'yyyy-MM-dd EE';
                    }
                }

                if (date) {
                    Date.prototype.Format = format;
                    this.$store.state.ifLeaveForGroupDate = true;

                    this.forSaveEndTime = new Date(Number(date)).Format(this.element.format || 'yyyy-MM-dd HH:mm');

                    return new Date(Number(date)).Format(dateFormatType);
                } else {
                    if (this.element.value) {
                        let value = JSON.parse(this.element.value);
                        let endDate = value.endDate;
                        let endTime = value.endTime;
                        let date = '';
                        let time = '';
                        let iosDate = '';
                        if (endDate) {
                            if (window.headers.clientOs === '1') {
                                iosDate = endDate.substring(0, 4) + '/' + endDate.substring(4, 6) + '/' + endDate.substring(6);
                            }
                            date = endDate.substring(0, 4) + '-' + endDate.substring(4, 6) + '-' + endDate.substring(6);
                        }
                        if (endTime && dateFormatType.indexOf(':') > 0) {
                            time = ' ' + endTime.substring(0, 2) + ':' + endTime.substring(2);
                        }
                        if (!date && !time) {
                        	this.endTime = 0;
                        } else {
                            if (window.headers.clientOs === '1') {
                                this.endTime = new Date(iosDate + time).getTime();
                            }
                            if (window.headers.clientOs === '2') {
                                this.endTime = new Date(date + time).getTime();
                            }
                        }
                        if (value.days) {
                            this.returnDates = value.days;
                        } else {
                            this.returnDates = '';
                        }
                        if (value.hours) {
                            this.returnHours = value.hours;
                        } else {
                            this.returnHours = '';
                        }
                        if (value.minutes) {
                            this.returnMinutes = value.minutes;
                        } else {
                            this.returnMinutes = '';
                        }
                        this.$store.state.ifLeaveForGroupDate = true;

                        this.forSaveEndTime = date + time;

                        let userWeek = '';
                        if (date) {
                            if (window.headers.clientOs === '1') {
                                userWeek = this.week[new Date(iosDate + time).getDay()];
                            }
                            if (window.headers.clientOs === '2') {
                                userWeek = this.week[new Date(date + time).getDay()];
                            }
                        }
                        return date + ' ' + userWeek + time; // 显示从api获取的时间
                    }
                    this.$store.state.ifLeaveForGroupDate = false;
                    this.returnDates = '';
                    this.returnHours = '';
                    this.returnMinutes = '';

                    this.forSaveEndTime = '';

                    return '';
                }
            }
        },
        mounted () {
            if (this.startTime < this.endTime) {
                this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = true;
            } else {
                this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = false;
            }
            if (this.saveGroupDate.value) {
                this.timeObj = JSON.parse(this.saveGroupDate.value); // 初始化timeObj
            }
            this.$store.state.quitCheck = false;
            this.SAVE_GROUPTIME(this.saveGroupDate);
        },
        methods: {
            ...mapMutations([
                'SAVE_GROUPTIME',
                'CAN_SAVE',
                'ONLY_JUDGE'
            ]),
            daysCheck (status) {
                if (this.returnDates > 365) {
                    let instance = Toast('天数不能大于365');
                    setTimeout(() => {
                        instance.close();
                        if (status === 1) {
                            this.startTime = null;
                            this.startArr = this.formatDate('');
                            this.element.value = '';
                            this.returnDates = '';
                            this.returnHours = '';
                            this.returnMinutes = '';
                        }
                        if (status === 0) {
                            this.endTime = null;
                            this.endArr = this.formatDate('');
                            this.element.value = '';
                            this.returnDates = '';
                            this.returnHours = '';
                            this.returnMinutes = '';
                        }
                        this.returnDates = '';
                        this.saveTimeLength(this.returnDates + '', this.returnHours + '', this.returnMinutes + '');
                    }, 2000);
                } else if (this.returnDates >= 0){
                    this.saveTimeLength(this.returnDates + '', this.returnHours + '', this.returnMinutes + '');
                } else {
                    this.returnDates = '';
                    this.saveTimeLength(this.returnDates + '', this.returnHours + '', this.returnMinutes + '');
                }
            },
            hoursCheck (status) {
                if (this.returnHours > 23) {
                    let instance = Toast('小时数不能大于23');
                    setTimeout(() => {
                        instance.close();
                        if (status === 1) {
                            this.startTime = null;
                            this.startArr = this.formatDate('');
                            this.element.value = '';

                            this.returnDates = '';
                            this.returnHours = '';
                            this.returnMinutes = '';
                        }
                        if (status === 0) {
                            this.endTime = null;
                            this.endArr = this.formatDate('');
                            this.element.value = '';
                            this.returnDates = '';
                            this.returnHours = '';
                            this.returnMinutes = '';
                        }
                        this.returnHours = '';
                        this.saveTimeLength(this.returnDates + '', this.returnHours + '', this.returnMinutes + '');
                    }, 2000);
                } else if (this.returnHours >= 0){
                    this.saveTimeLength(this.returnDates + '', this.returnHours + '', this.returnMinutes + '');
                } else {
                    this.returnHours = '';
                    this.saveTimeLength(this.returnDates + '', this.returnHours + '', this.returnMinutes + '');
                }
            },
            minutesCheck (status) {
                if (this.returnMinutes > 59) {
                    let instance = Toast('分钟数不能大于59');
                    setTimeout(() => {
                        instance.close();
                        if (status === 1) {
                            this.startTime = null;
                            this.startArr = this.formatDate('');
                            this.element.value = '';

                            this.returnDates = '';
                            this.returnHours = '';
                            this.returnMinutes = '';
                        }
                        if (status === 0) {
                            this.endTime = null;
                            this.endArr = this.formatDate('');
                            this.element.value = '';
                            this.returnDates = '';
                            this.returnHours = '';
                            this.returnMinutes = '';
                        }
                        this.returnMinutes = '';
                        this.saveTimeLength(this.returnDates + '', this.returnHours + '', this.returnMinutes + '');
                    }, 2000);
                } else if (this.returnMinutes >= 0){
                    this.saveTimeLength(this.returnDates + '', this.returnHours + '', this.returnMinutes + '');
                } else {
                    this.returnMinutes = '';
                    this.saveTimeLength(this.returnDates + '', this.returnHours + '', this.returnMinutes + '');
                }
            },
            calculateLength (typeNum) {
                if (typeNum === 0) {
                    this.returnDates = this.returnDates.replace(/[^\d]/g, '');
                    this.daysCheck();
                }
                if (typeNum === 1) {
                    this.returnHours = this.returnHours.replace(/[^\d]/g, '');
                    this.hoursCheck();
                }
                if (typeNum === 2) {
                    this.returnMinutes = this.returnMinutes.replace(/[^\d]/g, '');
                    this.minutesCheck();
                }
            },
            saveTimeLength (dates, hours, minutes) {
                // 时长必填
                if ( dates === '' || hours === '' || minutes === '') {
                    this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = false;
                } else {
                    this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = true;
                }
                let lengthObj = this.formatTime(dates + '', hours + '', minutes + '');
                Object.assign(this.timeObj, lengthObj); // post时长数据
                this.saveGroupDate.value = JSON.stringify(this.timeObj);
                this.SAVE_GROUPTIME(this.saveGroupDate);

                this.ONLY_JUDGE();
            },
            timeLength (status) { // 格式化显示时长 保存按钮样式控制
                let sTime = new Date(this.startTime).getTime() || 0;
                let eTime = new Date(this.endTime).getTime() || 0;

                let diffs = Math.abs((sTime - eTime));
                let dates = Math.floor(diffs / (1000 * 60 * 60 * 24));
                let diffsH = diffs % (1000 * 60 * 60 * 24);
                let hours = Math.floor(diffsH / (1000 * 60 * 60));
                let diffsM = diffsH % (1000 * 60 * 60);
                let minutes = Math.floor(diffsM / (1000 * 60));

                if (sTime && eTime) {
                    if (sTime < eTime) {
                        // 开始、结束时间都存在，且开始小于结束，则计算总时长
                        this.returnDates = dates;
                        this.returnHours = hours;
                        this.returnMinutes = minutes;

                        this.daysCheck(status);
                        this.hoursCheck(status);
                        this.minutesCheck(status);
                    } else {
                        // 结束时间小的时候 不填充
                        if (status === 1) {
                            this.startTime = null;
                            this.startArr = this.formatDate('');
                            this.element.value = '';

                        } else {
                            this.endTime = null;
                            this.endArr = this.formatDate('');
                            this.element.value = '';

                        }
                        let instance = Toast({
                            message: '开始时间不能大于结束时间',
                            className: 'toast-width'
                        });
                        setTimeout(() => {
                            instance.close();
                        }, 2000);
                        this.returnDates = '';
                        this.returnHours = '';
                        this.returnMinutes = '';
                    }
                }
            },
            // 将groupdata 组件的数据存入到mutations中
            async addTime (status) {
                let self = this;
                let dateData;
                let defaultDate = 0;
                let startObj = {};
                let endObj = {};
                // 调app 时间控件
                if (this.element.format) {
                    if (this.element.format.indexOf(':') > 0) {
                        self.dateType = 0; // 0 默认年月日时分
                    } else {
                        self.dateType = 1;
                    }
                }
                if (status === 1) {
                    if (this.startTime) {
                        defaultDate = this.startTime;
                    }
                    dateData = await jsBridge.getDate(self.dateType, defaultDate);
                    this.startTime = dateData;

                    this.startArr = this.formatDate(this.forSaveStartTime);
                    this.timeLength(status); //计算时长  不要换位置

                    startObj = this.returnData(this.startArr, 'beginDate', 'beginTime');
                }
                if (status === 0) {
                    if (this.endTime) {
                        defaultDate = this.endTime;
                    }
                    dateData = await jsBridge.getDate(self.dateType, defaultDate);
                    this.endTime = dateData;

                    this.endArr = this.formatDate(this.forSaveEndTime);
                    this.timeLength(status); //计算时长

                    endObj = this.returnData(this.endArr, 'endDate', 'endTime');
                }

                Object.assign(this.timeObj, startObj, endObj);
                this.saveGroupDate.value = JSON.stringify(this.timeObj);
                this.$store.state.quitCheck = true;
                this.SAVE_GROUPTIME(this.saveGroupDate);

                if (this.startTime && this.endTime && (this.startTime < this.endTime)) {
                    this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = true;
                    this.ONLY_JUDGE();
                } else {
                    this.$store.state.save[this.element.typeName + '_' + this.element.orderCode] = false;
                    this.ONLY_JUDGE();
                }
            },
            returnData (arr, date, time) {
                switch (arr.length) {
                    case 0:
                        return '';
                    case 1:
                        return {
                            [date]: arr[0],
                            [time]: '0000'
                        };
                    case 2:
                        return {
                            [date]: arr[0],
                            [time]: arr[1]
                        };
                    default:
                        break;
                }
            },
            formatTime (dates, hours, minutes) {
                return {days: dates, hours: hours, minutes: minutes};
            },
            formatDate (value) {
                let arr = value.split(' ');
                if (arr.length) {
                    let pattern = /\D+/g;
                    let formatArr = [];
                    for (let i = 0; i < arr.length; i++) {
                        let newValue = arr[i].replace(pattern, '');
                        formatArr.push(newValue);
                    }
                    return formatArr;
                }
            }
        }
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    @import "../../../common/css/mixin";
    @import "../../../common/css/index";

    .group-date {
        width: 100%;

        .date-wrapper {
            height: .64rem;
            box-sizing: border-box;
            font-family: PingFangSC-Regular;
            position: relative;
            @include border-1px(#EBEBEB);

            .title {
                margin-top: 0.2rem;
                width: 0.66rem;
                line-height: .22rem;
                font-size: 0.16rem;
                color: #999;
                text-align: right;
                letter-spacing: 0;
            }

            .date {
                width: calc(100% - 0.66rem);
                height: calc(100% - 0.21rem);
                text-align: right;
                padding-top:0.21rem;
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
                .choice-date {
                    width: 0.08rem;
                    height: 0.14rem;
                    vertical-align: middle;
                    display: inline-block;
                    margin-top: -0.01rem;
                @include bg-image('../../../../static/image/right_more');
                    background-size: cover;
                }
                .startAndend{
                    padding-right: 0.16rem;
                }
                input {
                    display: inline-block;
                    height: 0.22rem;
                    width: 2.2rem;
                    outline: none;
                    line-height: .22rem;
                    font-size: 0.16rem;
                    color: #333;
                    vertical-align: middle;
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

                .day-length,
                .hour-length,
                .minute-length {
                    width: .7rem;
                    box-sizing: border-box;
                    line-height: .22rem;
                    font-size: 0.16rem;
                    color: #333;
                    margin-right: 0;
                    text-align:center;
                }
                span {
                    line-height: .22rem;
                    font-size: 0.16rem;
                    color: #999;
                }
            }
        }
    }
</style>
