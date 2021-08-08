<template>
  <v-layout wrap justify-space-around>
    <v-flex xs12 sm8 md6 lg5 xl4 pa-3>
      <v-card>
        <v-card-title primary-title>
          {{ chronicle.name }}
        </v-card-title>
        <v-card-subtitle>{{ moment(chronicle.createdAt).format('MMMM Do YYYY, h:mm:ss a') }}</v-card-subtitle>
        <v-card-text style="flex: 1">{{ chronicle.shortDescription }}</v-card-text>
        <v-card-actions>
          <v-btn @click="join" color="primary">
            <img class="gbutton" src="../../assets/btn_google_light_normal_ios.svg" alt />
            {{$ml.get("joinChronicle")}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import client from "../../services/client";
export default {
  methods: {
    join() {
      location.href = `/auth/google-join/${this.$route.params.token}`;
    },
    async getChronicle() {
      let response = await client.get(
        `/api/invitations/chronicle/${this.$route.params.token}`
      );
      this.chronicle = response.data;
    }
  },
  data() {
    return {
      chronicle: {}
    };
  },
  created() {
    this.getChronicle();
  }
};
</script>

<style>
</style>
