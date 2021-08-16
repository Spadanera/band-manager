<template>
  <v-card class="max-height">
    <v-list color="primary" dark>
      <v-list-item>
        <v-list-item-icon>
          <v-icon> {{ icon }} </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="headline">{{
            listLabel
          }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-list-item-action-text
            >Time: {{ duration }}</v-list-item-action-text
          >
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-list flat class="max-height-list">
      <v-list-item-group>
        <draggable
          group="songs"
          v-model="localSongList"
          @start="startDrag"
          @end="orderSetList"
          draggable=".song"
          handle=".handle"
        >
          <template v-for="(song, index) in this.localSongList">
            <SongItem
              class="song"
              @opensong="openSong"
              @deletesong="deleteSong"
              :key="index"
              :song="song"
              :memberInfo="memberInfo"
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
    songList: Array,
    memberInfo: Object,
    listName: String,
    listLabel: String,
    duration: String,
    icon: String,
    drag: Boolean,
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
    orderSetList() {
      this.$emit("ordersetlist");
    },
    getList() {
      return this.localSongList;
    },
    startDrag() {
      this.$emit("startdrag");
    },
  },
  created() {
    this.localSongList = this.copy(this.songList);
  },
};
</script>

<style>
</style>