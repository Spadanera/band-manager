<template>
  <v-layout wrap justify-space-around>
    <v-flex xs12 sm8 md6 lg5 xl4 pa-3>
      <v-card>
        <div>
          <v-card-title class="headline">{{ band.name }}</v-card-title>
          <v-card-subtitle>{{ formatted_address }}</v-card-subtitle>
        </div>
        <v-card-text style="flex: 1">
          <v-avatar
            v-if="hasLogo"
            class="ma-3"
            size="130"
            tile
            style="float: left"
          >
            <v-img :src="band.logo"></v-img>
          </v-avatar>
          <div v-html="band.description"></div>
          <v-divider v-if="!inBand"></v-divider>
        </v-card-text>
        <v-card-text style="padding-top: 0">
          <div class="my-4 subtitle-1" style="margin-top: 0 !important">
            {{$ml.get('bandMembers')}}
          </div>
          <v-chip v-for="(member, index) in band.bandMembers" :key="index">
            <v-avatar left>
              <v-img :src="member.userPicture"></v-img>
            </v-avatar>
            {{ member.userDisplayName }}
          </v-chip>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text style="padding-top: 0">
          <v-subheader>{{$ml.get('genres')}}</v-subheader>
          <v-chip
            v-for="(genre, index) in band.genres"
            :key="index"
            class="ma-1"
          >
            {{ genre }}
          </v-chip>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="join" color="primary">
            <img
              class="gbutton"
              src="../../assets/btn_google_light_normal_ios.svg"
              alt
            />
            {{$ml.get('joinBand')}}
          </v-btn>
          <v-spacer></v-spacer>
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
    async getBand() {
      let response = await client.get(
        `/api/invitations/band/${this.$route.params.token}`
      );
      this.band = response.data;
    },
  },
  data() {
    return {
      band: {},
      inBand: false
    };
  },
  created() {
    this.getBand();
  },
  computed: {
    hasLogo() {
      return this.band && this.band.logo;
    },
    formatted_address() {
        if (this.band && this.band.location_address) {
            return this.band.location_address.formatted_address;
        }
        else {
            return "";
        }
    }
  },
};
</script>

<style>
</style>
