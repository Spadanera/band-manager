<template>
  <v-card>
    <v-expand-transition>
      <div v-show="setListOpen !== 0">
        <div>
          <v-row>
            <v-col :cols="event.poster ? 7 : 12">
              <v-card-subtitle>
                {{ moment(event.eventDate).format("LL") }}
                <span v-if="event.eventTime"> - {{ event.eventTime }}</span>
              </v-card-subtitle>
              <v-card-title
                class="text-h5"
                v-text="event.locationName"
              ></v-card-title>
              <v-card-subtitle
                style="cursor: pointer"
                @click="openLink(event.locationURL)"
                v-text="locationAddress"
              ></v-card-subtitle>
            </v-col>
            <v-col
              v-show="event.poster"
              cols="5"
              style="padding-right: 20px; padding-top: 20px"
            >
              <v-hover>
                <template v-slot:default="{ hover }">
                  <v-img
                    style="cursor: pointer"
                    class="rounded-lg"
                    :src="event.poster"
                    @click="openPoster"
                  >
                    <v-fade-transition>
                      <v-overlay v-if="hover" absolute>
                        <v-btn fab small @click="openPoster">
                          <v-icon> zoom_in </v-icon>
                        </v-btn>
                      </v-overlay>
                    </v-fade-transition>
                  </v-img>
                </template>
              </v-hover>
            </v-col>
          </v-row>
        </div>
        <v-card-text>
          {{ event.description }}
        </v-card-text>
      </div>
    </v-expand-transition>
    <v-expansion-panels
      id="event-expansion"
      flat
      tile
      accordion
      v-model="setListOpen"
    >
      <v-expansion-panel>
        <v-expansion-panel-header>
          <template v-slot:default="{ open }">
            <v-row no-gutters style="margin-left: 32px">
              <v-col cols="4"> Setlist </v-col>
              <v-col cols="8" class="text-right font-weight-bold">
                <v-fade-transition leave-absolute>
                  <span v-if="open" key="0">
                    {{ event.locationName }}
                  </span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-btn small text @click="playSetlist">
            <v-icon left> play_arrow </v-icon>
            Play Setlist
          </v-btn>
          <SongList
            :memberInfo="memberInfo"
            :songList="songList"
            :inEvent="true"
            :readOnly="true"
            :duration="duration"
            :elevation="0"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card-actions v-if="memberInfo.canEditEvents">
      <v-btn
        v-if="memberInfo.canEditEvents"
        text
        @click="$emit('openevent', event)"
      >
        Edit
      </v-btn>
      <v-btn
        v-if="memberInfo.canEditEvents"
        text
        @click="$emit('copyevent', event)"
      >
        copy
      </v-btn>
      <v-btn
        v-if="memberInfo.canEditEvents"
        color="error"
        @click="$emit('deleteevent', event._id)"
        text
      >
        Delete
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        v-show="this.waShareLink"
        text
        :href="waShareLink"
        data-action="share/whatsapp/share"
      >
        <v-icon>whatsapp</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import SongList from "../song/SongList.vue";

export default {
  name: "EventCard",
  components: {
    SongList,
  },
  props: {
    event: Object,
    memberInfo: Object,
  },
  data() {
    return {
      setListOpen: false,
      overlay: false,
    };
  },
  methods: {
    openPoster() {
      this.$root.$emit("openImage", this.event.poster);
    },
    openLink(url) {
      if (url) {
        window.open(url, "_blank");
      }
    },
    playSetlist() {
      this.$root.$emit("playSetlist", this.songList);
    }
  },
  computed: {
    waShareLink() {
      return `whatsapp://send?text=*${encodeURIComponent(
        this.event.locationName
      )}*%20-%20${this.moment(this.event.eventDate).format("LL")}%20-%20${
        this.event.eventTime
      }%0a_${this.locationAddress}_%0a${encodeURIComponent(
        this.event.locationURL
      )}%0a%0a*Setlist*%20-%20Duration%3A%20${this.duration}%0a${this.songList
        .map((s, index) => encodeURIComponent(`${index + 1} - ${s.title}`))
        .join("%0a")}
    `;
    },
    locationAddress() {
      if (this.event.locationAddress) {
        return JSON.parse(this.event.locationAddress).formatted_address;
      }
      return "";
    },
    songList() {
      return this.event.setList.filter((s) => s.live);
    },
    duration() {
      let setList = this.songList;
      if (setList.length) {
        return this.parseTime(
          setList.map((s) => s.duration).reduce((a, c) => a + c)
        );
      } else {
        return "0:00";
      }
    },
  },
};
</script>

<style>
.v-expansion-panel-content__wrap {
  padding: 0 !important;
}
#event-expansion .v-expansion-panel-header__icon {
  margin-left: 12px;
  position: absolute;
  left: 0;
}
</style>