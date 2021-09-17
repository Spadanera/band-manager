<template>
  <v-dialog v-model="dialog" scrollable persistent max-width="700px">
    <v-card>
      <v-tabs v-model="tab" stlye="text-transform: uppercase">
        <v-tab> {{$ml.get('info')}} </v-tab>
        <v-tab> {{$ml.get('setlist')}} </v-tab>
      </v-tabs>
      <v-card-text style="max-height: 700px" v-show="tab === 0">
        <v-form
          style="padding-top: 20px; padding-bottom: 20px"
          v-model="valid"
          autocomplete="off"
          @submit.prevent="submitForm"
          ref="form"
        >
          <v-row>
            <v-col cols="12" md="6">
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
                    :label="$ml.get('eventDate')"
                    append-icon="event"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :rules="[validationRules.required]"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="event.eventDate" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="dialogDate = false">
                    {{$ml.get('cancel')}}
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialogDate.save(event.eventDate)"
                  >
                    {{$ml.get('ok')}}
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>
            <v-col cols="12" md="6">
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
                    :label="$ml.get('eventTime')"
                    append-icon="schedule"
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
                    {{$ml.get('cancel')}}
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialogTime.save(event.eventTime)"
                  >
                    {{$ml.get('ok')}}
                  </v-btn>
                </v-time-picker>
              </v-dialog>
            </v-col>
          </v-row>
          <v-text-field
            v-model="event.locationName"
            :label="$ml.get('locationName')"
            :rules="[validationRules.required]"
          ></v-text-field>
          <GoogleMapsAutocomplete
            @input="setPlace"
            v-model="currentPlace"
            :label="$ml.get('locationAddress')"
            noResultFoundMessage="No result"
          />
          <v-textarea
            v-model="event.description"
            :label="$ml.get('description')"
            :auto-grow="true"
            rows="1"
          ></v-textarea>
          <v-row justify="space-around">
            <v-col cols="12" md="6" style="position: relative">
              <v-subheader>{{$ml.get('eventPoster')}}</v-subheader>
              <v-img :src="eventPoster" max-width="300">
                <v-row class="fill-height ma-0" align="center" justify="center">
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
                :label="$ml.get('fileInput')"
              ></v-file-input>
            </v-col>
            <v-col cols="12" md="6">
              <v-subheader> {{$ml.get('publicVisibility')}} </v-subheader>
              <v-switch
                v-model="event.isPublic"
                class="ma-1"
                :label="$ml.get('eventPublic')"
              ></v-switch>
              <v-switch
                v-model="event.isSetlistPublic"
                class="ma-1"
                :label="$ml.get('setlistPublic')"
              ></v-switch>
            </v-col>
          </v-row>
          <v-btn type="submit" style="display: none"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-text style="max-height: 700px; padding: 0" v-show="tab === 1">
        <SongList
          :inEvent="true"
          :duration="duration"
          :songList="event.setlist"
          :memberInfo="memberInfo"
          :drag="drag"
          :setlists="band.setlists"
          @ordersetlist="orderSetlist"
          @reloadsetlist="reloadSetlist"
          @startdrag="startDrag"
          ref="songlist"
          :elevation="0"
        />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeModal">{{$ml.get('dismiss')}}</v-btn>
        <v-btn color="blue darken-1" text @click="submitForm">{{$ml.get('save')}}</v-btn>
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
    baseSetlist: Array,
    band: Object,
    memberInfo: Object,
  },
  data() {
    return {
      event: {
        setlist: [],
      },
      valid: true,
      dialogDate: false,
      dialogTime: false,
      currentPlace: {},
      basePoster: "/static-assets/empty.jpeg",
      tab: 0,
      duration: "0:00",
      drag: false,
      eventPoster: "",
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
        let band = await this.Service.bandService.upsertEvent(
          this.band._id,
          this.event
        );
        this.$emit("reload", band);
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
        this.$refs.songlist.reload(this.event.setlist);
      }
      this.eventPoster = this.event.poster || this.basePoster;
      this.setlistDuration();
    },
    setPlace(place) {
      this.currentPlace = place;
      this.event.locationURL = this.Service.bandService.getGmapsLink(place);
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
    orderSetlist() {
      this.event.setlist = this.$refs.songlist.getList();
      this.setlistDuration();
      this.drag = false;
    },
    liveSetlist() {
      return this.event.setlist.filter((s) => s.live);
    },
    setlistDuration() {
      let setlist = this.liveSetlist();
      if (setlist.length) {
        this.duration = this.parseTime(
          setlist.map((s) => s.duration).reduce((a, c) => a + c)
        );
      } else {
        this.duration = "0:00";
      }
    },
    reloadSetlist(setlistId) {
      this.event.setlist = this.copy(
        this.band.setlists
          .find((s) => s._id === setlistId).songs
          .filter((s) => s.status === 'confirmed')
      );
      this.setlistDuration();
      this.$refs.songlist.reload(this.event.setlist);
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
          this.event.isSetlistPublic = false;
        }
      },
    },
  },
};
</script>

<style>
</style>