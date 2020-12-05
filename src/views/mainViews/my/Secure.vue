<template>
  <div class="secure">
    <van-nav-bar
      title="安全中心"
      left-text="返回"
      right-text="退出登陆"
      left-arrow
      fixed
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div class="btn">
      <button class="v-btn" @click="showPopup">修改密码</button>
      <van-popup
        v-model="show"
        round
        :closeable="true"
        :close-on-click-overlay="false"
        :style="{ height: '35%' }"
        position="bottom"
      >
        <div class="changePasswold">修改密码</div>
        <van-form @submit="onSubmit">
          <van-field
            v-model="userLoginInfo.oldPassword"
            label="旧密码"
            name="旧密码"
            placeholder="旧密码"
            :type="isActive ? 'password' : 'text'"
            :right-icon="isActive ? 'closed-eye' : 'eye-o' "
            @click-right-icon="clickRight"
          />
          <van-field
            v-model="userLoginInfo.newPassword"
            label="新密码"
            name="新密码"
            placeholder="新密码"
            :type="againIsActive ? 'password' : 'text'"
            :right-icon="againIsActive ? 'closed-eye' : 'eye-o' "
            @click-right-icon="clickAgainRight"
          />
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit">提交</van-button>
          </div>
        </van-form>
      </van-popup>
      <button class="v-btn" @click="destroyAccount">注销账号</button>
    </div>
  </div>
</template>

<script>
import { validForm } from "../../../assets/js/validForm";
import { utils } from "../../../assets/js/utils";
export default {
  data() {
    return {
      userLoginInfo: {
        newPassword: "",
        oldPassword: ""
      },
      show: false,
      username: "",
      password: "",
      // 眼睛
      isActive: true,
      againIsActive: true
    };
  },
  created() {},
  methods: {
    onClickLeft() {
      this.$router.back();
    },
    // 密码type类型切换
    clickRight() {
      this.isActive = !this.isActive;
    },
    clickAgainRight() {
      this.againIsActive = !this.againIsActive;
      // 
    },
    // 退出登录
    onClickRight() {
      this.$dialog
        .confirm({
          title: "退出登录",
          message: "是否确认退出登录"
        })
        .then(() => {
          localStorage.removeItem("CSTK");
          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0,
            loadingType: "spinner"
          });

          setTimeout(() => {
            this.$toast.clear();
            this.$router.push({ name: "Login" });
          }, 1000);
        })
        .catch(() => {
          // on cancel
        });
    },
    showPopup() {
      this.show = true;
    },
    //修改密码
    onSubmit() {
      
      // 验证密码
      let o = {
        oldPassword: {
          value: this.userLoginInfo.oldPassword,
          reg: /[0-9a-zA-Z_]{6,16}/,
          errorMsg: "旧密码不正确"
        },
        newPassword: {
          value: this.userLoginInfo.newPassword,
          reg: /[0-9a-zA-Z_]{6,16}/,
          errorMsg: "新密码密码不正确"
        }
      };

      if (!validForm.valid(o)) {
        return;
      }

      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        password: this.userLoginInfo.newPassword,
        oldPassword: this.userLoginInfo.oldPassword
      });

      this.axios({
        method: "POST",
        url: "/updatePassword",
        data
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == "E001") {
            this.$toast(result.data.msg);
            localStorage.removeItem("CSTK");
            setTimeout(() => {
              this.$router.push({ name: "Login" });
            }, 1000);
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    // 注销账号
    destroyAccount() {
      this.$dialog
        .confirm({
          title: "注销账号",
          message: "是否注销账号,一旦注销将无法恢复!"
        })
        // 点击确定 发送请求
        .then(() => {
          let tokenString = localStorage.getItem("CSTK");
          if (!tokenString) {
            return this.$router.push({ name: "Login" });
          }

          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0,
            loadingType: "spinner",
          });

          //参数序列化
          let data = utils.queryString({
            appkey: this.appkey,
            tokenString
          });

          this.axios({
            method: "POST",
            url: "/destroyAccount",
            data
          }).then(result =>{
            this.$toast.clear()
            
            if(result.data.code == 'G001'){
              localStorage.removeItem('CSTK')
              setTimeout(() => {
                  this.$router.push({name:'Login'})
              }, 600);
            }
          }).catch(err =>{
             this.$toast.clear()
            
          })
        })
        .catch(() => {
          // on cancel
        });
    }
  }
};
</script>

<style lang="less" scoped>
.secure {
  height: 620px;
  background: #f2f2f2;
  .btn {
    margin-top: 46px;
    padding-top: 10px;
    width: 100%;
    .v-btn {
      width: 80%;
      display: block;
      margin-left: 10%;
      margin-top: 30px;
      font-size: 17px;
      outline: none;
      border: none;
      height: 40px;
      line-height: 40px;
      background: #fff;
    }
    .changePasswold {
      font-size: 17px;
      margin-top: 16px;
      padding-bottom: 5px;
    }
  }
}
</style>