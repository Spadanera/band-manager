<template>
  <v-container fluid grid-list-md class="max-height">
    <div v-if="!events.length && loaded">
      <v-row wrap justify="space-around">
        <v-col cols="12" sm="10" md="8" lg="6" xl="4">
          <v-card>
            <v-card-title primary-title>
              <div>
                <div class="headline">No events</div>
              </div>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div v-if="events.length" class="max-height">
      <v-row
        :justify="$vuetify.breakpoint.smAndUp ? 'space-between' : undefined"
        dense
      >
        <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="0" md="1"></v-col>
        <v-col cols="8" sm="8" md="8" lg="3" xl="2">
          <v-text-field
            prepend-icon="search"
            clearable
            dense
            flat
            placeholder="search"
            v-model="search"
          >
          </v-text-field>
        </v-col>
        <v-col v-if="$vuetify.breakpoint.mdAndUp"></v-col>
        <v-col cols="3" md="2">
          <v-btn-toggle dense v-model="viewMode">
            <v-btn small>
              <v-icon>grid_view</v-icon>
            </v-btn>

            <v-btn small>
              <v-icon>map</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col v-if="$vuetify.breakpoint.lgAndUp" cols="0" md="1"></v-col>
      </v-row>
      <v-row wrap justify="space-around" v-if="viewMode === 0">
        <v-col
          cols="12"
          sm="6"
          md="6"
          lg="4"
          xl="3"
          v-for="event in filteredEvents"
          v-bind:key="event._id"
          class="my-2"
        >
          <EventCard :event="event" :memberInfo="{ publicUser: true }" />
        </v-col>
      </v-row>
      <v-row v-if="viewMode === 1" style="height: calc(100% - 60px)">
        <v-col class="max-height">
          <GmapMap
            :center="center"
            :zoom="zoom"
            style="width: 100%; height: 100%"
            :streetViewControl="false"
          >
            <GmapMarker
              :title="event.locationName"
              v-bind:key="event._id"
              v-for="event in filteredEventsMap"
              :position="event.location_address.geometry.location"
              :clickable="true"
              @click="showEvent(event)"
              :icon="event.mapLogo"
            />
          </GmapMap>
        </v-col>
      </v-row>
    </div>
    <v-dialog v-model="eventDialog">
      <v-card>
        <EventCard :event="selectedEvent" :memberInfo="{ publicUser: true }" />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="eventDialog = false" text> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import EventCard from "../../components/event/EventCard.vue";
export default {
  name: "PublicEvents",
  components: {
    EventCard,
  },
  data() {
    return {
      loaded: false,
      search: "",
      events: [],
      viewMode: 0,
      center: { lat: 30, lng: 20 },
      zoom: 11,
      eventDialog: false,
      selectedEvent: {},
    };
  },
  methods: {
    async loadList() {
      this.events = await this.Service.publicService.getEvents();
      for (var i = 0; i < this.events.length; i++) {
        this.events[i].mapLogo = await this.resizeImage(
          this.events[i].logo,
          60
        );
      }
      this.loaded = true;
    },
    showEvent(event) {
      this.selectedEvent = event;
      this.eventDialog = true;
    },
    resizeImage(base64Str, maxWidth = 400) {
      return new Promise((resolve) => {
        let img = new Image();
        img.src = base64Str;
        img.onload = () => {
          let canvas = document.createElement("canvas");
          const MAX_WIDTH = maxWidth;
          const MAX_HEIGHT = img.height * (maxWidth / img.width);
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          let ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL());
        };
      });
    },
  },
  created() {
    this.loadList();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      },
      (error) => {
        console.log(error);
      }
    );
  },
  computed: {
    filteredEvents() {
      return this.events.filter(
        (e) =>
          this.search === "" ||
          this.search === null ||
          e.locationName.search(new RegExp(this.search, "i")) > -1 ||
          e.band.name.search(new RegExp(this.search, "i")) > -1
      );
    },
    filteredEventsMap() {
      return this.filteredEvents.filter(e => e.location_address);
    }
  },
};
</script>

<style scoped>
.max-height {
  height: 100%;
}
.selected {
  color: red;
}
</style>

