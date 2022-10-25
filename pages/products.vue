<template>
  <div class="animate__animated animate__fadeIn main-product-container">
    <MainTitle text="Productos" />
    <br />
    <div class="form-container">
      <br />
      <div v-if="loadingCreateProduct">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
        <br />
      </div>
      <h1 class="form-create-title">Creación de producto</h1>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="name"
          :counter="30"
          :rules="nameRules"
          label="Nombre del producto"
          required
        ></v-text-field>
        <br />
        <v-text-field
          v-model="price"
          :rules="requiredRules"
          type="number"
          label="Precio del producto"
          required
        ></v-text-field>
        <br />
        <v-checkbox
          v-if="sections.length > 0"
          v-model="checkbox"
          label="Usar secciones existentes?"
        ></v-checkbox>
        <v-select
          v-if="sections.length > 0 && checkbox"
          v-model="section"
          :items="this.sections"
          :rules="requiredRules"
          label="Sección del producto"
          required
        ></v-select>
        <v-text-field
          v-else
          v-model="section"
          :counter="15"
          :rules="sectionRules"
          label="Nombre de la nueva sección"
          required
        ></v-text-field>
        <br />
        <v-file-input
          :rules="requiredRules"
          accept="image/*"
          label="Sube una imagen"
          required
          @change="getMainImage"
        ></v-file-input>
        <br />
        <div style="text-align: center">
          <v-btn @click="createProduct" v-if="!loadingCreateProduct" outlined
            ><v-icon class="icon-button-margin">mdi-plus</v-icon>
            Crear
          </v-btn>
        </div>
        <br />
      </v-form>
      <div v-if="loadingCreateProduct">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
        <br />
      </div>
    </div>
    <br />
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Búsqueda"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="tableProducts"
        :loading="loadingTableData"
        :search="search"
        class="elevation-1"
        hide-default-footer
        disable-pagination
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined v-bind="attrs" v-on="on">
                <v-icon big color="white"> mdi-dots-horizontal </v-icon></v-btn
              >
            </template>
            <v-list>
              <v-list-item>
                <v-btn small @click="openEditDialog(item)">
                  <v-icon big color="info"> mdi-pencil </v-icon>
                </v-btn>
              </v-list-item>
              <v-list-item>
                <v-btn small @click="deleteProduct(item)">
                  <v-icon big color="red"> mdi-delete </v-icon>
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-slot:[`item.imageUrl`]="{ item }">
          <div class="img-table-container">
            <div>
              <v-img class="img-table-style" :src="item.imageUrl"></v-img>
            </div>
          </div>
        </template>
        <template v-slot:no-data> No hay productos registrados </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="editDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark>
          <v-btn icon dark @click="closeEditDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark @click="editProduct" outlined
              ><v-icon class="icon-button-margin">mdi-content-save</v-icon>
              Guardar cambios
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text style="padding: 20px; margin-top: 20px">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="editItem.name"
              :counter="30"
              :rules="nameRules"
              label="Nombre del producto"
              required
            ></v-text-field>
            <br />
            <v-text-field
              v-model="editItem.price"
              :rules="requiredRules"
              type="number"
              label="Precio del producto"
              required
            ></v-text-field>
            <div style="display: flex; flex-flow: column">
              <v-img
                style="
                  align-self: center !important;
                  border: solid;
                  width: 200px;
                  height: 200px;
                  border-radius: 100%;
                "
                :src="editItem.imageUrl"
              ></v-img>
              <br />
              <div
                v-if="!changeImage"
                style="display: flex; justify-content: center"
              >
                <v-btn @click="changeImage = true" outlined>
                  <v-icon class="icon-button-margin"
                    >mdi-swap-horizontal</v-icon
                  >
                  Cambiar imagen</v-btn
                >
              </div>
            </div>
            <v-file-input
              v-if="changeImage"
              :rules="requiredRules"
              accept="image/*"
              label="Sube una imagen"
              required
              @change="getMainImage"
            ></v-file-input>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { uid } from "uid";
