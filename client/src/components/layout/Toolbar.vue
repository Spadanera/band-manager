<template>
  <v-app-bar app clipped-left fixed color="primary" dark >
    <v-app-bar-nav-icon
      class="hidden-lg-and-up"
      v-if="leftIconVisible()"
      @click="$emit('toggle-nav')"
    ></v-app-bar-nav-icon>
    <router-link :to="rootMenu" tag="span" style="cursor: pointer">
      <img src="../../assets/vmplogo.png">
    </router-link>
    <v-toolbar-title class="display-1 text-uppercase pl-5">
      <router-link :to="rootMenu" tag="span" id="title" class="cavatelo">
        <span class="hidden-sm-and-down">{{ title }}</span>
        <span class="hidden-md-and-up" v-if="!leftIconVisible()">{{ shortTitle }}</span>
      </router-link>

      <span class="font-weight-light"></span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <div class="text-truncate headline" v-if="userMenu"><span class="cavatelo">{{ chronicleName }}</span></div>
    <v-menu v-if="userMenu" :close-on-content-click="false" v-model="menu">
      <template v-slot:activator="{ on }">
        <v-btn fab icon v-on="on">
          <v-avatar size="40px">
            <img :src="user.picture" :alt="user.displayName">
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-list>
          <v-list-item>
            <!-- <v-list-item-content>
              <LanguageSwitcher @close="menu = false" />
            </v-list-item-content> -->
            <v-list-item-action>
              <v-icon>translate</v-icon>
            </v-list-item-action>
          </v-list-item>
          <v-list-item @click="toggleFullScreen" class="hidden-sm-and-down">
            <v-list-item-content>{{$ml.get("fullScreen")}}</v-list-item-content>
            <v-list-item-action >
              <v-icon v-if="!fullscreen">fullscreen</v-icon>
              <v-icon v-else>toggle_on</v-icon>
            </v-list-item-action>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-content>{{$ml.get("logout")}}</v-list-item-content>
            <v-list-item-action>
              <v-icon>exit_to_app</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
    <!-- <LanguageSwitcher v-else /> -->
  </v-app-bar>
</template>

<script>
import client from "../../services/client";
// import LanguageSwitcher from "./LanguageSwitcher";
export default {
  name: "Toolbar",
  components: {
    // LanguageSwitcher
  },
  props: {
    title: String,
    shortTitle: String,
    chronicleName: String,
    darkTheme: Boolean,
    userMenu: Boolean,
    rootMenu: String
  },
  data() {
    return {
      user: {},
      menu: false
    };
  },
  methods: {
    logout() {
      this.menu = false;
      location.href = "/auth/logout";
    },
    toggleDarkTheme() {
      this.menu = false;
      this.$emit("theme");
    },
    leftIconVisible() {
      return this.$route.fullPath.indexOf("/chronicle/") > -1;
    },
    async getUser() {
      if (this.userMenu) {
        let response = await client.get("/api/user");
        this.user = response.data;
      }
    },
    toggleFullScreen() {
      if (this.fullscreen) {
        this.GoOutFullscreen();
      } else {
        this.GoInFullscreen();
      }
      this.menu = false;
    },
    GoInFullscreen() {
      let element = document.querySelector("#app");
      if (element.requestFullscreen) element.requestFullscreen();
      else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
      else if (element.webkitRequestFullscreen)
        element.webkitRequestFullscreen();
      else if (element.msRequestFullscreen) element.msRequestFullscreen();
    },
    GoOutFullscreen() {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  },
  async created() {
    this.getUser();
  },
  computed: {
    fullscreen: {
      get() {
        let full_screen_element =
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement ||
          null;
        // If no element is in full-screen
        if (full_screen_element === null) return false;
        else return true;
      }
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
