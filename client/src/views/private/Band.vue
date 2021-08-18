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
    <v-dialog v-model="dialogSong" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span v-if="!song.title" class="headline">Add Song</span>
          <span v-else class="headline">Edit Song</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-form autocomplete="off" ref="form" v-model="valid" @submit.prevent="saveSong">
              <v-text-field
                v-model="song.title"
                label="Title"
                required
                :rules="[validationRules.required]"
                :autofocus="true"
              ></v-text-field>
              <v-text-field
                v-model="song.author"
                label="Author"
                required
              ></v-text-field>
              <v-text-field
                v-model="song.duration"
                label="Time"
                suffix="seconds"
                required
              ></v-text-field>
              <v-select
                v-model="song.status"
                :items="statuses"
                :rules="[validationRules.required]"
                label="Status"
              ></v-select>
              <v-btn type="submit" style="display: none;"></v-btn>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            type="submit"
            text
            @click="dialogSong = false"
            >Dismiss</v-btn
          >
          <v-btn color="blue darken-1" text @click="saveSong">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import SetList from "../../components/band/SetList.vue";
import GeneralInfo from "../../components/band/GeneralInfo.vue";
import EventsList from "../../components/event/EventsList.vue";

export default {
  components: {
    SetList,
    GeneralInfo,
    EventsList,
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
      valid: false,
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
      this.getSubList();
      if (this.band.location) {
        this.band.location_address = JSON.parse(this.band.location);
      }
      this.$emit("setband", this.band.name);
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
      song = song._id ? song : {
        status: "confirmed"
      };
      this.song = this.copy(song);
      this.dialogSong = true;
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    },
    saveSong() {
      this.$refs.form.validate();
      if (this.valid) {
        if (this.song.duration) {
          this.song.duration = Math.floor(this.song.duration);
        } else {
          this.song.duration = 0;
        }
        if (!this.song._id) {
          this.song.position = this.band.setList.length + 2;
          this.band.setList.push(this.copy(this.song));
        } else {
          for (let i = 0; i < this.band.setList.length; i++) {
            if (this.band.setList[i]._id === this.song._id) {
              this.band.setList[i] = this.copy(this.song);
              break;
            }
          }
        }
        this.updateBand();
        this.dialogSong = false;
        this.song = {};
      }
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
</style>
