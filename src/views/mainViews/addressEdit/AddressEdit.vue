<template>
  <div class="addressEdit">
    <van-nav-bar
      :title="aid ? '修改地址' : '新增地址'"
      left-text="返回"
      left-arrow
      :fixed="true"
      @click-left="back"
    />
    <van-address-edit
      :area-list="areaList"
      show-postal
      :show-delete="aid? true:false"
      show-set-default
      :address-info="addressInfo"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>

<script>
import areaList from "../../../assets/js/arealist";
import { utils } from "../../../assets/js/utils";
export default {
  data() {
    return {
      areaList,
      aid: false,
      // 地址初始值
      addressInfo: {
        id: "",
        name: "",
        tel: "",
        province: "",
        city: "",
        county: "",
        addressDetail: "",
        areaCode: "",
        postalCode: "",
        isDefault: false
      }
    };
  },
  created() {
    this.aid = this.$route.query.aid;
    // if (this.aid) {
      this.getAddressDataByAid();
    // }
  },
  methods: {
    //  返回上一页
    back() {
      this.$router.go(-1);
    },
    // 新增地址
    newAddress(address) {
      let content = Object.assign({}, address);

      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }
      // 使用自身id country为空的
      delete content.id;
      delete content.country;

      // 转Number
      content.isDefault = Number(content.isDefault);

      content.appkey = this.appkey;
      content.tokenString = tokenString;

      // 序列化参数
      let data = utils.queryString(content);

      

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      this.axios({
        method: "POST",
        url: "/addAddress",
        data
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 9000) {
            setTimeout(() => {
              this.$router.go(-1);
            }, 1500);
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    // 编辑地址
    editAddress(content) {
      // 
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }
      
      // this.newAddress(content);

      //判断地址是否被修改
      let isModify = false;
      for (const key in this.addressInfo) {
        if (this.addressInfo[key] != content[key]) {
          //已经被修改了
          isModify = true;
          break;
        }
      }
      if (isModify) {
        // 发起修改地址请求
        let addressData = Object.assign({}, content);
        delete addressData.country;
        delete addressData.id;

        addressData.aid = this.aid;
        addressData.tokenString = tokenString;
        addressData.appkey = this.appkey;
        addressData.isDefault = Number(addressData.isDefault);
        
        //序列化参数
        let data = utils.queryString(addressData);

        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
          loadingType: "spinner"
        });

        this.axios({
          method: "POST",
          url: "/editAddress",
          data
        })
          .then(result => {
            this.$toast.clear();
            
            if (result.data.code == 30000) {
              setTimeout(() => {
                this.$router.push({ name: "Address" });
              }, 1000);
            }
          })
          .catch(err => {
            this.$toast.clear();
            
          });
      } else {
        this.$router.push({ name: "Address" });
      }
    },
    // 保存地址
    onSave(address) {
      
      if (this.aid) {
        this.editAddress(address);
      } else {
        this.newAddress(address);
      }
    },
    //根据aid查询地址数据
    getAddressDataByAid() {
      //获取token字符串
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

      this.axios({
        method: "GET",
        url: "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 40000) {
            for (const key in this.addressInfo) {
              if (key == "id") {
                this.addressInfo[key] = result.data.result[0].aid;
                //   
                continue;
              }
              this.addressInfo[key] =
                key == "isDefault"
                  ? Boolean(result.data.result[0][key])
                  : result.data.result[0][key];
            }
            
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    // 删除
    onDelete() {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      //参数序列化
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        aid: this.aid
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      this.axios({
        method: "POST",
        url: "/deleteAddress",
        data
      })
        .then(result => {
          this.$toast.clear();
          
          this.$toast(result.data.msg);
          if (result.data.code == 10000) {
            setTimeout(() => {
              this.$router.push({ name: "Address" });
            }, 1000);
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    }
  }
};
</script>
<style lang="less">
.van-address-edit {
  margin-top: 46px;
}
.van-button--danger {
  border-color: #1898fa;
  background-color: #1898fa;
}
</style>