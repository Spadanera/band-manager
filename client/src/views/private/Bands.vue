<template>
  <v-container fluid grid-list-md>
    <div v-if="!bands.length && loaded">
      <v-row wrap justify="space-around">
        <v-col
          cols="12"
          sm="10"
          md="8"
          lg="6"
          xl="4"
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
        </v-col>
      </v-row>
    </div>
    <div v-if="bands.length">
      <v-row wrap justify="space-around">
        <v-col
          cols="12"
          sm="6"
          md="6"
          lg="4"
          xl="3"
          v-for="band in bands"
          v-bind:key="band._id"
          class="my-2"
        >
          <BandCard
            :band="band"
            @submitted="submitted"
            :memberInfo="band.memberInfo"
          />
        </v-col>
      </v-row>
      <BandForm
        :dialog="dialog"
        @submitted="submitted"
        @close="dialog = false"
        :memberInfo="{
          isAdmin: true
        }"
      />
      <v-btn color="primary" dark fixed bottom right fab @click="dialog = true">
        <v-icon>add</v-icon>
      </v-btn>
    </div>
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
      loaded: false,
      memberInfo: {}
    };
  },
  methods: {
    async loadList() {
      this.bands = await this.Service.bandService.getBands();
      this.loaded = true;
    },
    submitted() {
      this.$root.$emit("showSnackbar", "Band successfully created");
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

@media screen and (min-width: 900px) {
  .max-height-alt {
    height: calc(100% - 48px);
    max-height: calc(100% - 48px);
    overflow-y: auto;
  }

  .max-height-alt > .v-window__container {
    height: 100%;
  }
}
</style>

