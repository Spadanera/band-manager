<template>
  <v-container fluid class="max-height" style="overflow: auto;">
    <v-row v-if="futureEvents.length" justify="space-around" style="padding-top: 12px;">
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
          :baseSetlist="band.setlists[0]"
          @openevent="openEvent(event)"
          @deleteevent="confirmDeleteEvent"
          @copyevent="copyEvent"
          @startlive="startLive"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-divider></v-divider>
        <h3 v-if="pastEvents.length" style="margin-top: 20px;" class="text-center">{{$ml.get('pastEvents')}}</h3>
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
          :baseSetlist="band.setlists[0]"
          @openevent="openEvent(event)"
          @deleteevent="confirmDeleteEvent"
          @copyevent="copyEvent"
          @startlive="startLive"
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
              <div class="headline">{{$ml.get('noEvent')}}</div>
            </div>
          </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn @click="openEvent">{{$ml.get('createEvent')}}</v-btn>
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
      <v-btn text @click="snackbar.enabled = false">{{$ml.get('close')}}</v-btn>
    </v-snackbar>
    <Confirm
      :dialog="dialogConfirm"
      @confirm="deleteEvent"
      :title="modalTitle"
      :text="modalText"
      @close="dialogConfirm = false"
    />
    <LiveDialog :dialog="liveDialog" :event="liveEvent" @close="liveDialog = false;" />
  </v-container>
</template>

<script>
import EventCard from "./EventCard.vue";
import EventForm from "./EventForm.vue";
import Confirm from "./../layout/Confirm.vue";
import LiveDialog from "../song/Live.vue";

export default {
  name: "EventsList",
  components: {
    EventCard,
    EventForm,
    Confirm,
    LiveDialog
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
      modalTitle: this.$ml.get('areYouSure'),
      modalText: this.$ml.get('eventWillRemoved'),
      liveDialog: false,
      liveEvent: {
        setlist: []
      }
    };
  },
  created() {

  },
  methods: {
    openEvent(bandEvent) {
      if (!bandEvent || !bandEvent._id) {
        bandEvent = {
          bandId: this.band._id,
          setlist: [],
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
      let band = await this.Service.bandService.deleteEvent(this.band._id, this.eventId);
      this.snackbar = {
        enabled: true,
        text: this.$ml('eventDeleted'),
      };
      this.reload(band);
    },
    reload(band) {
      this.$emit("reload", band);
    },
    copyEvent(bandEvent) {
      let bandCopied = this.copy(bandEvent);
      delete bandCopied._id;
      bandCopied.eventDate = undefined;
      bandCopied.eventTime = undefined;
      this.$refs.eventform.reload(bandCopied);
      this.dialogEvent = true;
    },
    startLive(event) {
      this.liveEvent = event;
      this.liveDialog = true;
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