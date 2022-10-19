<template>
  <div class="gallery-main-container">
    <MainTitle text="Galería" />
    <br />
    <input
      type="file"
      accept="image/*"
      ref="fileInput"
      style="display: none"
      @change="handleInput"
    />
    <div
      v-if="!file"
      @click="$refs.fileInput.click()"
      class="upload-image-container"
    >
      <div class="upload-image-border">
        <div class="upload-image-input">
          <v-icon size="60" color="black">mdi-cloud-upload-outline </v-icon>
          <p>Click para subir imagen</p>
        </div>
      </div>
    </div>
    <div v-else class="upload-image-container">
      <div v-if="!loading" class="upload-image-border">
        <div class="upload-image-input">
          <v-btn @click="uploadToFirebaseStorage">
            <v-icon class="icon-button-margin" color="success">
              mdi-upload
            </v-icon>
            Subir
          </v-btn>
          <br />
          <v-btn @click="openDialog">
            <v-icon class="icon-button-margin" color="primary">
              mdi-eye
            </v-icon>
            Visualizar
          </v-btn>
          <br />
          <v-btn @click="deleteFile">
            <v-icon class="icon-button-margin" color="red"> mdi-delete </v-icon>
            Eliminar
          </v-btn>
        </div>
      </div>
      <div v-else class="upload-image-border">
        <div class="upload-image-input">
          <v-progress-circular
            indeterminate
            :size="100"
            color="primary"
          ></v-progress-circular>
        </div>
      </div>
    </div>
    <br />
    <v-progress-linear
      v-if="loadingGallery"
      indeterminate
      color="primary"
    ></v-progress-linear>
    <div v-else class="container-gallery">
      <v-card
        color="white"
        class="border-image-card"
        v-for="(image, index) in gallery"
        :key="index"
      >
        <v-img
          :src="image.serverUrl"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          height="200px"
        >
        </v-img>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small @click="deleteImageFromGallery(image)">
            <v-icon big color="red"> mdi-delete </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <v-dialog v-model="dialog"
      ><v-card>
        <v-card-title>
          <v-slider
            v-model="width"
            class="align-self-stretch"
            min="200"
            max="600"
            step="1"
          ></v-slider>
        </v-card-title>
        <v-card-text>
          <div class="d-flex flex-column justify-space-between align-center">
            <v-img
              :aspect-ratio="16 / 9"
              :width="width"
              :src="previewFile"
            ></v-img>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false"> Cerrar </v-btn>
        </v-card-actions>
      </v-card></v-dialog
    >
  </div>
</template>

<script>
import { uid } from "uid";
import moment from "moment";
import MainTitle from "../components/MainTitle";
export default {
  name: "InspirePage",
  middleware: "auth",
  comments: { MainTitle },
  data() {
    return {
      gallery: [],
      width: 300,
      file: null,
      previewFile: null,
      dialog: false,
      urlUploadedImage: null,
      loading: false,
      loadingGallery: false,
    };
  },
  created() {
    moment.locale("es");
    this.getImages();
  },
  methods: {
    async getImages() {
      try {
        this.loadingGallery = true;
        this.gallery = await this.getGalleryData();
        this.loadingGallery = false;
      } catch (error) {
        this.loadingGallery = false;
        console.log(error);
      }
    },
    openDialog() {
      this.dialog = true;
    },
    deleteFile() {
      this.file = null;
    },
    uploadImage() {
      $refs.fileInput.click();
    },
    async deleteImageFromGallery(item) {
      try {
        this.loadingGallery = true;
        const actualGalleryData = await this.getGalleryData();
        const newGalleryList = actualGalleryData.filter(
          (u) => u.id !== item.id
        );
        await this.$fire.firestore.collection("Gallery").doc("Images").set({
          data: newGalleryList,
        });
        const ref = this.$fire.storage.ref("Images").child(item.id);
        await ref.delete();
        this.$swal(
          "Exito",
          "Se ha eliminado la imagen de la galería",
          "success"
        );
        await this.getImages();
      } catch (error) {
        this.loadingGallery = false;
        this.$swal("Error", "Error al eliminar imagen", "error");
      }
    },
    async uploadToFirebaseStorage() {
      try {
        this.loading = true;
        const serverFileName = uid(16);
        const ref = this.$fire.storage.ref("Images").child(serverFileName);
        await ref.put(this.file);
        this.urlUploadedImage = await ref.getDownloadURL();
        const payload = {
          serverUrl: this.urlUploadedImage,
          createdAt: moment().format("dddd MM, [del] YYYY hh:mm:ss a"),
          id: serverFileName,
        };
        const actualGalleryData = await this.getGalleryData();
        const newGalleryList = [...actualGalleryData, payload];
        await this.$fire.firestore.collection("Gallery").doc("Images").set({
          data: newGalleryList,
        });
        this.$swal(
          "Exito",
          "Se subio con exito la imagen a la galería",
          "success"
        );
        this.file = null;
        this.previewFile = null;
        this.loading = false;
        await this.getImages();
      } catch (error) {
        console.log(error);
        this.file = null;
        this.previewFile = null;
        this.loading = false;
        this.$swal("Error", "Error al subir imagen", "error");
      }
    },
    async getGalleryData() {
      const response = await this.$fire.firestore
        .collection("Gallery")
        .doc("Images")
        .get();
      return response.data().data;
    },
    handleInput(e) {
      if (e) {
        try {
          this.file = e.target.files[0];
          this.previewFile = URL.createObjectURL(this.file);
          console.log(e);
        } catch (error) {
          this.$swal("Error", "Error al subir imagen", "error");
        }
      }
    },
  },
};
</script>
<style scoped>
.border-image-card {
  border: solid;
}
.icon-button-margin {
  margin-right: 10px;
}
.gallery-main-container {
  min-height: 100vh;
  height: auto;
  padding: 30px;
}
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
  height: 250px;
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
