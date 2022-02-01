<template>
  <v-dialog
    v-model="dialog"
    persistent
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card class="max-height">
      <v-toolbar
        dense
        dark
        color="primary"
        v-bind:class="{ 'padding-right': $vuetify.breakpoint.mdAndUp }"
      >
        <v-btn icon @click="close">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title class="text-truncate">
          {{ event.locationName }}
        </v-toolbar-title>
        <v-spacer> </v-spacer>
        <v-toolbar-items>
          <v-btn @click="selectedSong--" icon :disabled="selectedSong === 0">
            <v-icon> skip_previous </v-icon>
          </v-btn>
          <v-btn
            @click="selectedSong++"
            icon
            :disabled="selectedSong === event.setlist.length - 1"
          >
            <v-icon> skip_next </v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-toolbar
        v-bind:class="{ 'padding-right': $vuetify.breakpoint.mdAndUp }"
        dense
      >
        <v-toolbar-title>
          {{ songToShow.title }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title v-if="songToShow.bpm" class="text-caption">
          BPM {{ songToShow.bpm }}
        </v-toolbar-title>
        <v-toolbar-items v-if="songToShow.bpm">
          <!-- <v-btn text v-if="!metronomeRunning" @click="startMetronome">
            {{ $ml.get("startMetronome") }}
          </v-btn>
          <v-btn text v-else @click="stopMetronome">
            {{ $ml.get("stopMetronome") }}
          </v-btn> -->
          <v-btn icon @click="songNavigation = true">
            <v-icon> menu_open </v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-navigation-drawer
        temporary
        fixed
        id="live-song-setlist"
        v-model="songNavigation"
        right
      >
        <v-subheader
          style="
            position: absolute;
            background-color: white;
            z-index: 8;
            width: 100%;
            -webkit-box-shadow: 0px 0px 2px;
            -moz-box-shadow: 0px 0px 2px;
            box-shadow: 0px 0px 2px;
          "
          elevation="8"
        >
          {{ $ml.get("missingTime") }}: {{ this.missingTime }}
        </v-subheader>
        <v-list style="padding-top: 50px" dense two-line>
          <v-list-item-group v-model="selectedSong">
            <v-list-item v-for="(song, i) in songList" v-bind:key="i">
              <v-list-item-content>
                <v-list-item-title v-text="song.title"></v-list-item-title>
                <v-list-item-subtitle
                  v-text="song.author"
                ></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action-text
                v-text="parseTime(song.duration)"
              ></v-list-item-action-text>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <div
        v-bind:class="{ 'padding-right': $vuetify.breakpoint.mdAndUp }"
        id="lyrics-container"
      >
        <v-card-text>
          <pre v-bind:class="splitColumnsClass">{{ songToShow.lyrics }}</pre>
        </v-card-text>
      </div>
    </v-card>
    <v-overlay @click="songNavigation = false" v-model="songNavigation">
    </v-overlay>
  </v-dialog>
</template>

<script>
export default {
  name: "LiveDialog",
  props: {
    dialog: Boolean,
    event: Object,
  },
  data() {
    return {
      selectedSong: 0,
      metronomeRunning: false,
      splitColumnsClass: {
        "pre-1": false,
        "pre-2": false,
        "pre-3": false,
        "pre-4": false,
      },
      songNavigation: false,
      metronomeInterval: 0,
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    startMetronome() {
      this.metronomeInterval = window.setInterval(() => {},
      this.event.setlist[this.selectedSong].bpm);
      this.metronomeRunning = true;
    },
    stopMetronome() {
      window.clearInterval(this.metronomeInterval);
      this.metronomeRunning = false;
    },
  },
  computed: {
    missingTime() {
      var time = 0;
      for (let i = this.selectedSong; i < this.event.setlist.length; i++) {
        time += this.event.setlist[i].duration;
      }
      return this.parseTime(time);
    },
    songToShow() {
      return this.event.setlist.length
        ? this.event.setlist[this.selectedSong]
        : {};
    },
    songList() {
      return this.event.setlist.filter((s) => s.live);
    },
  },
  created() {
    if (this.$vuetify.breakpoint.xs) {
      this.splitColumnsClass["pre-1"] = true;
    } else if (this.$vuetify.breakpoint.sm) {
      this.splitColumnsClass["pre-2"] = true;
    } else if (this.$vuetify.breakpoint.lg || this.$vuetify.breakpoint.md) {
      this.splitColumnsClass["pre-3"] = true;
    } else {
      this.splitColumnsClass["pre-4"] = true;
    }
  },
  watch: {
    dialog() {
      this.selectedSong = 0;
      this.songNavigation = false;
    },
    selectedSong() {
      document
        .querySelector("#live-song-setlist .v-list-item--active")
        .scrollIntoView();
      document
        .querySelector("#lyrics-container .v-card__text")
        .scrollIntoView();
    },
  },
};
</script>

<style scoped>
.max-height {
  max-height: 100%;
  height: 100%;
  overflow-y: auto;
}

.padding-right {
  /* padding-right: 256px; */
}

#lyrics-container {
  max-height: calc(100% - 96px);
  height: calc(100% - 96px);
  overflow-y: auto;
}

pre {
  white-space: break-spaces;
  line-height: 19px;
  column-gap: 10px;
  -webkit-column-gap: 10px;
  -moz-column-gap: 10px;
}

.pre-1 {
  column-count: 1;
  -webkit-column-count: 1;
  -moz-column-count: 1;
}

.pre-2 {
  column-count: 2;
  -webkit-column-count: 2;
  -moz-column-count: 2;
}

.pre-3 {
  column-count: 3;
  -webkit-column-count: 3;
  -moz-column-count: 3;
}

.pre-4 {
  column-count: 4;
  -webkit-column-count: 4;
  -moz-column-count: 4;
}
</style>