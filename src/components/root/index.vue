<template>
  <section class="main-container">
    <transition
      mode="out-in"
      :appear="true"
      name="fadeInRight"
      enter-active-class="fadeInRight"
      leave-active-class="fadeOutRight"
    >
      <router-view class="main-view animated"></router-view>
    </transition>
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
    //获取用户信息
    getUserData() {},
  },
  components: {},
  computed: {
    ...mapState(["currentRoute", "userData", "lastEmptyRoute"]),
    ...mapGetters([]),
  },
  created() {
    this.getUserData();
  },
  beforeDestroy() {},
};
</script>
<style lang="less" scoped>
</style>