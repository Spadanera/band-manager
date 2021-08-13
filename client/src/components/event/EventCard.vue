<template>
  <v-card>
      <v-img :src="event.poster"></v-img>
      <v-card-subtitle>
            {{ moment(event.eventDate).format('LL') }}
            <span v-if="event.eventTime"> - {{ event.eventTime }}</span>
          </v-card-subtitle>
          <v-card-title
            class="text-h5"
            v-text="event.locationName"
          ></v-card-title>
          <v-card-subtitle v-text="locationAddress"></v-card-subtitle>
          <v-card-text>
              {{event.description}}
          </v-card-text>
          <v-card-actions v-if="memberInfo.canEditEvents">
              <v-btn text @click="$emit('openevent', event)">
                Edit
              </v-btn>
              <v-btn color="error" @click="$emit('deleteevent', event._id)" text>
                Delete
              </v-btn>
            </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "EventCard",
  props: {
    event: Object,
    memberInfo: Object,
  },
  data() {
    return {};
  },
  computed: {
    locationAddress() {
      if (this.event.locationAddress) {
        return JSON.parse(this.event.locationAddress).formatted_address;
      }
      return "";
    },
  },
};
</script>

<style>
</style>