// 使用 Mock
var Mock = require('mockjs');
var Random=Mock.Random;
var data = Mock.mock({
    'list|1-10': '张三'
})


export default {
	data
}