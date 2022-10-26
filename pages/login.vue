<template>
  <div class="login-main-container animate__animated animate__fadeIn">
    <SignIn />
  </div>
</template>

<script>
import SignIn from "../components/SignIn.vue";
export default {
  components: { SignIn },
  created() {
    this.signOut();
  },
  methods: {
    async signOut() {
      console.log("Signed Out");
      await this.$fire.auth.signOut();
    },
  },
};
</script>

<style scoped>
.login-main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
}
</style>
