<template>
	<div class="approvalList-warpper">
		<!-- <div class="notify-time">{{list.notice.sendtime}}</div> -->
		<div class="abstract-warpper">
			<div class="title">审批</div>
			<div class="content">
				<div class="content_title" style="-webkit-box-orient: vertical">{{list.title}}</div>
				<div class="summary">
					<!-- 只有一个日期起止组件 start-->
					<div  class="summary_list" v-if="content.length == 1 && content[0].elementId == 8">
						<p><span class="summary_tab" style="-webkit-box-orient: vertical">开始时间</span><span class="colon">：</span></p>
						<div class="text">
							{{JSON.parse(content[0].detail).beginDate | formatYear}}
							<span v-if="content[0].format=='yyyy-MM-dd HH:mm'">{{JSON.parse(content[0].detail).beginTime | formatTime}}</span>
						</div><br/>
					</div>
					<div  class="summary_list" v-if="content.length == 1 && content[0].elementId == 8">
						<p><span class="summary_tab" style="-webkit-box-orient: vertical">结束时间</span><span class="colon">：</span></p>
						<div class="text">
							{{JSON.parse(content[0].detail).endDate | formatYear}}
							<span v-if="content[0].format=='yyyy-MM-dd HH:mm'">{{JSON.parse(content[0].detail).endTime | formatTime}}</span>
						</div><br/>
					</div>
					<div  class="summary_list" v-if="content.length == 1 && content[0].elementId == 8">
						<p><span class="summary_tab" style="-webkit-box-orient: vertical">总时长</span><span class="colon">：</span></p>
						<div class="text">{{JSON.parse(content[0].detail).days}}天{{JSON.parse(content[0].detail).hours}}时{{JSON.parse(content[0].detail).minutes}}分</div>
					</div>
					<!-- 只有一个日期起止组件 end-->
						
					<!-- 只有一个日期单组件 start-->
					<div  class="summary_list" v-if="content.length == 1 && content[0].elementId == 6">
						<p><span class="summary_tab" style="-webkit-box-orient: vertical">{{content[0].title}}</span><span class="colon">：</span></p>
						<div class="text">{{JSON.parse(content[0].detail) | formatDateTime(content[0].format)}}</div>
					</div>
					<!-- 只有一个日期单组件 end-->

					<!-- 只有一个非日期组件 start-->
					<div  class="summary_list" v-if="content.length == 1 && !content[0].format">
						<p><span class="summary_tab" style="-webkit-box-orient: vertical">{{content[0].title}}</span><span class="colon">：</span></p>
						<div class="text">{{content[0].detail}}</div><br/>
					</div>
					<!-- 只有一个非日期组件 end-->

					<!-- 表单有两个以及以上个组件 start-->
					<div class="summary_list" v-if="content.length >1" v-for="(val,key) in content">
						<!-- title部分处理 start-->
							<p v-if="val.elementId!= 8"><span class="summary_tab" style="-webkit-box-orient: vertical" >{{val.title}}</span><span class="colon">：</span></p>
							<p v-else><span class="summary_tab" style="-webkit-box-orient: vertical">开始时间</span><span class="colon">：</span></p>
						<!-- title部分处理 end-->
						<!-- 内容部分 start-->
								<!-- 多个组件中非时间组件时 -->
							<div class="text" v-if="val.elementId!= 8 && val.elementId!= 6">{{val.detail}}</div>
								<!-- 多个组件中有单时间组件时 -->
							<div class="text" v-if="val.elementId==6">
								<span v-if="val.format">{{val.detail | formatDateTime(val.format)}}</span>
								<!-- <span v-if="val.format == 'yyyy-MM-dd'">{{val.detail | formatDateTime(val.format)}}</span> -->
							</div>
								<!-- 多个组件中有起止时间组件时 -->
							<div class="text" v-if="val.elementId== 8">{{JSON.parse(val.detail).beginDate | formatYear}}
								<span v-if="val.format == 'yyyy-MM-dd HH:mm'">{{JSON.parse(val.detail).beginTime | formatTime}}</span>
							</div>
						<!-- 内容部分 end-->
					</div>
					<!-- 表单有两个以及以上个组件 end-->
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		props: ['list'],
		data(){
			return {
			}
		},
		computed:{
			randomColor () {
                let colorArr = ['#b2dbf3', '#81dbee', '#a6e6c2', '#68c6aa', '#f8b186', '#f693bf', '#b5b4e3', '#c280d3'];
                let index = Math.floor((Math.random() * colorArr.length));
                return colorArr[index];
            },
            content(){
            	let content = JSON.parse(this.list.content);
				return content;
			},
		},
		filters: {
            formatDateTime(timeStamp,style) {//转化 yyyy-MM-dd HH:mm 和 yyyy-MM-dd
			    var date = new Date();  
			    date.setTime(timeStamp);  
			    var y = date.getFullYear();      
			    var m = date.getMonth() + 1;      
			    m = m < 10 ? ('0' + m) : m;      
			    var d = date.getDate();      
			    d = d < 10 ? ('0' + d) : d;      
			    var h = date.getHours();    
			    h = h < 10 ? ('0' + h) : h;    
			    var minute = date.getMinutes();    
			    var second = date.getSeconds();    
			    minute = minute < 10 ? ('0' + minute) : minute;      
			    second = second < 10 ? ('0' + second) : second; 
			    if(style == 'yyyy-MM-dd HH:mm') {
			    	return y + '-' + m + '-' + d+' '+h+':'+minute;
			    }else {
			    	return y + '-' + m + '-' + d;
			    }   
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
        },
		methods:{
		},
		mounted(){
			// console.log(this.content);
		}
	}
</script>

<style lang='scss' type='text/css' rel='stylesheet/scss' scoped>
	.approvalList-warpper{
		font-size:0.16rem;
		background: #fff;
		margin-top: 0.15rem;
		border-radius: 0.04rem;
		.notify-time{
			text-align: center;
		}
		.abstract-warpper{
			box-sizing: border-box;
			.title{
				box-sizing: border-box;
				font-family: PingFangSC-Regular;
				font-size: 0.14rem;
				color: #666666;
				padding:0.07rem 0.1rem;
    			border-bottom: 1px solid #EEEEEE;
			}
			.content{
				margin-top: 0.19rem;
				/*padding-bottom: 0.2rem;*/
				padding:0 0.1rem 0.2rem 0.1rem;
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
					margin-bottom: 0.02rem;
				}
				.summary{
					font-family: PingFangSC-Regular;
					font-size: 0.14rem;
					color: #999999;
					.summary_list{
						padding-top: 0.04rem;
					}
					p{
						width: 0.7rem;
						display: inline-block;
						text-align:right;
						vertical-align: middle;
						position: relative;
						.summary_tab{
							line-height: 0.17rem;
							width: 0.56rem;
						    display: -webkit-box;
						    text-overflow: ellipsis;
						    -webkit-line-clamp: 2;
						    overflow: hidden;
						    /*background: red;*/
						}
						 .colon{
							display: inline-block;
    						width: 0.12rem;
    						text-align: right;
    						height: 0.165rem;
    						line-height: 0.15rem;
    						position: absolute;
							top: 0;
							bottom: 0;
							right: 0;
							margin: auto;
							/*background: pink;*/
						} 
					}
					.text{
						display: inline-block;
						vertical-align: middle;
    					width: 2.48rem;
    					line-height: 0.17rem;
    					overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
						/*background: yellow;*/
					}
				}
			}
		}
	}
	
</style>