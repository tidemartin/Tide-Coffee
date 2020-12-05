export const routes = [
    {
        // 登录
        path:'/login',
        name:'Login',
        component:() => import('../views/Login.vue')
    },
    {
      // 登录
      path:'/main',
      name:'Main',
      component:() => import('../views/Main.vue'),
      children:[
        {
          path:'home',
          name:'Home',
          component:() => import('../views/mainViews/Home.vue'),
        },
        {
          path:'menu',
          name:'Menu',
          component:() => import('../views/mainViews/Menu.vue')
        },
        {
          path:'shopbag',
          name:'Shopbag',
          component:() => import('../views/mainViews/Shopbag.vue')
        },
        {
          path:'my',
          name:'My',
          component:() => import('../views/mainViews/My.vue')
        },
        
      ]
    },
    {
      path:'/baidu',
      name:'Baidu',
      component:() => import('../views/mainViews/baidu/Baidu.vue'),
    },
    {
      path:'/commodity',
      name:'Commodity',
      component:() => import('../views/mainViews/commodity/Commodity.vue')
    },
    {
      path:'/pay',
      name:'Pay',
      component:() => import('../views/mainViews/pay/Pay.vue')
    },
    {
      path:'/address',
      name:'Address',
      component:() => import('../views/mainViews/address/Address.vue')
    },
    {
      path:'/addressEdit',
      name:'AddressEdit',
      component:() => import('../views/mainViews/addressEdit/AddressEdit.vue')
    },
    {
      path:'/order',
      name:'Order',
      component:() => import('../views/mainViews/Order.vue')
    },
    {
      path:'/account',
      name:'Account',
      component:() => import('../views/mainViews/my/Account.vue')
    },
    {
      path:'/like',
      name:'Like',
      component:() => import('../views/mainViews/my/Like.vue')
    },
    {
      path:'/secure',
      name:'Secure',
      component:() => import('../views/mainViews/my/Secure.vue')
    },
    {
      path:'/forget',
      name:'Forget',
      component:() => import('../views/mainViews/forget/Forget.vue')
    },
    {
        // 当以上不能piper时,匹配path:*路径
        path:'*',
        // 路由重定向
        redirect:{
          name:'Login'
        }
      }
]