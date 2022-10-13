<template>
  <div style="min-height: 100vh; height: auto; padding: 30px">
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
        <div
          style="padding: 20px; display: flex; justify-content: space-between"
        >
          <v-btn @click="openDialog" outlined elevation="2">
            <v-icon style="margin-right: 10px">mdi-plus</v-icon>
            Crear</v-btn
          >
          <v-btn outlined color="primary" elevation="2">
            <v-icon style="margin-right: 10px">mdi-information-outline</v-icon>
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
            <v-text-field
              v-model="newEmail"
              label="Correo"
              outlined
              clearable
            ></v-text-field>
            <div style="display: flex; justify-content: flex-end">
              <v-btn @click="createUser" outlined
                ><v-icon style="margin-right: 10px">mdi-account-plus</v-icon>
                Registrar
              </v-btn>
            </div>
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
    dialog: false,
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
      try {
        try {
          if (this.verifyEmail(this.newEmail)) {
            const actualUsersData = await this.getUsersData();
            const payload = {
              email: this.newEmail,
              createdAt: moment().format("dddd MM, [del] YYYY hh:mm:ss a"),
              createdBy: this.currentUser.email,
            };

            const newUserList = [...actualUsersData, payload];

            await this.$fire.firestore.collection("Users").doc("Emails").set({
              data: newUserList,
            });

            await this.getUsers();

            this.dialog = false;
          }
        } catch (error) {
          this.dialog = false;
          console.log(error);
        }
        this.closeDialog();
      } catch (error) {}
    },
    closeDialog() {
      this.dialog = false;
    },
    openDialog() {
      this.dialog = true;
    },
    async deleteUser(user) {
      try {
        const actualUsersData = await this.getUsersData();
        const newUserList = actualUsersData.filter(
          (u) => u.email !== user.email
        );
        await this.$fire.firestore.collection("Users").doc("Emails").set({
          data: newUserList,
        });
        await this.getUsers();
      } catch (error) {}
    },
  },
};
</script>
<style scoped>
.modal-title {
  font-family: Ms madi !important;
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
