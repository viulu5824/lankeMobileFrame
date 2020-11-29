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
    getUserData() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            code: 200,
            msg: "",
            data: {
              username: "Liulu",
              id: Math.random(),
            },
          });
        }, 1000);
      });
    },
  },
  computed: {
    ...mapState(["userData"]),
  },
  created() {
    if (this.userData.id) {
      return this.$router.push("/index");
    } else {
      this.getUserData().then(
        (res) => {
          if (res.code === 200) {
            this.$router.push("/index");
          } else {
            this.$router.push("/login");
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  },
};
</script>
<style lang="less">
</style>
