<template>
  <v-container fluid grid-list-md>
    <div v-if="!bands.length && loaded">
      <v-layout row wrap>
        <BandForm
          :dialog="dialog"
          @submitted="submitted"
          @close="dialog = false"
        />
        <v-flex
          xs12
          sm10
          md8
          lg6
          xl4
          offset-sm1
          offset-md2
          offset-lg3
          offset-xl4
        >
          <v-card>
            <v-card-title primary-title>
              <div>
                <div class="headline">No bands</div>
                <span class="grey--text">You have to create a Band</span>
              </div>
            </v-card-title>
            <v-card-actions class="justify-center">
              <v-btn @click="dialog = true">Create Band</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
    <div v-if="bands.length">
      <v-layout wrap justify-space-around>
        <v-flex
          xs12
          sm6
          md6
          lg4
          xl3
          v-for="band in bands"
          v-bind:key="band._id"
          class="my-2"
        >
          <BandCard
            :band="band"
            @submitted="submitted"
            :memberInfo="band.memberInfo"
          />
        </v-flex>
      </v-layout>
      <BandForm
        :dialog="dialog"
        @submitted="submitted"
        @close="dialog = false"
      />
      <v-btn color="primary" dark fixed bottom right fab @click="dialog = true">
        <v-icon>add</v-icon>
      </v-btn>
    </div>
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
      <v-btn text @click="snackbar.enabled = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import BandForm from "../../components/band/BandForm.vue";
import BandCard from "../../components/band/BandCard.vue";
export default {
  components: {
    BandForm,
    BandCard,
  },
  data() {
    return {
      dialog: false,
      bands: [],
      snackbar: {
        enebled: false,
        text: "",
      },
      loaded: false,
    };
  },
  methods: {
    async loadList() {
      this.bands = await this.Service.bandService.getBands();
      this.loaded = true;
    },
    submitted(text) {
      this.snackbar = {
        enabled: true,
        text,
      };
      this.loadList();
      this.dialog = false;
    },
  },
  created() {
    this.loadList();
  },
};
</script>

<style>
.selected {
  color: red;
}
</style>

