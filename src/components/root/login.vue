<template>
  <section class="login-container">
    <van-form
      ref="loginForm"
      :scroll-to-error="true"
      :show-error="false"
      input-align="right"
      validate-trigger="onChange"
      error-message-align="right"
      @submit="loginSubmit"
    >
      <van-field
        clickable
        readonly
        name="theirType"
        label="证件类型"
        required
        :value="theirTypeText"
        placeholder="请选择您的证件类型"
        :rules="[{ required: true, message: '请选择您的证件类型' }]"
        @click="isCtypePickShow = true"
      />
      <!-- 证件类型选择器 -->
      <van-popup v-model="isCtypePickShow" position="bottom">
        <van-picker
          show-toolbar
          :columns="certificateTypeList"
          @confirm="confirmCtypeSel"
          @cancel="isCtypePickShow = false"
        />
      </van-popup>
      <van-field
        v-model="loginFormModel.name"
        name="name"
        label="姓名"
        required
        placeholder="请输入您的姓名"
        :rules="[{ required: true, message: '请输入您的姓名' }]"
      />
      <van-field
        v-model="loginFormModel.idcard"
        name="idcard"
        label="证件号码"
        required
        placeholder="请输入您的证件号码"
        :rules="[
          { required: true, message: '请输入您的证件号码' },
          {
            validator(value, rule) {
              if (value.length < 5) {
                return false;
              } else {
                return true;
              }
            },
            message: '请输入正确的证件号码',
          },
        ]"
      />
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
      <div style="margin: 16px">
        <van-button large round block type="info" native-type="submit">
          下一步
        </van-button>
      </div>
    </van-form>
  </section>
</template>
<script>
import Vue from "vue";
import common from "../../js/common";
import { Form, Field, Picker, Popup } from "vant";
Vue.use(Form).use(Field).use(Picker).use(Popup);
export default {
  data() {
    return {
      isCtypePickShow: false, //显隐选择证件类型
      theirTypeText: "",
      loginFormModel: {
        theirType: null, //证件类型
        idcard: null, //证件号码
        mobile: null,
        name: null, //姓名
        idPic: null, //证件照片
        facePic: null, //本人现场照
      },
      certificateTypeList: [
        { value: 1, text: "外籍护照" },
        { value: 2, text: "港澳居民来往内地通行证" },
        { value: 3, text: "台湾居民来往内地通行证" },
        { value: 4, text: "港澳台居民居住证" },
      ],
    };
  },
  methods: {
    //登录提交表单
    loginSubmit() {
      console.log(this.loginFormModel);
    },
    //确认证件类型选择
    confirmCtypeSel(selObj) {
      console.log(selObj);
      this.loginFormModel.theirType = selObj.value;
      this.theirTypeText = selObj.text;
      this.isCtypePickShow = false;
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="less" scoped>
.login-container {
  padding: 0 15px;
}
</style>