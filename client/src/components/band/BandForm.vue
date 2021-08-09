<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">New band</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-form autocomplete="off" ref="form" v-model="valid">
            <v-text-field
              v-model="band.name"
              label="Name"
              required
            ></v-text-field>
            <v-textarea
              v-model="band.description"
              label="Description"
              name="description"
              auto-grow
              rows="1"
            ></v-textarea>
          </v-form>
        </v-container>
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
  name: "BandForm",
  components: {},
  props: {
    dialog: Boolean,
  },
  data() {
    return {
      band: {},
      valid: true,
    };
  },
  methods: {
    created() {
      this.$emit("submitted");
      this.$emit("close", false);
    },
    closeModal() {
      this.$emit("close", false);
    },
    async submitForm() {
      this.$refs.form.validate();
      if (this.valid) {
        await this.Service.bandService.upsertBand(this.band);
        this.$refs.form.reset();
        this.$emit("submitted", "Band successfully created");
      }
    },
  },
};
</script>

<style>
</style>
