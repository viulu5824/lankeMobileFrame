<template>
  <div class="main-container">
    <router-view class="view-container"></router-view>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  methods: {
    //获取用户信息
    getUserInfo() {
        
    },
  },
  components: {},
  computed: {
    ...mapState([
      "currentRoute",
      "userData",
      "lastEmptyRoute",
      "basicData",
      "isGetUserData",
    ]),
    ...mapGetters([]),
  },
  created() {
    this.getUserInfo();
  },
};
</script>
<style lang="less" scoped>
</style>