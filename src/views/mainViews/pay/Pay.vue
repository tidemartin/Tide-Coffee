<template>
  <div class="pay">
    <div class="title">
      <van-nav-bar title="提交订单" fixed left-text="返回" left-arrow @click-left="onClickLeft" />
    </div>
    <div class="oderdata">
      <div class="address" @click="adressManage">
        <div class="selector">选择收货地址</div>
        <van-icon name="arrow" />
      </div>
      <div class="personaldata">
        <div class="top">
          <div class="name">{{addressgoods.name}}</div>
          <div class="phone">{{addressgoods.tel}}</div>
        </div>
        <div class="bottom">{{addressData}}</div>
      </div>
    </div>
    <div class="goods">
      <div class="goodsdata">订单信息</div>

      <div>
        <div class="content" v-for="(item,index) in sidsOrderDatas" :key="index">
          <div class="v-img">
            <img :src="item.small_img" alt />
          </div>
          <div class="data">
            <div class="data-name">
              <div class="v-name">{{item.name}}</div>
              <div class="host">{{item.rule}}</div>
            </div>
            <div class="enname">{{item.enname}}</div>
            <div class="data-price clear">
              <div class="v-price fl">¥{{item.price}}</div>
              <div class="v-count fr">x{{item.count}}</div>
            </div>
          </div>
        </div>
        <div class="price clear">
          <div class="count fl">共计&nbsp;{{totalCount}}&nbsp;件商品</div>
          <div class="total fr">合计&nbsp;¥{{totalPrice}}</div>
          <div class="semi-circle">
            <div class="left-top-circle"></div>
            <div class="left-bottom-circle"></div>
            <div class="right-top-circle"></div>
            <div class="right-bottom-circle"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="close">
      <button @click="pay" :class="active ? 'active' : ''">立即结算</button>
    </div>
  </div>
</template>

<script>
import "../../../assets/less/pay/pay.less";
import { utils } from "../../../assets/js/utils";
export default {
  data() {
    return {
      active: false,
      // 地址详情
      addressgoods: [],
      // 地址
      addressData: "",
      // 商品数据详情
      sidsOrderDatas: [],
      // 数量总和
      totalCount: 0,
      // 价格总和
      totalPrice: 0,
      // 地址id
      id: "",
      sid: "",
      // 点击立即结算的数据
      int: [],
      // 布尔值
      isPay: ""
    };
  },
  created() {
    this.getGoods();

    // 传过来的地址id
    this.id = this.$route.query.id;
    // console.log(this.id)

    this.sid = this.$route.query.sid;
    // console.log(this.$route.query.sid);
    //
    this.creaCountPrice()
    this.getSessionStorageData();
  },
  methods: {
    onClickLeft() {
      this.$router.push({ name: "Shopbag" });
    },
    adressManage() {
      this.$router.push({ name: "Address" });
    },
    // 存入sessionStorage
    creaCountPrice() {
      if (this.sid == undefined) {
        return;
      }
      sessionStorage.setItem("user", this.sid);
    },
    // 在sessionStorage拿sid
    getSessionStorageData() {
      let tokenString = localStorage.getItem("CSTK");

      let data = sessionStorage.getItem("user");
      // console.log("data==>", data);
      if (data == undefined) {
        return;
      }
      data = data.split("&");

      //

      this.axios({
        method: "GET",
        url: "/commitShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(data)
        }
      })
        .then(result => {
          if (result.data.code == 50000) {
            result.data.result.map(v => {
              if (v.count == 0) {
                v.count = 1;
              }
              this.totalCount += v.count;
              this.totalPrice += v.count * v.price;
            });
            this.totalPrice = `${this.totalPrice}.00`;
            this.sidsOrderDatas = result.data.result;
          }
        })
        .catch(err => {});
    },
    // 查询需要购买商品接口
    getGoods() {
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      this.axios({
        method: "GET",
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          //
          if (result.data.code == 20000) {
            result.data.result.map(v => {
              //
              if (v.aid == this.id) {
                this.addressgoods = v;
                this.addressData =
                  v.province + v.city + v.county + v.addressDetail;
              } else if (v.isDefault == 1) {
                this.addressgoods = v;
                this.addressData =
                  v.province + v.city + v.county + v.addressDetail;
              }
            });
            // 号码
            //
            // 地址
            //
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },
    // 立即结算
    pay() {
      this.active = !this.active;
      if (this.addressgoods == "") {
        this.$toast("请选择收货地址");
        return;
      }

      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      // 拿sids
      let sids = sessionStorage.getItem("user");
      if(sids == undefined){
        return this.$toast('请选择商品')
      }

      sids = sids.split("&");
      // console.log(sids)
      
    
      //参数序列化
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        sids: JSON.stringify(sids),
        phone: this.addressgoods.tel,
        address: this.addressData,
        receiver: this.addressgoods.name
      });

      //

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      this.axios({
        method: "POST",
        url: "/pay",
        data
      })
        .then(result => {
          this.$toast.clear();
          //
          if (result.data.code == 60000) {
            this.$toast(result.data.msg);
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("int");
            setTimeout(() => {
              this.$router.push({ name: "Order" });
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

