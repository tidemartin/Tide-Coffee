<template>
  <div class="forget">
    <van-nav-bar @click-right="onClickRight" right-text="去逛一逛">
      <template #left>
        <div class="login-logo">
          <div>
            <img src="../../../assets/image/logo.png" alt />
          </div>
          <div class="login-text">Luckin Coffee</div>
        </div>
      </template>
    </van-nav-bar>

    <div class="welcome-back">
      <h2>忘记密码!</h2>
      <div class="text">forget password</div>
    </div>

    <div class="submit">
      <van-form>
        <van-field label="手机号" placeholder="手机号" v-model="userforgetInfo.phone" />
        <van-field
          :type="isActive ? 'password' : 'text'"
          label="密码"
          placeholder="密码"
          :right-icon="isActive ? 'closed-eye' : 'eye-o' "
          @click-right-icon="clickRight"
          v-model="userforgetInfo.password"
        />
        <van-field type="email" label="邮箱" placeholder="邮箱" v-model="userforgetInfo.email" />
        <van-field
          center
          clearable
          label="验证码"
          placeholder="请输入验证码"
          v-model="userforgetInfo.validcode"
        >
          <template #button>
            <van-button size="small" :disabled="disabled" @click="senEmail" type="primary">{{text}}</van-button>
          </template>
        </van-field>
        <div class="already" @click="GOlogin">已有账号,去登陆</div>
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit" @click="onSubmit">提交</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import "../../../assets/less/forget/forget.less";
import { validForm } from "../../../assets/js/validForm";
import { utils } from "../../../assets/js/utils";

export default {
  data() {
    return {
      userforgetInfo: {
        phone: "",
        password: "",
        email: "",
        validcode: ""
      },
      isActive: true,
      disabled: false,
      text: "发送验证码"
    };
  },
  created() {},
  methods: {
    onClickRight() {
      this.$router.push({ name: "Home" });
    },
    // 密码type类型切换
    clickRight() {
      this.isActive = !this.isActive;
    },
    GOlogin() {
      this.$router.push({ name: "Login" });
    },
    
    // 发送验证码
    senEmail() {
      let time = 5;
      this.disabled = true;
      this.text = time + "s后重新发送";
      time--;
      let timer = setInterval(() => {
        if (time <= 0) {
          clearInterval(timer);
          time = 5;
          this.disabled = false;
          this.text = "发送验证码";
        } else {
          this.text = time + "s后重新发送";
          time--;
        }
      }, 1000);

      //   获取邮箱验证码接口
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      let data = utils.queryString({
        appkey: this.appkey,
        email: this.userforgetInfo.email
      });

      this.axios({
        method: "POST",
        url: "/emailValidCode",
        data
      })
        .then(result => {
          this.$toast.clear();
          

          this.$notify({
            type: "warning",
            message: result.data.msg
          });
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    // 提交
    onSubmit() {
      //   this.res();
      let o = {
        phone: {
          value: this.userforgetInfo.phone,
          reg: /^(\+86)?1[3456789]\d{9}$/,
          errorMsg: "手机号格式不正确"
        },
        password: {
          value: this.userforgetInfo.password,
          reg: /[0-9a-zA-Z_]{6,16}/,
          errorMsg: "密码格式不正确"
        },
        email: {
          value: this.userforgetInfo.email,
          reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
          errorMsg: "邮箱格式不正确"
        },
        validcode: {
          value: this.userforgetInfo.validcode,
          reg: /^\d{6}$/,
          errorMsg: "验证码为6位数字"
        }
      };

      if (!validForm.valid(o)) {
        return;
      }
       
      
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      let data = utils.queryString({
        appkey: this.appkey,
        validCode: this.userforgetInfo.validcode
      });
      
      this.axios({
        method: "POST",
        url: "/checkValidCode",
        data
      })
        .then(result => {
          this.$toast.clear();
          

          if (result.data.code == "K001") {
            this.updatePassword();
            
          } else {
            this.$notify({
              type: "warning",
              message: result.data.msg
            });
          }
        })
        .catch(err => {
          
          this.$toast.clear();
        });
    },
    // 修改密码
    updatePassword() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      //参数序列化
      let data = utils.queryString({
        phone: this.userforgetInfo.phone,
        password: this.userforgetInfo.password,
        appkey: this.appkey
      });

      this.axios({
        method: "POST",
        url: "/retrievePassword",
        data
      })
        .then(result => {
          this.$toast.clear();
          

          if (result.data.code == "L001") {
            this.$toast(result.data.msg);
            setTimeout(() => {
              this.$router.push({ name: "Login" });
            }, 600);
          } else {
            this.$toast(result.data.msg);
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