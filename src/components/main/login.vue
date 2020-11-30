<template>
  <section class="login-container">
    <van-form
      class="loginForm"
      ref="loginForm"
      :show-error="false"
      input-align="right"
      validate-trigger="onChange"
      error-message-align="right"
      @submit="loginSubmit"
    >
      <van-field
        v-model="loginFormModel.mobile"
        name="idcard"
        label="手机号"
        required
        placeholder="请输入您的手机号码"
        :rules="[
          { required: true, message: '请输入您的手机号码' },
          {
            pattern: verify.testPhone().regex,
            message: '请输入正确的手机号码',
          },
        ]"
      />
      <van-field
        v-model="loginFormModel.code"
        center
        clearable
        label="短信验证码"
        placeholder="请输入短信验证码"
      >
        <template #button>
          <van-button native-type="button" size="small" type="info"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button round block size="normal" type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
  </section>
</template>
<script>
import Vue from "vue";
import { Form, Field, Picker, Popup } from "vant";
Vue.use(Form).use(Field).use(Picker).use(Popup);
export default {
  data() {
    return {
      loginFormModel: {
        mobile: null,
        code: null,
      },
    };
  },
  methods: {
    //登录提交表单
    loginSubmit() {
      console.log(this.loginFormModel);
      this.$router.push({ path: "/" });
    },
  },
  created() {},
};
</script>
<style lang="less" scoped>
.login-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.loginForm {
  padding: 30px 0 60px;
  border: 1px solid #dfdfdf;
  border-radius: 6px;
  border-width: 2px;
  width: 88%;
}
</style>