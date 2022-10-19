<template>
  <div class="animate__animated animate__fadeIn main-product-container">
    <MainTitle text="Productos" />
    <br />
  </div>
</template>

<script>
import MainTitle from "../components/MainTitle";
export default {
  name: "InspirePage",
  middleware: "auth",
  components: { MainTitle },
};
</script>
<style scoped>
.main-product-container {
  min-height: 100vh;
  height: auto;
  padding: 30px;
}
</style>
