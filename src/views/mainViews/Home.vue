<template>

  <div class="home">
   
    <div class="title">
      <div class="data">
        <div class="details">
          <div class="day" ref="day">8</div>
          <div class="month" ref="month">2222</div>
        </div>
        <div class="text" ref="text">寒冬季中,蓝朋友在的你</div>
      </div>
      <div class="seat" @click="baidu">
        <van-icon color="#3948bf" size="24px" name="location-o" />
        <div class="seat-text">{{text}}</div>
        <van-icon class="right-arrow" color="#999" size="13px" name="arrow" />
      </div>
    </div>
    <div class="banner">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(item,index) in banner" :key="index">
          <img :src="item.bannerImg" class="auto-img">
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="recommend">
      <h3>大师推荐</h3>
      <div class="produce" >
        <div v-for="(item,index) in hotProducts" :key='index' class="clear">
          <img :src="item.smallImg" @click="clickProduce(item)" class="auto-img">
          <div class="name fl">{{item.name}}</div>
          <div class="price fr">¥{{item.price}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/less/home/home.less";
import { utils } from "../../assets/js/utils";

export default {
  data() {
    return {
      banner: [],
      hotProducts:[],
      text:''
    };
  },
  created() {
    this.date();
    this.getBanner();
    this.recommend();
    this.text = sessionStorage.getItem('SEAT')
  },
  methods: {
    baidu(){
      this.$router.push({ name: "Baidu" });
      
    },
    //获取日期
    date() {
      let data = new Date();
      let month = data.getMonth() + 1;
      let day = data.getDate();
      // 
      
      let arrNamber = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      let arrEnglish = [
        "January",
        "baiFebruary",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      arrNamber.forEach((element, index) => {
        if (month == element) {
          arrEnglish.forEach((e, i) => {
            if (i == index) {
              
              this.$nextTick(function() {
                this.$refs.month.innerText = e;
              });
            }
          });
        }
      });
      this.$nextTick(function() {
        // 
        this.$refs.day.innerText = day;
        
      });
      if (month > 0 && month < 4) {
        this.$nextTick(function() {
          this.$refs.text.innerText = "春意盎然,蓝朋友陪你。";
        });
      } else if (month > 3 && month < 7) {
        this.$nextTick(function() {
          this.$refs.text.innerText = "夏日炎炎,蓝朋友陪你。";
        });
      } else if (month > 6 && month < 10) {
        this.$nextTick(function() {
          this.$refs.text.innerText = "秋风落叶,蓝朋友陪你。";
        });
      } else if (month > 9 && month < 13) {
        this.$nextTick(function() {
          this.$refs.text.innerText = "寒冬中季,蓝朋友陪你。";
        });
      }
    },
    // 获取banner图片
    getBanner() {
      this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0,
          loadingType: 'spinner'
        })
      this.axios({
        method: "GET",
        // 请求参数
        url: "/banner",
        params: {
          appkey: this.appkey
        }
      })
        .then(result => {
           this.$toast.clear();
          // 
          if (result.data.code == 300) {
            let res = result.data.result;
            for (const key in res) {
              this.banner.push(res[key]);
            }
          }
        })
        .catch(err => {
           this.$toast.clear();
          
        });
    },
    // 获取推荐商品
    recommend(){
      this.axios({
        method:'GET',
        url:'/typeProducts',
        // 
        params:{
          appkey:this.appkey,
          key:'isHot',
          value:1
        }
      }).then(result =>{
        
        if(result.data.code == 500){
          this.hotProducts = result.data.result
        }
      }).catch(err =>{
        
      })
    },
    // 跳转单Commodity页面
    clickProduce(item){
      // 
      this.$router.push({name:'Commodity',query:{id:item.pid}})
    }
  }
};
</script>
