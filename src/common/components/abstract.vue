<template>
    <div class="content">
        <div class="content_title" style="-webkit-box-orient: vertical">
            <span v-if="entryType===0" v-html="item.approves.ownerName + '的'"></span>{{ item.approves.formName }}
        </div>
        <!-- 遍历所有的组件 -->
        <div class="summary" v-for="value in valuesArr">
            <!-- <div style="color:red; display:block">{{value.typeName}}--{{value.title}}--{{item.values.length}}++</div> -->
            <div class="summary_list ">
                <!-- 处理列表左侧title部分 -->
                <p>
                    <!-- 判断是不是为时间组件，如果是，就改变value.title为‘开始时间’，不是的话就显示value.title -->
                    <span class="summary_tab" style="-webkit-box-orient: vertical" v-if="value.typeName=='groupDate'">开始时间</span>
                    <span class="summary_tab" style="-webkit-box-orient: vertical" v-if="value.typeName!='groupDate'">{{value.title}}</span>
                    <span class="colon">：</span>
                </p>
                <!-- 判断groupDate组件,在里面判断是不是带时分的组件 -->
                <div class="text" v-if="value.typeName=='groupDate'">
                    <span v-if="value.format.indexOf(':') > 0">{{JSON.parse(value.value).beginDate | formatYear}} {{(JSON.parse(value.value).beginTime) | formatTime}}</span>
                    <span v-else>{{JSON.parse(value.value).beginDate | formatYear}}</span>
                </div>
                <!-- 判断date组件 -->
                <div class="text" v-if="value.typeName=='date'">
                    <span v-if="value.format.indexOf(':') > 0">{{value.value | formatDate}}</span>
                    <span v-else>{{value.value | formatDate2}}</span>
                </div>
                <!-- 判断radio组件 -->
                <div class="text" v-if="value.typeName=='radio'">
                    <div v-for="item in value.items" class="text_radio">
                        <span v-if="item.id==value.value">{{item.item}}</span>
                    </div>
                </div>

                <!-- 判断checkbox组件 -->
                <div class="text" v-if="value.typeName=='checkbox'" >
                    <span v-for="check in (value.value).split(',')">
                        <span v-if="check>-1">
                            <span v-for="(item,key) in value.items">
                                <span v-if="item.id==check">{{item.item}}<span v-if="key<value.items.length-1 && checkboxNum.length!==1">、</span></span>
                            </span>
                        </span>
                    </span>
                </div>
                <!-- 判断textarea或text或number组件 -->
                <div class="text" v-if="value.typeName=='textarea' || value.typeName=='text' || value.typeName=='number'">
                    <span v-if="value.value!==''">{{value.value}}</span>
                    <span v-else>无</span>
                </div>
            </div>

            <!-- 判断item.values数组是不是只有一个时间组件，让后面的结束时间和总时长都显示 -->
            <div class="summary_list space" v-if="value.typeName==='groupDate' && item.values.length===1">
                <div>
                    <p><span class="summary_tab" style="-webkit-box-orient: vertical">结束时间</span><span class="colon">：</span></p>
                    <div class="text">
                        <span>{{JSON.parse(value.value).endDate | formatYear}}
                        <span v-if="value.format.indexOf(':') > 0">{{JSON.parse(value.value).endTime | formatTime}}</span></span>
                    </div>
                </div>
            </div>
            <div class="summary_list space" v-if="value.typeName==='groupDate' && item.values.length===1"> 
                <div>
                    <p><span class="summary_tab" style="-webkit-box-orient: vertical">总时长</span><span class="colon">：</span></p>
                    <div class="text">
                        <span>{{JSON.parse(value.value).days}}天{{JSON.parse(value.value).hours}}小时{{JSON.parse(value.value).minutes}}分钟</span>
                    </div>
                </div>
                
            </div>
        </div>
        <!-- 紧急标签 -->
        <div class="sendTime">
            <span v-if="entryType==1 && tabType==0">{{item.approves.utime | formatDate}}</span>
            <span v-else>{{ item.approves.ctime | formatDate}}</span>
            <span >
                <span class="degree urgent" v-if="item.approves.urgencyLevel===1 && isShowUrgent">较紧急</span>
                <span class="degree very_urgent" v-if="item.approves.urgencyLevel===2 && isShowUrgent">很紧急</span>
            </span>
        </div>
        <!-- 审批状态 -->
        <div class="status" v-if="!isShowUrgent">
            <span class="approve_status doing" v-if="isShowApproving">审批中</span>
            <span class="approve_status pass" v-if="item.approves.status===2">已通过</span>
            <span class="approve_status unapproved" v-if="item.approves.status===3">未批准</span>
            <span class="approve_status cancel" v-if="item.approves.status===4">已撤销</span>

            <span class="degree urgent" v-if="item.approves.urgencyLevel===1 && !isShowUrgent">较紧急</span>
            <span class="degree very_urgent" v-if="item.approves.urgencyLevel===2 && !isShowUrgent">很紧急</span>
        </div>
    </div>
</template>

