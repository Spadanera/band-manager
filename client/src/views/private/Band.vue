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
        <v-tabs centered v-model="tabIndex">
          <v-tab v-for="(setlist, i) in band.setlists" v-bind:key="setlist._id">
            <v-tab>
              {{ setlist.title }}
              <v-menu v-show="i === listIndex">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" v-show="i === listIndex">
                    <v-icon> more_vert </v-icon>
                  </v-btn>
                </template>
                <v-list dense style="padding: 0">
                  <v-list-item dense>
                    <v-btn small text @click="setlistDialog(setlist)">
                      Rename
                    </v-btn>
                  </v-list-item>
                  <v-list-item dense>
                    <v-btn small text @click="setlistDialog(setlist, true)">
                      Copy
                    </v-btn>
                  </v-list-item>
                  <v-list-item dense v-if="band.setlists && band.setlists.length > 1">
                    <v-btn small text @click="dialogConfirm = true">
                      Delete
                    </v-btn>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-tab>
          </v-tab>
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                style="margin-top: 10px"
                v-bind="attrs"
                v-on="on"
                @click="setlistDialog"
              >
                <v-icon> add </v-icon>
              </v-btn>
            </template>
            <span>New Setlist</span>
          </v-tooltip>
        </v-tabs>
        <v-tabs-items v-model="listIndex" touchless class="max-height-alt">
          <v-tab-item v-for="setlist in band.setlists" v-bind:key="setlist._id" class="max-height">
            <Setlist
              :setlist="setlist.songs"
              :statuses="statuses"
              :memberInfo="memberInfo"
              :bandId="band._id"
              ref="setlist"
              @ordersetlist="orderSetlist"
              @savesong="saveSong"
              @opensong="openSong"
              @deletesong="deleteSong"
            />
          </v-tab-item>
        </v-tabs-items>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              fixed
              bottom
              right
              fab
              @click="openSong"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </template>
          <span>New Song</span>
        </v-tooltip>
      </v-tab-item>
      <v-tab-item class="max-height">
        <EventsList :band="band" :memberInfo="memberInfo" @reload="loadBand" />
      </v-tab-item>
    </v-tabs-items>
    <v-dialog v-model="titleSelistDialog" max-width="350">
      <v-card>
        <v-card-title>
          <span v-if="newSetlist" class="headline">New Setlist</span>
          <span v-else class="headline">Edit Setlist</span>
        </v-card-title>
        <v-card-text>
          <v-form
            autocomplete="off"
            ref="form"
            v-model="valid"
            @submit.prevent="setSetlistTitle"
          >
            <v-text-field
              v-model="setlistTitle"
              label="Title"
              :rules="[validationRules.required]"
              ref="title"
            >
            </v-text-field>
            <v-btn type="submit" style="display: none"></v-btn>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="setSetlistTitle"
            >Save</v-btn
          >
          <v-btn color="blue darken-1" text @click="titleSelistDialog = false"
            >Dismiss</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <SongForm
      ref="songform"
      :dialog="dialogSong"
      @close="closeSong"
      @savesong="saveSong"
      :bandType="band.type"
      :statuses="statuses"
    />
    <Confirm
      :dialog="dialogConfirm"
      @confirm="deleteSetlist"
      :title="modalTitle"
      :text="modalText"
      @close="dialogConfirm = false"
    />
  </v-container>
</template>

<script>
import Setlist from "../../components/song/Setlist.vue";
import GeneralInfo from "../../components/band/GeneralInfo.vue";
import EventsList from "../../components/event/EventsList.vue";
import SongForm from "../../components/song/SongForm.vue";
import Confirm from "../../components/layout/Confirm.vue";

