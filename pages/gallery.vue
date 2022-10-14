<template>
  <div style="min-height: 100vh; height: auto; padding: 30px">
    <MainTitle text="Galería" />
    <br />
    <input
      type="file"
      accept="image/*"
      ref="fileInput"
      style="display: none"
      @change="handleInput"
    />
    <div @click="$refs.fileInput.click()" class="upload-image-container">
      <div class="upload-image-border">
        <div class="upload-image-input">
          <v-icon size="60" color="black">mdi-cloud-upload-outline </v-icon>
          <p>Click para subir imagen</p>
        </div>
      </div>
    </div>
    <br />
    <div class="container-gallery">
      <v-card
        color="white"
        style="border: solid"
        v-for="(image, index) in debugData"
        :key="index"
      >
        <v-img
          :src="image.url"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          height="200px"
        >
        </v-img>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small>
            <v-icon big color="red"> mdi-delete </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import { METHODS } from "http";
import MainTitle from "../components/MainTitle";
export default {
  name: "InspirePage",
  middleware: "auth",
  comments: { MainTitle },
  data() {
    return {
      debugData: [
        { id: "dsasdasd1", url: "https://picsum.photos/200" },
        { id: "dsasdasd2", url: "https://picsum.photos/200" },
        { id: "dsasdasd3", url: "https://picsum.photos/200" },
        { id: "dsasdasd4", url: "https://picsum.photos/200" },
        { id: "dsasdasd5", url: "https://picsum.photos/200" },
        { id: "dsasdasd6", url: "https://picsum.photos/200" },
        { id: "dsasdasd7", url: "https://picsum.photos/200" },
        { id: "dsasdasd8", url: "https://picsum.photos/200" },
        { id: "dsasdasd9", url: "https://picsum.photos/200" },
        { id: "dsasdasd10", url: "https://picsum.photos/200" },
        { id: "dsasdasd11", url: "https://picsum.photos/200" },
      ],
      file: null,
    };
  },
  methods: {
    uploadImage() {
      $refs.fileInput.click();
    },
    handleInput(e) {
      console.log(e.target.files[0]);
    },
  },
};
</script>
<style scoped>
.upload-image-input {
  border: dashed 5px;
  height: 100%;
  border-radius: 10px;
  display: flex;
  flex-flow: column;
  color: black;
  justify-content: center;
  align-items: center;
}
.upload-image-border {
  width: 100%;
  height: 200px;
  padding: 20px;
  border-radius: 10px;
}
.upload-image-container {
  display: flex;
  justify-content: center;
  background-color: darkgrey;
  border-radius: 10px;
  cursor: pointer;
  border: solid;
}
.container-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  justify-content: center;
  grid-gap: 10px;
}
</style>
