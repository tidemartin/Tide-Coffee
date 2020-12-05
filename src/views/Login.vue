<template>
  <div class="login">
    <!-- <router-view></router-view> -->
    <van-nav-bar  @click-right="onClickRight" right-text="去逛一逛">
      <template #left>
        <div class="login-logo">
          <div>
            <img src="../assets/image/logo.png" alt />
          </div>
          <div class="login-text">Tide Coffee</div>
        </div>
      </template>
    </van-nav-bar>

    <div class="welcome-back">
      <h2>欢迎回来!</h2>
      <div class="text">
        Please login to your
        <br />accounts
      </div>
    </div>

    <van-form class="register">
      <span class="tips" ref="tips">输入的号码或者密码不正确</span>
      <van-field
        v-model="userLoginInfo.phone"
        :right-icon="erre ? '' : 'fail'"
        label="用户名"
        placeholder="用户名/手机号码"
        @input="inputPhone"
        maxlength="11"
      />
      <van-field
        v-model="userLoginInfo.password"
        :type="isActive ? 'password' : 'text'"
        label="密码"
        placeholder="密码"
        :right-icon="isActive ? 'closed-eye' : 'eye-o' "
        @click-right-icon="clickRight"
        @input="inputPhone"
        ref="phone"
        maxlength="16"
      />
      <div class="remember-forget clear">
        <div class="remember fl">
          <span>记住我</span>
          <input type="checkbox" ref="check" />
        </div>
        <div class="forget fr" @click="forgetPassword">忘记密码</div>
      </div>
      <div>
        <van-button round block type="info" native-type="submit" @click="clickBtn">登录</van-button>
      </div>
      <div class="logon">
        还没有账号?
        <a @click="showPopup">立即注册!</a>
      </div>
    </van-form>

    <!-- 弹出注册 -->
    <van-popup v-model="show" position="bottom" closeable :style="{ height: '60%' }">
      <div class="v-show">
        <span>注册</span>
      </div>
      <van-form class="v-register">
        <van-field v-model="userRegisterInfo.nickName" placeholder="用户名" type="text" />
        <van-field v-model="userRegisterInfo.phone" placeholder="手机号码" type="text" maxlength="11" />
        <van-field
          v-model="userRegisterInfo.password"
          placeholder="密码6-16"
          :type="isActive ? 'password' : 'text'"
          :right-icon="isActive ? 'closed-eye' : 'eye-o' "
          @click-right-icon="clickRight"
          maxlength="16"
        />
        <van-field
          placeholder="确认密码"
          v-model="userRegisterInfo.againPassword"
          :type="againIsActive ? 'password' : 'text'"
          :right-icon="againIsActive ? 'closed-eye' : 'eye-o' "
          @click-right-icon="clickAgainRight"
          maxlength="16"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit" @click="register">注册</van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>

<script>
import "../assets/less/login/login.less";
import { validForm } from "../assets/js/validForm";
import { utils } from "../assets/js/utils";


