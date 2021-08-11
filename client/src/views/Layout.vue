<template>
  <div>
    <v-app-bar app clipped-left fixed color="primary" dark>
      <v-app-bar-nav-icon
        class="hidden-lg-and-up"
        v-if="leftIconVisible()"
        @click="toggleNav"
      ></v-app-bar-nav-icon>
      <router-link :to="rootMenu" tag="span" style="cursor: pointer">
        <img src="../assets/vmplogo.png" />
      </router-link>
      <v-toolbar-title class="display-1 text-uppercase pl-5">
        <router-link :to="rootMenu" tag="span" id="title" class="cavatelo">
          <span class="hidden-sm-and-down">Band Manager</span>
          <span class="hidden-md-and-up">BD</span>
        </router-link>

        <span class="font-weight-light"></span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="text-truncate headline" v-if="isLoggedIn && bandPage">
        <span class="cavatelo">{{ bandName }}</span>
      </div>
      <v-menu v-if="isLoggedIn" :close-on-content-click="false" v-model="menu">
        <template v-slot:activator="{ on }">
          <v-btn fab icon v-on="on">
            <v-avatar size="40px">
              <img :src="user.picture" :alt="user.displayName" />
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-item @click="logout">
              <v-list-item-content>Logout</v-list-item-content>
              <v-list-item-action>
                <v-icon>exit_to_app</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
      <v-btn v-else @click="login" color="primary">
        <img
          class="gbutton"
          src="../assets/btn_google_light_normal_ios.svg"
          alt
        />
        Log in
      </v-btn>
      <template v-slot:extension v-if="bandPage">
        <v-tabs v-model="bandTab" fixed-tabs background-color="secondary">
          <v-tab>General Info</v-tab>
          <v-tab>Setlist</v-tab>
          <v-tab>Events</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-content class="max-height">
      <router-view @setband="setBand" :tab="bandTab" :nav="nav"></router-view>
    </v-content>
    <NprogressContainer />
  </div>
</template>

<script>
import NprogressContainer from "vue-nprogress/src/NprogressContainer";
import client from "../services/client";
export default {
  components: {
    NprogressContainer,
  },
  data() {
    return {
      darkTheme: false,
      nav: {
        visible: false,
      },
      isLoggedIn: false,
      user: {},
      menu: false,
      rootMenu: "/",
      bandName: "",
      bandTab: null
    };
  },
  methods: {
    toggleNav() {
      this.nav.visible = !this.nav.visible;
    },
    setBand(bandName) {
      this.bandName = bandName;
    },
    toggleTheme() {
      this.$emit("theme");
    },
    login() {
      location.href = `/auth`;
    },
    logout() {
      this.menu = false;
      location.href = "/auth/logout";
    },
    toggleDarkTheme() {
      this.menu = false;
      this.$emit("theme");
    },
    leftIconVisible() {
      return this.$route.fullPath.indexOf("/band/") > -1;
    },
    async getUser() {
      if (this.isLoggedIn) {
        let response = await client.get("/api/user");
        this.user = response.data;
      }
    },
  },
  async created() {
    try {
      let isLoggedIn = await client.get("/auth/checkauthentication");
      this.isLoggedIn = isLoggedIn.data;
      if (this.isLoggedIn) {
        await this.getUser();
        this.loaded = true;
        this.rootMenu = "/bands";
      } else {
        this.loaded = true;
        this.rootMenu = "/";
      }
      if (this.message) {
        this.snackbar.text = this.message;
        this.snackbar.enabled = true;
      }
    } catch (error) {
      this.loaded = true;
    }
  },
  computed: {
    bandPage() {
      return /\/band\//.test(this.$route.path);
    }
  }
};
</script>

<style>
.v-toolbar__title {
  cursor: pointer;
}
img {
  width: 45px;
}
</style>
