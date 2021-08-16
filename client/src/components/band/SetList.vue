<template>
  <v-container fluid class="max-height">
    <v-row class="max-height">
      <v-col col="12" xs="12" sm="12" lg="4" md="4" class="max-height">
        <v-card class="max-height">
          <v-list color="primary" dark>
            <v-list-item>
              <v-list-item-icon>
                <v-icon> assignment_turned_in </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="headline"
                  >Confirmed</v-list-item-title
                >
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text
                  >Time: {{ confirmedDuration }}</v-list-item-action-text
                >
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-list flat class="max-height-list">
            <v-list-item-group>
              <draggable
                :options="{ group: 'songs' }"
                v-model="confirmedList"
                @start="drag = true"
                @end="orderSetList"
                draggable=".song"
                handle=".handle"  
              >
                <template v-for="(song, index) in this.confirmedList">
                  <SongItem
                    v-bind:class="{
                      song: memberInfo.isAdmin || memberInfo.canEditSetList,
                    }"
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
      </v-col>
      <v-col col="12" xs="12" sm="12" lg="4" md="4" class="max-height">
        <v-card class="max-height">
          <v-list color="primary" dark>
            <v-list-item>
              <v-list-item-icon>
                <v-icon> pending_actions </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="headline">Pending</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text
                  >Time: {{ pendingDuration }}</v-list-item-action-text
                >
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-list flat class="max-height-list">
            <v-list-item-group>
              <draggable
                :options="{ group: 'songs' }"
                v-model="pendingList"
                @start="drag = true"
                @end="orderSetList"
                draggable=".song"
                handle=".handle"
              >
                <template v-for="(song, index) in this.pendingList">
                  <SongItem
                    v-bind:class="{
                      song: memberInfo.isAdmin || memberInfo.canEditSetList,
                    }"
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
      </v-col>
      <v-col col="12" xs="12" sm="12" lg="4" md="4" class="max-height">
        <v-card class="max-height">
          <v-list color="primary" dark>
            <v-list-item>
              <v-list-item-icon>
                <v-icon> cancel </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="headline">Removed</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text
                  >Time: {{ removedDuration }}</v-list-item-action-text
                >
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-list flat class="max-height-list">
            <v-list-item-group >
              <draggable
                :options="{ group: 'songs' }"
                v-model="removedList"
                @start="drag = true"
                @end="orderSetList"
                draggable=".song"
                handle=".handle"
              >
                <template v-for="(song, index) in this.removedList">
                  <SongItem
                    v-bind:class="{
                      song: memberInfo.isAdmin || memberInfo.canEditSetList,
                    }"
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import draggable from "vuedraggable";
import SongItem from "../../components/song/SongItem.vue";

export default {
  name: "SetList",
  components: {
    draggable,
    SongItem,
  },
  props: {
    setList: Array,
    status: Array,
    memberInfo: Object,
  },
  data() {
    return {
      song: {},
      drag: false,
      confirmedList: [],
      pendingList: [],
      removedList: [],
    };
  },
  created() {
    this.getSubList();
  },
  methods: {
    getSubList() {
      this.confirmedList = this.setList.filter((s) => s.status === "confirmed");
      this.pendingList = this.setList.filter((s) => s.status === "pending");
      this.removedList = this.setList.filter((s) => s.status === "removed");
      this.confirmedList.sort((s1, s2) => s1.position - s2.position);
    },
    openSong(song) {
      this.$emit("opensong", song);
    },
    deleteSong(song) {
      this.$emit("deletesong", song);
    },
    orderSetList() {
      this.$emit("ordersetlist", {
        confirmedList: this.confirmedList,
        pendingList: this.pendingList,
        removedList: this.removedList,
      });
      this.drag = false;
    },
    getDuration(setListType) {
      let list = this.setList.filter((s) => s.status === setListType);
      if (list.length) {
        return this.parseTime(
          list.map((s) => s.duration).reduce((a, c) => a + c)
        );
      } else {
        return "00:00";
      }
    },
    parseTime(second) {
      return `${Math.floor(second / 60)}:${("0" + (second % 60)).slice(-2)}`;
    },
  },
  computed: {
    confirmedDuration() {
      return this.getDuration("confirmed");
    },
    pendingDuration() {
      return this.getDuration("pending");
    },
    removedDuration() {
      return this.getDuration("removed");
    },
  },
};
</script>

<style>
@media screen and (min-width: 960px) {
  .max-height-list {
    height: calc(100% - 76px);
    max-height: calc(100% - 76px);
    overflow-y: auto;
  }
  .max-height {
    height: 100%;
    max-height: 100%;
  }
}
</style>