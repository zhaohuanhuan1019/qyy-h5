import Vue from 'vue';
import VueX from 'vuex';
import module_attence from './module_attence';

Vue.use(VueX);

//相当于公共数据的data
    /*const state = {
        count:80,
        popUp:false
    };*/
//相当于公共数据的methods
    /*const mutations={
        add(state,n){
            state.count+=1;
        },
        reduce(state,n){
            state.count-=1;
        },
        change_pop(state){
            if(state.popUp==false){
                state.popUp=true;
            }else{
                state.popUp=false;
            }
        }
    };*/
//相当于公共数据的计算属性computed
    /*const getters = {
        count:function(state){
            return state.count +=100;
        }
    };*/
//actions和之前讲的Mutations功能基本一样，不同点是，actions是异步的改变state状态，而Mutations是同步改变状态。
    /*const actions ={
        addAction(context){
            context.commit('add',10);
            setTimeout(function(){context.commit('reduce')},3000)
            // setTimeOut(()=>{context.commit(reduce)},3000);
            console.log('我比reduce提前执行');
        },
        reduceAction({commit}){
            commit('reduce'); 
        }
    };*/

//module模块组
/*const moduleA={
    state,
    mutations,
    getters,
    actions
}*/


export default new VueX.Store({
    /*state,
    mutations,
    getters,
    actions,*/
    modules:{
        attence:module_attence
    }
});
