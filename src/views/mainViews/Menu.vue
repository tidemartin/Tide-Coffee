<template>
  <div class="menu">
    <div class="mask" ref="show">
      <div class="show">
        <form action="/">
          <van-search
            v-model="value"
            show-action
            placeholder="请输入搜索关键词"
            background="#1989fa"
            shape="round"
            @search="onSearch"
            @cancel="onCancel"
          />
        </form>
        <div
          class="searchData"
          ref="searchData"
          @click="goData(item)"
          v-for="(item,index) in searchData"
          :key="index"
        >{{item.name}}</div>
      </div>
    </div>
    <div class="title">
      <div class="return">
        <van-icon name="arrow-left" color="#1989fa" @click="clickLogin" size="24px" />
      </div>
      <div class="position" @click="GoMap">
        <van-icon color="#3948bf" size="22px" name="location-o" />
        <div class="text">{{text}}</div>
        <van-icon class="right-arrow" color="#999" size="13px" name="arrow" />
      </div>
    </div>
    <div class="swipe">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item
          v-for="(item,index) in swipeImg"
          :key="index"
          :style="{backgroundImage:`url(${item.url})`,backgroundPositionY:-item.p + 'px'}"
        >
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="label" ref="label">
      <div
        class="box"
        ref="box"
        @touchstart="start"
        @touchmove="move"
        :style="{left:this.left + 'px',width:this.width +'px'}"
      >
        <div class="type" @click="showView">
          <van-icon style="margin-top:8px" name="search" size="50px" />
          <div class="content" style="margin-top:0">搜索</div>
        </div>
        <div
          class="type"
          @click="toggleType(item)"
          ref="type"
          v-for="(item,index) in typedata"
          :key="index"
        >
          <div
            class="label-icon"
            :style="{backgroundImage:`url(${item.isActive ? item.activeIcon : item.icon})`}"
          ></div>
          <div class="content" :class="item.isActive ? 'radiu' : ''">{{item.typeDesc}}</div>
        </div>
      </div>
    </div>
    <div class="package">
      <div class="details">
        <div class="item" v-for="(item,index) in detailsData" :key="index">
          <div
            class="details-left"
            @click="getDetails(item)"
            :style="{backgroundImage:`url(${item.smallImg})`}"
          ></div>
          <div class="details-right">
            <div class="name" @click="getDetails(item)">{{item.name}}</div>
            <div class="englishName">{{item.enname}}</div>
            
          </div>
           <div class="and">
            <div class="money">￥{{item.price}}</div>
            
          </div> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/less/menu/menu.less";
