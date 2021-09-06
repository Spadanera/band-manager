<template>
  <v-bottom-sheet inset eager persistent v-model="openSheet">
    <div>
      <div style="height: 50px; text-align: center">
        <img src="../../assets/en_GB-dark@2x.png" style="width: 150px" />
      </div>
      <v-card :height="$vuetify.breakpoint.mdAndUp ? 100 : 150" tile>
        <v-progress-linear
          v-model="percentage"
          class="my-0"
          height="3"
          @click.native="setPosition()"
          :disabled="!loaded"
        ></v-progress-linear>
        <v-card-title v-if="!$vuetify.breakpoint.mdAndUp">{{
          title
        }}</v-card-title>
        <v-card-subtitle
          v-if="!$vuetify.breakpoint.mdAndUp"
          style="padding-bottom: 0"
          >{{ author }}</v-card-subtitle
        >
        <v-list v-bind:class="{
                'no-padding': $vuetify.breakpoint.smAndDown,
              }">
          <v-list-item>
            <v-list-item-content v-if="$vuetify.breakpoint.mdAndUp">
              <v-list-item-title>{{ title }}</v-list-item-title>
              <v-list-item-subtitle>{{ author }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-spacer></v-spacer>
            <div></div>
            <v-list-item-icon>
              <v-btn
                outlined
                icon
                class="ma-2"
                :color="color"
                @click.native="mute()"
                :disabled="!loaded"
              >
                <v-icon v-if="!isMuted">volume_up</v-icon>
                <v-icon v-else>volume_mute</v-icon>
              </v-btn>
            </v-list-item-icon>

            <v-list-item-icon>
              <v-btn
                outlined
                icon
                class="ma-2"
                :color="color"
                @click.native="playing ? pause() : play()"
                :disabled="!loaded"
              >
                <v-icon v-if="!playing || paused">play_arrow</v-icon>
                <v-icon v-else>pause</v-icon>
              </v-btn>
            </v-list-item-icon>

            <v-list-item-icon v-if="isList">
              <v-btn
                outlined
                icon
                class="ma-2"
                :color="color"
                @click.native="$emit('previous')"
                :disabled="!loaded"
              >
                <v-icon>skip_previous</v-icon>
              </v-btn>
            </v-list-item-icon>

            <v-list-item-icon v-if="isList">
              <v-btn
                outlined
                icon
                class="ma-2"
                :color="color"
                @click.native="$emit('next')"
                :disabled="!loaded"
              >
                <v-icon>skip_next</v-icon>
              </v-btn>
            </v-list-item-icon>

            <v-list-item-icon>
              <v-btn
                outlined
                icon
                class="ma-2"
                :color="color"
                @click.native="close()"
                :disabled="!loaded && !error"
              >
                <v-icon>close</v-icon>
              </v-btn>
            </v-list-item-icon>

            <v-spacer></v-spacer>

            <v-list-item-content
              v-bind:class="{
                'floating-subheader': $vuetify.breakpoint.smAndDown,
              }"
            >
              <v-list-item-subtitle>
                <span v-if="!error">{{ currentTime }} / {{ duration }}</span>
                <span v-else style="color: red; font-size: larger">{{
                  errorMessage
                }}</span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </div>
    <audio
      id="player"
      ref="player"
      v-on:ended="ended"
      v-on:canplay="canPlay"
      :src="file"
    ></audio>
  </v-bottom-sheet>
</template>
<script>
const formatTime = (second) =>
  new Date(second * 1000).toISOString().substr(14, 5);
