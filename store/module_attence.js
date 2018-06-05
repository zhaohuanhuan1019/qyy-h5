// 引入 axios
import axios from 'axios';
import jsBridge from 'common/js/jsbridge'; // 引入jsBridge

export default{
	state:{
		popUp:{
			isShow:false,
        	showText:['初始值'],
        	count:5
		},
		initTime:'',
		sureTime:'我是sureTime初始值',//确认的打卡时间
		firstClockTime:'－－',//上班打卡数据
		secondClockTime:'我是secondClockTime初始值',//下班打卡数据
		circle_disable:false,//默认circle是可点击状态
		isShowCircle:true,//circle是否显示
		isShowregister: false,//签到数据元素是否显示
		isShowLoading:false,//是否显示loading
		beforeClick_clockCommute:'我是点击什么卡的初始值',//点击的是什么卡
		clockConfirm:{
			isShow:false,
		},
        whichRouterPath:'clock',//哪一个路由path
		morningNight:{
			isShow:false,
		},
        isDateErr:false,//是否是服务器接口错误
		isShowUpdateClick:true,//是否显示更新打卡按钮
        isShowNoPermission:false,//是否显示没有权限弹窗
        isShowfile: false,//加载失败页面
		isHasPlan:true,//是否有考勤方案
		isActive:false,//光效显示与不显示
		clockStatus:'我是clockStatus初始值',// 打卡异常状态（迟到，早退）
		clockCommute:'我是clockCommute初始值',// 代表上下班标示
		listData:'我是初始值',
		workDay:'我是初始值workDay',
		sysTimes: '我是实时获取系统de初始值', // 是通过gettime方法来实时获取系统的时分秒
		positioning: false,    // 正在定位状态
		positionTrue: false,   // 定位成功状态
		positionWrong:false,    // 定位失败状态
		loadfail: false,
		enterTrue: true,
		addressName: [], // 所有考勤地点的名称
		schemeTime: '我是考勤时间初始值',//考勤时间
		schemeAddressArr: [], // 存放几个有效打卡地点的信息
		timer:null,
        supplementAble: true, // 补卡按钮默认为可点击状态
        supplementShow: true, // 补卡按钮默认展示
        supplementNextDay: false, // 补卡默认不显示次日icon
        isRetroactive: false, // 补卡操作标志默认为false
        calendarClicked: false, // 在clock页面日历icon被点击了
        api: {
            commonList: '/attend/user/record/list', // list接口
            listByMonthView: '/attend/user/record/listByMonthView' // 当日所在方案周期list数据
        },
        title_tip:'考勤打卡',
    },
    mutations:{
        change_titleTip(state,date){
            state.title_tip = date;
        },
        change_whichRouterPath(state,date){
            state.whichRouterPath = date;
        },
    	change_positioning(state){
    		if(state.positioning == false){
	    		state.positioning = true;
	    	}else{
	    		state.positioning = false;
	    	}
    	},
    	change_loadfail(state){
    		if(state.loadfail == false){
	    		state.loadfail = true;
	    	}else{
	    		state.loadfail = false;
	    	}
    	},

    	change_enterTrue(state){
    		if(state.enterTrue == false){
	    		state.enterTrue = true;
	    	}else{
	    		state.enterTrue = false;
	    	}
    	},
        change_isShowfile(state,date){
             state.isShowfile = date;
        },
        change_isDateErr(state,date){
            state.isDateErr = date;
        },
        change_isShowNoPermission(state,date){
            state.isShowNoPermission = date;
        },
    	change_isShowUpdateClick(state,date){
    		state.isShowUpdateClick = date;
    	},
    	change_isShowLoading(state,date){
    		state.isShowLoading = date;
    	},
    	change_circle_disable(state,date){
    		state.circle_disable = date;
    	},

    	change_positionTrue(state){
    		if(state.positionTrue == false){
	    		state.positionTrue = true;
	    	}else{
	    		state.positionTrue = false;
	    	}
    	},
    	change_positionWrong(state, status){
            state.positionWrong = status;
    	},
        change_sysTimes (state) {
            let myDate = new Date();
            let h = myDate.getHours();
            let m = myDate.getMinutes();
            let s = myDate.getSeconds();
            if (h < 10) {
                h = '0' + h;
            }
            if (m < 10) {
                m = '0' + m;
            }
            if (s < 10) {
                s = '0' + s;
            }
            state.sysTimes = h + ':' + m + ':' + s;
            setInterval(() => {
                let myDate = new Date();
                let h = myDate.getHours();
                let m = myDate.getMinutes();
                let s = myDate.getSeconds();
                if (h < 10) {
                    h = '0' + h;
                }
                if (m < 10) {
                    m = '0' + m;
                }
                if (s < 10) {
                    s = '0' + s;
                }
                state.sysTimes = h + ':' + m + ':' + s;
            }, 1000);
        },
        change_isHasPlan(state){
        	if(state.isHasPlan==false){
	           state.isHasPlan=true;
	        }else{
	            state.isHasPlan=false;
	        }
        },

	    change_popIsShow(state, status){
           state.popUp.isShow = status;
	    },
	    change_circle(state, status){
	           state.isShowCircle = status;
	    },
	    change_register(state, status){
            state.isShowregister = status;
	    },
	    change_clockConfirm(state, status){
           state.clockConfirm.isShow = status;
	    },
	    change_morningNight(state, status){
	           state.morningNight.isShow = status;
	    },
	    change_active(state,status){
	    	state.isActive = status;
	    },
	   	change_clockStatus(state,date){
	   		state.clockStatus = date;
	   	},
	   	change_workDay(state,date){
	   		state.workDay = date;
	   	},
	   	change_listData(state,date){
	   		// console.log('dfgsdfgdjghdjfh')
	   		state.listData = date;
	   	},

	   	change_popshowText(state,date){
	   		state.popUp.showText = date;
	   	},
	   	change_clockCommute(state,date){
	   		state.clockCommute = date;
	   	},
	   	change_beforeClick_clockCommute(state,date){
	    	state.beforeClick_clockCommute = date;
	    },
	   	change_initTime(state,date){
	   		state.initTime = date;
	   	},
	   	change_firstClockTime(state,date){
	   		state.firstClockTime = date;
	   	},
	   	change_secondClockTime(state,date){
	   		state.secondClockTime = date;
	   	},
	   	change_sureTime(state,date){
	   		state.sureTime = date;
	   	},
        change_supplementShow(state,date){
            state.supplementShow = date;
        },
        change_supplementAble(state, status){
            state.supplementAble = status;
        },
        change_supplementNextDay(state, status){
            state.supplementNextDay = status;
        },
        change_isRetroactive(state,status){
            state.isRetroactive = status;
        },
        change_calendarClicked(state,status) {
            state.calendarClicked = status;
        }
	},
	actions:{
        change_titleTipAction({commit},date){
            commit('change_titleTip',date);
        },
        change_isDateErrAction({commit},date){
            commit('change_isDateErr',date);
        },
		change_circle_disableAction({commit},date){
			commit('change_circle_disable',date);
		},
		change_isShowUpdateClickAction({commit},date){
			commit('change_isShowUpdateClick',date);
		},
		change_isShowLoadingAction({commit},date){
			commit('change_isShowLoading',date);
		},
		change_sysTimesAction({commit}){
	        commit('change_sysTimes');
	    },
	    change_psingAction({commit}){
	    	commit('change_positioning');
	    },
	    change_psTrueAction({commit}){
	    	commit('change_positionTrue');
	    },
        change_isShowfileAction({commit}, status){
            commit('change_isShowfile', status);
        },
	    change_psWrongAction({commit}, status){
	    	commit('change_positionWrong', status);
	    },
	    change_loadfailAction({commit}){
	    	commit('change_loadfail');
	    },
	    change_enterTrueAction({commit}){
	    	commit('change_enterTrue');
	    },
	    checkList({ dispatch, commit,state,getters}, apiType) {
		    let url;
		    if (apiType === 1) {
		        url = state.api.listByMonthView;
            } else {
                url = state.api.commonList;
            }
            // 请求list接口
            jsBridge.getHeader().then(function (value) {
                let header =value;
                let flag = Number(value.clientOs);
                jsBridge.GetAttendanceDate().then(function (value) {
                    axios({
                        url: url,
                        method: 'POST',
                        data: {
                            'srcFlag':flag,
                            'record': {
                                'cid': value.companyId,
                                'clockDate': getters.getdata_today,
                                'uid': value.staffId,
                                // 'uname': value.staffName,
                                'deptId': value.deptId,
                                // 'deptName': value.deptName
                            }
                        },
                        headers: header,
                        timeout: 5000
                    }).then((res) => {
                        res = res.data;
                        if (state.calendarClicked) {
                            return;
                        }
                        if(res.code == 0){
                            if (res.data.off && res.data.on) {
                                /*把后台返回的data存储到公共数据listData--start*/
                                commit('change_listData',res.data);
                                /*把后台返回的data存储到公共数据listData--end*/

                                /*对页面刚加载过来时有无打卡数据的展现处理--start*/
                                if(state.listData.off.clockTime == '') {//无下班数据
                                    commit('change_circle', true);//无下班数据显示打卡按钮
                                    commit('change_register', true); // 无下班数据就展示签到时间

                                    if(state.listData.on.clockTime !== ''){ //代表只有上班数据
                                        commit('change_firstClockTime',(res.data.on.clockTime).slice(0,5))
                                        commit('change_supplementShow', res.data.on.retroactive); // 是否显示补签
                                        commit('change_supplementAble', !res.data.on.retroactive); // 控制补签按钮样式 为可点击

                                        if (res.data.on.retroactive) {
                                            commit('change_supplementNextDay', res.data.on.nextDay); // 补签次日标志
                                        }
                                    } else { // 无任何打卡数据
                                        if (state.clockCommute == 2) { //  若此时为可签退时间 则显示补卡
                                            commit('change_supplementShow', !res.data.on.retroactive); // 显示补签
                                            commit('change_supplementAble', !res.data.on.retroactive); // 控制补签按钮样式 为可点击
                                        } else if (state.clockCommute == 1) { //  若此时为可签到时间 则不显示签到时间
                                            commit('change_register', false); // 无下班数据就展示签到时间
                                        }
                                    }
                                } else { // 有下班数据
                                    commit('change_register', false); // 有下班数据就隐藏签到时间
                                    commit('change_secondClockTime',(res.data.off.clockTime).slice(0,5));
                                    commit('change_circle', false);
                                    if(apiType !=1){//在打卡页面
                                        commit('change_isShowUpdateClick',true);
                                    }
                                }
                                if(apiType ==1){//在日历页面点击当天日期控制更新按钮显示与否
                                    commit('change_isShowUpdateClick',state.listData.dayOfUpdated);
                                }
                                /*对页面刚加载过来时有无打卡数据的展现处理--end*/
                            }
                        }else {
                            /*控制err弹窗显示和内容--start*/
                            commit('change_isDateErr',true)
                            commit('change_isShowfile',true)
                            /*控制err弹窗显示和内容--end*/
                        }
                    }, (res) => {
                        /*控制err弹窗显示和内容--start*/
                        commit('change_isDateErr',false)
                        commit('change_isShowfile',true)
                        /*控制err弹窗显示和内容--end*/
                    });
                });
            });
        },
	    checkClockStatus ({ dispatch, commit,state,getters}) {
            //请求打卡接口
            jsBridge.GetAttendanceDate().then(function (value) {
                axios({
                    url: '/attend/user/record/checkClockStatus',
                    data:{
                        'srcFlag':window.headers.clientOs,
                        'retroactive': state.isRetroactive,
                        'record': {
                            'cid': value.companyId,
                            'clockTime': state.sysTimes,
                            'clockDate': getters.getdata_today,
                            'clockCommute': state.clockCommute,
                            'uid': value.staffId ,
                            'uname': value.staffName,
                            'deptId': value.deptId,
                            'deptName': value.deptName
                        }
                    },
                    method: 'POST',
                    headers: window.headers,
                    timeout: 5000 //和产品沟通接口请求延迟时间
                }).then((res) => {
                    res = res.data;
                    commit('change_active',false);//光效消失
                    commit('change_isShowLoading',false);//隐藏因更新打卡显示的loading

                    if (res.code === 0) {
                        if (state.isRetroactive) { // 补卡
                            commit('change_beforeClick_clockCommute', 3); // 补卡提示标志3
                            commit('change_firstClockTime',res.data.clockTime.slice(0,5));
                            commit('change_morningNight', true);
                            dispatch('checkList', 0);
                        } else {
                            if (res.data.clockStatus == 0) { // 打卡正常
                                if(state.clockCommute == 2) { // 如果我打的是签退（就要跳到列表页，把签到时间元素隐藏）
                                    commit('change_circle', false);
                                    commit('change_secondClockTime',res.data.clockTime.slice(0,5));
                                    commit('change_isShowUpdateClick',true);

                                } else if(state.clockCommute == 1)  { // 如果我打的是签到（还要停留在圆圈页面，把签到时间元素显示）
                                    commit('change_circle', true);
                                    commit('change_firstClockTime',res.data.clockTime.slice(0,5));
                                }
                                commit('change_beforeClick_clockCommute',state.clockCommute)//打的什么卡传给弹窗组件
                                commit('change_clockCommute',res.data.clockCommute);
                                commit('change_morningNight', true);

                                dispatch('checkList', 0);
                            } else if (res.data.clockStatus == 1) { // 打卡迟到

                                commit('change_beforeClick_clockCommute', 1)//打的什么卡传给弹窗组件
                                commit('change_clockConfirm', true);//clockConfirm弹窗打开
                                commit('change_clockStatus',res.data.clockStatus);//把返回的异常标示存到公共状态中

                            } else if (res.data.clockStatus == 2) { // 打卡早退

                                commit('change_beforeClick_clockCommute',2)//打的什么卡传给弹窗组件
                                commit('change_clockConfirm', true);//clockConfirm弹窗打开
                                commit('change_clockStatus',res.data.clockStatus);//把返回的异常标示存到公共状态中
                                commit('change_isShowUpdateClick',true);

                            } else if (res.data.clockStatus == 6) { // 休息日 未按计划出勤

                                if(state.clockCommute == 2) { // 下班卡
                                    commit('change_circle', false);
                                    commit('change_secondClockTime',res.data.clockTime.slice(0,5));
                                    commit('change_isShowUpdateClick',true);

                                } else if(state.clockCommute == 1)  { // 上班卡
                                    commit('change_circle', true);
                                    commit('change_firstClockTime',res.data.clockTime.slice(0,5));
                                }
                                commit('change_beforeClick_clockCommute',state.clockCommute) //打的什么卡传给弹窗组件
                                commit('change_clockCommute',res.data.clockCommute);
                                commit('change_morningNight', true);

                                dispatch('checkList', 0);
                            }
                        }
                    } else {
                        /*改变pop弹窗提示文本--start*/
                            commit('change_popIsShow', true);// 失败弹窗显示
                            if (state.isRetroactive) {
                                commit('change_popshowText',['补卡失败，请稍后再试', '取消', '再试一次']);
                            } else {
                                commit('change_popshowText',['打卡失败，请稍后再试', '取消', '再试一次']);
                            }
                        /*改变pop弹窗提示文本--end*/
                    }
                }, (res) => {
                    commit('change_popIsShow', true);// 失败弹窗显示
                    if (state.isRetroactive) {
                        commit('change_popshowText',['补卡失败，请稍后再试', '取消', '再试一次']);
                    } else {
                        commit('change_popshowText',['打卡失败，请稍后再试', '取消', '再试一次']);
                    }
                });
            });
        },
	    mapAction({dispatch,commit,state,getters}) {
            return new Promise(function (resolve, reject) {
                // 加载地图，调用浏览器定位服务
                let map = new AMap.Map('container', {
                    resizeEnable: true,
                    zoom: 15
                });

                map.plugin('AMap.Geolocation', function () { // 利用高德的Geolocation插件进行定位
                    let geolocation = new AMap.Geolocation({ // 构造Geolocation的一个实例geolocation
                        enableHighAccuracy: true, // 是否使用高精度定位，默认:true
                        timeout: 10000,          // 超过10秒后停止定位，默认：无穷大
                        buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        zoomToAccuracy: true,      // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                        buttonPosition: 'RB',
                    });

                    map.addControl(geolocation); // 把定位实例添加到map地图上
                    geolocation.getCurrentPosition();
                    AMap.event.addListener(geolocation, 'complete', onComplete); // 返回定位信息
                    AMap.event.addListener(geolocation, 'error', onError);      // 返回定位出错信息
                });
                // 解析定位结果
                let sate = [];

                function onComplete(data) {
                   console.log(data)

                    let tips2 = document.getElementsByClassName('result');
                    for (let i=0; i<tips2.length; i++) {
                        tips2[i].innerHTML = data.formattedAddress;
                    }
                    // 考勤记录打卡 有效打卡地址的获取
                    jsBridge.getHeader().then(function (value) {
                    	let header =value;
	               		let flag = Number(value.clientOs);
	               		jsBridge.GetAttendanceDate().then(function (value) {
		                    axios({
		                        url: '/attend/user/record/initSchemeInfo',
		                        method: 'POST',
		                        data: {
		                            'srcFlag':flag,
		                            'record': {
		                                'cid': value.companyId,
		                                'clockTime': state.sysTimes,
		                                'uid': value.staffId,
		                                'uname': value.staffName,
		                                'deptId': value.deptId,
		                                'deptName': value.deptName,
		                            }
		                        },
		                        headers: header,
		                        timeout: 5000 //和产品沟通接口请求延迟时间。
		                    }).then((res) => {
		                    	let initData = res.data;
		                        if(initData.code ==0) {
                                    /*初始化时得到的上下班标示存到公共的clockCommute里面--start*/
                                        commit('change_clockCommute',initData.data.record.clockCommute);
                                        commit('change_workDay',initData.data.workDay);
                                    /*初始化时得到的上下班标示存到公共的clockCommute里面--end*/

		                            /*判断是否有考勤方案--start*/
		                                if(initData.data.schemeId==0){
		                                	/*隐藏isHasPlan--start*/
			                                	if(state.isHasPlan ==true) {
			                                		commit('change_isHasPlan');
			                                	}
		                                	/*隐藏isHasPlan--end*/


		                                    /*处理页面展现--start*/
		                                        /*正在定位隐藏--start*/
			                                        if(state.positioning == true){
			                                        	commit('change_positioning');
			                                        }
		                                        /*正在定位隐藏--end*/

		                                        /*定位成功显示--start*/
			                                        if(state.positionTrue == false){
			                                        	commit('change_positionTrue');
			                                        }
		                                        /*定位成功显示--end*/

		                                        /*定位失败隐藏--start*/
                                                    commit('change_positionWrong', false);
		                                        /*定位失败隐藏--end*/
		                                        if(state.loadfail == true){
		                                        	commit('change_loadfail');
		                                        }
		                                        if(state.enterTrue == true){
		                                        	commit('change_enterTrue');
		                                        }
		                                    /*处理页面展现--end*/

                                            /*处理无考勤方案不显示今日休息--start*/
                                                if(state.isHasPlan == false){
                                                     commit('change_workDay',true);
                                                }
                                            /*处理无考勤方案不显示今日休息--end*/

		                                }else{
		                                	/*显示isHasPlan--start*/
			                                	if(state.isHasPlan ==false) {
			                                		commit('change_isHasPlan');
			                                	}
		                                	/*显示isHasPlan--end*/
		                                }
		                            /*判断是否有考勤方案--end*/

		                            let schemeTime = state.schemeTime;
		                            schemeTime = { // 拿到考勤时间
		                                workOnBeforeTime: initData.data.workOnBeforeTime,//上班时间
		                                workOnAfterTime: initData.data.workOnAfterTime, // 开始休息时间
		                                workOffAfterTime: initData.data.workOffAfterTime,// 最晚签退时间
		                            };
		                            let workOnBeforeTimeArr =schemeTime.workOnBeforeTime.split(':'); // 切割考勤安排中的上班时间
		                            let workOnAfterTimeArr =schemeTime.workOnAfterTime.split(':'); // 切割考勤安排中的休息时间
		                            let workOffAfterTimeArr =schemeTime.workOffAfterTime.split(':'); // 切割考勤安排中的最晚签退时间


		                            function toDouble(s){
		                                return s < 10 ? '0' + s: s;
		                            };
		                           /*处理服务器返回的时间 --start*/
		                                let serverTimeArr = initData.data.record.clockTime.split(':');//切割服务器返回的时间
		                                let serverTimes = (parseInt(serverTimeArr[0]*3600)+parseInt(serverTimeArr[1]*60)+parseInt(serverTimeArr[2]))*1000 + parseInt(initData.data.record.clockDate);//服务器返回的时间戳
		                                let hour=parseInt(serverTimeArr[0]);
		                                let min=parseInt(serverTimeArr[1]);
		                                let sec=parseInt(serverTimeArr[2]);
		                                console.log('服务器时间===='+toDouble(hour) + ':' + toDouble(min));
		                                commit('change_initTime',toDouble(hour) + ':' + toDouble(min));
		                                // self.change_initTimeAction(toDouble(hour) + ':' + toDouble(min));//先给页面显示拿到的服务器时间
		                            /*处理服务器返回的时间 --end*/

		                            clearInterval(state.timer);
		                            /*定时器--start*/
		                                state.timer = setInterval(() => {
		                                   serverTimes+=1000;
		                                   let timeDiff = (serverTimes - new Date().getTime())/1000;//正值代表本地时间慢，负值代表本地时间快
                                           // console.log('服务器时间与本地时间的差值：'+timeDiff);
		                                    if(Math.abs(timeDiff)<10){//小于10s不算误差
		                                       // console.log('服务器时间与本地时间的差值：'+timeDiff);
		                                    } else if(Math.abs(timeDiff)>=10 && Math.abs(timeDiff)<60){
		                                        serverTimes = serverTimes + Math.abs(timeDiff)*1000;
		                                        let nowTime = new Date(serverTimes);
		                                        hour=nowTime.getHours();
		                                        min=nowTime.getMinutes();
		                                        sec=nowTime.getSeconds();
		                                    } else if(Math.abs(timeDiff)>60){
                                                function checkWorkDay(){
                                                    return new Promise(function (resolve, reject) {
                                                        axios({
                                                            url: '/attend/user/record/checkWorkDay',
                                                            method: 'POST',
                                                            data: {
                                                                'srcFlag':window.headers.clientOs,
                                                                'record': {
                                                                    'cid': GetAttendanceDate.companyId,
                                                                    'clockTime': state.sysTimes,
                                                                    'clockDate': getters.getdata_today,
                                                                    'uid': GetAttendanceDate.staffId,
                                                                    'uname': GetAttendanceDate.staffName,
                                                                    'deptId': GetAttendanceDate.deptId,
                                                                    'deptName': GetAttendanceDate.deptName
                                                                }
                                                            },
                                                            headers: window.headers,
                                                            timeout: 5000,
                                                        }).then((res) => {
                                                            res = res.data;
                                                            if (res.code == 0) {
                                                                serverTimeArr = res.data.record.clockTime.split(':');//切割服务器返回的时间
                                                                serverTimes = (parseInt(serverTimeArr[0]*3600)+parseInt(serverTimeArr[1]*60)+parseInt(serverTimeArr[2]))*1000 + parseInt(res.data.record.clockDate);//服务器返回的时间戳
                                                                let nowTime = new Date(serverTimes);
                                                                hour=nowTime.getHours();
                                                                min=nowTime.getMinutes();
                                                                sec=nowTime.getSeconds();
                                                                resolve(serverTimes)
                                                            }else {
                                                                /*控制err弹窗显示和内容--start*/
                                                                commit('change_isDateErr',true)
                                                                commit('change_isShowfile',true)
                                                                /*控制err弹窗显示和内容--end*/
                                                            }
                                                        }, (res) => {
                                                            /*控制err弹窗显示和内容--start*/
                                                            commit('change_isDateErr',false)
                                                            commit('change_isShowfile',true)
                                                            /*控制err弹窗显示和内容--end*/
                                                        });
                                                    })
                                                };
                                                (async ()=> {
                                                    let result=await checkWorkDay();
                                                })();
		                                    }
		                                    /*处理时间变化--start*/
		                                        sec = parseInt(sec) + 1;
		                                        if(sec>59){
		                                            min = parseInt(min) + 1;
		                                            sec = 0;
		                                        }
		                                        if(min>59){
		                                            hour = parseInt(hour) + 1;
		                                            min = 0;
		                                        }
		                                        if(hour>23){
		                                            hour = 0;
		                                        }
		                                        commit('change_initTime',toDouble(hour) + ':' + toDouble(min));
		                                        // self.change_initTimeAction(toDouble(hour) + ':' + toDouble(min));
		                                    /*处理时间变化--end*/

		                                    /*自动刷新字样开始--start*/
		                                        /*let initTime2 =hour*3600 + min*60; //定时器时间的时分的秒数
		                                        let workOnBeforeTime2 =workOnBeforeTimeArr[0]*3600+workOnBeforeTimeArr[1]*60; //上班时间的时分的秒数
		                                        let workOnAfterTime2 =workOnAfterTimeArr[0]*3600+workOnAfterTimeArr[1]*60; //休息时间的时分的秒数
		                                        let workOffAfterTime2 =workOffAfterTimeArr[0]*3600+workOffAfterTimeArr[1]*60; //最晚签退时间的时分的秒数

		                                        //console.log(initTime2+'--------'+workOnAfterTime2+'--------'+workOffAfterTime2)

		                                        if(state.workDay == true){ //在工作日下
		                                            if(initTime2 >=workOnAfterTime2 && initTime2 <workOffAfterTime2){ //代表定时器时间大于休息时间且小于最晚签退时间
		                                                if(state.clockCommute ==1){
		                                                	commit('change_clockCommute',2);// 字样该显示签退了
		                                                }
		                                            }
		                                        }*/
		                                    /*自动刷新字样结束*/
		                                },1000);
		                            /*定时器--end*/

		                            let schemeAddresses = initData.data.schemeAddresses;

		                            if(schemeAddresses.length <= 0 || schemeAddresses =='') {
		                                state.addressName = []; //说明考勤地点数组中没数据
		                                /*正在定位隐藏--start*/
		                                    if(state.positioning == true){
		                                    	commit('change_positioning');
		                                    }
		                                /*正在定位隐藏--end*/
		                                /*定位成功显示--start*/
		                                    if(state.positionTrue == false){
		                                    	commit('change_positionTrue');
		                                    }
		                                /*定位成功显示--end*/

		                                /*定位失败隐藏--start*/
                                            commit('change_positionWrong', false);
		                                /*定位失败隐藏--end*/
		                                if(state.enterTrue == true){
		                                	commit('change_enterTrue');
		                                }
		                            } else if(schemeAddresses.length > 0){
		                            	let schemeAddressArr = state.schemeAddressArr;
		                                schemeAddressArr = [];
		                                for (let i = 0; i < schemeAddresses.length; i++) {
		                                    schemeAddressArr.push(schemeAddresses[i].schemeAddress);
		                                }

		                                let lnglatXY = [data.position.getLng(), data.position.getLat()]; // 获得现在的坐标
		                                var lnglat = new AMap.LngLat(data.position.getLng(), data.position.getLat()); // 为了计算俩点之间的距离
		                                // 循环后台的几个打卡地点
		                                state.addressName = [];
		                                for (let i = 0; i < schemeAddressArr.length; i++) {
		                                    let arr = [];
		                                    let coordinateX = schemeAddressArr[i].coordinateX;
		                                    let coordinateY = schemeAddressArr[i].coordinateY;
		                                    arr.push(coordinateX, coordinateY); // 所有的有效打卡地点x和y扔进arr数组
		                                    sate.push(lnglat.distance(arr)); // 所有的两点间距离push进sate数组
		                                    // 把所有的考勤地点的名称push进self.addressName数组中
		                                    state.addressName.push(schemeAddressArr[i].name +"（"+schemeAddressArr[i].clockRange + '米范围内）');
		                                }
		                                let min = Math.min.apply(null, sate); // 求俩点间的距离数组中最小的那个
		                                let index = -1;
		                                for (var i = 0; i < sate.length; i++) { // 求sate数组中最小的那个下标
		                                    if (sate[i] == min) {
		                                        index = i;
		                                        break;
		                                    }
		                                }
		                                // 得到离我最近的那个点的有效范围与我距离的实际距离进行比较
		                                let range = schemeAddressArr[index].clockRange;
		                                if (sate[index] < range) {
                                            console.log('onComplete--在范围内')
		                                	/*正在定位隐藏--start*/
			                                    if(state.positioning == true){
			                                    	commit('change_positioning');
			                                    }
			                                /*正在定位隐藏--end*/
			                                /*定位成功显示--start*/
			                                    if(state.positionTrue == false){
			                                    	commit('change_positionTrue');
			                                    }
			                                /*定位成功显示--end*/
			                                /*设置圆圈为可点击状态--start*/
			                                commit('change_circle_disable',false);
			                                /*设置圆圈为可点击状态--end*/

			                                /*定位失败隐藏--start*/
                                                commit('change_positionWrong', false);
			                                /*定位失败隐藏--end*/
			                                if(state.loadfail == true){
		                                    	commit('change_loadfail');
		                                    }
		                                    /*pop弹窗隐藏--start*/
                                                commit('change_popIsShow', false);
		                                    /*pop弹窗隐藏--end*/
		                                    /*光环特效结束--start*/
			                                    commit('change_active',false);
		                                    /*光环特效结束--end*/
		                                    resolve(state.positionTrue);
		                                } else {
		                                    console.log('onComplete--bu在范围内')
		                                    /*正在定位隐藏--start*/
			                                    if(state.positioning == true){
			                                    	commit('change_positioning');
			                                    }
			                                /*正在定位隐藏--end*/

			                                /*定位成功隐藏--start*/
			                                    if(state.positionTrue == true){
			                                    	commit('change_positionTrue');
			                                    }
			                                /*定位成功隐藏--end*/
			                                /*定位失败显示--start*/
                                                commit('change_positionWrong', true);
			                                /*定位失败显示--end*/

                                            commit('change_circle_disable',true);//设置圆圈为不可点击状态

			                                if(state.loadfail == true){
		                                    	commit('change_loadfail');
		                                    }
		                                    resolve(state.positionTrue);
		                                }
		                            }
		                        } else {
                                    console.log('onComplete--接口code不为0')
		                            /*正在定位隐藏--start*/
                                        if(state.positioning == true){
                                            commit('change_positioning');
                                        }
                                    /*正在定位隐藏--end*/
                                    if(state.loadfail == false){
                                        commit('change_loadfail');
                                    }
                                    /*控制err弹窗显示和内容--start*/
                                    commit('change_isDateErr',true)
                                    commit('change_isShowfile',true)
                                    /*控制err弹窗显示和内容--end*/
		                        }
		                    }, (res) => {
                                console.log('onComplete--网络原因出错')
                                /*正在定位隐藏--start*/
                                    if(state.positioning == true){
                                        commit('change_positioning');
                                    }
                                /*正在定位隐藏--end*/
                                if(state.loadfail == false){
                                    commit('change_loadfail');
                                }
                                /*控制err弹窗显示和内容--start*/
                                commit('change_isDateErr',false)
                                commit('change_isShowfile',true)
                                /*控制err弹窗显示和内容--end*/
		                    });
	               		});
                    })
                }
                // 解析定位错误信息
                function onError(data) {
                    console.log(data)
                    /*正在定位隐藏--start*/
                        if(state.positioning == true){
                        	commit('change_positioning');
                        }
                    /*正在定位隐藏--end*/
                    if(state.loadfail == false){
                    	commit('change_loadfail');
                    }
                    if(state.whichRouterPath == 'calendar'){
                        commit('change_isShowLoading',false);//转圈页面消失
                        /*控制err弹窗显示和内容--start*/
                        commit('change_isDateErr',false)
                        commit('change_isShowfile',true)
                        /*控制err弹窗显示和内容--end*/
                    }
                }
            })
        },
        /*module_Id----2代表审批，4代表公告，3代表考勤*/
        isOpenAppstore({commit,state,getters},module_Id){
            jsBridge.getHeader().then(function (value) {
                let header =value;
                let flag = Number(value.clientOs);
                jsBridge.GetAttendanceDate().then(function (value) {
                    axios({
                        method: 'GET',
                        url: '/appstore/getVisibleAppInfoList',
                        params: {
                            'cid': value.companyId,
                            'webType':2,
                            'handleSizeFlag':false,
                            'width':0,
                            'height':0,
                        },
                        headers: header,
                        timeout: 5000 //和产品沟通接口请求延迟时间。
                    }).then((res) => {
                        res=res.data;
                        console.log(res);
                        if(res.code==0){
                            if(res.data.list){
                                let list =res.data.list;
                                let isOpen= false;
                                for (let i=0;i<list.length;i++) {
                                    if(list[i].moduleId == module_Id){
                                        isOpen= true;
                                    }
                                }
                                if(isOpen == true){
                                    console.log('你已开通该应用');
                                }else {
                                    // alert('你没开通该应用');
                                    commit('change_isShowNoPermission',true);
                                }
                            }else {
                                // alert('你没开通该应用--没有返回的list数据');
                                commit('change_isShowNoPermission',true);
                            }
                        }
                    }, (res) => {
                    });
                });
            })
        },
        change_isShowNoPermissionAction({dispatch,commit},isShow){
            commit('change_isShowNoPermission',isShow);
        },
	  	async startClickBtn ({ dispatch, commit,state }) { // 点击签到或签退按钮
            /*先执行定位操作--start*/
                /*显示正在定位--start*/
                    if(state.positioning == false){
                    	commit('change_positioning');
                    }
                /*显示正在定位--end*/

                /*隐藏定位成功--start*/
                    if(state.positionTrue ==true){
                    	commit('change_positionTrue');
                    }
                /*隐藏定位成功--end*/
                /*定位失败隐藏--start*/
					commit('change_positionWrong', false);
                /*定位失败隐藏--end*/

                /*隐藏loadfail --start*/
                    if(state.loadfail ==true){
                    	commit('change_loadfail');
                    }
                /*隐藏loadfail --end*/
                let isPositionTrue=await dispatch('mapAction');
                // alert(isPositionTrue)
            /*先执行定位操作--end*/

            /*光环特效开始--start*/
               commit('change_active',true);
            /*光环特效开始--end*/
            if(state.isHasPlan ==true){//判断用户是否有考勤方案
                /*打卡操作部分--start*/
                    if (isPositionTrue == true) {//定位成功部分
                        if (state.workDay == false) {//休息日部分
                            if(state.clockCommute ==1){
                                commit('change_popIsShow', true);// pop弹窗显示
                                /*改变pop弹窗提示文本--start*/
                                commit('change_popshowText',['休息时间，是否打卡', '取消', '确认打卡'])
                                /*改变pop弹窗提示文本--end*/
                            } else if(state.clockCommute ==2){
                            	dispatch('checkClockStatus');
                            }
                        } else{//工作日部分
                            dispatch('checkClockStatus');// 请求打卡接口
                        }
                    } else {//定位失败部分
                        /*光环特效结束--start*/
                           commit('change_active',false);
                        /*光环特效结束--end*/
                        commit('change_popIsShow', true);// pop弹窗显示
                        if (state.isRetroactive) {
                            commit('change_popshowText',['补卡失败，不在考勤范围内', '取消', '再试一次']);
                        } else {
                            commit('change_popshowText',['打卡失败，不在考勤范围内', '取消', '再试一次']);
                        }
                        
                        commit('change_isShowLoading',false);//转圈页面消失
                    }
                /*打卡操作部分--end*/
            }else{
                //alert('暂无考勤方案，无法打卡')
            }
        },
	    change_isHasPlanAction(){
	    	commit('change_isHasPlan');
	    },
	    change_circleAction({commit}, status){
	    	commit('change_circle', status);
	    },
	    change_registerAction({commit}, status){
	    	commit('change_register', status);
	    },
        change_supplementShowAction({commit}, status){
            commit('change_supplementShow', status);
        },
	    change_firstClockTimeAction({commit},date){
	    	commit('change_firstClockTime',date);
	    },
	    change_listDataAction({commit},date){
	    	commit('change_listData',date);
	    },
	    change_workDayAction({commit},date){
	    	commit('change_workDay',date);
	    },

	    change_popshowTextAction({commit},date){
	    	commit('change_popshowText',date);
	    },
	    change_beforeClick_clockCommuteAction({commit},date){
	    	commit('change_beforeClick_clockCommute',date);
	    },
	    change_secondClockTimeAction({commit},date){
	    	commit('change_secondClockTime',date);
	    },
	    change_initTimeAction({commit},date){
	    	commit('change_initTime',date);
	    },
	    change_popIsShowAction({commit}, status){
	    	commit('change_popIsShow', status);
	    },
	    change_clockConfirmAction({commit}, status){
	    	commit('change_clockConfirm', status);
	    },
	    change_morningNightAction({commit}, status){
	    	commit('change_morningNight', status);
	    },
	    change_activeAction({commit},status){
	    	commit('change_active',status);
	    },
	    change_clockStatusAction({commit},date){
	    	commit('change_clockStatus',date);
	    },
	    change_clockCommuteAction({commit},date){
	    	console.log('clockCommute'+'----'+date)
	    	commit('change_clockCommute',date);
	    },
	    change_sureTimeAction({commit},date){
	    	console.log('sureTime'+'----'+date)
	    	commit('change_sureTime',date);
	    },
    },
    getters:{
    	getdata_today() { //得到的是今天的日期时间戳
            let myDate = new Date();
            let year = myDate.getFullYear();
            let month = myDate.getMonth() + 1;
            let date = myDate.getDate();
            if (month < 10) {
                month = '0' + month;
            }
            if (date < 10) {
                date = '0' + date;
            }
            let a = year + '/' + month + '/' + date;
            return new Date(a).getTime();
        },
    }
}
