<template>
  <v-card
    v-bind:class="{ 'max-height': !readOnly, 'limited-height': readOnly }"
    :elevation="elevation"
    class="setlist"
  >
    <v-list color="primary" dark v-if="!inEvent">
      <v-list-item>
        <v-list-item-icon>
          <v-icon style="margin-top: 9px"> {{ icon }} </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="headline">{{
            listLabel
          }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-list-item-action-text v-if="showPreview && localSongList.filter(s => s.preview).length">
            <v-btn small text @click="playSetlist">
              <v-icon left> play_arrow </v-icon>
              Play
            </v-btn>
          </v-list-item-action-text>
          <v-list-item-action-text
            >Time: {{ duration }}</v-list-item-action-text
          >
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-list
      flat
      class="max-height-list"
      v-bind:class="{ full: readOnly }"
      dense
    >
      <v-subheader v-if="inEvent">
        <span>Time: {{ duration }}</span>
        <v-spacer></v-spacer>
        <span
          v-if="inEvent && !readOnly"
          style="cursor: pointer"
          @click="reloadSetlist()"
          >RELOAD MAIN SETLIST</span
        >
      </v-subheader>
      <v-list-item-group>
        <draggable
          group="songs"
          v-model="localSongList"
          @start="startDrag"
          @end="orderSetlist"
          draggable=".song"
          handle=".handle"
        >
          <template v-for="(song, index) in this.localSongList">
            <SongItem
              :inEvent="inEvent"
              class="song"
              @opensong="openSong"
              @deletesong="deleteSong"
              :key="index"
              :song="song"
              :memberInfo="memberInfo"
              @togglelive="toggleLive(index)"
              :readOnly="readOnly"
            ></SongItem>
          </template>
          <v-divider></v-divider>
        </draggable>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
import draggable from "vuedraggable";
import SongItem from "./SongItem.vue";
export default {
  name: "SongList",
  components: {
    draggable,
    SongItem,
  },
  props: {
    inEvent: Boolean,
    songList: Array,
    memberInfo: Object,
    listName: String,
    listLabel: String,
    duration: String,
    icon: String,
    drag: Boolean,
    readOnly: Boolean,
    elevation: Number,
    showPreview: Boolean,
  },
  data() {
    return {
      localSongList: [],
    };
  },
  methods: {
    openSong(song) {
      this.$emit("opensong", song);
    },
    deleteSong(song) {
      this.$emit("deletesong", song);
    },
    orderSetlist() {
      this.$emit("ordersetlist");
    },
    getList() {
      return this.localSongList;
    },
    startDrag() {
      this.$emit("startdrag");
    },
    toggleLive(index) {
      this.localSongList[index].live = !this.localSongList[index].live;
      this.orderSetlist();
    },
    reload(songList) {
      this.localSongList = this.copy(songList || this.songList);
    },
    reloadSetlist() {
      this.$emit("reloadsetlist");
    },
    playSetlist() {
      this.$root.$emit("playSetlist", this.localSongList);
    }
  },
  created() {
    this.localSongList = this.copy(this.songList);
  },
  watch: {
    songList: {
      handler: function () {
        this.reload();
      },
      deep: true
    }
  },
};
</script>

<style>
.full {
  max-height: 100% !important;
  height: 100% !important;
}

.limited-height {
  max-height: 500px;
  overflow: auto;
}

.setlist .v-list-item__icon,
.setlist .v-list-item__action {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>