export default {
  name: "vuetify-audio",
  props: {
    title: String,
    author: String,
    flat: Boolean,
    file: String,
    ended: {
      type: Function,
      default: () => {},
    },
    canPlay: {
      type: Function,
      default: () => {},
    },
    color: String,
    downloadable: Boolean,
    open: Boolean,
    isList: Boolean,
  },
  computed: {
    duration() {
      return this.audio ? formatTime(this.totalDuration) : "";
    },
    openSheet: {
      get() {
        return this.open || this.playing;
      },
      set() {},
    },
  },
  data() {
    return {
      firstPlay: true,
      isMuted: false,
      loaded: false,
      playing: false,
      paused: false,
      percentage: 0,
      currentTime: "00:00",
      audio: undefined,
      totalDuration: 0,
      playerVolume: 1,
      error: false,
    };
  },
  methods: {
    close() {
      this.stop();
      this.$emit("close");
    },
    setPosition() {
      this.audio.currentTime = parseInt(
        (this.audio.duration / 100) * this.percentage
      );
    },
    stop() {
      this.audio.pause();
      this.paused = true;
      this.playing = false;
      this.audio.currentTime = 0;
    },
    play() {
      this.audio
        .play()
        .then(() => (this.playing = true))
        .catch((e) => {
          console.log(e);
          this.error = true;
          this.errorMessage = "Error occured";
        });
      this.paused = false;
    },
    pause() {
      this.paused = !this.paused;
      this.paused ? this.audio.pause() : this.audio.play();
    },
    download() {
      this.audio.pause();
      window.open(this.file, "download");
    },
    mute() {
      this.isMuted = !this.isMuted;
      this.audio.muted = this.isMuted;
    },
    reload() {
      this.audio.load();
    },
    _handleLoaded: function () {
      if (this.audio.readyState >= 2) {
        if (this.audio.duration === Infinity) {
          this.audio.currentTime = 1e101;
          this.audio.ontimeupdate = () => {
            this.audio.ontimeupdate = () => {};
            this.audio.currentTime = 0;
            this.totalDuration = parseInt(this.audio.duration);
          };
        } else {
          this.totalDuration = parseInt(this.audio.duration);
        }
        this.loaded = true;
        if (this.open) {
          this.play();
        }
      } else {
        throw new Error("Failed to load sound file");
      }
    },
    _handlePlayingUI: function () {
      this.audio.volume = this.playerVolume;
      this.percentage = (this.audio.currentTime / this.audio.duration) * 100;
      this.currentTime = formatTime(this.audio.currentTime);
    },
    _handlePlayPause: function (e) {
      if (e.type === "play" && this.firstPlay) {
        // in some situations, audio.currentTime is the end one on chrome
        this.audio.currentTime = 0;
        if (this.firstPlay) {
          this.firstPlay = false;
        }
      }
      if (
        e.type === "pause" &&
        this.paused === false &&
        this.playing === false
      ) {
        this.currentTime = "00:00";
      }
      if (e.type === "play") {
        this.playing = true;
        this.paused = false;
      }
      if (e.type === "pause") {
        this.playing = false;
        this.paused = true;
      }
    },
    _handleEnded() {
      this.paused = this.playing = false;
      this.$emit("ended");
    },
    init: function () {
      this.audio.addEventListener("timeupdate", this._handlePlayingUI);
      this.audio.addEventListener("loadeddata", this._handleLoaded);
      this.audio.addEventListener("pause", this._handlePlayPause);
      this.audio.addEventListener("play", this._handlePlayPause);
      this.audio.addEventListener("ended", this._handleEnded);
    },
  },
  watch: {
    file() {
      this.reload();
    },
    open() {
      if (!this.open) {
        if (this.playing) {
          this.stop();
        }
      }
    },
  },
  mounted() {
    this.audio = this.$refs.player;
    this.init();
  },
  beforeDestroy() {
    this.audio.removeEventListener("timeupdate", this._handlePlayingUI);
    this.audio.removeEventListener("loadeddata", this._handleLoaded);
    this.audio.removeEventListener("pause", this._handlePlayPause);
    this.audio.removeEventListener("play", this._handlePlayPause);
    this.audio.removeEventListener("ended", this._handleEnded);
  },
};
</script>

<style scoped>
.floating-subheader {
  position: absolute;
  top: -78px;
  right: 8px;
}

.no-padding {
  padding-top: 0 !important;
}
</style>