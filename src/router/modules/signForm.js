const Layout = () => import('@/layout/index.vue')

export default {
    path: '/signForm',
    component: Layout,
    redirect: '/signForm/qrCode',
    name: 'signForm',
    meta: {
        title: '活动管理',
        icon: 'sidebar-breadcrumb'
    },
    children: [
        {
            path: 'qrCode',
            name: 'qrCode',
            component: () => import('@/views/signForm/qrCode.vue'),
            meta: {
                title: '活动管理'
            }
        },
        {
            path: 'signFrom',
            name: 'signFrom',
            component: () => import('@/views/signForm/signFrom.vue'),
            meta: {
                title: '报名信息',
                sidebar: false,
                auth: ['admin']
            }
        },
        {
            path: 'colorPage',
            name: 'colorPage',
            component: () => import('@/views/signForm/colorPage.vue'),
            meta: {
                title: '彩页管理',
                auth: ['admin']
            }
        },
        {
            path: 'salesman',
            name: 'salesman',
            component: () => import('@/views/signForm/salesman.vue'),
            meta: {
                title: '销售管理',
                auth: ['admin']
            }
        }
    ]
}
