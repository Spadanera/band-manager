<template>
  <v-container fluid class="max-height">
    <v-row class="max-height" style="margin-top: 0; margin-bottom: 0;">
      <v-col cols="12" xs="12" sm="12" lg="4" md="4" class="max-height">
        <SongList
          ref="confirmedList"
          icon="assignment_turned_in"
          :listLabel="$ml.get('confirmed')"
          listName="confirmedList"
          :duration="confirmedDuration"
          :songList="confirmedList"
          :memberInfo="memberInfo"
          :drag="drag"
          :showPreview="true"
          @ordersetlist="orderSetlist"
          @opensong="openSong"
          @deletesong="deleteSong"
          @startdrag="startDrag"
        />
      </v-col>
      <v-col cols="12" xs="12" sm="12" lg="4" md="4" class="max-height">
        <SongList
          ref="pendingList"
          icon="pending_actions"
          :listLabel="$ml.get('pending')"
          listName="pendingList"
          :duration="pendingDuration"
          :songList="pendingList"
          :memberInfo="memberInfo"
          :drag="drag"
          @ordersetlist="orderSetlist"
          @opensong="openSong"
          @deletesong="deleteSong"
          @startdrag="startDrag"
        />
      </v-col>
      <v-col cols="12" xs="12" sm="12" lg="4" md="4" class="max-height">
        <SongList
          ref="removedList"
          icon="cancel"
          :listLabel="$ml.get('removed')"
          listName="removedList"
          :duration="removedDuration"
          :songList="removedList"
          :memberInfo="memberInfo"
          :drag="drag"
          @ordersetlist="orderSetlist"
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
  name: "Setlist",
  components: {
    SongList,
  },
  props: {
    setlist: Array,
    status: Array,
    memberInfo: Object,
    bandId: String,
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
    if (this.bandId) {
      this.getSubList();
    }
  },
  methods: {
    getSubList() {
      this.confirmedList = this.setlist.filter((s) => s.status === "confirmed");
      this.pendingList = this.setlist.filter((s) => s.status === "pending");
      this.removedList = this.setlist.filter((s) => s.status === "removed");
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
    orderSetlist() {
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
    getDuration(setlistType) {
      let list = this.setlist.filter((s) => s.status === setlistType);
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
  watch: {
    bandId(newVal) {
      if (newVal) {
        this.getSubList();
      }
    }
  }
};
</script>

<style>

</style>