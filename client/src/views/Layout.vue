<template>
  <div>
    <v-app-bar app clipped-left fixed color="primary" dark>
      <v-app-bar-nav-icon
        class="hidden-md-and-up"
        @click="drawer = true"
      ></v-app-bar-nav-icon>
      <router-link :to="rootMenu" custom v-slot="{ navigate }">
        <img
          @click="navigate"
          style="padding: 3px; cursor: pointer"
          src="../assets/logo_small.png"
        />
      </router-link>
      <v-toolbar-title v-if="!bandPage" class="display-1 text-uppercase pl-5">
        <router-link
          :to="rootMenu"
          id="title"
          v-slot="{ navigate }"
          custom
          class="cavatelo"
        >
          <span @click="navigate">Gig Addicted</span>
        </router-link>

        <span class="font-weight-light"></span>
      </v-toolbar-title>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text v-for="link in links" :key="link.to">
          <router-link
            v-bind:class="{ underline: matchRoute(link.to) }"
            :to="link.to"
            v-slot="{ navigate }"
            custom
          >
            <span @click="navigate">{{ $ml.get(link.title) }}</span>
          </router-link>
        </v-btn>
        <v-divider vertical v-if="isLoggedIn"></v-divider>
        <v-btn v-if="isLoggedIn" text>
          <router-link
            v-bind:class="{ underline: matchRoute('/bands') }"
            to="/bands"
            v-slot="{ navigate }"
            custom
          >
            <span @click="navigate">{{$ml.get("myBands")}}</span>
          </router-link>
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
            <v-list-item>
              <v-list-item-content>
                <LanguageSwitcher @close="menu = false" />
              </v-list-item-content>
              <v-list-item-action>
                <v-icon>language</v-icon>
              </v-list-item-action>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-content style="text-transform: uppercase;">{{$ml.get("logout")}}</v-list-item-content>
              <v-list-item-action>
                <v-icon>exit_to_app</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
      <v-toolbar-items v-else class="hidden-sm-and-down">
        <v-btn text @click="login">
          <img
            class="gbutton"
            src="../assets/btn_google_light_normal_ios.svg"
            alt
          />
          {{$ml.get("login")}}
        </v-btn>
        <LanguageSwitcher @close="menu = false" :icon="true" />
      </v-toolbar-items>
      <template v-slot:extension v-if="bandPage">
        <v-tabs v-model="bandTab" show-arrows grow background-color="secondary">
          <v-tab>{{$ml.get("generalInfo")}}</v-tab>
          <v-tab>{{$ml.get("setlists")}}</v-tab>
          <v-tab>{{$ml.get("events")}}</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" fixed temporary dark color="primary">
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
              <router-link
                v-bind:class="{ underline: matchRoute('/bands') }"
                v-slot="{ navigate }"
                custom
                to="/bands"
              >
                <span @click="navigate">{{$ml.get("myBands")}}</span>
              </router-link>
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
              <router-link
                v-bind:class="{ underline: matchRoute(link.to) }"
                v-slot="{ navigate }"
                custom
                :to="link.to"
              >
                <span @click="navigate">{{ $ml.get(link.title) }}</span>
              </router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-list-item>
          <v-list-item-action>
            <v-icon>language</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <LanguageSwitcher @close="menu = false" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logOutIn">
          <v-list-item-icon>
            <v-icon v-if="isLoggedIn">exit_to_app</v-icon>
            <v-icon v-else>login</v-icon>
          </v-list-item-icon>
          <v-list-item-content style="text-transform: uppercase">
            <v-list-item-title v-if="isLoggedIn"> {{$ml.get("logout")}} </v-list-item-title>
            <v-list-item-title v-else> {{$ml.get("login")}} </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-navigation-drawer>
    <v-main class="max-height">
      <router-view @setband="setBand" :tab="bandTab"></router-view>
    </v-main>
    <NprogressContainer />
    <vuetify-audio
      ref="playerbottom"
      flat
      :file="play.preview"
      :title="play.title"
      :author="play.author"
      :open="play.open"
      :isList="setlist.length ? true : false"
      @close="closePlayer"
      @ended="endedSong"
      @next="nextSong"
      @previous="previousSong"
    ></vuetify-audio>
    <v-dialog
      :overlay-opacity="0.8"
      v-model="imageDialog"
      :scrollable="false"
      :max-width="$vuetify.breakpoint.smAndUp ? '600px' : '100%'"
    >
      <v-img
        class="text-right"
        contain
        :src="image"
        max-height="100%"
        max-width
      >
        <v-btn
          small
          fab
          dark
          @click="imageDialog = false"
          style="background-color: rgba(0, 0, 0, 0.3)"
        >
          <v-icon> close </v-icon>
        </v-btn>
      </v-img>
    </v-dialog>
    <v-snackbar
      v-model="snackbar.enabled"
      :bottom="true"
      :left="false"
      :multi-line="false"
      :right="false"
      :timeout="3000"
      :vertical="false"
    >
      {{ snackbar.text }}
      <v-btn text @click="snackbar.enabled = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import NprogressContainer from "vue-nprogress/src/NprogressContainer";
