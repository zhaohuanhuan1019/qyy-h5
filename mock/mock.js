/*jdfkjgkj*/
let Mock=require('mockjs');
let Random=Mock.Random;

let channel = require('./js/channel');
let base = require('./js/base');
let depts = require('./js/depts');
/*扩展*/
Random.extend({
	/*单子类型*/
    formType: function(date) {
        var formType = ['事假申请', '公章用印申请', '婚假申请', '病假申请', '年假申请', '孕产假申请', '财务专用章申请', '人力资源章申请', '合同专用章申请', '离职申请', '转正申请', '上班未打卡','下班未打卡','全天未打卡']
        return this.pick(formType)
    }
})
Random.extend({
	/*组件信息*/
    components:function(date) {
    	var components = [{key:'请假类型',value:'事假申请'}, {key:'开始时间',value:'2017-8-20'}, {key:'结束时间',value:'2017-9-1'}, {key:'总时长',value:'2天5小时34分'}, {key:'请假事由',value:'有事'}]
        return this.pick(components)
    } 
})

/*扩展*/

module.exports=()=>{
    let data={
        news:[],
        formDetail:[]
    };

    let images=[1,2,3].map(x=>Random.image('120x60',Random.color(),Random.word(2,6)));

    for(let i=0;i<20;i++){
        let content=Random.cparagraph(0,10);
        data.news.push({
            id:i,
            title:Random.cword(8,20),
            desc:content.substr(0,40),
            tag:Random.cword(2,6),
            views:Random.integer(100,5000),
            images:images.slice(0,Random.integer(1,3))
        });
        data.formDetail.push({
        	name:Random.name(),
        	formType:Random.formType(),
        	componentsDetail:{
        		fristComponents:Random.components(),
        		secondComponents:Random.components(),
        		thirdComponents:Random.components(),
        	}
        });
    }
    return Object.assign(data,channel,base,depts);
}