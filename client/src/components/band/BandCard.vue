<template>
  <v-card>
    <div>
      <v-card-title class="headline">{{ band.name }}</v-card-title>
      <v-card-subtitle>{{ formatted_address }}</v-card-subtitle>
    </div>
    <v-card-text style="flex: 1">
      <v-avatar v-if="hasLogo" class="ma-3" size="130" tile style="float: left">
        <v-img :src="band.logo"></v-img>
      </v-avatar>
      <div v-html="band.description"></div>
      <v-divider v-if="!inBand" style="clear: both"></v-divider>
    </v-card-text>
    <v-card-text style="padding-top: 0" v-if="!inBand">
      <v-subheader>Band Members</v-subheader>
      <v-chip v-for="(member, index) in band.bandMembers" :key="index">
        <v-avatar left>
          <v-img :src="member.userPicture"></v-img>
        </v-avatar>
        {{ member.userDisplayName || member.userEmailAddress }}
      </v-chip>
    </v-card-text>
    <v-divider style="clear: both"></v-divider>
    <v-card-text style="padding-top: 0">
      <v-subheader>Genres</v-subheader>
      <v-chip v-for="(genre, index) in band.genres" :key="index" class="ma-1">
        {{ genre }}
      </v-chip>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text style="padding-top: 0" v-if="memberInfo.isAdmin">
      <v-subheader>Visibility</v-subheader>
      <div v-if="!band.isPublic">Nothing is public</div>
      <v-chip v-if="band.isPublic" class="ma-1"> Public </v-chip>
      <v-chip v-if="band.isMembersPublic" class="ma-1"> Members Public </v-chip>
      <v-chip v-if="band.isEventsPublic" class="ma-1"> Events Public </v-chip>
      <v-chip v-if="band.isSetlistPublic" class="ma-1"> Setlist Public </v-chip>
    </v-card-text>
    <v-card-text
      v-if="inBand && (memberInfo.isAdmin || memberInfo.canEditInfo)"
      style="padding: 0; position: relative"
    >
      <v-btn
        absolute
        dark
        small
        fab
        top
        right
        color="primary"
        @click="editBand()"
      >
        <v-icon> edit </v-icon>
      </v-btn>
    </v-card-text>
    <v-card-actions v-if="!inBand">
      <v-btn text @click="openBand()">Open</v-btn>
      <v-btn v-if="memberInfo.isCreator" text color="error" @click="modalDelete"
        >Delete</v-btn
      >
      <v-spacer></v-spacer>
    </v-card-actions>
    <Confirm
      :dialog="dialog"
      @confirm="deleteBand"
      :title="modalTitle"
      :text="modalText"
      @close="dialog = false"
    />
  </v-card>
</template>

<script>
import Confirm from "../layout/Confirm.vue";
export default {
  name: "BandCard",
  data() {
    return {
      dialog: false,
      modalTitle: "",
      modalText: "",
    };
  },
  components: {
    Confirm,
  },
  props: {
    band: Object,
    inBand: Boolean,
    memberInfo: Object,
  },
  methods: {
    modalDelete() {
      this.modalTitle = "Are you sure?";
      this.modalText = "Band with all setlists and events will be deleted";
      this.dialog = true;
    },
    async deleteBand() {
      await this.Service.bandService.deleteBand(this.band._id);
      this.$emit("submitted", "Band successfully deleted");
    },
    openBand() {
      this.$router.push({
        path: `/band/${this.band._id}`,
      });
    },
    editBand() {
      this.$emit("edit");
    },
  },
  computed: {
    hasLogo() {
      return this.band && this.band.logo;
    },
    formatted_address() {
      if (this.band && this.band.location_address) {
        return this.band.location_address.formatted_address;
      } else {
        return "";
      }
    },
  },
};
</script>

<style>
</style>
