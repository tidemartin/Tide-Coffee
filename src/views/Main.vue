<template>
  <div>
    <router-view></router-view>
    <div class="bottom">
      <van-tabbar v-model="active">
        <van-tabbar-item v-for="(item,index) in Icon" :key="index" :to='item.name'>
          <span >{{item.title}}</span>
          <template #icon="props">
            <img :src="props.active ? item.inactive : item.active" />
          </template>
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      Icon: [
       {
          title: "首页",
          name:'Home',
          active: require("../assets/image/home.png"),
          inactive: require("../assets/image/home_active.png")
        },
       {
          title: "菜单",
          name:'Menu',
          active: require("../assets/image/menu.png"),
          inactive: require("../assets/image/menu_active.png"),
        },
       {
          title: "购物袋",
          name:'Shopbag',
          active: require("../assets/image/shopbag.png"),
          inactive: require("../assets/image/shopbag_active.png")
        },
       {
          title: "我的",
          name:'My',
          active: require("../assets/image/my.png"),
          inactive: require("../assets/image/my_active.png")
        }
      ],

    };
  },
  created(){
      this.activeTabbar()
  },
  methods:{
      //匹配路径激活响应的标签
      activeTabbar(){
          for(let i = 0;i < this.Icon.length;i++){
            if(this.Icon[i].name.indexOf(this.$route.name) > -1){
                this.active = i
            }

          }
      }
  }
};
</script>

<style lang="less" scoped>
</style>