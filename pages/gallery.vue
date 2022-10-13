<template>
  <div style="min-height: 100vh; height: auto; padding: 30px">
    <MainTitle text="Galería" />
    <br />
  </div>
</template>

<script>
import MainTitle from "../components/MainTitle";
export default {
  name: "InspirePage",
  middleware: "auth",
  comments: { MainTitle },
};
</script>
