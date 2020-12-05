<template>
  <div class="commodity">
    <div class="title">
      <van-nav-bar title="商品详情" left-text="返回" left-arrow @click-left="onClickLeft" />
    </div>
    <div class="banner">
      <img :src="introduce.large_img" class="auto-img" />
      <div class="text" :class="reace ? 'reace' : ''">
        <span>{{introduce.name}}</span>
        <span>{{introduce.enname}}</span>
      </div>
      <div class="like" :style="{color:this.like ? '#666' : '#fff'}">
        <van-icon :style="{color:this.color ? '#fff' : '#1989fa'}" name="like" @click="clickLike" />
        <span>收藏</span>
      </div>
    </div>
    <div class="content">
      <div class="tem_desc" v-for="(item,index) in introduce.rules" :key="index">
        {{item.title}}
        <div
          :class="{active:v.isActive}"
          v-for="(v, i) in item.rules"
          :key="i"
          @click="toggleRule(v, index)"
        >{{v.title}}</div>
      </div>

      <div class="dest">
        商品描述
        <div v-for="(item,index) in introduce.desc" :key="index">{{index+1}}.{{item}}</div>
      </div>
      <van-goods-action>
        <van-goods-action-icon icon="chat-o" text="客服" />
        <van-goods-action-icon icon="bag-o" text="购物袋" :badge="this.bagCount" @click="clickShopbag" />
        <van-goods-action-button
          color="rgba(25, 137, 250, 0.78)"
          @click="addShopbag"
          type="warning"
          text="加入购物车"
        />
        <van-goods-action-button @click='goOrder' color="#1989fa" type="danger" text="立即购买" />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
import "../../../assets/less/commodity/commodity.less";
import { utils } from "../../../assets/js/utils.js";

export default {
  data() {
    return {
      introduce: {},
      reace: false,
      like: false,
      // 糖/温度状态
      color: true,
      // 查询添加购物袋参数
      count: 0,

      bagCount: 0,

    };
  },
  created() {
    // banner图片
    this.getBannerImg();
    // 查寻商品是否被收藏
    this.findLike();
    // 查询购物袋
    this.findShopbag();

  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    getBannerImg() {
      // 
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });
      let id = this.$route.query.id;
      this.axios({
        method: "GET",
        url: "/productDetail",
        params: {
          appkey: this.appkey,
          pid: id
        }
      })
        .then(result => {
          this.$toast.clear();
          //   
          if (result.data.code == 600) {
            if (result.data.result[0].type == "rena_ice") {
              this.reace = true;
              this.like = true;
            }

            // 处理商品描述
            result.data.result[0].desc = result.data.result[0].desc.split(/\n/);
            /** 
             * [
                {
                  title: '温度',
                  rules: [
                    {
                      title: '热',
                      isActive: false
                    }
                  ]
                }
              ]
            */
            // 处理温度
            let ruleItems = ["tem", "sugar", "cream", "milk"];
            let rulesData = [];
            ruleItems.forEach(e => {
              if (result.data.result[0][e] == "") {
                return;
              }
              let rule = {
                title: result.data.result[0][e + "_desc"],
                rules: []
              };

              let r = result.data.result[0][e].split("/");
              //   
              r.map((v, i) => {
                let o = {
                  title: v,
                  isActive: i == 0
                };
                rule.rules.push(o);
              });
              rulesData.push(rule);
            });

            result.data.result[0].rules = rulesData;

            this.introduce = result.data.result[0];
            // 
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    // 
    goOrder(){
      this.addShopbag(true)
    },
    // 切换状态
    toggleRule(v, i) {
      if (v.isActive) {
        return;
      }
      let ruleData = this.introduce.rules[i].rules;
      // 
      for (let i = 0; i < ruleData.length; i++) {
        if (ruleData[i].isActive) {
          ruleData[i].isActive = false;
          break;
        }
      }
      v.isActive = true;
      this.findLike()
    },

    // 查寻商品是否被收藏
    findLike() {
      let id = this.$route.query.id;
      // 

      let tokenString = localStorage.getItem("CSTK");
      // 
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
        url: "/findlike",
        params: {
          appkey: this.appkey,
          pid: id,
          tokenString: tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          // 
          if (result.data.code == 1000) {
            if (result.data.result.length == 1) {
              this.color = false;
            }
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    // 收藏商品
    clickLike() {
      let id = this.$route.query.id;

      let tokenString = localStorage.getItem("CSTK");
      //  如果没有返回登录页面
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        pid: id
      });

      let url = this.color ? "/like" : "/notlike";

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      this.axios({
        method: "POST",
        url,
        data
      })
        .then(result => {
          this.$toast.clear();
          
          this.$toast(result.data.msg + "!");
          if (result.data.code == 800) {
            this.color = false;
          } else if (result.data.code == 900) {
            this.color = true;
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    // 加入购物袋
    addShopbag(isBuy) {
      let id = this.$route.query.id;

      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      let rules = this.introduce.rules;
      
      let rule = [];

      rules.map(v => {
        for (let i = 0; i < v.rules.length; i++) {
          if (v.rules[i].isActive) {
            rule.push(v.rules[i].title);
            break;
          }
        }
      });
      // 

      // 序列化参数
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        pid: id,
        count: this.count,
        rule: rule.join("/")
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
        url: "/addShopcart",
        data
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 3000) {
            if (result.data.status == 1) {
              //累加徽章数量, 购物车数据，而不是购物车商品总数量
              this.bagCount++;
            }

            if(isBuy == true){
              // 立即购买
              setTimeout(()=>{
                this.$router.push({name:'Pay',query:{sid:result.data.sid}})
              },600)
            }
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 查询购物袋
    findShopbag() {
      let id = this.$route.query.id;

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
        url: "/findAllShopcart",
        params:{
          appkey:this.appkey,
          tokenString,
        }
      }).then(result =>{
        this.$toast.clear()
        // 
        if(result.data.code == 5000){
          this.bagCount = result.data.result.length;
          // 
        }else{
          this.$toast(result.data.msg)
        }
      }).catch(err=>{
        this.$toast.clear()
        
      })
    },

    clickShopbag(item){
      this.$router.push({name:'Shopbag'})
    }
  }
};
</script>
