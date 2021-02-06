<!--上传公用组件-->
<!--文件列表[item只返回base64|URL格式，便于返显图片]-->
<template>
  <div
    :class="[fileType, { flex: col > 1 }, { center: isCenter }]"
    class="upload clearfix"
  >
    <div v-if="isCropper" v-show="cropperShow" class="cropper-block">
      <div class="cropper-container">
        <vueCropper
          v-if="fileData"
          ref="cropper"
          :img="fileData"
          :outputSize="cropperOptions.size"
          :autoCrop="cropperOptions.autoCrop"
          :centerBox="cropperOptions.centerBox"
        ></vueCropper>
      </div>
      <span @click="closeCropper" class="close-btn"
        ><van-icon :size="30 / 37.5 + 'rem'" name="close"
      /></span>
      <div class="bottom-btn">
        <van-button
          native-type="button"
          type="info"
          @click="$refs.cropper && $refs.cropper.rotateRight()"
          >旋转90度</van-button
        >
        <van-button
          native-type="button"
          class="ml15"
          type="info"
          @click="confirmCropper"
          >确认裁剪</van-button
        >
      </div>
    </div>
    <input
      :disabled="disabled"
      v-show="false"
      ref="uploadRef"
      type="file"
      @change="uploadInputChange()"
    />

    <template v-if="fileList.length">
      <div
        :style="
          col > 1
            ? {
                width: 'calc(90% / ' + col + ')',
                'margin-right': 'calc(8% / ' + col + ')',
              }
            : {}
        "
        :key="index"
        v-for="(item, index) in fileList"
        class="show-block"
      >
        <template v-if="fileType === 'image'">
          <van-image
            @click.stop="
              previewImage({
                images: previewImgList,
                startPosition: index,
                needPrefix: false,
              })
            "
            :fit="fit"
            width="100%"
            height="100%"
            :src="
              isRealTimeUpload && fileCodingType != 'base64'
                ? (preImgUrl || projectImgPrefixUrl) + item
                : item
            "
          >
            <template v-slot:loading>
              <van-loading type="spinner" size="20" /> </template
          ></van-image>
          <p v-if="!disabled" @click="delFile(item, index)" class="del-bar">
            删除图片
          </p>
        </template>
        <template v-else-if="fileType === 'all'">
          <div class="file-info">
            <span class="name">文件-{{ index + 1 }}</span>
            <span><van-icon @click="delFile(item, index)" name="cross" /></span>
          </div>
        </template>
      </div>
    </template>
    <div
      :style="col > 1 ? { width: 'calc(90% / ' + col + ')' } : {}"
      v-if="!disabled && fileList.length < maxCount"
      class="upload-block"
    >
      <div
        class="upload-block-square"
        @click="uploadFile"
        v-if="fileType === 'image'"
      >
        <p class="iconfont icon-camera f20"></p>
        <p>拍照/上传</p>
      </div>
      <van-button
        @click="uploadFile"
        v-else-if="fileType === 'all'"
        size="small"
        icon="plus"
        type="info"
        native-type="button"
        >上传文件</van-button
      >
    </div>
  </div>
</template>

<script>
import Vue from "vue";
const wx = require("weixin-js-sdk");
import { isWX } from "util/environment";
import { previewImage, dataURLtoFile, file2DataUrl } from "util/common";
import { mapActions, mapState } from "vuex";
import VueCropper from "vue-cropper";
import Compressor from "compressorjs";
Vue.use(VueCropper);

