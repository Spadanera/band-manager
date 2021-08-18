<template>
  <v-dialog v-model="dialog" scrollable persistent max-width="700px">
    <v-card>
      {{ event.date }}
      <v-card-title v-if="event._id">Edit Event</v-card-title>
      <v-card-title v-else>Create Event</v-card-title>
      <v-divider></v-divider>
      <v-card-text style="max-height: 700px">
        <v-tabs v-model="tab">
          <v-tab> INFO </v-tab>
          <v-tab> SETLIST </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-form
              style="padding-top: 20px; padding-bottom: 20px"
              v-model="valid"
              autocomplete="off"
              @submit.prevent="submitForm"
              ref="form"
            >
              <v-row>
                <v-col col="12" md="6">
                  <v-dialog
                    ref="dialogDate"
                    v-model="dialogDate"
                    :return-value.sync="event.eventDate"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="event.eventDate"
                        label="Event date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="[validationRules.required]"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="event.eventDate" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="dialogDate = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dialogDate.save(event.eventDate)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-col>
                <v-col col="12" md="6">
                  <v-dialog
                    ref="dialogTime"
                    v-model="dialogTime"
                    :return-value.sync="event.eventTime"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="event.eventTime"
                        label="Event Time"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="[validationRules.required]"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      format="24hr"
                      v-if="dialogTime"
                      v-model="event.eventTime"
                      full-width
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="dialogTime = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dialogTime.save(event.eventTime)"
                      >
                        OK
                      </v-btn>
                    </v-time-picker>
                  </v-dialog>
                </v-col>
              </v-row>
              <v-text-field
                v-model="event.locationName"
                label="Location Name"
                :rules="[validationRules.required]"
              ></v-text-field>
              <GoogleMapsAutocomplete
                @input="setPlace"
                v-model="currentPlace"
                label="Location address"
                noResultFoundMessage="No result"
              />
              <v-textarea
                v-model="event.description"
                label="Description"
                :auto-grow="true"
                rows="1"
              ></v-textarea>
              <v-row justify="space-around">
                <v-col col="12" md="6" style="position: relative">
                  <v-subheader>Event Poster</v-subheader>
                  <v-img :src="eventPoster" max-width="300">
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                    </v-row>
                  </v-img>
                  <v-btn
                    style="position: absolute; bottom: 0; right: 0"
                    fab
                    color="primary"
                    dark
                    @click="$refs.file.$refs.input.click()"
                  >
                    <v-icon> edit </v-icon>
                  </v-btn>
                  <v-file-input
                    ref="file"
                    style="display: none"
                    show-size
                    @change="onFilePicket"
                    accept="image/*"
                    label="File input"
                  ></v-file-input>
                </v-col>
                <v-col col="12" md="6">
                  <v-subheader> Public Visibility </v-subheader>
                  <v-switch
                    v-model="event.isPublic"
                    class="ma-1"
                    label="Event Public"
                  ></v-switch>
                  <v-switch
                    v-model="event.isSetListPublic"
                    class="ma-1"
                    label="Setlist Public"
                  ></v-switch>
                </v-col>
              </v-row>
              <v-btn type="submit" style="display: none"></v-btn>
            </v-form>
          </v-tab-item>
          <v-tab-item>
            <SongList
              :inEvent="true"
              :duration="duration"
              :songList="event.setList"
              :memberInfo="memberInfo"
              :drag="drag"
              @ordersetlist="orderSetList"
              @reloadsetlist="reloadSetList"
              @startdrag="startDrag"
              ref="songlist"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeModal">Dismiss</v-btn>
        <v-btn color="blue darken-1" text @click="submitForm">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import GoogleMapsAutocomplete from "../layout/GoogleMapsAutocomplete.vue";
import SongList from "../song/SongList.vue";

export default {
  name: "EventForm",
  components: {
    GoogleMapsAutocomplete,
    SongList,
  },
  props: {
    dialog: Boolean,
    baseSetList: Array,
    band: Object,
    memberInfo: Object,
  },
  data() {
    return {
      event: {
        setList: [],
      },
      valid: true,
      dialogDate: false,
      dialogTime: false,
      currentPlace: {},
      basePoster: "/static-assets/empty.jpeg",
      tab: 0,
      duration: "0:00",
      drag: false,
      eventPoster: ""
    };
  },
  methods: {
    closeModal() {
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
      this.$emit("close");
    },
    async submitForm() {
      this.$refs.form.validate();
      if (this.valid) {
        if (this.currentPlace.formatted_address) {
          this.currentPlace.placeId = this.currentPlace.place_id;
          this.event.locationAddress = JSON.stringify(this.currentPlace);
        }
        await this.Service.bandService.upsertEvent(this.band._id, this.event);
        this.$emit("reload");
        this.closeModal();
      }
    },
    reload(bandEvent) {
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
      this.tab = 0;
      this.event = this.copy(bandEvent);
      if (this.event.locationAddress) {
        this.currentPlace = JSON.parse(this.event.locationAddress);
      } else {
        this.currentPlace = {};
      }
      if (this.$refs.songlist) {
        this.$refs.songlist.reload(this.event.setList);
      }
      this.eventPoster = this.event.poster || this.basePoster;
      this.setListDuration();
    },
    setPlace(place) {
      this.currentPlace = place;
    },
    onFilePicket(file) {
      if (file) {
        const fr = new FileReader();
        fr.readAsDataURL(file);
        fr.addEventListener("load", () => {
          this.eventPoster = this.event.poster = fr.result;
        });
      }
    },
    orderSetList() {
      this.event.setList = this.$refs.songlist.getList();
      this.setListDuration();
      this.drag = false;
    },
    liveSetList() {
      return this.event.setList.filter((s) => s.live);
    },
    setListDuration() {
      let setList = this.liveSetList();
      if (setList.length) {
        this.duration = this.parseTime(
          setList.map((s) => s.duration).reduce((a, c) => a + c)
        );
      } else {
        this.duration = "0:00";
      }
    },
    reloadSetList() {
      this.event.setList = this.copy(this.band.setList.filter((s) => s.live));
      this.setListDuration();
      this.$refs.songlist.reload(this.event.setList);
    },
    startDrag() {
      this.drag = true;
    },
  },
  computed: {
    isPublic() {
      return this.event.isPublic;
    },
  },
  watch: {
    isPublic: {
      handler(newValue) {
        if (!newValue) {
          this.event.isSetListPublic = false;
        }
      },
    },
  },
};
</script>

<style>
</style>