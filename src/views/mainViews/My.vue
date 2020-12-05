<template>
  <div class="my">
    <div v-if="isLogin">
      <div class="my-bg" :style="{backgroundImage:`url(${userInfo.userBg})`}">
        <div class="me">我的</div>
        <van-uploader accept :after-read="afterRead">更换背景</van-uploader>
      </div>
      <div class="my-func">
        <div class="my-head">
          <div class="header" :style="{backgroundImage:`url(${userInfo.userImg})`}">
            <!-- <img src=""> -->
          </div>
          <div class="show">
            <div class="name">{{userInfo.nickName}}</div>
            <div class="personality">{{userInfo.desc == '' ? '这个人很懒什么都没说' : userInfo.desc }}</div>
          </div>
        </div>
        <div class="funcs">
          <div :to="item.to" v-for="(item,index) in list" :key="index" @click="toList(item)">
            {{item.title}}
            <van-icon name="arrow" />
          </div>
        </div>
      </div>

      <div class="free">
        <img src="../../assets/image/1.png" alt />
      </div>
    </div>
    <div v-else>
     <van-button round type="danger" @click="goLogin" class="isLogin">去登录</van-button>
     </div>
  </div>
</template>

<script>
import "../../assets/less/my/my.less";
import { utils } from "../../assets/js/utils";
export default {
  data() {
    return {
      list: [
        { title: "个人资料", to: { name: "Account" } },
        { title: "我的订单", to: { name: "Order" } },
        { title: "个人收藏", to: { name: "Like" } },
        { title: "收货地址", to: { name: "Address" } },
        { title: "安全中心", to: { name: "Secure" } }
      ],
      userInfo: {},
      isLogin: false,
      maxSize: 1 * 1024 * 1024
    };
  },
  created() {
    this.getUserInfo();
    // this.afterRead(file)
  },
  methods: {
    goLogin(){
      this.$router.push({name:'Login'})
    },
    toList(item) {
      
      this.$router.push({ name: item.to.name });
    },
    // 查询用户信息
    getUserInfo() {
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "circular"
      });

      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
            // 
          if (result.data.code == "A001") {
            if (result.data.result.length > 0) {
              this.isLogin = true;
              this.userInfo = result.data.result[0];
              // 
              
            }
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    // 上传背景
    afterRead(file) {
      // 
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      // 获取文件类型
      let type = file.file.type.split("/")[1];
      

      // 自定义图片类型
      let imgType = ["png", "jpg", "jpeg", "gif"];
      if (imgType.indexOf(type) == -1) {
        this.$notify({
          message: "图片类型只支持" + imgType.join(","),
          color: "#fff",
          background: "#0c34BA"
        });
        return;
      }

      // 图片大小
      if (this.maxSize < file.file.size) {
        this.$notify({
          message: "上传文件大小不能超过" + this.maxSize / 1024 + "KB",
          color: "#fff",
          background: "#0c34BA"
        });
        return;
      }

      // 获取图片base64
      let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, "");

      // 

      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        imgType: type,
        serverBase64Img: base64
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      this.axios({
        method: "POST",
        url: "/updateUserBg",
        data
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == "I001") {
            
            this.userInfo.userBg = result.data.userBg;
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    }
  }
};
</script>

<style lang="less" scoped>


</style>