export default {
  props: {
    //居中展示
    isCenter: {
      type: Boolean,
      default: false,
    },
    //是否开启多张
    multiple: {
      type: Boolean,
      default: false,
    },
    //几张占一行
    col: {
      type: Number,
      default: 1,
    },
    //是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    //限制文件类型
    fileType: {
      type: String,
      default: "image", //all
    },
    //图片展示方式
    fit: {
      type: String,
      default: "contain",
    },
    //文件列表[item只返回base64|URL格式，便于返显图片]
    fileList: {
      type: Array,
      default() {
        return [];
      },
    },
    //文件最大数量
    maxCount: {
      type: Number,
      default: 1,
    },
    //是否实时上传
    isRealTimeUpload: {
      type: Boolean,
      default: false,
    },
    //拼接图片地址
    preImgUrl: {
      type: String,
      default: "",
    },
    //实时上传接口地址
    uploadUrl: {
      type: String,
      default: "smart-city/file/upload",
    },
    //实时删除接口地址
    delUrl: {
      type: String,
      default: "smart-city/file/delFile",
    },
    //文件上传编码类型 fileObj|base64
    fileCodingType: {
      type: String,
      default: "fileObj",
    },
    //是否裁剪
    isCropper: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      cropperShow: false,
      fileData: null,
      cropperOptions: {
        size: 0.6,
        autoCrop: true,
        centerBox: true,
      },
    };
  },
  methods: {
    //上传图片
    uploadFile() {
      if (isWX && this.isGetWxSign && this.fileType === "image") {
        this.wxUploadImg();
      } else {
        this.$refs.uploadRef.dispatchEvent(new MouseEvent("click"));
      }
    },
    //原生上传控件监听
    uploadInputChange() {
      const vm = this;
      const inputFile = this.$refs.uploadRef.files[0];
      console.log(inputFile);
      if (!inputFile) {
        return;
      }
      //判断文件类型
      if (
        this.fileType === "image" &&
        !/image\/(jpg|jpeg|bmp|png)$/.test(inputFile.type)
      ) {
        this.$refs.uploadRef.value = null;
        return this.$toast("上传文件格式不正确");
      }
      this.saveFile(inputFile);
    },
    //微信拍照/上传
    wxUploadImg() {
      const vm = this;
      wx.chooseImage({
        count: 1, //vm.maxCount - vm.fileList.length,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success(res) {
          console.log(res.localIds);
          vm.wxGetLocalImg(res.localIds);
        },
      });
    },
    //微信获取本地图片
    wxGetLocalImg(localIds) {
      const vm = this;
      const localId = localIds.shift();
      //异步方法 不能遍历 只能递归回调执行
      wx.getLocalImgData({
        localId,
        success(res) {
          console.log("getLocalImgData", res.localData.slice(0, 100));
          let localData = res.localData;
          //判断是否有这样的头部
          if (localData.indexOf("data:image") != 0) {
            localData = "data:image/jpg;base64," + localData;
          }
          //转换file对象
          localData = dataURLtoFile(localData);
          vm.saveFile(localData);
          if (localIds.length > 0) {
            vm.wxGetLocalImg(localIds);
          }
        },
        fail(err) {
          alert("显示失败");
        },
      });
    },
    //转换文件格式
    transformFileType(fileData) {
      return new Promise((resolve, reject) => {
        if (this.fileCodingType === "base64") {
          file2DataUrl(fileData).then((res) => {
            resolve(res);
          });
        } else {
          resolve(fileData);
        }
      });
    },
    //上传或保存本地文件
    uploadOrSaveLocalFile(fileData) {
      this.transformFileType(fileData).then((fileData) => {
        //是否实时上传
        if (this.isRealTimeUpload) {
          this.uploadToServer(fileData);
        } else {
          if (this.fileCodingType === "fileObj") {
            file2DataUrl(fileData).then((res) => {
              this.$emit("update:fileList", [...this.fileList, res]);
            });
          } else {
            this.$emit("update:fileList", [...this.fileList, fileData]);
          }
          this.$refs.uploadRef.value = null;
        }
      });
    },
    //保存文件
    saveFile(fileData) {
      console.log("准备保存文件", fileData);
      //是否需要裁剪
      if (this.isCropper) {
        return this.cropperImage(fileData);
      } else {
        this.uploadOrSaveLocalFile(fileData);
      }
    },
    //裁剪图片
    cropperImage(fileData) {
      const vm = this;
      this.cropperShow = true;
      file2DataUrl(fileData).then((res) => {
        vm.fileData = res;
        console.log("准备裁剪", vm.fileData.slice(0, 50));
      });
    },
    //删除已上传文件
    delFile(item, index) {
      this.isRealTimeUpload
        ? this.delServerFile(item, index)
        : this.delLocalFile(index);
    },
    //删除本地文件
    delLocalFile(index) {
      this.$refs.uploadRef.value = null;
      const delItem = this.fileList.splice(index, 1);
      this.$emit("update:fileList", this.fileList);
      this.$emit("delete", delItem, index);
    },
    //删除服务器文件
    delServerFile(imgSrc, index) {
      let formData = new FormData();
      formData.append("filePath", imgSrc);
      this.$request({
        method: "post",
        url: this.delUrl,
        data: formData,
        cancelType: "url",
        serverTypeStr: "bladeXApi",
      }).then(
        (res) => {
          console.log(res);
          if (res.data.code == 200) {
            this.delLocalFile(index);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },

    //上传文件到服务器
    uploadToServer(file) {
      console.log("源文件", file);
      const vm = this;
      new Compressor(file, {
        quality: 0.6,
        success(result) {
          console.log("压缩源文件", result);
          const formData = new FormData();
          formData.append("fileList", result);
          vm.$request({
            method: "post",
            url: vm.uploadUrl,
            data: formData,
            serverTypeStr: "bladeXApi",
            cancelType: "url",
          }).then(
            (res) => {
              console.log(res);
              if (res.data.code === 200) {
                res.data.data &&
                  vm.$emit("update:fileList", [...vm.fileList, res.data.data]);
              }
              vm.$refs.uploadRef.value = null;
            },
            (err) => {
              console.log(err);
            }
          );
        },
      });
    },
    //确认截图
    confirmCropper() {
      this.$refs.cropper.getCropData((data) => {
        console.log("裁剪后文件", data.slice(0, 50));
        this.closeCropper();
        this.uploadOrSaveLocalFile(dataURLtoFile(data));
      });
    },
    //关闭截图
    closeCropper() {
      this.cropperShow = false;
    },
    previewImage,
    ...mapActions(["getWxSign"]),
  },
  created() {
    isWX && this.getWxSign();
  },

  computed: {
    ...mapState(["isGetWxSign"]),
    previewImgList() {
      if (this.fileCodingType === "fileObj") {
        return this.fileList.map((e) => this.projectImgPrefixUrl + e);
      } else {
        return this.fileList;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.cropper-block {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 10000000000000;
  display: flex;
  flex-direction: column;
  .cropper-container {
    flex: 1 1 auto;
    height: 0;
  }
  .bottom-btn {
    flex: 0 0 70px;
  }
  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    color: #fff;
  }
}
.upload {
  text-align: left;
  width: 100%;
  margin-top: 12px;
  color: #999;
  border-radius: 3px;
  position: relative;
  .show-block {
    margin-bottom: 15px;
  }
  .file-info {
    padding: 4px 12px;
    background-color: #fafafa;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .name {
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.upload.flex {
  display: flex;
  flex-wrap: wrap;
}
.upload.center {
  justify-content: center;
}
.upload.flex.image {
  .show-block {
    float: left;
    height: 150px;
  }
  .upload-block {
    float: left;
    height: 150px;
    margin-bottom: 0;
  }
}
.upload.image {
  text-align: center;
  .show-block {
    height: 230px;
    padding-bottom: 30px;
    position: relative;
    .van-image {
      background-color: @bg_color_main;
    }
    .del-bar {
      position: absolute;
      bottom: 0;
      line-height: 30px;
      width: 100%;
      text-align: center;
    }
  }

  .upload-block {
    height: 200px;
    margin-bottom: 30px;
    background-color: @bg_color_main;
    &:active {
      opacity: 0.7;
    }
  }
  .upload-block-square {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
