<template>
  <div>
    <v-divider></v-divider>
    <v-list-item two-line>
      <v-list-item-icon v-if="song.audio">
        <v-icon>play_circle</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title v-text="song.title"></v-list-item-title>
        <v-list-item-subtitle v-text="song.author"></v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-list-item-action-text
          v-text="parseTime(song.duration)"
        ></v-list-item-action-text>
        <v-menu close-on-content-click close-on-click absolute v-if="memberInfo.isAdmin || memberInfo.canEditSetList">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon><v-icon v-bind="attrs" v-on="on"> more_vert </v-icon></v-btn>
          </template>
          <v-list dense flat>
            <v-list-item-group>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title @click="openSong(song)"
                    >Edit</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title @click="deleteSong(song)"
                    >Delete</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </v-list-item-action>
    </v-list-item>
  </div>
</template>

<script>
export default {
  name: "SongItem",
  props: {
    song: Object,
    memberInfo: Object
  },
  data() {
    return {};
  },
  methods: {
    openSong(song) {
      this.$emit("opensong", song);
    },
    deleteSong(song) {
      this.$emit("deletesong", song);
    },
    parseTime(second) {
      return `${Math.floor(second / 60)}:${second % 60}`;
    },
  },
};
</script>

<style>
</style>
