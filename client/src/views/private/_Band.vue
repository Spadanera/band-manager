<template>
  <v-layout align-start justify-start fill-height style="overflow-y: auto">
    <v-navigation-drawer absolute permanent width="400px">
      <v-list flat>
        <v-subheader class="headline">
          Setlist - {{ totalDuration }}
          <v-spacer></v-spacer>
          <v-icon @click="openSong"> add </v-icon>
        </v-subheader>
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
                :key="index"
                :song="song"
              ></SongItem>
            </template>
          </draggable>
        </v-list-item-group>
      </v-list>
      <v-list flat>
        <v-subheader class="headline"> Pending </v-subheader>
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
                :key="index"
                :song="song"
              ></SongItem>
            </template>
          </draggable>
        </v-list-item-group>
      </v-list>
      <v-list flat>
        <v-subheader class="headline"> Removed </v-subheader>
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
                :key="index"
                :song="song"
              ></SongItem>
            </template>
          </draggable>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-btn
      color="primary"
      dark
      fixed
      bottom
      right
      fab
      @click="openEvent"
    >
      <v-icon>add</v-icon>
    </v-btn>
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
    <v-dialog v-model="dialogEvent" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span v-if="!event.place" class="headline">Create Event</span>
          <span v-else class="headline">Edit Event</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-form autocomplete="off" ref="form">
              <v-dialog
                ref="dialog"
                v-model="dialogDate"
                :return-value.sync="event.date"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="event.date"
                    label="Event date"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="event.date" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="dialogDate = false">
                    Cancel
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.dialog.save(event.date)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>
              <v-text-field
                v-model="event.place"
                label="Place"
                required
              ></v-text-field>
              <v-textarea
                v-model="event.description"
                label="Description"
                required
              ></v-textarea>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogEvent = false"
            >Dismiss</v-btn
          >
          <v-btn color="blue darken-1" text @click="saveEvent"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import draggable from "vuedraggable";
import SongItem from "../../components/ogp/SongItem.vue";
export default {
  components: {
    draggable,
    SongItem,
  },
  props: {
    nav: Object,
  },
  data() {
    return {
      confirmedList: [],
      pendingList: [],
      removedList: [],
      setList: {
        setList: [],
      },
      selectedSong: [],
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
      events: []
    };
  },
  methods: {
    closeNavBar() {
      this.navVisible = false;
    },
    async loadSetList() {
      this.setList = await this.Service.ogpService.getSetList();
      this.getSubList();
    },
    parseTime(second) {
      return `${Math.floor(second / 60)}:${second % 60}`;
    },
    updateSetList() {
      this.Service.ogpService.updateSetList(this.setList);
    },
    orderSetList() {
      this.confirmedList.forEach((s) => (s.status = "confirmed"));
      this.pendingList.forEach((s) => (s.status = "pending"));
      this.removedList.forEach((s) => (s.status = "removed"));
      this.drag = false;
      for (let i = 0; i < this.confirmedList.length; i++) {
        this.confirmedList[i].position = i + 1;
      }
      this.setList.setList = [
        ...this.confirmedList,
        ...this.pendingList,
        ...this.removedList,
      ];
      this.updateSetList();
      this.getSubList();
    },
    getSubList() {
      this.confirmedList = this.setList.setList.filter(
        (s) => s.status === "confirmed"
      );
      this.pendingList = this.setList.setList.filter(
        (s) => s.status === "pending"
      );
      this.removedList = this.setList.setList.filter(
        (s) => s.status === "removed"
      );
      this.confirmedList.sort((s1, s2) => s1.position - s2.position);
    },
    openSong(song) {
      this.song = song || {};
      this.dialogSong = true;
    },
    saveSong() {
      if (!this.song._id) {
        this.song.position = this.setList.setList.length + 2;
        this.setList.setList.push(this.song);
      } else {
        for (let i = 0; i < this.setList.setList; i++) {
          if (this.setList.setList[i]._id === this.song._id) {
            this.setList.setList[i] === this.song;
            break;
          }
        }
      }
      this.updateSetList();
      this.getSubList();
      this.dialogSong = false;
    },
    openEvent(event) {
      this.event = event || {};
      this.dialogEvent = true;
    },
    saveEvent() {
      if (this.event._id) {
        this.Service.ogpService.updateEvent(this.event);
      }
      else {
        this.Service.ogpService.createEvent(this.event);
      }
      this.loadEvents();
      this.dialogEvent = false;
    },
    loadEvents() {
      this.events = this.Service.ogpService.getEvents();
    }
  },
  created() {
    this.loadSetList();
    this.loadEvents();
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
    totalDuration: {
      get() {
        if (this.setList.setList.length) {
          return this.parseTime(
            this.setList.setList
              .filter((s) => s.status === "confirmed")
              .map((s) => s.duration)
              .reduce((a, c) => a + c)
          );
        } else {
          return 0;
        }
      },
    },
  },
};
</script>

<style>
</style>
