<template>
  <v-dialog v-model="dialog" persistent max-width="400px">
    <v-card>
      <v-card-title> {{$ml.get('editBandMembers')}} </v-card-title>
      <v-card-text>
        <v-form autocomplete="off" ref="form" v-model="valid" @submit.prevent="submitForm">
          <v-text-field
            v-model="localBandMember.userDisplayName"
            v-if="!localBandMember.userEmailAddress"
            :label="$ml.get('name')"
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
              :label="$ml.get('admin')"
            ></v-switch>
            <v-switch
              v-model="localBandMember.canEditInfo"
              class="ma-1"
              :label="$ml.get('editInfo')"
            ></v-switch>
            <v-switch
              v-model="localBandMember.canEditSetlist"
              class="ma-1"
              :label="$ml.get('editSetlists')"
            ></v-switch>
            <v-switch
              v-model="localBandMember.canEditEvents"
              class="ma-1"
              :label="$ml.get('editEvents')"
            ></v-switch>
            <v-switch
              v-model="localBandMember.canEditMembers"
              class="ma-1"
              :label="$ml.get('editMembers')"
            ></v-switch>
          </v-row>
          <v-btn type="submit" style="display: none;"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeModal">{{$ml.get('dismiss')}}</v-btn>
        <v-btn color="blue darken-1" text @click="submitForm">{{$ml.get('save')}}</v-btn>
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
    async submitForm() {
      let band = await this.Service.bandService.updateBandMember(
        this.bandId,
        this.localBandMember
      );
      this.$emit("reload", band);
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
          this.localBandMember.canEditSetlist = true;
          this.localBandMember.canEditEvents = true;
        }
      },
    },
  },
};
</script>

<style>
</style>