<template>
  <div class="root-container">
    <router-view></router-view>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  methods: {
  },
  computed: {
    ...mapState(["userData"]),
  },
  created() {
  },
};
</script>
<style lang="less">
</style>
