<template>
  <v-container fluid class="max-height" style="padding: 0">
    <v-tabs-items v-model="tab" class="max-height" touchless v-show="loaded">
      <v-tab-item>
        <GeneralInfo
          :band="this.band"
          :memberInfo="memberInfo"
          @reload="loadBand"
        />
      </v-tab-item>
      <v-tab-item class="max-height">
        <SetList
          :setList="band.setList"
          :statuses="statuses"
          :memberInfo="memberInfo"
          :bandId="band._id"
          ref="setlist"
          @ordersetlist="orderSetList"
          @savesong="saveSong"
          @opensong="openSong"
          @deletesong="deleteSong"
        />
        <v-btn color="primary" dark fixed bottom right fab @click="openSong">
          <v-icon>add</v-icon>
        </v-btn>
      </v-tab-item>
      <v-tab-item class="max-height">
        <EventsList :band="band" :memberInfo="memberInfo" @reload="loadBand" />
      </v-tab-item>
    </v-tabs-items>
    <SongForm
      ref="songform"
      :dialog="dialogSong"
      @close="closeSong"
      @savesong="saveSong"
      :bandType="band.type"
      :statuses="statuses"
    />
  </v-container>
</template>

<script>
import SetList from "../../components/band/SetList.vue";
import GeneralInfo from "../../components/band/GeneralInfo.vue";
import EventsList from "../../components/event/EventsList.vue";
import SongForm from "../../components/song/SongForm.vue";

export default {
  components: {
    SetList,
    GeneralInfo,
    EventsList,
    SongForm,
  },
  props: {
    tab: Number,
  },
  data() {
    return {
      band: {
        setList: [],
        bandMembers: [],
        events: [],
      },
      dialogEvent: false,
      dialogDate: false,
      dialogSong: false,
      loaded: false,
      event: {},
      song: {},
      statuses: [
        { text: "Confirmed", value: "confirmed" },
        { text: "Pending", value: "pending" },
        { text: "Removed", value: "removed" },
      ],
      memberInfo: {},
    };
  },
  methods: {
    async loadBand() {
      this.band = await this.Service.bandService.getBand(this.$route.params.id);
      this.loaded = true;
      if (this.band.location) {
        this.band.location_address = JSON.parse(this.band.location);
      }
      this.$emit("setband", this.band.name);
      this.getSubList();
    },
    async updateBand() {
      await this.Service.bandService.upsertBand(this.band);
      await this.loadBand();
    },
    orderSetList(lists) {
      lists.confirmedList.forEach((s) => (s.status = "confirmed"));
      lists.pendingList.forEach((s) => (s.status = "pending"));
      lists.removedList.forEach((s) => (s.status = "removed"));
      for (let i = 0; i < lists.confirmedList.length; i++) {
        lists.confirmedList[i].position = i + 1;
      }
      this.band.setList = [
        ...lists.confirmedList,
        ...lists.pendingList,
        ...lists.removedList,
      ];
      this.updateBand();
    },
    getSubList() {
      if (this.$refs.setlist) {
        this.$refs.setlist.getSubList();
      }
    },
    openSong(song) {
      if (!song._id) {
        song = {
          status: "confirmed",
        };
        song.cover = true;
        if (this.band.type === "tribute") {
          song.author = this.band.tributeArtist;
        } else if (this.band.type === "original") {
          song.author = this.band.name;
          song.cover = false;
        }
      }
      this.$refs.songform.reloadSong(song);
      this.dialogSong = true;
    },
    saveSong(song) {
      if (song.duration) {
        song.duration = Math.floor(song.duration);
      } else {
        song.duration = 0;
      }
      if (!song._id) {
        song.position = this.band.setList.length + 2;
        this.band.setList.push(this.copy(song));
      } else {
        for (let i = 0; i < this.band.setList.length; i++) {
          if (this.band.setList[i]._id === song._id) {
            this.band.setList[i] = this.copy(song);
            break;
          }
        }
      }
      this.updateBand();
      this.dialogSong = false;
    },
    closeSong() {
      this.dialogSong = false;
    },
    deleteSong(song) {
      this.band.setList = this.band.setList.filter((s) => s._id !== song._id);
      this.updateBand();
    },
  },
  async created() {
    this.loadBand();
    this.memberInfo = await this.Service.bandService.memberInfo(
      this.$route.params.id
    );
  },
};
</script>

<style>
@media screen and (min-width: 960px) {
  .max-height {
    height: 100%;
    max-height: 100%;
  }
}
.max-height {
  min-height: 100%;
}
</style>