import moment from "moment";
import MainTitle from "../components/MainTitle";
export default {
  name: "InspirePage",
  middleware: "auth",
  components: { MainTitle },
  data() {
    return {
      products: [],
      search: "",
      tableProducts: [],
      editDialog: false,
      loadingEditDialog: false,
      changeImage: false,
      headers: [
        {
          text: "Nombre",
          align: "center",
          sortable: true,
          value: "name",
        },
        {
          text: "Sección",
          align: "center",
          sortable: true,
          value: "section",
        },
        {
          text: "Fecha de creación",
          value: "createdAt",
          filterable: false,
          sortable: false,
          align: "center",
        },
        {
          text: "Creado por",
          value: "createdBy",
          sortable: true,
          align: "center",
        },
        {
          text: "Imagen",
          value: "imageUrl",
          filterable: false,
          sortable: false,
          align: "center",
        },
        {
          text: "Acciones",
          value: "actions",
          filterable: false,
          sortable: false,
          align: "center",
        },
      ],
      valid: true,
      name: "",
      requiredRules: [(v) => !!v || "Campo requerido"],
      nameRules: [
        (v) => !!v || "Campo requerido",
        (v) =>
          (v && v.length <= 30) || "El nombre no debe superar las 30 letras",
      ],
      sectionRules: [
        (v) => !!v || "Campo requerido",
        (v) =>
          (v && v.length <= 20) ||
          "El nombre de la sección no debe superar las 30 letras",
      ],
      select: null,
      checkbox: true,
      section: "",
      price: null,
      sections: [],
      loadingCreateProduct: false,
      loadingTableData: false,
      formImage: null,
      editItem: { name: "", price: "" },
    };
  },
  watch: {
    price(after, before) {
      if (after <= 0) {
        this.price = null;
      }
    },
  },
  computed: {
    currentUser() {
      return this.$store.state.user;
    },
  },
  created() {
    moment.locale("es");
    this.getProducts();
  },
  methods: {
    async getMainImage(e) {
      this.formImage = e;
    },
    async getProducts() {
      try {
        this.loadingTableData = true;
        this.products = await this.getProductsData();
        if (this.products) {
          this.tableProducts = this.products
            .map((pr) => {
              return pr.products.map((p) => ({ ...p, section: pr.section }));
            })
            .flat()
            .reverse();
          this.sections = this.products.map((pr) => {
            return pr.section;
          });
        }
        this.loadingTableData = false;
      } catch (error) {
        console.log(error);
        this.loadingTableData = false;
        this.$swal("Error", "Error al traer información de productos", "error");
      }
    },
    async getProductsData() {
      const response = await this.$fire.firestore
        .collection("Products")
        .doc("Menu")
        .get();
      return response.data().data;
    },
    async createProduct() {
      if (this.$refs.form.validate()) {
        this.name = this.name.trim();
        this.price = this.price;
        this.section = this.section.trim();
        try {
          this.loadingCreateProduct = true;
          const serverIdProduct = uid(16);
          const serverImageName = this.name + " " + serverIdProduct;
          const ref = this.$fire.storage.ref("Images").child(serverImageName);
          await ref.put(this.formImage);
          const urlUploadedImage = await ref.getDownloadURL();
          const payload = {
            id: serverIdProduct,
            name: this.name,
            imageUrl: urlUploadedImage,
            createdBy: this.currentUser.email,
            createdAt: moment().format("dddd MM, [del] YYYY hh:mm:ss a"),
            price: this.price,
            isAvailable: true,
          };
          const actualProductsData = await this.getProductsData();
          if (actualProductsData) {
            if (this.sections.includes(this.section)) {
              const newProductsList = actualProductsData.map((pr) => {
                if (pr.section === this.section) {
                  pr.products = [...pr.products, payload];
                  return pr;
                }
                return pr;
              });
              await this.$fire.firestore
                .collection("Products")
                .doc("Menu")
                .set({
                  data: newProductsList,
                });
              this.$swal(
                "Exito",
                "Se ha creado con exito el producto",
                "success"
              );
              await this.getProducts();
            } else {
              const newProductsList = [
                ...actualProductsData,
                { section: this.section, products: [payload] },
              ];
              await this.$fire.firestore
                .collection("Products")
                .doc("Menu")
                .set({
                  data: newProductsList,
                });
              this.$swal(
                "Exito",
                "Se ha creado con exito la sección y el producto",
                "success"
              );
              await this.getProducts();
            }
          } else {
            const newProductsList = [
              { section: this.section, products: [payload] },
            ];
            await this.$fire.firestore.collection("Products").doc("Menu").set({
              data: newProductsList,
            });
            this.$swal(
              "Exito",
              "Se ha creado con exito el producto",
              "success"
            );
            await this.getProducts();
          }
          this.cleanProductForm();
          this.loadingCreateProduct = false;
        } catch (error) {
          console.log(error);
          this.loadingCreateProduct = false;
          this.cleanProductForm();
          this.$swal("Error", "Error al crear producto", "error");
        }
      }
    },
    openEditDialog(item) {
      this.editDialog = true;
      this.editItem = item;
    },
    async editProduct(item) {
      this.closeEditDialog();
    },
    closeEditDialog() {
      this.editDialog = false;
      this.editItem = null;
    },
    async deleteProduct(item) {
      console.log(item);
      this.$swal
        .fire({
          title: "¿Estás segur@ de eliminar el producto?",
          text: "Esta acción es irreversible",
          showDenyButton: true,
          confirmButtonText: "Si",
          denyButtonText: `No`,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              this.$swal.fire({
                title: "Por favor espera",
                icon: "info",
                html: "Eliminando producto...", // add html attribute if you want or remove
                allowOutsideClick: false,
                showConfirmButton: false,
                onBeforeOpen: () => {
                  this.$swal.showLoading();
                },
              });
              const actualProductsData = await this.getProductsData();
              const newProductsList = actualProductsData.map((pr) => {
                if (pr.section === item.section) {
                  pr.products = pr.products.filter((p) => p.id !== item.id);
                  return pr;
                }
                return pr;
              });
              await this.$fire.firestore
                .collection("Products")
                .doc("Menu")
                .set({
                  data: newProductsList,
                });
              const ref = this.$fire.storage
                .ref("Images")
                .child(item.name + " " + item.id);
              await ref.delete();
              this.$swal.close();
              this.$swal.fire(
                "Exito",
                "Producto eliminado con exito",
                "success"
              );
              await this.getProducts();
            } catch (error) {
              console.log(error);
              this.$swal.close();
              this.$swal("Error", "Error al eliminar producto", "error");
            }
          }
        });
    },
    cleanProductForm() {
      this.name = null;
      this.price = null;
      this.section = null;
      this.checkbox = false;
      this.resetValidation();
    },
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>
<style scoped>
.icon-button-margin {
  margin-right: 10px;
}
.img-table-container {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.img-table-style {
  border-radius: 100%;
  width: 50px;
  height: 50px;
}
.main-product-container {
  min-height: 100vh;
  height: auto;
  padding: 30px;
}
.form-container {
  border: solid 8px;
  padding: 10px;
  border-radius: 10px;
}
.form-create-title {
  font-family: Permanent Marker;
}
@media (max-width: 700px) {
  .form-create-title {
    text-align: center;
  }
}
</style>
