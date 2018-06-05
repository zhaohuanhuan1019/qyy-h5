<template>
    <div class="head-wrapper">
        <span class='back_warpper'><i class="back" v-if="title_tip!=='没有访问权限'" @click="backTo"></i></span>
        <span class="title">{{ title_tip }}</span>
        <span class='calendar_warpper'><i class="calendar" v-if="title_tip=='考勤打卡'" @click="calendar"></i></span>
        
    </div>
</template>

<script>
    import jsBridge from 'common/js/jsbridge';
    import {mapState,mapMutations,mapGetters,mapActions} from 'vuex';
    export default {
        props: ['title'],
        data () {
            return {
                isShowCalendar: true,
            };
        },
        computed:{
            /*从公共状态中拿到的数据--start*/
                title_tip(){
                    return this.$store.state.attence.title_tip;
                },
                isShowregister(){
                    return this.$store.state.attence.isShowregister;
                },
            /*从公共状态中拿到的数据--end*/
        },
        methods: {
            ...mapMutations([
            	'change_calendarClicked',
                'change_whichRouterPath'
            ]),
            ...mapActions([
            	'change_circleAction',
                'change_titleTipAction',
                'change_registerAction',
            ]),
            backTo () {
                if (this.title_tip == '考勤打卡') {
                    // alert('我要跳app页面了');
                    jsBridge.requestBack().then(function () {
                    });
                } else{
                    this.$router.go(-1);
                    this.change_titleTipAction('考勤打卡');
                    this.change_whichRouterPath('clock');
                    this.change_registerAction(false);
                }
            },
            calendar () {
                this.change_calendarClicked(true);
                this.$router.push({path:'/calendar'}); // 跳转路由
                this.change_whichRouterPath('calendar');
            }
        },
        mounted () {
        }
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    @import '../../../common/css/mixin';

    .head-wrapper {
        width: 100%;
        height: .44rem;
        min-height:.44rem;
        position: relative;
        background-color: #4590E4;
        line-height: .44rem;
        color: #ffffff;
        .back_warpper{
            display: inline-block;
            width: 10%;
            height: 0.44rem;
            float: left;
            font-size: 0;
            position: relative;
            .back {
                display: inline-block;
                width:0.17rem;
                height: 0.17rem;
                position: absolute;
                left: 0.185rem;
                right: 0;
                bottom: 0;
                top:0;
                margin:auto;
                @include bg-image('../../../../static/attence-image/return');
                background-repeat: no-repeat;
                background-size: .09rem .16rem;
                background-position: center;
            }
        }
        .title {
            text-align: center;
            float: left;
            width:80%;
            height: 0.44rem;
            font-size: .18rem;
        }
        .calendar_warpper{
            display: inline-block;
            width: 10%;
            height: 0.44rem;
            float: right;
            position: relative;
            .calendar {
                display: inline-block;
                width:0.19rem;
                height: 0.19rem;
                position: absolute;
                left: 0;
                bottom: 0;
                top:0;
                margin:auto;
                @include bg-image('../../../../static/attence-image/calendar');
                background-repeat: no-repeat;
                background-size:100%; 
                background-position: right;
            }
        }
    }
</style>