export default {
  data() {
    return {
      userLoginInfo: {
        phone: "",
        password: ""
      },
      userRegisterInfo: {
        phone: "",
        nickName: "",
        password: "",
        againPassword: ""
      },
      isActive: true,
      againIsActive: true,
      erre: true,
      show: false
    };
  },
  created() {
    // 
    this.activeShow();
  },
  methods: {
    // 匹配路径激活响应的标签
    activeShow() {
      if (this.show) {
        this.show = true;
        return;
      }
    },
    // onClickRight
    onClickRight(){
      this.$router.push({name:'Home'})
    },
    // 忘记密码
    forgetPassword(){
      this.$router.push({name:'Forget'})
    },
    // 密码type类型切换
    clickRight() {
      this.isActive = !this.isActive;
    },
    clickAgainRight() {
      this.againIsActive = !this.againIsActive;
      // 
    },
    // input输入提示
    inputPhone() {
      let tips = this.$refs.tips;
      let res = /^(\+86)?1[3456789]\d{9}$/;
      let password = this.$refs.phone.$refs.input;
      // 
      if (!res.test(this.userLoginInfo.phone)) {
        this.erre = false;
      } else {
        this.erre = true;
        tips.style.display = "none";
      }
      if (this.userLoginInfo.phone == "") {
        this.erre = true;
        tips.style.display = "none";
      }
      if (password.value) {
        tips.style.display = "none";
      }
    },
    // 登录
    clickBtn() {
      let res = /^(\+86)?1[3456789]\d{9}$/;
      let pas = /[0-9a-zA-Z_]{6,16}/;
      let tips = this.$refs.tips;
      let check = this.$refs.check;
      let userInfo = this.userLoginInfo;

      if (!res.test(userInfo.phone) || !pas.test(userInfo.password)) {
        tips.style.display = "block";
        tips.innerText = "输入的号码或者密码不正确";
      }
      if (userInfo.password == "") {
        tips.style.display = "block";
        tips.innerText = "请输入密码";  
      }
      if (userInfo.phone == "") {
        tips.style.display = "block";
        tips.innerText = "请输入手机号码";
      }

      if (res.test(userInfo.phone) && pas.test(userInfo.password)) {
        // this.$toast.loading({
        //   message: "加载中...",
        //   forbidClick: true,
        //   duration: 0,
        //   loadingType: "spinner"
        // });
        // 发送请求
        // 复制对象
        let info = Object.assign({}, userInfo);
        info.appkey = this.appkey;

        // 序列化
        let data = utils.queryString(info);

        this.axios({
          method: "POST",
          url: "/login",
          data
        })
          .then(result => {
            
            // this.$toast.clear();
            if (result.data.code == 200) {
              this.$router.push({ name: "Home" });
              // if (check.checked == true) {
                localStorage.setItem("CSTK", result.data.token);
              // }
            } else {
              this.$notify({
                type: "warning",
                message: result.data.msg
              });
            }
          })
          .catch(err => {
            // this.$toast.clear();
            
          });
      }
    },
    // 注册页面
    showPopup() {
      this.show = true;
    },
    disClick() {
      this.show = !this.show;
    },
    // 注册
    register() {
      let userInfo = this.userRegisterInfo;
      // 

      // 验证表单
      let o = {
        phone: {
          value: userInfo.phone,
          reg: /^(\+86)?1[3-9]\d{9}$/,
          errorMsg: "手机格式不正确"
        },
        nickName: {
          value: userInfo.nickName,
          reg: /[\w\u4e00-\u9fa5]{1,10}/,
          errorMsg: "昵称格式不正确"
        },
        password: {
          value: userInfo.password,
          reg: /[0-9a-zA-Z_]{6,16}/,
          errorMsg: "密码格式不正确"
        }
      };

      if (userInfo.password != userInfo.againPassword) {
        this.$notify({
          type: "warning",
          message: "两次密码不一致"
        });

        // 

        return;
      }
      if (!validForm.valid(o)) {
        // 验证不通过
        for (const key in o) {
          o[key].value = "";
        }
        return;
      }

      // 发起请求
      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        // 显示时间,如果时间为0,则不会自动关闭
        duration: 0,
        loadingType: "spinner"
      });

      // 序列化参数
      // 复制对象
      let info = Object.assign({}, userInfo);
      // 
      info.appkey = this.appkey;
      let data = utils.queryString(info);
      // 

      this.axios({
        method: "POST",
        // 请求参数
        url: "register",
        data
      })
        .then(result => {
          // 
          this.$toast.clear();
          // 如果注册成功
          if (result.data.code == 100) {
            this.show = false;
          } else {
            this.$notify({
              type: "warning",
              message: result.data.msg
            });
          }
        })
        .catch(err => {
          // 
          this.$toast.clear();
        });
    }
  }
};
</script>

