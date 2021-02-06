<template>
  <div class="set-location pr">
    <div class="top-search">
      <van-search
        background="transparent"
        @search="searchLocInfoList"
        v-model="searchInfo"
        action-text="返回"
        show-action
        @cancel="returnPrev"
        placeholder="请输入搜索关键词"
      />
    </div>
    <div v-show="resultShow" class="result-pannel">
      <ul class="result-list">
        <li
          @click="resultItemClick(item)"
          v-for="(item, index) in locationResultList"
          :key="index"
        >
          <div class="result-content">
            <p class="main">
              <span>{{ item.name }}</span>
              <span v-if="item.address.length">{{
                "（" + item.address + "）"
              }}</span>
            </p>
            <p v-if="item.district" class="sub">{{ item.district }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div v-show="confirmBtnShow" class="bottom-btn">
      <van-button @click="saveLocation" block type="info"
        >确认地址选择</van-button
      >
    </div>
    <el-amap
      ref="infoWindow"
      :map-style="mapOps.mapStyle"
      :amap-manager="mapOps.amapManager"
      :events="mapOps.events"
      :zooms="mapOps.zooms"
      :center="mapOps.center"
      class="map-container"
    >
      <el-amap-marker
        v-if="!!positionInfo && position.length"
        :visible="!!positionInfo"
        :position="position"
      ></el-amap-marker>
    </el-amap>
  </div>
</template>

<script>
import Vue from "vue";
import { Search } from "vant";
Vue.use(Search);
import { assign, debounce } from "lodash-es";
//引入高德地图
import VueAMap from "vue-amap";
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: "36dfcfb4e0aea15be5a027d67d4d6f9c",
  plugin: [
    "AMap.Geocoder",
    "AMap.Autocomplete",
    "Amap.PlaceSearch",
    "AMap.OverView",
  ],
  v: "1.4.6",
});
import { AMapManager } from "vue-amap";
export default {
  props: ["query"],
  data() {
    const vm = this;
    return {
      //逻辑控制字段
      mapLoad: true,
      resultShow: false,
      confirmBtnShow: false,
      //页面接收数据
      positionData: {},
      //组件基础数据
      searchInfo: null,
      locationResultList: [],
      //子组件基础数据
      position: [],
      positionInfo: "",
      geocoder: null,
      autocomplete: null,
      placeSearch: null,
      infoWindow: null,
      mapOps: {
        zooms: [3, 19],
        center: [116.857461, 38.310582],
        amapManager: new AMapManager(),
        events: {
          complete() {
            vm.amap = vm.mapOps.amapManager.getMap();
            vm.geocoder = new AMap.Geocoder();
            vm.autocomplete = new AMap.Autocomplete();
            vm.placeSearch = new AMap.PlaceSearch({
              map: vm.amap,
            });
            if (vm.position && vm.position[0]) {
              vm.showInfoWindow({
                position: vm.position,
                content: vm.positionInfo,
              });
            } else if (
              vm.positionData.location.longitude &&
              vm.positionData.location.latitude
            ) {
              //获取传入的位置信息
              vm.position = [
                vm.positionData.location.longitude,
                vm.positionData.location.latitude,
              ];
              vm.positionInfo =
                vm.positionData.quarantinePointLocalAddress || null;
              vm.showMarker();
            }
            vm.mapLoad = false;
          },
          click: debounce(function (e) {
            console.log(e);
            if (
              vm.positionData.pageType === "add" ||
              vm.positionData.pageType === "edit"
            ) {
              vm.position = [e.lnglat.R, e.lnglat.Q];
              vm.hideInfoWindow();
              vm.showMarker();
            }
          }, 150),
        },
      },
      amap: null,
    };
  },
  methods: {
    //监听谷歌地图加载完成
    gmapInit() {
      console.log("init");
      //仅限首次完成
      if (this.gmap) {
        return;
      }
      this.$refs.gmap.$_getMap().then((res) => {
        this.gmap = res;
        this.geocoder = new google.maps.Geocoder();
        this.autocomplete = new google.maps.places.AutocompleteService();
        this.placeSearch = new google.maps.places.PlacesService(res);
        if (this.position && this.position[0]) {
          this.showInfoWindow({
            position: this.position,
            content: this.positionInfo,
          });
        } else if (
          this.positionData.location.longitude &&
          this.positionData.location.latitude
        ) {
          //获取传入的位置信息
          this.position = [
            this.positionData.location.longitude,
            this.positionData.location.latitude,
          ];
          this.positionInfo = this.positionData.detail.address || null;
          this.showMarker();
        }
        this.mapLoad = false;
      });
    },
    //点击谷歌地图
    gmapClick: debounce(function (e) {
      const vm = this;
      console.log(e.latLng.lat());
      if (vm.positionData.type === "add" || vm.positionData.type === "edit") {
        vm.position = [e.latLng.lng(), e.latLng.lat()];
        vm.hideInfoWindow();
        vm.showMarker();
      }
    }, 150),
    //模糊查询地理位置信息（输入提示）
    searchLocInfoList(queryStr) {
      console.log(queryStr, this.autocomplete);
      if (this.autocomplete) {
        this.autocomplete.search(queryStr, (status, res) => {
          console.log(status, res);
          if (status === "complete") {
            this.locationResultList = res.tips;
            this.resultShow = true;
          } else {
            this.locationResultList = [];
          }
        });
      } else {
        callback([]);
      }
    },
    //点击提示结果
    resultItemClick(data) {
      console.log(data);
      this.positionInfo = data.district ? data.district + data.name : data.name;
      if (data.location) {
        this.position = [data.location.R, data.location.Q];
        this.showMarker();
        this.resultShow = false;
      } else {
        this.$request({
          method: "get",
          url: "https://restapi.amap.com/v3/geocode/geo?parameters",
          params: {
            key: "589713192e1c3322729e7d75f12147c6",
            address: this.positionInfo,
          },
          noToken: true,
          noOpenid: true,
        }).then(
          (res) => {
            console.log(res);
            if (res.data.status === "1") {
              this.position = res.data.geocodes[0]["location"].split(",");
              this.showMarker();
              this.resultShow = false;
            }
          },
          (err) => {
            console.log(err);
          }
        );
      }
    },
    //显示标记
    showMarker() {
      const vm = this;
      if (!vm.positionInfo) {
        vm.amap &&
          vm.geocoder.getAddress(vm.position, (status, res) => {
            if (status === "complete" && res.info === "OK") {
              console.log(res);
              vm.positionInfo = res.regeocode.formattedAddress;
              vm.showInfoWindow({
                position: vm.position,
                content: vm.positionInfo,
                autoMove: false,
              });
              this.confirmBtnShow = true;
            }
          });
      } else {
        vm.showInfoWindow({
          autoMove: false,
          position: vm.position,
          content: vm.positionInfo,
        });
        this.confirmBtnShow = true;
      }
    },
    //显示信息窗口
    showInfoWindow(ops) {
      const [lng, lat] = ops.position;
      if (this.positionInfo.type === "view") {
      }
      this.setZoomAndCenter(18, [lng, lat]);
      this.infoWindow = new AMap.InfoWindow({
        position: ops.position,
        content: ops.content,
        offset: new AMap.Pixel(5, -35),
      });
      this.infoWindow.open(this.amap);
    },
    //隐藏信息窗口
    hideInfoWindow() {
      this.infoWindow && this.infoWindow.close();
    },
    //设置中心点和缩放级别
    setZoomAndCenter(zoom, positionArr) {
      console.log(positionArr);
      const [lng, lat] = positionArr;
      this.amap.setZoomAndCenter(19, positionArr);
    },
    //保存位置信息
    saveLocation() {
      if (this.position.length != 2 || !this.positionInfo) {
        return this.$message.warning("请您先选择一个位置");
      }
      assign(this.positionData, {
        location: { longitude: this.position[0], latitude: this.position[1] },
        adresssInfo: this.positionInfo,
      });
      this.returnPrev();
    },
    //返回
    returnPrev() {
      sessionStorage.setItem("positionData", JSON.stringify(this.positionData));
      this.$router.go(-1);
      // this.$router.replace({
      //   name: this.positionData.prevRoute,
      //   query: this.positionData.prevQuery,
      // });
    },
  },
  computed: {},
  created() {
    this.positionData = JSON.parse(sessionStorage.positionData);
  },
  //组件销毁销毁地图
  beforeDestroy() {
    this.amap && this.amap.clearMap();
    this.amap && this.amap.destroy();
  },
  beforeRouteEnter(to, from, next) {
    console.log(to, from);
    /**
     * sessionStorage.positionData传递参数
     * @param {String} pageType (add|edit|view)
     * @param {String} prevRoute: 上一页面路由 name
     * @param {Object} prevQuery: 上一页面路由 query
     * @param {Object} detailData 上一页面详情信息
     * @param {Object} location 经纬度对象
     * @param {String} adresssInfo 地址详细信息
     */
    if (!from.name) {
      return next("/");
    } else {
      if (
        sessionStorage.positionData &&
        JSON.parse(sessionStorage.positionData).pageType
      ) {
        next();
      } else {
        next(false);
      }
    }
  },
};
</script>

<style lang="less" scoped>
.top-search {
  border-radius: 5px;
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  z-index: 1000;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
}
.van-search {
  padding: 0;
}
.map-toggle {
  position: absolute;
  padding: 12px 8px;
  border-radius: 4px;
  bottom: 25px;
  left: 25px;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  z-index: 2001;
  i {
    font-size: 18px;
  }
}
.result-pannel {
  position: absolute;
  padding: 0 15px;
  z-index: 1000;
  bottom: 0;
  width: 100%;
  height: calc(100% - 70px);
}
.result-list {
  border-radius: 4px 4px 0px 0px;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #fff;
  li {
    padding: 6px 0;
    border-bottom: 1px solid @border_color;
    &:last-of-type {
      border-bottom: 0 solid @border_color;
    }
    &:active {
      background-color: #fafafa;
    }
    .main {
      font-size: 14px;
      font-weight: 600;
      line-height: 1.4;
      white-space: pre-wrap;
    }
    .sub {
      color: #999;
      font-size: 12px;
      margin-top: 3px;
    }
  }
  .result-content {
    padding: 0 15px;
  }
}
.bottom-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #fff;
  padding: 8px 15px;
}
</style>