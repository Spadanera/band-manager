<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{$ml.get("invitePlayer")}}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-form autocomplete="off" ref="form" v-model="valid">
            <v-text-field v-model="invitation.emailAddress" label="Gmail Address" required></v-text-field>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-progress-circular v-if="loading" indeterminate color="red"></v-progress-circular>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" :disabled="loading" text @click="closeModal">{{$ml.get("dismiss")}}</v-btn>
        <v-btn color="blue darken-1" :disabled="loading" text @click="submit">{{$ml.get("send")}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "InvitePlayer",
  props: {
    dialog: Boolean,
    chronicleId: String
  },
  data() {
    return {
      invitation: {
        chronicleId: ""
      },
      valid: true,
      loading: false
    };
  },
  methods: {
    closeModal() {
      this.invitation.emailAddress = "";
      this.$emit("close", false);
    },
    async submit() {
      if (this.$refs.form.validate()) {
        try {
          this.invitation.chronicleId = this.chronicleId;
          this.loading = true;
          let response = await this.Service.invitationService.createInvitation(this.invitation);
          if (response.status === 204) {
            this.$emit("submitted", "Player already exists");
          }
          else {
            this.$emit("submitted");
          }
          this.closeModal();
        }
        catch (err) {
          alert("Error executing invitation");
        }
        finally {
          this.loading = false;
        }
      }
    }
  }
};
</script>

<style>
</style>
