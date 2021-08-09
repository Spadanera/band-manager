<template>
  <v-card style="display: flex; flex-direction: column; height: 100%">
    <v-card-title class="headline">{{ band.name }}</v-card-title>
    <v-card-text style="flex: 1">
      <p>{{ band.description }}</p>
    <v-divider></v-divider>
    </v-card-text>
    <v-card-text>
      <v-chip v-for="(member, index) in band.bandMembers" :key="index">
        <v-avatar left>
          <v-img :src="member.userPicture"></v-img>
        </v-avatar>
        {{ member.userDisplayName }}
      </v-chip>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="openBand(band._id)">Open</v-btn>
      <v-btn text color="error" @click="modalDelete">Delete</v-btn>
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
    openBand(id) {
      this.$router.push({
        path: `/band/${id}`,
      });
    },
  },
};
</script>

<style>
</style>
