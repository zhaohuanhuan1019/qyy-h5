<template>
	<div class="notify-warpper" id="notify-warpper">
		<my-header :title='title' :go='go' class='my_header'></my-header>
		<div class='overtime_warpper' v-show='overtime' @click='reload'><div class='overtime'><i></i><p>加载失败，点击加载</p></div></div>
		<div class='content' id="content" v-show='!overtime'>
			<v-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore"> 
			    <ul class="list" id="myUl">
				        <li v-for="(val, key) in noReadlists">
				        	<div class="notify-time" v-if="noRead_isShowTimeArr[key]==true">{{val.sendTime | filterTime}}</div>
				          	<approval-notify :list="val"></approval-notify>
				        </li>
				        <p class="history_line" v-if="Readlists.length != 0 && noReadlists.length!=0">以上为新通知</p>
				        <li v-for="(val, key) in Readlists">
				        	<div class="notify-time" v-if="Read_isShowTimeArr[key]==true">{{val.sendTime | filterTime}}</div>
				          	<approval-notify :list="val"></approval-notify>
				        </li>
			    </ul>  
		    </v-loadmore>
			<div class="noData" v-if="noData"><i></i><span>暂无数据</span></div>
			<div class="noRead" v-if="noRead && noReadNum!==0 && noReadNum!==''" @click="quick_position">{{noReadNum}}条新通知<span class="dot-bottom"></span></div>
		</div>
	</div>
</template>

