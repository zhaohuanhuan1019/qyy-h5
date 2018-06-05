// 审批调用nativa方法
function getDate (type, date) {
    // 获取时间
    return new Promise(function (resolve, reject) {
        window.WebViewJavascriptBridge.callHandler(
            'jsToNativeGetDate',
            {
                "code": 0,
                "msg": "",
                "data": {
                    "defaultDate": date,
                    "dateType": type
                }

            },
            function (responseData) {
                let defaultData = JSON.parse(String(responseData));
                if (defaultData.code === 0) {
                    resolve(defaultData.data.timestamp);
                }
            }
        );
    });
}

function getHeader () {
    // 获取请求头信息
    return new Promise(function (resolve, reject) {
        window.WebViewJavascriptBridge.callHandler(
            'jsToNativeGetHeader'
            , {'header': ''}
            , function (responseData) {
                let headerDate = JSON.parse(String(responseData));
                window.headers = headerDate.data;
                resolve(headerDate.data);
            }
        );
    });
}

function getStuffInfo (title = '') {
    // 获取通讯录员工信息
    return new Promise(function (resolve, reject) {
        window.WebViewJavascriptBridge.callHandler(
            'jsToNativeGetStaffDetail'
            , {
                "code": 0,
                "msg": "",
                "data": {
                    "title": title
                }
            }
            , function (responseData) {
                let staffData = JSON.parse(String(responseData));
                if (staffData.code === 0) {
                    resolve(staffData.data);
                }
            }
        );
    });
}

function requestBack () {
    // 请求返回
    return new Promise(function (resolve, reject) {
        window.WebViewJavascriptBridge.callHandler(
            'jsToNativeGoBack',
            {
                "code": 0,
                "msg": "",
                "data": {
                   "backType": 0 // 关闭
                }

            },
            function (responseData) {
            }
        );
    });
}


function getExtra (toAppJson) {
    // 获取其他字段或者数据
    return new Promise(function (resolve, reject) {
        window.WebViewJavascriptBridge.callHandler(
            'jsToNativeExtra',
            toAppJson,
            function (responseData) {
                let defaultData = JSON.parse(String(responseData));
                if (defaultData.code === 0) {
                    window.companyId = defaultData.data.companyId;
                    resolve(defaultData.data);
                }
            }
        );
    });
}
//安卓超链接打开方法
function setUrl (toAppJson) {
    return new Promise(function (resolve, reject) {
        window.WebViewJavascriptBridge.callHandler(
            'jsToNativeTitle',
            toAppJson,
            function (responseData) {
                console.log(responseData)
            },
            function (err){
                console.log(err)
            }
        );
    });
}
// 考勤调用nativa方法
function GetAttendanceDate () {
    //调用本地java方法
    return new Promise(function (resolve, reject) {
        window.WebViewJavascriptBridge.callHandler(
            'jsToNativeGetAttendanceDate'
            , {'param': ''}
            , function(responseData) {
                // alert(responseData);
                // alert('我拿到了native数据' + JSON.parse(String(responseData)));
                let info = JSON.parse(String(responseData));
                window.GetAttendanceDate = info.data;
                resolve(info.data);
                // alert(info.data.companyId);
            }
        );
    });
}

export default{
    getDate,
    getHeader,
    getStuffInfo,
    requestBack,
    getExtra,
    setUrl,
    GetAttendanceDate
}
