<template>
  <section class="main-container">
    
    <router-view class="main-view"></router-view>
  </section>
</template>

<script>
import Vue from "vue";
import _ from "lodash";
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  methods: {
    //示例接口
    getWeatherData() {
      this.$request({
        url: "https://free-api.heweather.net/s6/weather/now",
        withoutErrorMsg: true,
        params: {
          location: "北京",
          key: "8032a97d671146a5ac8732c5b6cd070e",
        },
        hasGlobalLoading: true,
      }).then(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
    },
  },
  components: {},
  computed: {
    ...mapState(["currentRoute", "userData", "lastEmptyRoute"]),
    ...mapGetters([]),
  },
  created() {
    this.getWeatherData();
  },
};
</script>
<style lang="less" scoped>
</style>