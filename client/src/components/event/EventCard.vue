<template>
  <v-card>
    <v-expand-transition>
      <v-img :src="event.poster" v-show="setListOpen !== 0"></v-img>
    </v-expand-transition>
    <v-expand-transition>
      <v-card-subtitle v-show="setListOpen !== 0">
        {{ moment(event.eventDate).format("LL") }}
        <span v-if="event.eventTime"> - {{ event.eventTime }}</span>
      </v-card-subtitle>
    </v-expand-transition>
    <v-expand-transition>
      <v-card-title
        v-show="setListOpen !== 0"
        class="text-h5"
        v-text="event.locationName"
      ></v-card-title>
    </v-expand-transition>
    <v-expand-transition>
      <v-card-subtitle
        v-show="setListOpen !== 0"
        v-text="locationAddress"
      ></v-card-subtitle>
    </v-expand-transition>
    <v-expand-transition>
      <v-card-text v-show="setListOpen !== 0">
        {{ event.description }}
      </v-card-text>
    </v-expand-transition>
    <v-expansion-panels flat tile accordion v-if="event.isSetListPublic" v-model="setListOpen">
      <v-expansion-panel>
        <v-expansion-panel-header>Setlist</v-expansion-panel-header>
        <v-expansion-panel-content>
          <SongList
            :memberInfo="memberInfo"
            :songList="songList"
            :inEvent="true"
            :readOnly="true"
            :duration="duration"
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
    };
  },
  computed: {
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
        return "00:00";
      }
    },
  },
};
</script>

<style>
.v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>