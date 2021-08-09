<template>
  <div>
    <!-- <h1>The site is under development. Do not use for real chronicles</h1> -->
    <v-layout wrap justify-space-around v-show="loaded">
      <v-flex xs12 sm6 md6 lg5 xl4 pa-3>
        
      </v-flex>
      <v-snackbar
        v-model="snackbar.enabled"
        :bottom="true"
        :left="false"
        :multi-line="false"
        :right="false"
        :timeout="3000"
        :vertical="false"
      >
        {{ snackbar.text }}
        <v-btn color="red" text @click="snackbar.enabled = false">Close</v-btn>
      </v-snackbar>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: {
    message: String
  },
  methods: {
    
  },
  data() {
    return {
      snackbar: {
        enabled: false,
        text: ""
      },
      loaded: false
    };
  }
};
</script>

<style>
.gbutton {
  width: 38px;
  margin-left: -9px;
  margin-top: -1px;
  margin-right: 5px;
}
</style>