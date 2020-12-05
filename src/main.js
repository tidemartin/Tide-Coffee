import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'

import {
  Button,
  NavBar,
  Form,
  Field,
  Icon,
  Popup,
  Toast,
  Tabbar,
  TabbarItem,
  Swipe,
  SwipeItem,
  DropdownMenu,
  DropdownItem,
  Tab,
  Tabs,
  Search,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Stepper,
  SwipeCell,
  Card,
  Checkbox,
  CheckboxGroup,
  SubmitBar,
  Empty,
  AddressList,
  AddressEdit,
  Uploader,
  Notify,
  Loading,
  Dialog
} from 'vant'

import 'lib-flexible/flexible'

Vue.use(Button)
  .use(NavBar)
  .use(Form)
  .use(Field)
  .use(Icon)
  .use(Popup)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Swipe)
  .use(SwipeItem)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Tab)
  .use(Tabs)
  .use(Search)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(Stepper)
  .use(SwipeCell)
  .use(Card)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(SubmitBar)
  .use(Empty)
  .use(AddressList)
  .use(AddressEdit)
  .use(Uploader)
  .use(Notify)
  .use(Loading)
  .use(Dialog)

// 
import BaiduMap from 'vue-baidu-map';
  Vue.use(BaiduMap, {
    // Visit http://lbsyun.baidu.com/apiconsole/key#/home
        ak: 'YOUR_APP_KEY'
  })

// 注册axios,ajax方案,用于请求数据
Vue.use(VueAxios, axios)

// 设置请求基础路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'

// axios.defaults.withCredentials = true
// 设置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

// 添加一个Vue的原型属性
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='

// 关闭生产环境提示
Vue.config.productionTip = false

//防止点击同一路由报错
let originalPush = Router.prototype.push;
Router.prototype.push = function (url) {
  return originalPush.call(this, url).catch(err => err);
}

//全局注册过滤器, 一般用于格式化数据
Vue.filter('formatDate', (value, format) => {
  //value: 需要格式化的数据
  //format: 指定格式 yyyy-MM-dd hh:mm:ss

  // 

  let date = new Date(value);

  //获取年份
  let year = date.getFullYear();
  // 
  if (/(y+)/.test(format)) {
    //获取匹配组的内容
    let content = RegExp.$1;
    // 
    format = format.replace(content, year.toString().slice(4 - content.length));

    // 
  }

  let o = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };

  for (let key in o) {
    //构造动态正则
    let reg = new RegExp(`(${key}+)`);
    // 
    if (reg.test(format)) {
      //获取匹配组的内容
      let content = RegExp.$1;
      // 
      let k =  o[key] >= 10 ? o[key] : content.length == 2 ? '0' + o[key] : o[key];
      // 
      format = format.replace(content, k);
      // 
    }
  }

  return format;
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')