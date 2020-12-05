
 <template>
  <div class="baidu">
    <div class="v-img" @click="goHome">
      <img src="../../../assets/image/return.png" alt />
    </div>
    <div id="map" style="width:100%;height:667px;"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lng: "",
      lat: ""
    };
  },
  created() {
  },
  methods: {
    goHome() {
      this.$router.go(-1);
    }
  },
  mounted() {
    // 百度地图API功能
    var map = new BMap.Map("map"); // 创建Map实例
    map.centerAndZoom(new BMap.Point(121.551257, 38.890002), 11); // 初始化地图,设置中心点坐标和地图级别
    //添加地图类型控件
    map.addControl(
      new BMap.MapTypeControl({
        mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
      })
    );
    map.setCurrentCity("广州"); // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

    var point = new BMap.Point(this.lng, this.lat);
    map.centerAndZoom(point, 10);
    var marker = new BMap.Marker(point); // 创建标注

    // marker.setTitle("广州");
    map.addOverlay(marker); // 将标注添加到地图中
    // 设置标注动画效果。如果参数为null，则取消动画效果。该方法需要在addOverlay方法后设置
    marker.setAnimation(Animation);

    // 根据浏览器定位
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(
      function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          var mk = new BMap.Marker(r.point);
          map.addOverlay(mk);
          map.panTo(r.point);
          this.lng = r.point.lng;
          this.lat = r.point.lat;

          var city_name = r.address.province + r.address.city;
          // 
          sessionStorage.setItem("SEAT", city_name);
        }
      },
      { enableHighAccuracy: true }
    );
  }
};
</script>
<style lang="less">
.BMap_cpyCtrl {
  display: none;
}
.anchorBL {
  display: none;
}
.baidu {
  position: relative;
}
.v-img {
  position: absolute;
  top: 10px;
  left: 15px;
  z-index: 99999;
  height: 40px;
  width: 50px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>