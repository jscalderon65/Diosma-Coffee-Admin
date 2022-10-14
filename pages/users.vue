<template>
  <div class="main-users-container">
    <MainTitle text="Usuarios" />
    <br />
    <v-data-table
      :headers="headers"
      :items="users"
      :loading="loadingUsers"
      :hide-default-footer="true"
      class="elevation-1"
    >
      <template v-slot:top>
        <div class="container-buttons-table">
          <v-btn @click="openDialog" outlined elevation="2">
            <v-icon class="icon-button-margin">mdi-plus</v-icon>
            Crear</v-btn
          >
          <v-btn @click="openInfoDialog" outlined color="primary" elevation="2">
            <v-icon class="icon-button-margin">mdi-information-outline</v-icon>
            Info</v-btn
          >
        </div>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn small @click="deleteUser(item)">
          <v-icon big color="red"> mdi-delete </v-icon>
        </v-btn>
      </template>
      <template v-slot:no-data> No hay usuarios registrados </template>
    </v-data-table>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="modal-title">
          <h1>Nuevo usuario</h1>
          <br />
        </v-card-title>
        <br />
        <v-card-text>
          <div>
            <v-progress-linear
              v-if="loadingCreate"
              indeterminate
              color="cyan"
            ></v-progress-linear>
            <br v-if="loadingCreate" />
            <v-text-field
              v-model="newEmail"
              label="Correo"
              outlined
              clearable
            ></v-text-field>
            <div style="display: flex; justify-content: flex-end">
              <v-btn :disabled="!newEmail" @click="createUser" outlined
                ><v-icon class="icon-button-margin">mdi-account-plus</v-icon>
                Registrar
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogInfo" width="500">
      <v-card>
        <v-card-title class="modal-title">
          <h1>Información</h1>
          <br />
        </v-card-title>
        <br />
        <v-card-text>
          <div class="info-text">
            Para crear un nuevo usuario, solo se debe ingresar un correo válido
            y que sea de <b>gmail</b>, solo los usuarios registrados en la tabla
            podrán ingresar a la plataforma.
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import MainTitle from "../components/MainTitle";
import moment from "moment";
export default {
  comments: { MainTitle },
  middleware: "auth",
  computed: {
    currentUser() {
      return this.$store.state.user;
    },
  },
  data: () => ({
    newEmail: null,
    users: [],
    loadingUsers: false,
    loadingCreate: false,
    dialog: false,
    dialogInfo: false,
    headers: [
      {
        text: "Correo",
        align: "center",
        sortable: false,
        value: "email",
      },
      {
        text: "Fecha de creación",
        value: "createdAt",
        sortable: false,
        align: "center",
      },
      {
        text: "Creado por",
        value: "createdBy",
        sortable: false,
        align: "center",
      },
      { text: "Acciones", value: "actions", sortable: false, align: "center" },
    ],
  }),

  created() {
    moment.locale("es");
    this.getUsers();
  },

  methods: {
    async getUsers() {
      try {
        this.loadingUsers = true;
        this.users = await this.getUsersData();
        this.loadingUsers = false;
      } catch (error) {
        this.loadingUsers = false;
        console.log(error);
      }
    },
    verifyEmail(email) {
      if (
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
          email
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
    async getUsersData() {
      const response = await this.$fire.firestore
        .collection("Users")
        .doc("Emails")
        .get();
      return response.data().data;
    },
    async createUser() {
      this.loadingCreate = true;
      try {
        if (this.verifyEmail(this.newEmail)) {
          const actualUsersData = await this.getUsersData();
          if (!actualUsersData.some((e) => e.email === this.newEmail)) {
            const payload = {
              email: this.newEmail,
              createdAt: moment().format("dddd MM, [del] YYYY hh:mm:ss a"),
              createdBy: this.currentUser.email,
            };

            const newUserList = [...actualUsersData, payload];

            await this.$fire.firestore.collection("Users").doc("Emails").set({
              data: newUserList,
            });

            this.$swal(
              "Exito",
              "Se ha creado con exito un nuevo usuario",
              "success"
            );
            this.loadingCreate = false;
            await this.getUsers();
            this.closeDialog();
          } else {
            this.$swal("Alerta", "Este usuario ya existe", "info");
            this.loadingCreate = false;
          }
        } else {
          this.loadingCreate = false;
          this.$swal(
            "Alerta",
            "El correo ingresado no posee un formato valido",
            "info"
          );
        }
      } catch (error) {
        this.loadingCreate = false;
        this.closeDialog();
        console.log(error);
        this.$swal("Error", "Error al crear usuario", "error");
      }
    },
    closeDialog() {
      this.newEmail = null;
      this.dialog = false;
    },
    openDialog() {
      this.dialog = true;
    },
    openInfoDialog() {
      this.dialogInfo = true;
    },
    closeInfoDialog() {
      this.dialogInfo = false;
    },
    async deleteUser(user) {
      if (user.email === this.currentUser.email) {
        this.$swal("Alerta", "No puedes eliminar tu propio usuario", "info");
      } else {
        try {
          const actualUsersData = await this.getUsersData();
          const newUserList = actualUsersData.filter(
            (u) => u.email !== user.email
          );
          await this.$fire.firestore.collection("Users").doc("Emails").set({
            data: newUserList,
          });
          this.$swal("Exito", "Se ha eliminado el usuario", "success");
          await this.getUsers();
        } catch (error) {
          this.$swal("Error", "Error al eliminar usuario", "error");
        }
      }
    },
  },
};
</script>
<style scoped>
.info-text {
  font-size: 1rem;
}
.icon-button-margin {
  margin-right: 10px;
}
.container-buttons-table {
  padding: 20px;
  display: flex;
  justify-content: space-between;
}
.main-users-container {
  min-height: 100vh;
  height: auto;
  padding: 30px;
}
.modal-title {
  font-family: Ms madi !important;
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
