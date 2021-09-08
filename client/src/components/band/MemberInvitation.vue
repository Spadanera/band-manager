<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Invite Member</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-form autocomplete="off" ref="form" v-model="valid">
            <v-text-field
              v-model="invitation.emailAddress"
              label="Gmail Address"
              :autofocus="true"
              :rules="[validationRules.required, validationRules.email]"
            ></v-text-field>
            <v-text-field
              v-model="bandMember.role"
              label="Role"
            ></v-text-field>
            <v-row
              align="center"
              justify="space-around"
              v-if="memberInfo.isAdmin"
            >
              <v-switch
                v-model="bandMember.isAdmin"
                class="ma-1"
                label="Admim"
              ></v-switch>
              <v-switch
                v-model="bandMember.canEditInfo"
                class="ma-1"
                label="Edit Info"
              ></v-switch>
              <v-switch
                v-model="bandMember.canEditSetlist"
                class="ma-1"
                label="Edit Setlist"
              ></v-switch>
              <v-switch
                v-model="bandMember.canEditEvents"
                class="ma-1"
                label="Edit Events"
              ></v-switch>
              <v-switch
                v-model="bandMember.canEditMembers"
                class="ma-1"
                label="Edit Members"
              ></v-switch>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="red"
        ></v-progress-circular>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          :disabled="loading"
          text
          @click="closeModal"
          >Dismiss</v-btn
        >
        <v-btn color="blue darken-1" :disabled="loading" text @click="submit"
          >Send</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "MemberInvitation",
  props: {
    dialog: Boolean,
    bandId: String,
    memberInfo: Object
  },
  data() {
    return {
      invitation: {},
      bandMember: {},
      valid: true,
      loading: false,
    };
  },
  methods: {
    closeModal() {
      this.clearField();
      this.$emit("close", false);
    },
    clearField() {
      this.invitation = {
        bandId: "",
        emailAddress: "",
      };
      this.bandMember = {
        role: "",
        isAdmin: false,
        isCreator: false,
        canEditMembers: false,
        canEditInfo: false,
        canEditSetlist: false,
        canEditEvents: false,
      };
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    },
    async submit() {
      this.$refs.form.validate();
      if (this.valid) {
        try {
          this.invitation.bandId = this.bandId;
          this.loading = true;
          this.bandMember.userEmailAddress = this.invitation.emailAddress;
          let response = await this.Service.invitationService.createInvitation({
            invitation: this.invitation,
            bandMember: this.bandMember,
            bandId: this.bandId,
          });
          if (response.status === 204) {
            this.$emit("submitted", "Member already exists");
          } else {
            this.$emit("submitted");
          }
          this.closeModal();
        } catch (err) {
          alert("Error executing invitation");
        } finally {
          this.loading = false;
        }
      }
    },
  },
  computed: {
    isAdmin() {
      return this.bandMember.isAdmin;
    },
  },
  watch: {
    isAdmin: {
      handler(newValue) {
        if (newValue) {
          this.bandMember.canEditMembers = true;
          this.bandMember.canEditInfo = true;
          this.bandMember.canEditSetlist = true;
          this.bandMember.canEditEvents = true;
        }
      },
    },
  },
};
</script>

<style>
</style>
