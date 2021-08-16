<template>
  <div>
    <v-app-bar app clipped-left fixed color="primary" dark>
      <v-app-bar-nav-icon
        class="hidden-md-and-up"
        @click="drawer = true"
      ></v-app-bar-nav-icon>
      <router-link :to="rootMenu" custom v-slot="{ navigate }">
          <img @click="navigate" style="padding: 3px; margin-top: 6px; cursor: pointer;" src="../assets/logo_small.png" />
      </router-link>
      <v-toolbar-title v-if="!bandPage" class="display-1 text-uppercase pl-5">
        <router-link :to="rootMenu" id="title" v-slot="{ navigate }" custom class="cavatelo">
          <span @click="navigate">Gig Addicted</span>
        </router-link>

        <span class="font-weight-light"></span>
      </v-toolbar-title>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text v-for="link in links" :key="link.to">
          <router-link :to="link.to" v-slot="{ navigate }" custom> <span @click="navigate">{{ link.title }}</span> </router-link>
        </v-btn>
        <v-divider vertical v-if="isLoggedIn"></v-divider>
        <v-btn v-if="isLoggedIn" text>
          <router-link to="/bands"  v-slot="{ navigate }" custom> <span @click="navigate">My Bands</span> </router-link>
        </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <div class="text-truncate headline" v-if="isLoggedIn && bandPage">
        <span class="cavatelo">{{ bandName }}</span>
      </div>
      <v-menu
        class="hidden-sm-and-down"
        v-if="isLoggedIn"
        :close-on-content-click="false"
        v-model="menu"
      >
        <template v-slot:activator="{ on }">
          <v-btn fab icon v-on="on" class="hidden-sm-and-down">
            <v-avatar size="40px">
              <img :src="user.picture" :alt="user.displayName" />
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-item @click="logout">
              <v-list-item-content>LOGOUT</v-list-item-content>
              <v-list-item-action>
                <v-icon>exit_to_app</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
      <v-btn v-else @click="login" color="primary" class="hidden-sm-and-down">
        <img
          class="gbutton"
          src="../assets/btn_google_light_normal_ios.svg"
          alt
        />
        Log in
      </v-btn>
      <template v-slot:extension v-if="bandPage">
        <v-tabs v-model="bandTab" fixed-tabs background-color="secondary">
          <v-tab><span>General Info</span></v-tab>
          <v-tab>Setlist</v-tab>
          <v-tab>Events</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      temporary
      dark
      color="primary"
    >
      <v-list>
        <v-list-item v-if="isLoggedIn" two-line>
          <v-list-item-avatar>
            <img :src="user.picture" :alt="user.displayName" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.displayName }}</v-list-item-title>
            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-if="isLoggedIn"></v-divider>
        <v-list-item v-if="isLoggedIn">
          <v-list-item-icon>
            <v-icon>groups</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              <router-link v-slot="{ navigate }" custom to="/bands"> <span @click="navigate">MY BANDS</span> </router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-if="isLoggedIn"></v-divider>
        <v-list-item v-for="link in links" :key="link.title" link>
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              <router-link v-slot="{ navigate }" custom :to="link.to">
                <span @click="navigate">{{ link.title }}</span>
              </router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-list-item @click="logOutIn">
          <v-list-item-icon>
            <v-icon v-if="isLoggedIn">exit_to_app</v-icon>
            <v-icon v-else>login</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-if="isLoggedIn"> LOGOUT </v-list-item-title>
            <v-list-item-title v-else> LOGIN / REGISTER </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-navigation-drawer>
    <v-main class="max-height">
      <router-view @setband="setBand" :tab="bandTab"></router-view>
    </v-main>
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
      isLoggedIn: false,
      user: {},
      menu: false,
      rootMenu: "/",
      bandName: "",
      bandTab: null,
      drawer: null,
      links: [
        { title: "HOME", to: "/", icon: "home" },
        { title: "BANDS", to: "/public-bands", icon: "recent_actors" },
        { title: "EVENTS", to: "/public-events", icon: "event" },
        // { title: "ABOUT", to: "/about", icon: "info" },
      ],
    };
  },
  methods: {
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
    logOutIn() {
      if (this.isLoggedIn) {
        this.logout();
      } else {
        this.login();
      }
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
    },
  },
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
