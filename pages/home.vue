<template>
  <div class="main-container animate__animated animate__fadeIn">
    <MainTitle text="Administración" />
    <br />
    <v-alert
      shaped
      color="primary"
      dark
      icon="mdi-home"
      prominent
      class="font-styles animate__animated animate__backInLeft"
    >
      Bienvenid@ al dashboar de administración de la plataforma de Diosma Café,
      este es un aplicativo en el que se podrá gestionar la información que se
      presenta en la plataforma principal.
    </v-alert>
    <v-alert
      shaped
      color="secondary"
      dark
      icon="mdi-coffee"
      prominent
      class="font-styles animate__animated animate__backInRight"
    >
      Se podrán realizar operaciones de edición, eliminación, creación, lectura
      y activación y desactivación temporal de los productos ofertados en la
      plataforma principal.
    </v-alert>
    <v-alert
      shaped
      color="info"
      dark
      icon="mdi-image"
      prominent
      class="font-styles animate__animated animate__backInLeft"
    >
      Además se podrán eliminar y subir imágenes que alimentarán la galería de
      la plataforma principal.
    </v-alert>
    <v-alert
      shaped
      color="alert"
      dark
      icon="mdi-account"
      prominent
      class="font-styles animate__animated animate__backInRight"
    >
      Por último, existe una funcionalidad de administración de usuarios
      permitidos para ingresar a la plataforma, solo los usuarios registrados
      podrán crear y eliminar nuevos usuarios validos para acceder a esta
      plataforma de administración.
    </v-alert>
  </div>
</template>

<script>
import MainTitle from "../components/MainTitle";
export default {
  components: { MainTitle },
  name: "IndexPage",
  middleware: "auth",
  computed: {
    currentUser() {
      return this.$store.state.user;
    },
  },
  data() {
    return {
      dataFirebase: [],
      loading: false,
      urlImage: null,
      title: "",
    };
  },
  async created() {
    this.loading = true;
    await this.$fire.firestore.collection("Users").onSnapshot((q) => {
      q.forEach((doc) => {
        this.dataFirebase.push(doc.data());
      });
      this.loading = false;
    });
  },
  methods: {
    async uploadImage(e) {
      this.loading = true;
      console.log(e.target.files[0]);
      const ref = this.$fire.storage
        .ref("images")
        .child(e.target.files[0].name);
      await ref.put(e.target.files[0]);
      this.urlImage = await ref.getDownloadURL();
      this.loading = false;
    },
    async signOutPopup() {
      console.log("Signed Out");
      await this.$fire.auth.signOut();
      window.location = "/login";
    },
  },
};
</script>
<style scoped>
.main-container {
  min-height: 100vh;
  height: auto;
  padding: 30px;
}
.container-card {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  justify-content: center;
  grid-gap: 10px;
}
.font-styles {
  font-size: 1.2rem;
}
</style>
