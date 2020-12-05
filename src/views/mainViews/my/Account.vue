<template>
  <div class="account">
    <van-nav-bar title="个人资料" left-text="返回" left-arrow @click-left="onClickLeft" fixed />
    <div class="content">
      <div>
        头像
        <van-uploader accept :after-read="afterRead"></van-uploader>
        <img :src="userInfo.userImg" alt />
      </div>
      <div>
        用户ID
        <input type="text" :value="userId" disabled name id />
      </div>
      <div>
        手机号
        <input type="text" :value="phone" disabled name id />
      </div>
      <div>
        昵称
        <input type="text" @change="updateNickName" v-model="userInfo.nickName" />
      </div>
      <div>
        简介
        <input type="text" v-model="userInfo.desc" @change="updateDesc" placeholder="这个人很懒什么也没写" />
      </div>
    </div>
  </div>
</template>

<script>
import { utils } from "../../../assets/js/utils";
export default {
  data() {
    return {
      userInfo: [],
      maxSize: 1 * 1024 * 300,
      userId: "",
      phone: ""
    };
  },
  created() {
    this.getUserInfo();
    this.findAccountInfo();
  },
  methods: {
    onClickLeft() {
      this.$router.back();
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
              //   this.isLogin = true;
              this.userInfo = result.data.result[0];
              // 
            }
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    // 上传头像
    afterRead(file) {
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
        url: "/updateAvatar",
        data
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == "H001") {
            //   
            this.userInfo.userImg = result.data.userImg;
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    // 查询ID 手机号码
    findAccountInfo() {
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
        url: "/findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          //   
          if (result.data.code == "B001") {
            this.userId = result.data.result[0].userId;
            this.phone = result.data.result[0].phone;
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    // 修改昵称
    updateNickName() {
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        nickName: this.userInfo.nickName
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      this.axios({
        method: "POST",
        url: "/updateNickName",
        data
      })
        .then(result => {
          this.$toast.clear();
           this.$toast(result.data.msg)
          
        })
        .catch(err => {
          this.$toast.clear();
           this.$toast(result.data.msg)
          
        });
    },
    // 修改简介
    updateDesc() {
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        desc: this.userInfo.desc
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      this.axios({
        method: "POST",
        url: "/updateDesc",
        data
      })
        .then(result => {
          this.$toast.clear();
          
          this.$toast(result.data.msg)
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast(result.data.msg)
          
        });
    }
  }
};
</script>
<style lang="less">
.account {
  height: 617px;
  background: #f2f2f2;
  .content {
    margin-top: 46px;
    background: #fff;
    div {
      height: 50px;
      border-bottom: 1px solid #f2f2f2;
      text-align: left;
      font-size: 16px;
      margin-left: 15px;
      line-height: 50px;
      position: relative;
      img {
        width: 42px;
        height: 42px;
        display: inline-block;
        position: absolute;
        right: 0;
        top: 0;
        padding-right: 15px;
        margin-top: 4px;
      }
      input {
        width: 80%;
        height: 50px;
        outline: none;
        font-size: 12px;
        border: none;
        text-align: right;
        position: absolute;
        right: 0;
        top: 0;
        box-sizing: border-box;
        padding-right: 15px;
        color: #999;
        background: #fff;
      }
      input[type="file"] {
        width: 42px;
        height: 42px;
        margin-top: 2px;
        margin-left: -31px;
        z-index: 99;
      }
      .van-uploader {
        opacity: 0;
        position: relative;
        display: inline-block;
        left: 252px;
        width: 42px;
        height: 42px;
        z-index: 9;
      }
    }
  }
}
</style>