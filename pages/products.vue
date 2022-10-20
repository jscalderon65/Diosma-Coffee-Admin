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
        <v-text-field
          v-model="price"
          :rules="requiredRules"
          type="number"
          label="Precio del producto"
          required
        ></v-text-field>
        <v-checkbox
          v-if="sections.length > 0"
          v-model="checkbox"
          label="Usar secciones existentes?"
        ></v-checkbox>
        <v-select
          v-if="checkbox"
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
        <div style="text-align: center">
          <v-btn @click="createProduct" v-if="!loadingCreateProduct" outlined
            ><v-icon class="icon-button-margin">mdi-plus</v-icon>
            Crear
          </v-btn>
        </div>
        <br />
      </v-form>
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
                <v-btn small @click="productDetails(item)">
                  <v-icon big color="primary"> mdi-eye </v-icon>
                </v-btn>
              </v-list-item>
              <v-list-item>
                <v-btn small @click="editProduct(item)">
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
      products: [
        /*  {
          section: "Café",
          products: [
            {
              id: JSON.stringify(new Date()),
              name: "Café semi descremado",
              imageUrl: "https://picsum.photos/200/300",
              createdBy: "jscalderon@gmail.com",
              price: "30000",
              createdAt: "10/20/2022",
              isAvailable: true,
            },
          ],
        },
        {
          section: "Licor",
          products: [
            {
              id: "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
              name: "Licor!",
              imageUrl: "https://picsum.photos/200/300",
              price: "30000",
              createdBy: "jscalderon@gmail.com",
              createdAt: "10/20/2022",
              isAvailable: true,
            },
          ],
        },
        {
          section: "Alimentos",
          products: [
            {
              id: "fffffffffffffffffffffff",
              name: "Comida",
              imageUrl: "https://picsum.photos/200/300",
              createdBy: "jscalderon@gmail.com",
              createdAt: "10/20/2022",
              price: "30000",
              isAvailable: true,
            },
          ],
        }, */
      ],
      search: "",
      tableProducts: [],
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
          (v && v.length <= 15) || "El nombre no debe superar las 30 letras",
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
    async getProducts() {
      try {
        this.loadingTableData = true;
        this.products = await this.getProductsData();
        if (this.products) {
          this.tableProducts = this.products
            .map((pr) => {
              return pr.products.map((p) => ({ ...p, section: pr.section }));
            })
            .flat();
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
        this.price = this.price.trim();
        this.section = this.section.trim();
        try {
          this.loadingCreateProduct = true;
          const serverIdProduct = uid(16);
          const payload = {
            id: serverIdProduct,
            name: this.name,
            imageUrl: "https://picsum.photos/200/300",
            createdBy: this.currentUser.email,
            createdAt: moment().format("dddd MM, [del] YYYY hh:mm:ss a"),
            price: this.price,
            isAvailable: true,
          };
          const actualProductsData = await this.getProductsData();
          if (actualProductsData) {
            if (this.section.includes(this.section)) {
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
                "Se ha creado con exito el producto",
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
    cleanProductForm() {
      this.name = null;
      this.price = null;
      this.section = null;
      this.checkbox = false;
      this.resetValidation();
    },
    productDetails() {},
    editProduct() {},
    deleteProduct() {},
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
  border: solid 5px;
  padding: 10px;
  border-radius: 5px;
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
