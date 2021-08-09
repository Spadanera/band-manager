<template>
  <v-container fluid class="max-height" style="padding: 0">
    <v-tabs-items v-model="tab" class="max-height">
      <v-tab-item>

      </v-tab-item>
      <v-tab-item class="max-height">
        <v-container fluid class="max-height">
          <v-row class="max-height">
            <v-col col="12" xs="12" sm="12" lg="4" md="4" class="max-height">
              <v-card class="max-height">
                <v-list-item>
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
                <v-list flat class="max-height-list">
                  <v-list-item-group>
                    <draggable
                      :options="{ group: 'songs' }"
                      v-model="confirmedList"
                      @start="drag = true"
                      @end="orderSetList"
                    >
                      <template v-for="(song, index) in this.confirmedList">
                        <SongItem
                          @opensong="openSong"
                          @deletesong="deleteSong"
                          :key="index"
                          :song="song"
                        ></SongItem>
                      </template>
                    </draggable>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-col>
            <v-col col="12" xs="12" sm="12" lg="4" md="4" class="max-height">
              <v-card class="max-height">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="headline"
                      >Pending</v-list-item-title
                    >
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text
                      >Time: {{ pendingDuration }}</v-list-item-action-text
                    >
                  </v-list-item-action>
                </v-list-item>
                <v-list flat>
                  <v-list-item-group>
                    <draggable
                      :options="{ group: 'songs' }"
                      v-model="pendingList"
                      @start="drag = true"
                      @end="orderSetList"
                    >
                      <template v-for="(song, index) in this.pendingList">
                        <SongItem
                          @opensong="openSong"
                          @deletesong="deleteSong"
                          :key="index"
                          :song="song"
                        ></SongItem>
                      </template>
                    </draggable>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-col>
            <v-col col="12" xs="12" sm="12" lg="4" md="4" class="max-height">
              <v-card class="max-height">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="headline"
                      >Removed</v-list-item-title
                    >
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text
                      >Time: {{ removedDuration }}</v-list-item-action-text
                    >
                  </v-list-item-action>
                </v-list-item>
                <v-list flat>
                  <v-list-item-group>
                    <draggable
                      :options="{ group: 'songs' }"
                      v-model="removedList"
                      @start="drag = true"
                      @end="orderSetList"
                    >
                      <template v-for="(song, index) in this.removedList">
                        <SongItem
                          @opensong="openSong"
                          @deletesong="deleteSong"
                          :key="index"
                          :song="song"
                        ></SongItem>
                      </template>
                    </draggable>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <v-btn color="primary" dark fixed bottom right fab @click="openSong">
          <v-icon>add</v-icon>
        </v-btn>
      </v-tab-item>
      <v-tab-item></v-tab-item>
    </v-tabs-items>
    <v-dialog v-model="dialogSong" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span v-if="!song.title" class="headline">Add Song</span>
          <span v-else class="headline">Edit Song</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-form autocomplete="off" ref="form">
              <v-text-field
                v-model="song.title"
                label="Title"
                required
              ></v-text-field>
              <v-text-field
                v-model="song.author"
                label="Author"
                required
              ></v-text-field>
              <v-text-field
                v-model="song.duration"
                label="Duration"
                suffix="seconds"
                required
              ></v-text-field>
              <v-select
                v-model="song.status"
                :items="statuses"
                label="Status"
              ></v-select>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogSong = false"
            >Dismiss</v-btn
          >
          <v-btn color="blue darken-1" text @click="saveSong">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import draggable from "vuedraggable";
import SongItem from "../../components/song/SongItem.vue";
export default {
  components: {
    draggable,
    SongItem,
  },
  props: {
    nav: Object,
    tab: Number,
  },
  data() {
    return {
      confirmedList: [],
      pendingList: [],
      removedList: [],
      band: {
        setList: [],
        bandMembers: [],
        events: [],
      },
      drag: false,
      dialogEvent: false,
      dialogSong: false,
      dialogDate: false,
      song: {},
      statuses: [
        { text: "Confirmed", value: "confirmed" },
        { text: "Pending", value: "pending" },
        { text: "Removed", value: "removed" },
      ],
      event: {},
    };
  },
  methods: {
    closeNavBar() {
      this.navVisible = false;
    },
    async loadBand() {
      this.band = await this.Service.bandService.getBand(this.$route.params.id);
      this.getSubList();
      this.$emit("setband", this.band.name);
    },
    parseTime(second) {
      return `${Math.floor(second / 60)}:${("0" + (second % 60)).slice(-2)}`;
    },
    async updateBand() {
      await this.Service.bandService.upsertBand(this.band);
    },
    orderSetList() {
      this.confirmedList.forEach((s) => (s.status = "confirmed"));
      this.pendingList.forEach((s) => (s.status = "pending"));
      this.removedList.forEach((s) => (s.status = "removed"));
      this.drag = false;
      for (let i = 0; i < this.confirmedList.length; i++) {
        this.confirmedList[i].position = i + 1;
      }
      this.band.setList = [
        ...this.confirmedList,
        ...this.pendingList,
        ...this.removedList,
      ];
      this.updateBand();
    },
    getSubList() {
      this.confirmedList = this.band.setList.filter(
        (s) => s.status === "confirmed"
      );
      this.pendingList = this.band.setList.filter(
        (s) => s.status === "pending"
      );
      this.removedList = this.band.setList.filter(
        (s) => s.status === "removed"
      );
      this.confirmedList.sort((s1, s2) => s1.position - s2.position);
    },
    openSong(song) {
      this.song = this.copy(song || {});
      this.dialogSong = true;
    },
    saveSong() {
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
      this.getSubList();
      this.dialogSong = false;
      this.song = {};
    },
    deleteSong(song) {
      this.band.setList = this.band.setList.filter((s) => s._id !== song._id);
      this.getSubList();
      this.orderSetList();
    },
    copy(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    getDuration(setListType) {
      let list = this.band.setList.filter((s) => s.status === setListType);
      if (list.length) {
        return this.parseTime(
          list.map((s) => s.duration).reduce((a, c) => a + c)
        );
      } else {
        return "00:00";
      }
    },
  },
  created() {
    this.loadBand();
  },
  computed: {
    navVisible: {
      get() {
        return this.nav.visible || this.$vuetify.breakpoint.lgAndUp;
      },
      set(val) {
        this.nav.visible = val;
      },
    },
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
.max-height-list {
  height: calc(100% - 52px);
  max-height: calc(100% - 52px);
  overflow-y: auto;
}
</style>
