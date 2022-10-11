<template>
  <v-footer dark padless>
    <v-card dark class="card-container white--text text-center">
      <v-card-text dark>
        <b class="main-font-color">© {{ new Date().getFullYear() }}</b> —
        <b class="main-font-color">Diosma Café, Derechos reservados</b>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      icons: ["mdi-facebook", "mdi-whatsapp", "mdi-gmail", "mdi-instagram"],
    };
  },
};
</script>

<style scoped>
.main-font-color {
  color: #f2e9e4;
}
.card-container {
  width: 100vw;
}
</style>