<script>
	import { Loadmore } from 'mint-ui';
	// import mock from '../../../../mock/mock.js';
	import myHeader from 'notifyRemain/components/header/header';
	import approvalNotify from 'notifyRemain/components/approval_notify/approval_notify';
	import noticeNotify from 'notifyRemain/components/notice_notify/notice_notify';

	import jsBridge from 'common/js/jsbridge'; // 引入jsBridge
	var getAllApi = '/message/messageList';//工作通知 - 获取消息列表

	export default{
		data(){
			return {
				go: 'app',
				title: '工作通知',
				total_lists:[],
				noReadlists:[],
				noReadIdArr:[],
				Readlists:[],
				noReadNum:'',
				allLoaded: false, 　　//若为真,则 bottomMethod 不会被再次触发
				presentPage:1, //代表当前页
				pageSize:20,
				noData:false,
				noRead:false,
				time_stamp:0,
				moreTime_stamp:0,
				loadType:0,
				moduleName:'',
				moduleType:'我是moduleType初始值',
				noRead_isShowTimeArr:[],
				Read_isShowTimeArr:[],
				time_out:5000,
				overtime:false,
				quickPosition:false,
			}
		},
		computed:{
		},
		components: {
            approvalNotify,
            noticeNotify,
            myHeader,
            'v-loadmore':Loadmore,
        },
        filters:{
        	filterTime(item){
        		let lastTime = item; //后台传过来的毫秒数
        		//获得今天零点的时间戳
        		let today = new Date();
        		let nowYear = today.getFullYear();     //获取完整的年份(4位,1970-????)
				let todaymonth = today.getMonth()+1;   //获取当前月份(0-11,0代表1月)
				let todayday = today.getDate();        //获取当前日(1-31)
				// var todayTime = today.getTime();       //获取当前时间(从1970.1.1开始的毫秒数)
				var todayTime = new Date(new Date().setHours(0, 0, 0, 0)) / 1000*1000;       //获取当前时间(从1970.1.1开始的毫秒数)
				// 昨天零点时间戳
			    var yesterdayTime = todayTime - 1000 * 60 * 60 * 24; //一天是86400秒 
			    // 一周之内零点时间戳
			    var oneWeekTime = todayTime - 1000 * 60 * 60 * 24 * 6;

				// 转化后台时间戳
        		let lastTimes = new Date(lastTime);
        		// let lastYear=lastTimes.getYear();    //获取当前年份(2位)
				let lastYear = lastTimes.getFullYear(); //获取完整的年份(4位,1970-????)
				let month = lastTimes.getMonth()+1;     //获取当前月份(0-11,0代表1月)
				month<10?month ='0'+month:month; 
				let day = lastTimes.getDate();          //获取当前日(1-31)
				day<10?day ='0'+day:day;
				let weekDay = lastTimes.getDay();       //获取当前星期X(0-6,0代表星期天)
				let hour =lastTimes.getHours(); 		//获取当前小时
				hour<10?hour ='0'+hour:hour;
				let minutes =lastTimes.getMinutes();    //获取当前分钟
				minutes<10?minutes ='0'+minutes:minutes;

				//swich星期
				switch(weekDay)
				{
					case 0:
					  weekDay="星期日";
					  break;
					case 1:
					  weekDay="星期一";
					  break;
					case 2:
					  weekDay="星期二";
					  break;
					case 3:
					  weekDay="星期三";
					  break;
					case 4:
					  weekDay="星期四";
					  break;
					case 5:
					  weekDay="星期五";
					  break;
					case 6:
					  weekDay="星期六";
					  break;
				}

				// var timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000*1000;
				//一天是86400秒   故n天前的时间戳为
				// var ThreeDayAgo = timeStamp - 86400 * n;
				// console.log(timeStamp+'====timeStamp');

				// 今天
			    if (lastTime > todayTime) {
				    return hour+':'+minutes;
			    }
			    // 昨天
			    if (lastTime < todayTime && lastTime >= yesterdayTime) {
			        return '昨天'+' ' + hour+ ':' + minutes;
			    }
			    // 一周内
			    if (lastTime < yesterdayTime && lastTime >= oneWeekTime) {
			        return weekDay +' ' + hour+ ':' + minutes;
			    }
			    // 一周之外 且今年内
			    if (lastTime < oneWeekTime && nowYear == lastYear) {
			        return month+'/'+day+' '+ hour+ ':' + minutes;
			    }
			    // 早年
			    if (lastTime < oneWeekTime && nowYear > lastYear) {
			        return lastYear+'/'+month+'/'+day+' '+ hour+ ':' + minutes;
			    }
			}
        },
        created (){
        },
        methods: {
        	reload(){
        		window.location.reload();
        	},
        	getCardInfo(){
        		let self = this;
        		return new Promise(function (resolve, reject) {
        			jsBridge.getHeader().then((value) => {
	        			let header =value;
	        			jsBridge.GetAttendanceDate().then(function (value) {
		        			self.$http({
					            method: 'GET',
					            url: '/message/getCardInfo',
					            params: {
					            	'cid': value.companyId
					            },
					            headers: header,
				              	timeout: self.time_out
				            }).then((res)=>{
				            	res= res.body;
				            	if(res.code == 0){
				            		if(res.data.module){
				            			self.moduleName = res.data.module.moduleName;
				            			self.moduleType = res.data.module.moduleType;
				            			resolve('我得到卡片信息le');
				            		}else {
				            			resolve('我mei得到卡片信息');
				            		}
				            	}
				            },(err)=>{
				          		self.overtime = true;
				          	});
		        		})
	        		});
        		});
        	},
        	/*下拉刷新方法--start*/
		    async loadTop() {
		    	this.noRead = false;//上拉加载时气泡按钮隐藏			
		    	/*改变传参--start*/
			    	this.time_stamp = 0;
			    	this.loadType = 1;
		    	/*改变传参--end*/

		    	// alert("刷新之前页面上已经有===="+this.total_lists.length+"条")
		    	let exitLength =this.total_lists.length;
		    	this.total_lists = [];
		    	this.noReadlists = [];
		    	this.Readlists = [];
		    	let bbb =await this.getDate(1,this.pageSize);
		    	// alert("下拉刷新后页面上有==="+bbb+"条数据c")
				this.$refs.loadmore.onTopLoaded();// 加载更多数据
			},
			/*下拉刷新方法--end*/
			/*上拉加载方法--start*/
			async loadBottom() {
				/*改变传参--start*/
				  this.time_stamp = this.total_lists[0].sendTime;//替换时间戳
				  this.loadType = 0;
				/*改变传参--end*/
			    this.$refs.loadmore.onBottomLoaded();
			    /*每触发上拉加载时页面++，调用请求接口*/
					this.presentPage++;
					let aaa=await this.getDate(this.presentPage,this.pageSize);
					// alert("目前页面上已经有==="+aaa+"条") //弹出请求
			    /*每触发上拉加载时页面++，调用请求接口*/
			},
			/*上拉加载方法--end*/
			getDate(page,num){
				let GetAttendanceDate = window.GetAttendanceDate;
				let self = this;
				return new Promise(function (resolve, reject) {
					self.$http({
			            method: 'GET',
			            url: getAllApi,
			            params: {
			            	'cid': GetAttendanceDate.companyId,
			              	'time':self.time_stamp,//当前时间戳，查询全部时为0
			              	'loadType':self.loadType,//值为1时为加载更多
			              	'moduleName':self.moduleName,//卡片名
			                'pageNo': page,//第几页
			                'pageSize': num //第几页请求多少条
			            },
			            headers: window.headers,
		              	timeout:self.time_out
		            }).then((res)=>{
		             if(res.body.code==0){
		             	if(self.time_stamp == 0){
		             		self.noReadNum = res.body.data.enReadCount;//后台返回的未读数
		             	}
		             	
		             	let myList = res.body.data.list;
		               	if(myList.length!=0){
			               	for (var i=0;i<myList.length;i++) {
			               		/*处理已读未读列表  --start*/
				               		if(myList[i].isRead == false){
				               			self.noReadlists.push(myList[i]);
				               			self.noReadIdArr.push(myList[i].id);
				               		}else {
				               			self.Readlists.push(myList[i]);
				               		}
			               		/*处理已读未读列表  --end*/
			                 	self.total_lists.push(myList[i]);
			               	}
			               	/*调用时间显示，初始化、上报方法--start*/
				               	self.isShowTime();
	                			self.init();
	                			self.readReport();//上报已读方法
                			/*调用时间显示，初始化、上报方法--end*/
		                	resolve(self.total_lists.length);
		                }else{
		               		console.log('返回的没有数据');
		               		resolve(self.total_lists.length);
		               		self.allLoaded = true;// 若数据已全部获取完毕,就不让触发上拉加载的行为了
		                }
		             }
		          	},(err)=>{
		          		self.overtime = true;
		          	});
			  	})
			},
			async quick_position(){
				this.quickPosition = true;
				let exitLength = this.total_lists.length;
				let lastNum = this.noReadNum;
				/*改变传参--start*/
					this.time_stamp = this.noReadlists[0].sendTime;//替换时间戳
					this.loadType = 1;
				/*改变传参--end*/
				if(exitLength<this.noReadNum){//判断页面上消息小于未读数时（eg:页面已存在的20条小于32条未读数）
					/*点击快速定位触发请求数据接口*/
						this.pageSize=this.noReadNum-exitLength; //第二页要请求的条数（多少条未读-已经加载出来的20条)
						let listsLength= await this.getDate(this.presentPage,this.pageSize);//等待数据加载
						this.noRead = false;
					/*点击快速定位触发请求数据接口*/
				}
				this.noRead = false;
				this.$nextTick(()=>{
			       let myLi=document.getElementsByTagName('li');
					let index = lastNum-1;
					console.log(myLi);//myLi[index]代表最后一条未读消息的这个元素

					/*获取计算后的元素高度*/
					var style = null;
					if (window.getComputedStyle) {
					    style = window.getComputedStyle(myLi[index], null);// 非IE
					} else { 
					    style = myLi[index].currentStyle;  // IE
					}
					let elHeight=Number(style.height.replace(/px/, ""));
					/*获取计算后的元素高度*/
					let offsetTop =myLi[index].offsetTop;
					let bodyHeight=document.body.clientHeight;
					let scrollTop = offsetTop+ elHeight-bodyHeight+44;
					console.log(offsetTop+'====='+bodyHeight+'===='+scrollTop);
					if(scrollTop>0){
						document.getElementById('content').scrollTop=scrollTop;
						console.log(document.getElementById('content').scrollTop);
					}else {
						console.log('不需要滚动的');
						// alert('不需要滚动的')
					}
			    })
			},
			scroll_position(){
				let myWarpper=document.getElementById('notify-warpper');
				myWarpper.addEventListener( "touchmove",()=>{
					if(this.total_lists.length>=this.noReadNum){
						/*获取计算后的元素高度*/
						let myLi=document.getElementsByTagName('li'); //获取所有的li元素
						if(this.noReadlists.length !=0){
							let index = this.noReadNum-1;//得到按钮上未读最后一条消息的下标
							// console.log(index)
							// console.log(myLi[index]);//myLi[index]代表最后一条未读消息的这个元素
							var style = null;
							if (window.getComputedStyle) {
							    style = window.getComputedStyle(myLi[index], null); // 非IE
							} else { 
							    style = myLi[index].currentStyle;  // IE
							}
							let elHeight=Number(style.height.replace(/px/, ""));
							/*获取计算后的元素高度*/
							let offsetTop =myLi[index].offsetTop;
							let bodyHeight=document.body.clientHeight;
							let scrollTop = myLi[index].offsetTop+ (elHeight/2)-bodyHeight+44;

							// console.log(document.getElementById('content').scrollTop +'==='+scrollTop)
							if(document.getElementById('content').scrollTop>scrollTop){
								// console.log('要把按钮隐藏了啊');
								this.noRead = false;
							}
						}
					}else{
						console.log("页面存在的数量小于未读数")
					}
				},false );
			},
			async isShowTime(){
				let self = this;
				let fiveMin = 5 * 60000;
				/*处理未读列表时间是否显示--start*/
				this.noRead_isShowTimeArr=[];
				if(self.noReadlists.length!=0){
					let timeNode=self.noReadlists[0].sendTime-fiveMin;
					for(let i=0;i<self.noReadlists.length;i++){
						// console.log(new Date(self.noReadlists[i].sendTime))
						if(i>0){
							if(self.noReadlists[i].sendTime< timeNode){
								timeNode=self.noReadlists[i].sendTime-fiveMin;
								self.noRead_isShowTimeArr.push(true);
							}else{
								self.noRead_isShowTimeArr.push(false)
							}
						}else{
							self.noRead_isShowTimeArr.push(true)
						}
					}
					console.log(self.noRead_isShowTimeArr,'noRead_isShowTimeArr++'+self.noRead_isShowTimeArr.length)
				}
				/*处理未读列表时间是否显示--end*/
				

				/*处理已读列表（历史消息）时间是否显示--start*/
				this.Read_isShowTimeArr = [];
				if(self.Readlists.length!=0){
					let timeRound=self.Readlists[0].sendTime-fiveMin;
					for (let i = 0; i < self.Readlists.length; i++) {
						// console.log(new Date(self.Readlists[i].sendTime))
						if (i > 0) {
							if (self.Readlists[i].sendTime< timeRound) {
								timeRound=self.Readlists[i].sendTime-fiveMin;
								self.Read_isShowTimeArr.push(true)
							} else {
								self.Read_isShowTimeArr.push(false)
							}
						} else {
							self.Read_isShowTimeArr.push(true);
						}
					}
					console.log(self.Read_isShowTimeArr, 'Read_isShowTimeArr--' + self.Read_isShowTimeArr.length)
				}
				/*处理已读列表（历史消息）时间是否显示--end*/
			},
			async init(){
				let bodyHeight=document.body.clientHeight;
				let exitLength = this.total_lists.length;
				
				let index = exitLength-1;
				if(index>=0){
					setTimeout(()=>{
						let myLi=document.getElementsByTagName('li'); //获取所有的li元素
						// console.log(myLi,'===========================');
						var style = null;
						if (window.getComputedStyle) {
						    style = window.getComputedStyle(myLi[index], null);    // 非IE
						} else { 
						    style = myLi[index].currentStyle;  // IE
						}

						let elHeight=Number(style.height.replace(/px/, ""));

						/*获取计算后的元素高度*/
						/*处理未读消息有无超出一屏的处理--start*/
							let noreadLength = this.noReadlists.length;
							if(noreadLength>0){
								let noReadLi_offsetTop =myLi[noreadLength-1].offsetTop+elHeight+44;

								// alert(noReadLi_offsetTop+'=='+document.body.clientHeight)
								if(noReadLi_offsetTop>document.body.clientHeight){//如果页面存在的未读列表超出屏幕高度
									if(this.time_stamp==0 && this.loadType==1 ||this.quickPosition == true){//下拉和快速定位的时候
										this.noRead = false;
									}else {
										this.noRead = true;
									}
								}else{
									this.noRead = false;
								}
							}else {
								this.noRead = false;
							}
						/*处理未读消息有无超出一屏的处理--end*/


						/*处理所有通知未超出一屏的处理--start*/
							let myLi_offsetTop =myLi[index].offsetTop+elHeight+44;
							console.log(myLi_offsetTop+'+++'+document.body.clientHeight)
							if(myLi_offsetTop<document.body.clientHeight){//如果页面存在的最后一个元素没有超出屏幕高度
								console.log('把下拉加载操作关闭s');
								this.allLoaded = true;// 把下拉加载操作关闭
							}
						/*处理所有通知未超出一屏的处理--end*/
					},200)
				}
			},
			readReport(){
                let self = this;
                jsBridge.getHeader().then((value) => {
                    let header =value;
                    jsBridge.GetAttendanceDate().then(function (value) {
                        self.$http({
                            method: 'POST',
                            url: '/message/readMessage',
                            body: JSON.stringify({
                                'cid': value.companyId,
                                'moduleType':self.moduleType,
                                "messageIds":self.noReadIdArr,
                            }),
                            headers: header,
                            timeout: self.time_out
                        }).then((res)=>{
                            res= res.body;
                            if(res.code == 0){
                               	console.log('上报成功了le');
                            }
                        },(err)=>{
			          		self.overtime = true;
			          	});;
                    })
                }) 
            }
		},
		mounted(){
			(async ()=> {
				let aaa=await this.getCardInfo();
                let listsLength=await this.getDate(this.presentPage,this.pageSize);
                if(listsLength ==0){
                	this.noData = true;
                }
                // alert("实例加载完成后mounted页面存在==="+listsLength+'条数据');
                this.scroll_position();
            })();
		}
	}
