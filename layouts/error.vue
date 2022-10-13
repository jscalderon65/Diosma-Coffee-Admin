<template>
  <v-app dark>
    <div v-if="error.statusCode === 404">
      <div class="container-404">
        <h1 style="font-family: Ms Madi; font-size: 3rem">
          Página no encontrada
        </h1>
        <section class="error-container">
          <span>4</span>
          <span>
            <span class="screen-reader-text">0</span>
          </span>
          <span>4</span>
        </section>
        <div class="link-container">
          <br />
          <div style="display: flex; justify-content: center">
            <button class="main-button menu-button">
              <a href="/"> Inicio </a>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="container-404">
        <h1 style="font-family: Ms Madi; font-size: 3rem">Error inesperado</h1>
        <section class="error-container">
          <span>5</span>
          <span>
            <span class="screen-reader-text">0</span>
          </span>
          <span>0</span>
        </section>
        <div class="link-container">
          <br />
          <div style="display: flex; justify-content: center">
            <button class="main-button menu-button">
              <a href="/"> Inicio </a>
            </button>
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
export default {
  name: "EmptyLayout",
  layout: "empty",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: "404 Not Found",
      otherError: "An error occurred",
    };
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title,
    };
  },
};
</script>

<style scoped>
.main-button.menu-button {
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
  width: 100%;
  font-family: "Permanent Marker";
  font-size: 1.5rem;
  padding: 7px 20px !important;
  border-radius: 5px;
  margin: 0px 0px 0px 20px;
  background-color: rgba(255, 255, 255, 0);
  border: 6px solid #f2e9e4;
  transition: 0.8s;
}

.main-button.menu-button a {
  text-decoration: none;
  color: #f2e9e4;
}

.main-button.menu-button:hover {
  background-color: black;
  cursor: pointer;
}
.main-button.menu-button:hover a {
  color: #f2e9e4;
}
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 150px;
  font-family: "Catamaran", sans-serif;
  font-weight: 800;
  margin-top: 20px;
  margin-bottom: 40px;
}

.error-container > span {
  display: inline-block;
  line-height: 0.7;
  position: relative;
  color: #ffb485;
}

.error-container > span {
  display: inline-block;
  position: relative;
  vertical-align: middle;
}

.error-container > span:nth-of-type(1) {
  color: #d1f2a5;
  animation: colordancing 4s infinite;
}

.error-container > span:nth-of-type(3) {
  color: #f56991;
  animation: colordancing2 4s infinite;
}

.error-container > span:nth-of-type(2) {
  width: 120px;
  height: 120px;
  border-radius: 999px;
}

.error-container > span:nth-of-type(2):before,
.error-container > span:nth-of-type(2):after {
  border-radius: 0%;
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: inherit;
  height: inherit;
  border-radius: 999px;
  box-shadow: inset 30px 0 0 rgba(209, 242, 165, 0.4),
    inset 0 30px 0 rgba(239, 250, 180, 0.4),
    inset -30px 0 0 rgba(255, 196, 140, 0.4),
    inset 0 -30px 0 rgba(245, 105, 145, 0.4);
  animation: shadowsdancing 4s infinite;
}

.error-container > span:nth-of-type(2):before {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  transform: rotate(45deg);
}

.screen-reader-text {
  position: absolute;
  top: -9999em;
  left: -9999em;
}

@keyframes shadowsdancing {
  0% {
    box-shadow: inset 30px 0 0 rgba(209, 242, 165, 0.4),
      inset 0 30px 0 rgba(239, 250, 180, 0.4),
      inset -30px 0 0 rgba(255, 196, 140, 0.4),
      inset 0 -30px 0 rgba(245, 105, 145, 0.4);
  }

  25% {
    box-shadow: inset 30px 0 0 rgba(245, 105, 145, 0.4),
      inset 0 30px 0 rgba(209, 242, 165, 0.4),
      inset -30px 0 0 rgba(239, 250, 180, 0.4),
      inset 0 -30px 0 rgba(255, 196, 140, 0.4);
  }

  50% {
    box-shadow: inset 30px 0 0 rgba(255, 196, 140, 0.4),
      inset 0 30px 0 rgba(245, 105, 145, 0.4),
      inset -30px 0 0 rgba(209, 242, 165, 0.4),
      inset 0 -30px 0 rgba(239, 250, 180, 0.4);
  }

  75% {
    box-shadow: inset 30px 0 0 rgba(239, 250, 180, 0.4),
      inset 0 30px 0 rgba(255, 196, 140, 0.4),
      inset -30px 0 0 rgba(245, 105, 145, 0.4),
      inset 0 -30px 0 rgba(209, 242, 165, 0.4);
  }

  100% {
    box-shadow: inset 30px 0 0 rgba(209, 242, 165, 0.4),
      inset 0 30px 0 rgba(239, 250, 180, 0.4),
      inset -30px 0 0 rgba(255, 196, 140, 0.4),
      inset 0 -30px 0 rgba(245, 105, 145, 0.4);
  }
}

@keyframes colordancing {
  0% {
    color: #d1f2a5;
  }

  25% {
    color: #f56991;
  }

  50% {
    color: #ffc48c;
  }

  75% {
    color: #effab4;
  }

  100% {
    color: #d1f2a5;
  }
}

@keyframes colordancing2 {
  0% {
    color: #ffc48c;
  }

  25% {
    color: #effab4;
  }

  50% {
    color: #d1f2a5;
  }

  75% {
    color: #f56991;
  }

  100% {
    color: #ffc48c;
  }
}

.container-404 {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
