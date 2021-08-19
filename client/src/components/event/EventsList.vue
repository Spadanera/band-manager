<template>
  <v-container fluid class="max-height" style="overflow: auto;">
    <v-row v-if="futureEvents.length" justify="space-around">
      <v-col
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="3"
        v-for="(event, index) in futureEvents"
        :key="index"
      >
        <EventCard
          :event="event"
          :memberInfo="memberInfo"
          :baseSetList="band.setList"
          @openevent="openEvent(event)"
          @deleteevent="confirmDeleteEvent"
          @copyevent="copyEvent"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-divider></v-divider>
        <h3 v-if="pastEvents.length" style="margin-top: 20px;" class="text-center">Past Events</h3>
      </v-col>
    </v-row>
    <v-row v-if="pastEvents.length" justify="space-around">
      <v-col
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="3"
        v-for="(event, index) in pastEvents"
        :key="index"
      >
        <EventCard
          :event="event"
          :memberInfo="memberInfo"
          :baseSetList="band.setList"
          @openevent="openEvent(event)"
          @deleteevent="confirmDeleteEvent"
          @copyevent="copyEvent"
        />
      </v-col>
    </v-row>
    <v-row
      v-if="!pastEvents.length && !futureEvents.length"
      align="center"
      justify="center"
    >
      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-card-title primary-title>
            <div>
              <div class="headline">No Event</div>
            </div>
          </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn @click="openEvent">Create Event</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <EventForm
      :dialog="dialogEvent"
      :band="band"
      :memberInfo="memberInfo"
      ref="eventform"
      @reload="reload"
      @close="dialogEvent = false"
    />
    <v-btn
      v-if="band.events.length"
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
    <v-snackbar
      v-model="snackbar.enabled"
      :bottom="true"
      :left="false"
      :multi-line="false"
      :right="false"
      :timeout="3000"
      :vertical="false"
    >
      {{ snackbar.text }}
      <v-btn text @click="snackbar.enabled = false">Close</v-btn>
    </v-snackbar>
    <Confirm
      :dialog="dialogConfirm"
      @confirm="deleteEvent"
      :title="modalTitle"
      :text="modalText"
      @close="dialogConfirm = false"
    />
  </v-container>
</template>

<script>
import EventCard from "./EventCard.vue";
import EventForm from "./EventForm.vue";
import Confirm from "./../layout/Confirm.vue";

export default {
  name: "EventsList",
  components: {
    EventCard,
    EventForm,
    Confirm,
  },
  props: {
    band: Object,
    memberInfo: Object,
  },
  data() {
    return {
      dialogEvent: false,
      dialogConfirm: false,
      snackbar: {
        enebled: false,
        text: "",
      },
      eventId: "",
      modalTitle: "Are you sure?",
      modalText: "Event will be removed from the list",
    };
  },
  methods: {
    openEvent(bandEvent) {
      if (!bandEvent || !bandEvent._id) {
        bandEvent = {
          bandId: this.band._id,
          setList: this.band.setList.filter(s => s.live ),
        };
      }
      this.$refs.eventform.reload(bandEvent);
      this.dialogEvent = true;
    },
    confirmDeleteEvent(eventId) {
      this.eventId = eventId;
      this.dialogConfirm = true;
    },
    async deleteEvent() {
      await this.Service.bandService.deleteEvent(this.band._id, this.eventId);
      this.snackbar = {
        enabled: true,
        text: "Event deleted",
      };
      this.reload();
    },
    reload() {
      this.$emit("reload");
    },
    copyEvent(bandEvent) {
      let bandCopied = this.copy(bandEvent);
      delete bandCopied._id;
      bandCopied.eventDate = undefined;
      bandCopied.eventTime = undefined;
      bandCopied.poster = undefined;
      this.$refs.eventform.reload(bandCopied);
      this.dialogEvent = true;
    }
  },
  computed: {
    futureEvents() {
      return this.band.events.filter((e) =>
        this.moment().isSameOrBefore(e.eventDate, "day")
      );
    },
    pastEvents() {
      return this.band.events.filter((e) =>
        this.moment().isAfter(e.eventDate, "day")
      );
    },
  },
};
</script>

<style>
</style>