export default {
  name: "Band",
  components: {
    Setlist,
    GeneralInfo,
    EventsList,
    SongForm,
    Confirm,
  },
  props: {
    tab: Number,
  },
  data() {
    return {
      band: {
        setlist: [],
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
      tabIndex: 0,
      titleSelistDialog: false,
      setlistTitle: "",
      newSetlist: false,
      valid: true,
      toCopy: false,
      dialogConfirm: false,
      modalTitle: "Are you sure?",
      modalText: "Setlist will be deleted",
    };
  },
  methods: {
    async loadBand(band) {
      if (band) {
        this.band = band;
      } else {
        this.band = await this.Service.bandService.getBand(
          this.$route.params.id
        );
      }
      this.loaded = true;
      if (this.band.location) {
        this.band.location_address = JSON.parse(this.band.location);
      }
      this.$emit("setband", this.band.name);
      this.getSubList();
    },
    async updateSetlist() {
      let band = {
        _id: this.band._id,
        setlists: this.band.setlists,
      };
      band = await this.Service.bandService.upsertBand(band, "setlist");
      await this.loadBand(band);
    },
    orderSetlist(lists) {
      lists.confirmedList.forEach((s) => (s.status = "confirmed"));
      lists.pendingList.forEach((s) => (s.status = "pending"));
      lists.removedList.forEach((s) => (s.status = "removed"));
      for (let i = 0; i < lists.confirmedList.length; i++) {
        lists.confirmedList[i].position = i + 1;
      }
      this.band.setlists[this.listIndex].songs = [
        ...lists.confirmedList,
        ...lists.pendingList,
        ...lists.removedList,
      ];

      this.updateSetlist();
    },
    getSubList() {
      if (this.$refs.setlist) {
        for (let i = 0; i < this.$refs.setlist.length; i++) {
          this.$refs.setlist[i].getSubList();
        }
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
        song.position = this.band.setlists[this.listIndex].songs.length + 2;
        this.band.setlists[this.listIndex].songs.push(this.copy(song));
      } else {
        for (
          let i = 0;
          i < this.band.setlists[this.listIndex].songs.length;
          i++
        ) {
          if (this.band.setlists[this.listIndex].songs[i]._id === song._id) {
            this.band.setlists[this.listIndex].songs[i] = this.copy(song);
            break;
          }
        }
      }
      this.updateSetlist();
      this.dialogSong = false;
    },
    closeSong() {
      this.dialogSong = false;
    },
    deleteSong(song) {
      this.band.setlists[this.listIndex].songs = this.band.setlists[
        this.listIndex
      ].songs.filter((s) => s._id !== song._id);
      this.updateSetlist();
    },
    setlistDialog(setlist, toCopy) {
      this.toCopy = toCopy;
      if (setlist && setlist.title) {
        this.setlistTitle = setlist.title + (toCopy ? " - Copy" : "");
        this.newSetlist = toCopy;
      } else {
        this.setlistTitle = "";
        this.newSetlist = true;
      }
      this.titleSelistDialog = true;
    },
    async setSetlistTitle() {
      this.$refs.form.validate();
      if (this.valid) {
        if (this.newSetlist) {
          this.band.setlists.push({
            title: this.setlistTitle,
            songs: this.toCopy
              ? this.band.setlists[this.listIndex].songs.map((s) => {
                  return {
                    author: s.author,
                    cover: s.cover,
                    duration: s.duration,
                    live: s.live,
                    position: s.position,
                    status: s.status,
                    title: s.title,
                  };
                })
              : [],
            bandId: this.band._id,
          });
        } else {
          this.band.setlists[this.listIndex].title = this.setlistTitle;
        }
        await this.updateSetlist();
        if (this.newSetlist) {
          this.tabIndex = (this.band.setlists.length - 1) * 2;
        }
        this.titleSelistDialog = false;
      }
    },
    async deleteSetlist() {
      let setlists = [];
      for (let i = 0; i < this.band.setlists.length; i++) {
        if (i !== this.listIndex) {
          setlists.push(this.band.setlists[i]);
        }
      }
      this.band.setlists = setlists;
      await this.updateSetlist();
      if (this.tabIndex > this.band.setlists.length - 1) {
        this.tabIndex--;
      }
      this.dialogConfirm = false;
    },
  },
  async created() {
    this.loadBand();
    this.memberInfo = await this.Service.bandService.memberInfo(
      this.$route.params.id
    );
  },
  computed: {
    listIndex() {
      return this.tabIndex / 2;
    },
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