import VuetifyAudio from "../components/song/VuetifyAudio.vue";
import client from "../services/client";
import LanguageSwitcher from "../components/layout/LanguageSwitcher.vue";

export default {
  components: {
    NprogressContainer,
    VuetifyAudio,
    LanguageSwitcher,
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
        { title: "home", to: "/", icon: "home" },
        { title: "bands", to: "/public-bands", icon: "recent_actors" },
        { title: "events", to: "/public-events", icon: "event" },
        { title: "about", to: "/about", icon: "info" },
      ],
      play: {
        preview: "",
        title: "",
        author: "",
        open: false,
      },
      image: "",
      imageDialog: false,
      setlist: [],
      playIndex: 0,
      snackbar: {
        enebled: false,
        text: "",
      },
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
      const urlParams = new URLSearchParams(window.location.search);
      const from = urlParams.get("from");
      window.location.href = `/auth${
        from ? `?from=${encodeURIComponent(from)}` : ""
      }`;
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
    matchRoute(path) {
      if (path === "/") {
        return `#${path}` === window.location.hash;
      }
      let reg = new RegExp(path);
      return reg.test(window.location.hash);
    },
    startPlayer(song) {
      this.play.open = true;
      this.play.preview = song.preview;
      this.play.title = song.title;
      this.play.author = song.author;
    },
    closePlayer() {
      this.play.open = false;
      this.setlist = [];
      this.playIndex = 0;
    },
    openImage(image) {
      this.image = image;
      this.imageDialog = true;
    },
    playSetlist(setlist) {
      this.setlist = setlist.filter((s) => s.preview);
      this.playIndex = 0;
      this.startPlayer(this.setlist[0]);
    },
    endedSong() {
      this.playIndex++;
      if (this.setlist.length > this.playIndex) {
        this.startPlayer(this.setlist[this.playIndex]);
      } else {
        this.closePlayer();
      }
    },
    nextSong() {
      this.endedSong();
    },
    previousSong() {
      if (this.playIndex > 0) {
        this.playIndex--;
        this.startPlayer(this.setlist[this.playIndex]);
      }
    },
    showSnackbar(text) {
      this.snackbar = {
        enabled: true,
        text,
      };
    },
  },
  async created() {
    this.$root.$on("startPlayer", this.startPlayer);
    this.$root.$on("playSetlist", this.playSetlist);
    this.$root.$on("openImage", this.openImage);
    this.$root.$on("showSnackbar", this.showSnackbar);
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
.underline {
  text-decoration: underline;
}

.nomargin {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.v-dialog {
  box-shadow: none !important;
  overflow-x: hidden !important;
}
</style>
