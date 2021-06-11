<template>
  <div class="index">首页
    <p><router-link :to="{name:'login'}">去登录</router-link></p>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {},
  methods: {},
  created() {},
};
</script>
<style lang="less" scoped>
.more {
  padding: 10px 15px;
}
</style>
