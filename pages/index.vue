<template>
  <div>
    <h1>
      Welcome <span v-if="currentUser">{{ currentUser.displayName }}</span>
    </h1>
    <br />
    <br />
    <div
      style="border: solid; display: grid; grid-template-columns: 1fr 1fr 1fr"
    >
      <v-card
        ><v-img
          v-if="urlImage"
          style="
            border-radius: 100%;
            width: 200px;
            height: 200px;
            border: solid white;
          "
          contain
          lazy-src="https://picsum.photos/seed/picsum/200/300"
          :src="urlImage"
        ></v-img
      ></v-card>
      <v-card
        ><v-img
          v-if="urlImage"
          style="
            border-radius: 100%;
            width: 200px;
            height: 200px;
            border: solid white;
          "
          contain
          lazy-src="https://picsum.photos/seed/picsum/200/300"
          :src="urlImage"
        ></v-img
      ></v-card>
      <v-card
        ><v-img
          v-if="urlImage"
          style="
            border-radius: 100%;
            width: 200px;
            height: 200px;
            border: solid white;
          "
          contain
          lazy-src="https://picsum.photos/seed/picsum/200/300"
          :src="urlImage"
        ></v-img
      ></v-card>
      <v-card
        ><v-img
          v-if="urlImage"
          style="
            border-radius: 100%;
            width: 200px;
            height: 200px;
            border: solid white;
          "
          contain
          lazy-src="https://picsum.photos/seed/picsum/200/300"
          :src="urlImage"
        ></v-img
      ></v-card>
    </div>

    <br />
    {{ title }}
    <input v-if="urlImage" type="text" v-model="title" />
    <input type="file" @change="uploadImage" accept="image/*" />
    <br />
    <br />
    <v-btn @click="signOutPopup">LogOut</v-btn>
    <br />
    <br />
    <p v-if="loading">Loading....</p>
    <div
      style="border: solid"
      v-else
      v-for="(data, index) in dataFirebase"
      :key="index"
    >
      {{ data }}
    </div>
  </div>
</template>

<script>
export default {
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
