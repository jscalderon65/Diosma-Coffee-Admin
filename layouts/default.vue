<template>
  <v-app dark>
    <v-navigation-drawer
      class="drawer-container"
      v-model="drawer"
      dark
      fixed
      app
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            class="drawer-title-container text-h5 animate__animated animate__fadeInLeft"
          >
            <b class="drawer-title-content">
              <div class="title-decorators"></div>
              Diosma Café
              <div class="title-decorators"></div
            ></b>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.to"
          @click="drawer = false"
        >
          <v-list-item-icon>
            <v-icon style="color: #f2e9e4">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title style="color: #f2e9e4">{{
              item.title
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="currentUser" />
      <div class="brand-icon-navbar">
        <div class="brand-icon-container">
          <v-icon class="brand-icon">mdi-coffee</v-icon>
        </div>
      </div>
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import Footer from "../components/Footer";
export default {
  name: "DefaultLayout",
  components: { Footer },
  computed: {
    currentUser() {
      return this.$store.state.user;
    },
  },
  data() {
    return {
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-home",
          title: "Inicio",
          to: "/home",
        },
        {
          icon: "mdi-coffee",
          title: "Productos",
          to: "/products",
        },
        {
          icon: "mdi-image",
          title: "Galería",
          to: "/gallery",
        },
        {
          icon: "mdi-account",
          title: "Usuarios",
          to: "/users",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Diosma Coffee",
    };
  },
};
</script>
<style scoped>
.drawer-container {
  background: #272727ff;
}
.title-decorators {
  border: solid;
  border-radius: 4px;
}
.drawer-title-container {
  text-align: center;
}
.drawer-title-content {
  font-family: Ms Madi;
  font-size: 2.5rem;
  color: #f2e9e4;
}
.brand-icon {
  font-size: 4rem;
  color: black;
  margin-bottom: 5px;
}
.brand-icon-container {
  background: #f2e9e4;
  border: solid #f2e9e4;
  height: 100px;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  border-radius: 10px;
}
.brand-icon-navbar {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
