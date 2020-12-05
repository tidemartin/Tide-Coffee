<template>
  <div class="shopbag">
    <div class="navbar">
      <van-nav-bar
        title="购物袋"
        left-text="返回"
        left-arrow
        @click-right="onClickRight"
        @click-left="onClickLeft"
      >
        <template #right v-if="isActive == true">编辑</template>
        <template #right v-else-if="isActive == false">完成</template>
      </van-nav-bar>
    </div>
    <div class="shop-bag-img">
      <img src="../../assets/image/shop_bag.png" alt />
    </div>
    <div class="box">
      <div class="swellcell">
        <van-swipe-cell :disabled="isActive" v-for="(item,index) in Allorder" :key="index">
          <van-checkbox v-model="item.isCkeck" @click="simpleSeletor"></van-checkbox>
          <div class="box-img">
            <img :src="item.small_img" alt />
          </div>
          <div class="item">
            <div class="title">{{item.name}}</div>
            <div class="englishtitle">{{item.enname}}</div>
            <div class="price">¥{{item.price}}</div>
            <van-card class="goods-card" right-width="300px" />
          </div>
          <div class="selector">{{item.rule}}</div>
          <van-stepper
            @change="changeCount(item)"
            v-model="item.count"
            theme="round"
            button-size="22"
            disable-input
          />
          <template #right>
            <van-button
              @click="oneShopbag(item.sid)"
              square
              text="删除"
              type="danger"
              class="delete-button"
            />
          </template>
        </van-swipe-cell>
      </div>
    </div>
    <van-popup v-model="removetost" :close-on-click-overlay="false">
      <div class="remove-top" ref="deletes">是否删除</div>
      <div class="remove-bottom clear">
        <div class="fl" @click="clickSelector1">否</div>
        <div class="fr" @click="clickSelector2">是</div>
      </div>
    </van-popup>

    <div v-if="Allorder.length > 0" class="submitOder">
      <van-submit-bar v-show="isActive" :price="total" @submit="Pay" button-text="提交订单">
        <van-checkbox v-model="allCkeck" @click="allSelector">全选</van-checkbox>
      </van-submit-bar>

      <van-submit-bar
        v-show="!isActive"
        class="delete"
        :price="3050"
        button-text="删除选择"
        @submit="allShopbag"
      >
        <van-checkbox v-model="allCkeck" @click="allSelector">全选</van-checkbox>
      </van-submit-bar>
    </div>
    <div v-else class="empty">
      <van-empty
        class="custom-image"
        image="https://img.yzcdn.cn/vant/custom-empty-image.png"
        description="购物车是空的哦!"
      />
      <van-button @click="GoForaWalk" round type="danger" class="bottom-button">去逛一逛</van-button>
    </div>
  </div>
</template>

<script>
import "../../assets/less/shopbag/shopbag.less";
import { utils } from "../../assets/js/utils";
export default {
  data() {
    return {
      // 订单显示
      isActive: true,
      // 全选状态
      allCkeck: false,
      isValue: 1,
      // 弹出提示状态
      removetost: false,
      // 弹出提示内容
      deletes: "",
      // 价格总和
      total: 0,

      Allorder: [],
      Allorders:[],

      // 点击的id
      sid: ""
    };
  },
  created() {
    this.findShopbag();
    //
  },
  methods: {
    // 返回
    onClickLeft() {
      this.$router.push({ name: "Menu" });
    },
    // 编辑&完成
    onClickRight() {
      this.isActive = !this.isActive;
      //
    },
    //查询购物袋
    findShopbag() {
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
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == 5000) {
            result.data.result.map(v => {
              v.isCkeck = false;
            });
            this.Allorder = result.data.result;
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },
    // 单选
    simpleSeletor() {
      this.sum();
      for (let i = 0; i < this.Allorder.length; i++) {
        //   如果一个为false 那么所有的都为false
        if (!this.Allorder[i].isCkeck) {
          this.allCkeck = false;
          return;
        }
      }
      this.allCkeck = true;
    },

    // 全选
    allSelector() {
      this.Allorder.map(v => {
        v.isCkeck = this.allCkeck;
      });
      this.sum();
    },

    // 改变数量
    changeCount(item) {
      //

      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      // 序列化参数
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        sid: item.sid,
        count: item.count
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data
      })
        .then(result => {
          this.$toast.clear();
          this.sum();
          //
          if (result.data.code != 6000) {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },
    // 是否
    clickSelector1() {
      this.removetost = false;
    },
    // 删除购物袋商品
    removeShopbag(sids) {
      // sids:是所有sid的集合  类型array
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      //参数序列化
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        sids: JSON.stringify(sids)
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      return this.axios({
        method: "POST",
        url: "/removeShopcart",
        data
      });
    },
    // 删除单个或者选择购物商品
    clickSelector2() {
      this.removetost = false;

      if (this.deletes == "是否删除") {
        let sid = [this.sid];
        //
        this.removeShopbag([sid])
          .then(result => {
            this.$toast.clear();
            //
            this.sum();
            if (result.data.code == 7000) {
              for (let i = this.Allorder.length - 1; i >= 0; i--) {
                if (this.Allorder[i].sid == sid) {
                  this.Allorder.splice(i, 1);
                }
              }
            }
          })
          .catch(err => {
            this.$toast.clear();
          });
      } else if (this.deletes == "是否全部删除") {
        //
        let sids = [];
        this.Allorder.map(v => {
          if (v.isCkeck) {
            sids.push(v.sid);
          }
        });
        this.removeShopbag(sids)
          .then(result => {
            this.$toast.clear();
            this.sum();

            if (result.data.code == 7000) {
              for (let i = this.Allorder.length - 1; i >= 0; i--) {
                if (this.Allorder[i].isCkeck) {
                  this.Allorder.splice(i, 1);
                }
              }
            }
          })
          .catch(err => {
            this.$toast.clear();
          });
      }
    },
    // 弹出提示是否删除
    oneShopbag(sid, index) {
      this.removetost = true;
      this.$nextTick(() => {
        this.$refs.deletes.innerText = "是否删除";
        this.deletes = this.$refs.deletes.innerText;
      });
      this.sid = sid;
    },
    // 弹出提示是否全部删除
    allShopbag(sid) {
      //
      this.removetost = true;
      this.$nextTick(() => {
        this.$refs.deletes.innerText = "是否全部删除";
        this.deletes = this.$refs.deletes.innerText;
      });
    },
    // 计算价格总和
    sum() {
      this.total = 0;
      this.Allorder.map(v => {
        if (v.isCkeck) {
          this.total += v.count * v.price;
        }
      });

      this.total *= 100;
    },
    // 回到菜单页
    GoForaWalk() {
      this.$router.push({ name: "Menu" });
    },
    // 支付页面
    Pay() {
      //
      this.Allorder.map(v => {
        if (v.isCkeck == false) {
          this.$toast("请选择商品");
          return;
        } else {
        
          this.Allorders.push(v);
          
          let user = "";
          this.Allorders.map(e => {
            user += e.sid + "&";
          });
          user = user.slice(0, -1);
          // console.log('user =>',user);
          this.$router.push({name:'Pay' ,query:{sid:user,isPay:true}})
        }
      });
    }
  }
};
</script>