<script>
    import format from 'common/js/dateformat';
    export default{
        props: {
            item: {
                type: Object
            },
            entryType: { // 0 - 我已审批 待我审批入口 ,1 - 我发起的入口
                type: Number
            },
            tabType: { // 0-待我审批  1-我已审批  ,,, 0-草稿 1-我发起的  2-已归档
                type: Number
            }
        },
        data(){
            return {
                itemArr2:[],
                valuesArr:[],
                checkboxNum:[],
            }
        },
        computed:{
            isShowApproving(){
                let status = this.item.approves.status;
                if(status ===1){
                    if(this.entryType===0 && this.tabType === 0 || this.entryType===1 && this.tabType === 0){
                        return false;
                    }else {
                        return true;
                    }
                }
            },
            isShowUrgent(){
                if(this.entryType===0 && this.tabType === 0 || this.entryType===1 && this.tabType === 0){
                    return true;
                }else {
                    return false;
                }
            },
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
            }
        },
        filters: {
            typeChange(data){
                alert(data)
                return JSON.parse(data);
            },
            formatDate (date) {
                Date.prototype.Format = format;
                return new Date(Number(date)).Format('yyyy-MM-dd HH:mm');
            },
            formatDate2 (date) {
                Date.prototype.Format = format;
                return new Date(Number(date)).Format('yyyy-MM-dd');
            },
            formatYear (str) { // 格式化 年-月-日
                // alert(typeof str)
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
        },
        methods:{
            checkboxCount(){
                for(let i = 0; i <this.valuesArr.length; i++){
                    if(this.valuesArr[i].typeName=='checkbox'){
                        let aa=this.valuesArr[i].value.split(',');
                        // console.log(aa);
                        for(let j=0;j<aa.length;j++){
                            if(aa[j]>-1){
                                this.checkboxNum.push(aa[j]);
                                // console.log(this.checkboxNum)
                            }
                        }
                    }
                }
            },
        },
        created(){

            let values = this.item.values
            for(let i=0; i<values.length;i++){
                if(i<3){
                    this.valuesArr.push(values[i]);
                }
            }
        },
        mounted(){
            this.checkboxCount();
            // console.log(this.entryType+"===="+this.tabType)
        }
    }
</script>

<style lang='scss' type='text/css' rel='stylesheet/scss' scoped>
    @import '../css/index';

    .item {
        display: inline-block;
        width: 100%;
        box-sizing: border-box;
    }

    .notify-time{
        text-align: center;
    }
    .content{
        font-size:0.16rem;
        background: #fff;
        box-sizing: border-box;
        padding: 0.205rem 0 0.2rem 0;
        .content_title{
            max-height: 0.4rem;
            font-family: PingFangSC-Regular;
            font-size: 0.16rem;
            color: #333333;
            line-height: 0.2rem;

            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            margin-bottom: 0.065rem;
        }
        .summary{
            width: 100%;
            font-family: PingFangSC-Regular;
            font-size: 0.14rem;
            color: #999999;
            display: inline-block;
            height: auto;
            .summary_list{
                width: 100%;
                padding-top: 0.015rem;
                position: relative;
                overflow: hidden;
                &.space{
                    margin-top: 0.02rem
                }
            }
            p{
                position: relative;
                float: left;
                width: 0.7rem;
                text-align:right;
                vertical-align: middle;
                /*background: red;*/
                span{
                    line-height: 17px;
                    float: left;
                }
                .summary_tab{
                    width: 0.56rem;
                    line-height: 0.17rem;

                    display: -webkit-box;
                    text-overflow: ellipsis;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                    /*background: red;*/
                }
                .colon{
                    display: inline-block;
                    width: 0.12rem;
                    text-align: right;
                    height: 0.16rem;
                    line-height: 0.15rem;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    right: 0;
                    margin: auto;
                    /*background: green;*/
                }
            }
            .text{
                position: absolute;
                top: 50%;
                margin-top: -.07rem;
                width: 100%;
                padding-left: .7rem;
                vertical-align: middle;
                box-sizing: border-box;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;

                span{
                   line-height: 0.17rem; 
                   /*background: yellow;*/
                }
                .text_radio{
                    vertical-align: middle;
                    box-sizing: border-box;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
            }
        }
        .sendTime{
            font-family: PingFangSC-Regular;
            font-size: 0.12rem;
            color: #C5C5C5;
            margin-top: 0.08rem;
        }
        .status{
            margin-top: 0.08rem;
            .approve_status{
                font-family: PingFangSC-Regular;
                font-size: 0.14rem;
                &.doing {
                    color: #f1991a;
                }
                &.pass{
                    color: #68C6AA;
                }

                &.unapproved {
                    color: #F06767;
                }

                &.cancel {
                    color: #CCCCCC;
                }
            }
        }
        .degree{
            float: right;
            font-family: PingFangSC-Regular;
            font-size: 0.1rem;
            letter-spacing: 0;
            border-radius:0.16rem;
            padding: 0.01rem 0.05rem;
            &.urgent{
                color: #F1B20B;
                border: 1px solid #F1B20B;
            }
            &.very_urgent{
                color: #FE6800;
                border: 1px solid #FE6800;
            }
        }
    }

</style>
