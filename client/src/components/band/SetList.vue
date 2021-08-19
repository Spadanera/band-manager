<template>
  <v-container fluid class="max-height">
    <v-row class="max-height">
      <v-col cols="12" xs="12" sm="12" lg="4" md="4" class="max-height">
        <SongList
          ref="confirmedList"
          icon="assignment_turned_in"
          listLabel="Confirmed"
          listName="confirmedList"
          :duration="confirmedDuration"
          :songList="confirmedList"
          :memberInfo="memberInfo"
          :drag="drag"
          @ordersetlist="orderSetList"
          @opensong="openSong"
          @deletesong="deleteSong"
          @startdrag="startDrag"
        />
      </v-col>
      <v-col cols="12" xs="12" sm="12" lg="4" md="4" class="max-height">
        <SongList
          ref="pendingList"
          icon="pending_actions"
          listLabel="Pending"
          listName="pendingList"
          :duration="pendingDuration"
          :songList="pendingList"
          :memberInfo="memberInfo"
          :drag="drag"
          @ordersetlist="orderSetList"
          @opensong="openSong"
          @deletesong="deleteSong"
          @startdrag="startDrag"
        />
      </v-col>
      <v-col cols="12" xs="12" sm="12" lg="4" md="4" class="max-height">
        <SongList
          ref="removedList"
          icon="cancel"
          listLabel="Removed"
          listName="removedList"
          :duration="removedDuration"
          :songList="removedList"
          :memberInfo="memberInfo"
          :drag="drag"
          @ordersetlist="orderSetList"
          @opensong="openSong"
          @deletesong="deleteSong"
          @startdrag="startDrag"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SongList from "../song/SongList.vue";

export default {
  name: "SetList",
  components: {
    SongList,
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
      listArray: ["confirmedList", "pendingList", "removedList"],
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
      for (let i = 0; i < this.listArray.length; i++) {
        if (this.$refs[this.listArray[i]] && this[this.listArray[i]]) {
          this.$refs[this.listArray[i]].reload(this[this.listArray[i]]);
        }
      }
    },
    openSong(song) {
      this.$emit("opensong", song);
    },
    deleteSong(song) {
      this.$emit("deletesong", song);
    },
    orderSetList() {
      for (let i = 0; i < this.listArray.length; i++) {
        this[this.listArray[i]] = this.$refs[this.listArray[i]].getList();
      }
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
        return "0:00";
      }
    },
    startDrag() {
      this.drag = true;
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