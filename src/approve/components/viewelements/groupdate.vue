<template>
    <div class="group-date">
        <div class="date-wrapper">
            <div class="time-warpper">
                <h1 class="title" style="-webkit-box-orient: vertical">开始时间</h1>
                <p class="start-time">{{showDate.start}}</p>
                <div class="clear"></div>
            </div>
            <div class="time-warpper">
                <h1 class="title" style="-webkit-box-orient: vertical">结束时间</h1>
                <p class="end-time">{{showDate.end}}</p>
                <div class="clear"></div>
            </div>
            <div class="time-warpper">
                <h1 class="title" style="-webkit-box-orient: vertical">总时长</h1>
                <p class="total-time">{{showDate.days}}</p>
                <div class="clear"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            value: {
                type: Object
            }
        },
        data () {
            return {
                startTime: '',
                endTime: '',
                allDays: ''
            };
        },
        computed: {
            formatToJSON () {
                return JSON.parse(this.value.value);
            },
            showDate () {
                let dateObj = this.formatToJSON;
                let beginDate = '';
                let endDate = '';
                let beginTime = '';
                let endTime = '';
                let start = '';
                let end = '';
                let days = '';
                if (dateObj.beginDate) {
                    beginDate = this.formatDate(dateObj.beginDate);
                }
                if (dateObj.endDate) {
                    endDate = this.formatDate(dateObj.endDate);
                }
//                if (dateObj.beginTime) {
//                    beginTime = this.formatTime(dateObj.beginTime);
//                }
//                if (dateObj.endTime) {
//                    endTime = this.formatTime(dateObj.endTime);
//                }
                if (dateObj.beginTime && this.value.format.indexOf(':') > 0) {
                    beginTime = this.formatTime(dateObj.beginTime);
                }
                if (dateObj.endTime && this.value.format.indexOf(':') > 0) {
                    endTime = this.formatTime(dateObj.endTime);
                }

                if (dateObj) {
                    days = this.formatDays(dateObj);
                }
                if (beginDate) {
                    start = beginDate + ' ' + beginTime;
                }
                if (endDate) {
                    end = endDate + ' ' + endTime;
                }
                return {start, end, days};
            }
        },
        methods: {
            formatDate (str) { // 格式化 年-月-日
                let year = str.substr(0, 4);
                let month = str.substr(4, 2);
                let day = str.substr(6, 2);
                return year + '-' + month + '-' + day;
            },
            formatTime (str) { // 格式化时间 00:00
                let hour = str.substr(0, 2);
                let minute = str.substr(2, 2);
                return hour + ':' + minute;
            },
            formatDays (obj) { // 格式化时长
                let days = obj.days + '天';
                let hours = obj.hours + '小时';
                let minutes = obj.minutes + '分钟';
                return days + hours + minutes;
            }

        }
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    .group-date {
        width: 100%;
        .time-warpper{
            margin-bottom: .1rem;
        }
        .title {
            float:left;
            width:0.66rem;
            text-align:right;
            font-family: PingFangSC-Regular;
            font-size: 0.16rem;
            color: #999999;
            letter-spacing: 0;
            margin-right: 0.18rem;
            line-height: .22rem;
            margin-left: -0.02rem;

            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }

        .start-time,
        .end-time,
        .total-time {
            float: left;
            line-height: .22rem;
            font-family: PingFangSC-Regular;
            font-size: 0.16rem;
            color: #333333;
            letter-spacing: 0;
        }
        .clear{
            clear:both;
        }
    }
</style>
