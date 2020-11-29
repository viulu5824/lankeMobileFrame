<template>
  <div class="main-container">
    <div class="notfound ac mt50">
      <p>404</p>
      <p class="mt10">页面找不到了</p>
      <button @click="$router.go(-1)" class="mt40" type="primary">返回</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  created() {}
};
</script>

<style lang="less" scoped>
.notfound {
}
</style>