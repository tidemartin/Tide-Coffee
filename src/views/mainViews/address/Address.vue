<template>
  <div class="adress">
    <div class="title">
      <van-nav-bar title="地址管理" left-text="返回" left-arrow fixed @click-left="onClickLeft" />
    </div>
    <div v-if="isEmpty" class="face">
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
        @select="modify"
      />
    </div>
    <div v-else class="empty">
      <van-empty
        class="custom-image"
        image="https://img.yzcdn.cn/vant/empty-image-default.png"
        description="你还没有任何的收货地址哦!"
      />
      <van-button @click="GoaddAddress" round type="danger" class="bottom-button">去新增地址</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chosenAddressId: "",
      list: [],
      isEmpty:true
    };
  },
  created() {
    this.getReceiveAddress();
    // 
    this.ints = this.$route.query.int
  },
  methods: {
    // 点击radius变成默认
    modify(item) {
      
      this.chosenAddressId = item.id;
        
        this.$router.push({ name: "Pay",query: { id: this.chosenAddressId}});

    },
    onClickLeft() {
      this.$router.back()
    },
    // 查询地址
    getReceiveAddress() {
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
              let address = v.province + v.city + v.county + v.addressDetail;
              this.list.push({
                id: v.aid,
                name: v.name,
                tel: v.tel,
                address,
                isDefault: Boolean(v.isDefault)
              });
             
            });
             
             if(this.list.length == 0){
               this.isEmpty = false
             }
            this.list.forEach(e => {
              if (e.isDefault) {
                this.chosenAddressId = e.id;
              }
            });
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    // 新增地址
    onAdd() {
      this.$router.push({ name: "AddressEdit" });
    },
    // 编辑地址
    onEdit(item, index) {
      // 
      this.$router.push({ name: "AddressEdit", query: { aid: item.id } });
    },
    // 新增地址
    GoaddAddress(){
      this.$router.push({name:'AddressEdit'})
    }
  }
};
</script>
<style lang="less">
.adress {
  height: 667px;
  background: #f2f2f2;
  .face {
    margin-top: 46px;
    .van-button--danger {
      border-color: #1989fa;
      background-color: #1989fa;
    }
    .van-tag--danger {
      background-color: #1989fa;
    }
    .van-address-item .van-radio__icon--checked .van-icon {
      border-color: #1989fa;
      background-color: #1989fa;
    }
  }

  .empty{
    padding-top: 90px;
    .van-button--danger{
      border:1px solid #1989fa;
      background-color: #1989fa;
    }
  }
}
</style>