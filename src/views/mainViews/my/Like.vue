<template>
  <div class="all-like">
    <van-nav-bar title="我的收藏" left-text="返回" left-arrow fixed @click-left="onClickLeft" />
    <div v-if="islike" class="v-like">
      <div class="v-item" v-for="(item,index) in allLike" :key="index">
        <div class="v-img">
          <img :src="item.smallImg" alt />
        </div>
        <div class="name">{{item.name}}</div>
        <div class="price">
          ¥{{item.price}}
          <van-icon @click="removeLike(item.pid,index)" size="18px" color="#999" name="delete" />
        </div>
      </div>
    </div>
    <div v-else class="empty">
      <van-empty
        class="custom-image"
        image="https://img.yzcdn.cn/vant/empty-image-default.png"
        description="你还没有收藏任何商品哦!"
      />
      <van-button @click="GoForaWalk" round type="danger" class="bottom-button">去逛一逛</van-button>
    </div>
  </div>
</template>

<script>
import "../../../assets/less/like/like.less";
import {utils} from '../../../assets/js/utils'
export default {
  data() {
    return {
      islike:true,
      allLike: []
    };
  },
  created() {
    this.findAllLike();
  },
  methods: {
    onClickLeft() {
      this.$router.back();
    },
    // 回到菜单页
    GoForaWalk(){
      this.$router.push({name:'Menu'})
    },
    // 查询收藏商品接口
    findAllLike() {
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
        url: "/findAllLike",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 2000) {
            this.allLike = result.data.result;
            
            // this.islike = false
            if(this.allLike.length == 0){
              this.islike = false
              return;
            }
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    // 删除收藏
    removeLike(pid,index) {
      
      
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      let data = utils.queryString({
          appkey:this.appkey,
          tokenString,
          pid:pid,
      })

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "circular"
      });

      this.axios({
          method:'POST',
          url:'/notlike',
          data
      }).then(result =>{
          this.$toast.clear()
          
          if(result.data.code == 900){
              this.allLike.splice(index,1)
              this.$toast('已删除')
          }
      }).catch(err =>{
          this.$toast.clear()
          
      })

    }
  }
};
</script>

<style lang="less" scoped>
</style>