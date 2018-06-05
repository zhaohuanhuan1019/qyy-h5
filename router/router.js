import App from '../src/App';
// 审批模块组件
import Home from 'approve/page/home/home';

import Approval from 'approve/page/myapproval/index';
import approvalList from 'approve/page/myapproval/children/approvallist';

import transferComment from 'approve/page/myapproval/children/transfercomment';
import rejectReason from 'approve/page/myapproval/children/rejectreason';
import agreeReason from 'approve/page/myapproval/children/agreereason';
import cancelLaunch from 'approve/page/myapply/children/cancellaunch';

import Apply from 'approve/page/myapply/index';
import applyList from 'approve/page/myapply/children/applylist';
import draftList from 'approve/page/myapply/children/draftlist';
import createForm from 'approve/page/createform/createform';
import viewForm from 'approve/page/viewform/viewform';  // 查看表单共用此页面
import draftForm from 'approve/page/draftform/draftform'; // 重新编辑表单页面

// 考勤模块组件
import Clock from 'attence/page/clock/clock';
import Calendar from 'attence/page/calendar/calendar';

//公告模块组件
import NoticeHome from 'notice/pages/NoticeHome.vue';
import Allnotice from 'notice/pages/Allnotice.vue';
import Collection from 'notice/pages/Collectnotice.vue';
import NoticeDetailAll from 'notice/pages/Detailnoticeall.vue';
import NoticeDetailCollect from 'notice/pages/Detailnoticecoll.vue';

//通知与待办组件 
import notify from 'notifyRemain/page/notify/notify';

export default [
    /*公告重定向路由--start*/
    {
        path: '/page_notice',
        redirect: '/notice'
    },
    /*公告重定向路由--end*/
    /*审批重定向路由--start*/
    {
        path: '/page_approve',
        redirect: '/home'
    },
    /*审批重定向路由--end*/
    /*考勤重定向路由--start*/
    {
        path: '/page_attend',
        redirect: '/clock'
    },
    /*考勤重定向路由--end*/
    { // 审批路由
        path: '/',
        component: App,
        children: [　// 二级路由对应App.vue
            {
                path: 'apply',
                name: 'apply',
                component: Apply,
                children: [
                    {
                        path: 'launch',
                        name: 'apply-launch-list',
                        component: applyList
                    },
                    {
                        path: 'draft',
                        name: 'apply-draft-list',
                        component: draftList
                    },
                    {
                        path: 'filed',
                        name: 'apply-filed-list',
                        component: applyList
                    }
                ]
            },
            {
                path: 'approval',
                component: Approval,
                name: 'approval',
                children: [
                    {
                        path: 'wait',
                        name: 'approval-wait-list',
                        component: approvalList
                    },
                    {
                        path: 'done',
                        name: 'approval-done-list',
                        component: approvalList
                    }
                ]
            },
            {
                path: 'home',
                name: 'home',
                component: Home
            },
            {
                path: 'approval/wait/:approveId',
                name: 'approval-wait',
                component: viewForm
            },
            {
                path: 'approval/wait/:approveId/reject',
                name: 'approval-wait-reject',
                component: rejectReason
            },
            {
                path: 'approval/wait/:approveId/agree',
                name: 'approval-wait-agree',
                component: agreeReason
            },
            {
                path: 'approval/wait/:approveId/transfer',
                name: 'approval-wait-transfer',
                component: transferComment
            },
            {
                path: 'approval/done/:approveId',
                name: 'approval-done',
                component: viewForm
            },
            {
                path: 'apply/launch/:approveId', // 我发起的 查看表单页
                name: 'apply-launch',
                component: viewForm
            },
            {
                path: 'apply/launch/:approveId/cancel',
                name: 'apply-launch-cancel',
                component: cancelLaunch
            },
            {
                path: 'apply/launch/:approveId/resubmit', // 我发起的 查看表单页
                name: 'apply-resubmit',
                component: draftForm
            },
            {
                path: 'apply/draft/:approveId', // 重新编辑草稿
                name: 'apply-redraft',
                component: draftForm
            },
            {
                path: 'apply/filed/:approveId', // 已归档 查看表单页
                name: 'apply-filed',
                component: viewForm
            },
            {
                path: 'apply/:typeId/create', // 创建申请单
                name: 'apply-create',
                component: createForm
            }
        ]
    },


    // 考勤路由
    {
        path: '/clock',
        // component: Clock,
        component:resolve => require(['attence/page/clock/clock'],resolve), // 路由懒加载
        // meta:{ keepAlive: true }
    },
    {
        path: '/calendar',
        // component: Calendar,
        component:resolve => require(['attence/page/calendar/calendar'],resolve), // 路由懒加载
        meta:{ keepAlive: false }
    },
    

    //公告路由
    {
        path: '/notice',
        component: NoticeHome,
        children: [
            {
                path:'/',
                name: 'noticeAll',
                component: Allnotice,
                meta: { keepAlive: true }
            },
            {
                path:'/notice/collection',
                name: 'noticeCollection',
                component: Collection,
                meta: { keepAlive: true }
            },
            {
                path:'/notice/detailAll',
                name: 'NoticeDetailAll',
                component:NoticeDetailAll
            },
            {
                path:'/notice/detailCollect',
                name: 'detailCollect',
                component:NoticeDetailCollect
            }
        ]
    },
    // 通知路由
    {
        path: '/workNotify',
        // component: notify,
        component:resolve => require(['notifyRemain/page/notify/notify'],resolve), // 路由懒加载
        meta:{ keepAlive: true }
    }
];
