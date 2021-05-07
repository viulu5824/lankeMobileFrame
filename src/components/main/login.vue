<!--隔离点登录组件 -->
<template>
  <div class="isolation-login">
    <div class="top-bg">
      <img :src="require('image/main/login.png')" alt="登录" />
    </div>
    <van-form
      :show-error="false"
      input-align="right"
      :label-width="150 / 37.5 + 'rem'"
      validate-trigger="onSubmit"
      error-message-align="right"
      :scroll-to-error="true"
      @submit="login"
      class="col-page login-form"
    >
      <input
        class="not-autocomplete"
        type="text"
        name="username"
        autocomplete="on"
      />
      <input
        class="not-autocomplete"
        type="password"
        name="password"
        autocomplete="on"
      />
      <van-field
        autocomplete="off"
        name="username"
        v-model="detailForm.username"
        label="用户名"
        placeholder="请输入用户名"
        :rules="[
          {
            required: true,
            message: '请输入用户名',
          },
        ]"
      ></van-field>
      <van-field
        name="password"
        type="password"
        autocomplete="off"
        v-model="detailForm.password"
        label="密码"
        placeholder="请输入密码"
        :rules="[
          { 
            required: true,
            message: '请输入密码',
          },
        ]"
      ></van-field>
      <van-button
        class="mt35"
        size="large"
        native-type="submit"
        type="info"
        block
        round
        >登录</van-button
      >
    </van-form>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import { Form, Field, CellGroup, Radio, RadioGroup } from "vant";
Vue.use(Form).use(Field).use(CellGroup).use(Radio).use(RadioGroup);
export default {
  data() {
    return {
      detailForm: {
        password: "",
        username: "",
      },
    };
  },
  methods: {
    //登录
    login() {
      this.$toast.success("登录成功");
      this.$router.replace({ name: "index" });
    },
  },
  computed: {
    ...mapState(["basicData"]),
  },
  created() {},
};
</script>
<style lang="less" scoped>
.isolation-login {
  background-color: #fff;
}
.top-bg {
  min-height: 222px;
  img {
    width: 100%;
    height: auto;
  }
}
.login-form {
  padding: 40px 15px;
  .van-cell {
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  .van-cell::after {
    border-color: #cccccc;
  }
}
</style>
