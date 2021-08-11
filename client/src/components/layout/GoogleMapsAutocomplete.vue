<template>
  <v-autocomplete
    :value="value.place_id"
    :items="virtualItems"
    :search-input.sync="search"
    :disabled="!initialized"
    :loading="isLoading"
    :hide-no-data="isLoading || !search"
    clearable
    item-text="address"
    item-value="placeId"
    return-object
    @input="onSelected"
    v-bind="$attrs"
  >
    <template slot="no-data">
      <v-list-item>
        <v-list-item-title>{{noResultsFoundMessage}}</v-list-item-title>
      </v-list-item>
    </template>

    <template slot="item" slot-scope="{ item }">
      <v-list-item-avatar>
        <v-icon>place</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-text="item.name" />
        <v-list-item-subtitle v-text="item.address" />
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
import debouncePromise from "debounce-promise";
export default {
  props: {
    value: {
      type: Object,
      default: null
    },
    restrictToCountries: {
      type: Array,
      default: () => []
    },
    noResultsFoundMessage: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isLoading: false,
      items: [],
      lastItemUpdate: 0,
      search: null,
      autocomplete: null,
      geocoder: null,
      initialized: false
    };
  },
  computed: {
    // If we saved the value but not the items, ensure that we spoof an items array
    // with at least the value so that the component still works
    virtualItems() {
      if (this.items.length === 0 && this.value) {
        return [this.value];
      } else {
        return this.items;
      }
    }
  },
  watch: {
    search(text) {
      if (text) {
        this.isLoading = true;
        this.searchPlaces(text).then(({ predictions, status }) => {
          const autocompleteError =
            status != window.google.maps.places.PlacesServiceStatus.OK;
          if (!autocompleteError) {
            this.items = predictions.map(p => ({
              name: p.structured_formatting.main_text,
              address: p.description,
              placeId: p.place_id
            }));
          }
          this.isLoading = false;
        });
      }
    }
    // Resolve lat and lng of selected place's location, and update selected place with that
    // information
  },
  created() {
    this.$gmapApiPromiseLazy().then(() => {
      this.geocoder = new window.google.maps.Geocoder();
      this.autocomplete = new window.google.maps.places.AutocompleteService();
      this.initialized = true;
      this.$emit("initialized");
    });
  },
  methods: {
    searchPlaces: debouncePromise(function(text) {
      return new Promise(resolve => {
        this.autocomplete.getPlacePredictions(
          {
            input: text,
            componentRestrictions: { country: this.restrictToCountries }
          },
          (predictions, status) => {
            resolve({ predictions, status });
          }
        );
      });
    }, 500),
    // When selected, get the lat/lng info and merge with original selection
    onSelected(selectedItem) {
      if (selectedItem) {
        const { placeId } = selectedItem;
        this.geocoder.geocode({ placeId }, result => {
          this.$emit("input", result[0]);
        });
      }
    }
  }
};
</script>