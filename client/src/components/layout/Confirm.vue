<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>

      <v-card-text>{{ text }}</v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" text @click="closeModal">{{$ml.get("dismiss")}}</v-btn>

        <v-btn color="green darken-1" text @click="confirm">{{$ml.get("confirm")}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Confirm",
  props: {
    title: String,
    text: String,
    dialog: Boolean
  },
  methods: {
      confirm () {
          this.$emit("confirm");
          this.$emit("close", false);
      },
      closeModal () {
          this.$emit("close", false);
      }
  }
};
</script>

<style>
</style>
