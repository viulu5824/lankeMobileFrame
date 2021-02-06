<template>
  <div class="main-container">
    <div class="not-found ac">
      <p>404</p>
      <p>页面找不到了</p>
      <button @click="$router.go(-1)" type="primary">返回</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  created() {},
};
</script>

<style lang="less" scoped>
.not-found {
  margin-top: 150px;
  p {
    font-size: 35px;
    font-weight: bolder;
  }
}
</style>