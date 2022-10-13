<template>
  <div class="info-title">
    <div
      class="divider-container info-container animate__animated animate__fadeIn"
    >
      <hr class="divider-item" />
    </div>
    <h1>{{ text }}</h1>
    <div
      class="divider-container info-container animate__animated animate__fadeIn"
    >
      <hr class="divider-item" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.divider-container {
  display: flex;
  justify-content: center;
}
.divider-item {
  width: 100%;
  border-radius: 10px;
  border: solid 4px;
  background: #f2e9e4;
}
.info-title {
  width: 100%;
  margin-top: 20px;
  color: #f2e9e4;
  text-align: center;
  font-family: Ms madi;
  font-size: 3rem;
}
@media (max-width: 700px) {
  .info-title {
    font-size: 2rem;
  }
}
</style>
