<template>
  <div>
    <v-divider></v-divider>
    <v-list-item two-line>
      <v-list-item-icon
        class="handle"
        v-if="
          (inEvent && song.live && !readOnly) ||
          (!inEvent &&
            (memberInfo.isAdmin || memberInfo.canEditSetlist) &&
            !readOnly)
        "
      >
        <v-icon style="margin-top: 20px"> menu </v-icon>
      </v-list-item-icon>
      <v-list-item-content v-bind:class="{ notlive: inEvent && !song.live }">
        <v-list-item-title v-text="song.title"></v-list-item-title>
        <v-list-item-subtitle v-text="song.author"></v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-list-item-action-text
          v-bind:class="{ notlive: inEvent && !song.live }"
          v-text="parseTime(song.duration)"
        ></v-list-item-action-text>
        <v-menu
          close-on-content-click
          close-on-click
          absolute
          v-if="(memberInfo.isAdmin || memberInfo.canEditSetlist) && !inEvent"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon
              ><v-icon v-bind="attrs" v-on="on"> more_vert </v-icon></v-btn
            >
          </template>
          <v-list dense flat>
            <v-list-item-group>
              <v-list-item v-show="song.preview">
                <v-list-item-content>
                  <v-list-item-title @click="previewSong(song)"
                    >{{$ml.get('preview')}}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title @click="openSong(song)"
                    >{{$ml.get('edit')}}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title @click="deleteSong(song)"
                    >{{$ml.get('delete')}}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
        <v-icon @click="previewSong(song)" v-if="(!((memberInfo.isAdmin || memberInfo.canEditSetlist) && !inEvent) || (inEvent && readOnly)) && song.preview"
        >
          play_circle
        </v-icon>
        <v-icon
          v-if="inEvent && !readOnly"
          v-text="getIcon(song.live)"
          @click="toggleLive()"
        >
        </v-icon>
      </v-list-item-action>
    </v-list-item>
  </div>
</template>

<script>
export default {
  name: "SongItem",
  props: {
    song: Object,
    memberInfo: Object,
    inEvent: Boolean,
    readOnly: Boolean,
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
    getIcon(live) {
      if (live) {
        return "remove";
      } else {
        return "add";
      }
    },
    toggleLive() {
      this.$emit("togglelive");
    },
    previewSong(song) {
      this.$root.$emit("startPlayer", {
        preview: song.preview,
        title: song.title,
        author: song.author,
      });
    },
  },
};
</script>

<style>
.notlive {
  opacity: 0.3;
  text-decoration: line-through;
}
</style>
