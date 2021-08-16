<template>
  <v-dialog v-model="dialog" persistent max-width="400px">
    <v-card>
      <v-card-title> Edit Band Member </v-card-title>
      <v-card-text>
        <v-form autocomplete="off" ref="form" v-model="valid">
          <v-text-field
            v-model="localBandMember.userDisplayName"
            v-if="!localBandMember.userEmailAddress"
            label="Name"
          />
          <v-text-field v-model="localBandMember.role" label="Role" />
          <v-row
            align="center"
            justify="space-around"
            v-if="memberInfo.isAdmin"
          >
            <v-switch
              v-model="localBandMember.isAdmin"
              class="ma-1"
              label="Admim"
            ></v-switch>
            <v-switch
              v-model="localBandMember.canEditInfo"
              class="ma-1"
              label="Edit Info"
            ></v-switch>
            <v-switch
              v-model="localBandMember.canEditSetList"
              class="ma-1"
              label="Edit Setlist"
            ></v-switch>
            <v-switch
              v-model="localBandMember.canEditEvents"
              class="ma-1"
              label="Edit Events"
            ></v-switch>
            <v-switch
              v-model="localBandMember.canEditMembers"
              class="ma-1"
              label="Edit Members"
            ></v-switch>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeModal">Dismiss</v-btn>
        <v-btn color="blue darken-1" text @click="submitForm">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "MemberForm",
  props: {
    bandMember: Object,
    memberInfo: Object,
    dialog: Boolean,
    bandId: String,
  },
  data() {
    return {
      valid: true,
      localBandMember: {},
    };
  },
  methods: {
    closeModal() {
      this.localBandMember = {};
      this.$emit("close");
    },
    submitForm() {
      this.Service.bandService.updateBandMember(
        this.bandId,
        this.localBandMember
      );
      this.$emit("reload");
      this.closeModal();
    },
    reload() {
      this.localBandMember = this.copy(this.bandMember);
    },
  },
  computed: {
    isAdmin() {
      return this.localBandMember.isAdmin;
    },
  },
  watch: {
    isAdmin: {
      handler(newValue) {
        console.log(newValue);
        if (newValue) {
          this.localBandMember.canEditMembers = true;
          this.localBandMember.canEditInfo = true;
          this.localBandMember.canEditSetList = true;
          this.localBandMember.canEditEvents = true;
        }
      },
    },
  },
};
</script>

<style>
</style>