</script>

<style lang='scss' type='text/css' rel='stylesheet/scss' scoped>	
@import '../../../common/css/mixin';
	.notify-warpper{
		width: 100%;
		min-height: 100%;
		box-sizing: border-box;
		font-size:0.16rem;
		background: #F3F4F5;
		position: fixed;
		left: 0;
		top:0;
		.my_header{
			position: fixed;
	        top:0;
	        left: 0;
		}
		.overtime_warpper{
			width: 100%;
			position: absolute;
			left: 0;
			top:0.44rem;
			height: 94%;
			.overtime{
				width:1.26rem;
				text-align: center;
				font-size: 0;
				margin:0 auto;
				margin-top: 1.8rem;
				i{
					display: inline-block;
					width: 1rem;
					height: 1rem;
					@include bg-image('../../../../static/image/overtime');
					background-size: 100%;
				}
				p{
					font-family: PingFangSC-Regular;
					font-size:0.14rem;
					color: #999999;
					letter-spacing: 0;
					line-height: 0.19rem;
					margin-top: 0.19rem;
				}
			}
		}
		.content{
			width: 92%;
			padding: 0 0.16rem;
			position: absolute;
			left: 0;
			top:0.44rem;
			height: 94%;
			overflow-y: scroll;
			&::-webkit-scrollbar {
			    width: 0px;
			}
		}
		.notify-time{
			text-align: center;
			padding-top: 0.15rem;
			font-family: PingFangSC-Regular;
			font-size: 0.12rem;
			color: #AAAAAA;
		}
		.noData{
			width: 1.14rem;
			text-align: center;
			margin:0 auto;
			margin-top: 1.43rem;
			i{
				width: 1.14rem;
				height: 1.29rem;
				display: inline-block;
				background: url('../../../../static/image/null@2x.png');
				background-size:100% 100%;	
			}
			@media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
	          	i {
	            	background-image: url('../../../../static/image/null@3x.png');
	          	}
	        }
			span{
				display: inline-block;
				line-height: 0.25rem;
				font-family: PingFangSC-Regular;
				font-size: 0.18rem;
				color: #999999;
				margin-top: 0.07rem;
			}	
		}
		.noRead{
			background: rgba(0,0,0,0.5);
			border-radius: 0.16rem;
			position: fixed;
			right: 0.16rem;
			bottom: 0.16rem;
			padding: 0.07rem 0.2rem;

			font-family: PingFangSC-Regular;
			font-size: 0.12rem;
			color: #FFFFFF;
			/* 向下的箭头 */  
			.dot-bottom {  
			    font-size: 0;  
			    line-height: 0;  
			    border-width: 0.1rem;  
			    border-color: rgba(0,0,0,0.5);
			    border-bottom-width: 0;  
			    border-style: dashed;  
			    border-top-style: solid;  
			    border-left-color: transparent;  
			    border-right-color: transparent; 
			    position: absolute;
			    bottom: -0.094rem;
			    left: 50%;
			    margin-left: -0.09rem

			}
		}
		.history_line{
			text-align: center;
			font-family: PingFangSC-Regular;
			font-size: 0.12rem;
			color: #AAAAAA;
			padding: 0.15rem 0;
			position: relative;
			&:before,&:after{
				background:#AAAAAA;
				content: '';
				width: 1rem;
				height: 0.015rem;
				position: absolute;
				top: 50%;
			}
			&:before{
				left: 0.2rem;
			}
			&:after{
				right: 0.2rem;		
			}
		}
	}
</style>