import { Toast } from "vant";
export default {
  data() {
    return {
      text:'',
      value: "",
      searchData: [],
      pageX: 0,
      //   moveX:0,
      left: 0,
      width: 0,
      swipeImg: [
        {
          url:
            "http://www.kangliuyong.com:10002/images/product_small/IMG_0381_02p.jpg",
          p: 16
        },
        {
          url:
            "http://www.kangliuyong.com:10002/images/product_small/IMG_0379_02p.jpg",
          p: 50
        },
        {
          url:
            "http://www.kangliuyong.com:10002/images/product_small/IMG_0387_02p.jpg",
          p: 0
        }
      ],
      lableType: [
        {
          title: "咖啡",
          type: "coffee",
          icon: require("../../assets/image/icons_05.gif"),
          activeIcon: require("../../assets/image/icons_19.gif")
        },
        {
          title: "拿铁",
          type: "latte",
          icon: require("../../assets/image/icons_03.gif"),
          activeIcon: require("../../assets/image/icons_18.gif")
        },
        {
          title: "瑞纳冰",
          type: "rena_ice",
          icon: require("../../assets/image/icons_07.gif"),
          activeIcon: require("../../assets/image/icons_20.gif")
        }
      ],
      // 类型
      typedata: [],
      // 数据
      detailsData: []
    };
  },
  created() {
    this.text = sessionStorage.getItem('SEAT')
    this.getTypeData();
  },
  methods: {
    // GoMap
    GoMap(){
      this.$router.push({name:'Baidu'})
    },
    // clickLogin
    clickLogin() {
      this.$router.push({ name: "Login" });
    },
    // 搜索
    onSearch(val) {
      
      
      if (this.value == "") {
        this.searchData = [];
        this.$toast("请输入关键词");
        return;
      }
      this.axios({
        method: "GET",
        url: "/search",
        params: {
          appkey: this.appkey,
          name: this.value
        }
      })
        .then(result => {
          
          if (result.data.code == "Q001") {
            if(result.data.result.length == 0){
               this.$toast("没有搜索到你要的商品");
               return
            }
            this.searchData = result.data.result;
          }
        })
        .catch(err => {
          
        });
    },
    // 点击搜索的商品
    goData(item) {
      
      // 
      if(item.type == 'coffee' || item.type == 'rena_ice'){
        this.left = -225
      }
     
      for (let i = 0; i < this.typedata.length; i++) {
        this.typedata[i].isActive = false
        if(this.typedata[i].type.indexOf(item.type) > -1){
           this.typedata[i].isActive = true
        }
      }
      this.getContent(item)
      this.onCancel()
    },
    onCancel() {
      this.$refs.show.style.display = "none";
    },
    start(e) {
      // 
      this.pageX = e.changedTouches[0].pageX;
    },
    move(e) {
      let boxW = this.$refs.box.clientWidth;
      let labelW = this.$refs.label.clientWidth;
      let W = -(boxW - labelW);

      let x = e.changedTouches[0].pageX - this.pageX;

      let left = this.left + x;

      left = left > 0 ? 0 : left < W ? W : left;
      this.left = left;
      this.pageX = e.changedTouches[0].pageX;
    },
    //
    showView() {
      this.value = ''
      this.searchData = [];
      // 
      // 
      this.$refs.show.style.display = "block";
    },
    // 获取商品类型
    getTypeData() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });
      this.axios({
        method: "GET",
        url: "/type",
        params: {
          appkey: this.appkey
        }
      })
        .then(result => {
          this.$toast.clear();
          //   
          if (result.data.code == 400) {
            // 
            result.data.result.forEach(element => {
              for (let i = 0; i < this.lableType.length; i++) {
                if (element.type == this.lableType[i].type) {
                  element.icon = this.lableType[i].icon;
                  element.activeIcon = this.lableType[i].activeIcon;
                  element.isActive = false;
                  // 
                }
              }
            });

            result.data.result.unshift({
              type: "isHot",
              typeDesc: "推荐",
              icon: require("../../assets/image/icons_09.gif"),
              activeIcon: require("../../assets/image/icons_21.gif"),
              isActive: true
            });

            this.typedata = result.data.result;
            // this.count = this.typedata.length;
            // 

            this.getContent(this.typedata[0]);

            this.$nextTick(() => {
              let width = this.$refs.type[0].clientWidth;

              this.width = (this.typedata.length + 1) * 120;
              // 
              //   
            });
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    // 切换商品
    toggleType(item) {
      // 
      // 
      if (item.isActive) {
        return;
      }

      for (let i = 0; i < this.typedata.length; i++) {
        if (this.typedata[i].isActive) {
          this.typedata[i].isActive = false;
          break;
        }
      }
      item.isActive = true;

      //根据商品类型获取商品数据
      this.getContent(item);
    },
    // 获取商品内容
    getContent(item) {
      this.detailsData = [];

      // 如果存在缓存数据,则在缓存获取商品数据,不发起请求
      let data = sessionStorage.getItem(item.type);
      //  
      if (data) {
        //  
        this.detailsData = JSON.parse(data);

        return;
      }
      // 

      let params = {
        key: "type",
        value: item.type,
        appkey: this.appkey
      };
      if (item.type == "isHot") {
        params.key = "isHot";
        params.value = 1;
      }
      // 

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });
      this.axios({
        method: "GET",
        url: "/typeProducts",
        params
      })
        .then(result => {
          this.$toast.clear();
          if (result.data.code == 500) {
            //   
            this.detailsData = result.data.result;

            //将商品数据缓存
            sessionStorage.setItem(item.type, JSON.stringify(this.detailsData));
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    getDetails(item) {
      this.$router.push({ name: "Commodity", query: { id: item.pid } });
    }
  }
};
</script>
