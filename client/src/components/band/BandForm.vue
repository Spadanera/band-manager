<template>
  <v-dialog v-model="dialog" persistent scrollable max-width="500px">
    <v-card>
      <v-card-title>
        <span v-if="localBand._id" class="headline">Edit band</span>
        <span v-else class="headline">New band</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text style="max-height: 600px">
        <v-container grid-list-md>
          <v-form autocomplete="off" ref="form" v-model="valid">
            <v-row>
              <v-col col="12">
                <v-text-field
                  v-model="localBand.name"
                  label="Name"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row align-content="center" style="margin-bottom: 15px">
              <v-col col="12" md="8" style="position: relative">
                <v-subheader>Band Logo</v-subheader>
                <v-img :src="bandLogo" max-width="300">
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                  </v-row>
                </v-img>
                <v-btn
                  style="position: absolute; bottom: 0; right: 0"
                  fab
                  small
                  color="primary"
                  dark
                  @click="$refs.file.$refs.input.click()"
                >
                  <v-icon> edit </v-icon>
                </v-btn>
                <v-file-input
                  ref="file"
                  style="display: none"
                  show-size
                  @change="onFilePicket"
                  accept="image/*"
                  label="File input"
                ></v-file-input>
              </v-col>
            </v-row>
            <v-row>
              <v-col col="12">
                <v-subheader>Description</v-subheader>
                <ckeditor
                  :editor="editor"
                  v-model="localBand.description"
                  :config="editorConfig"
                  tag-name="textarea"
                ></ckeditor>
              </v-col>
            </v-row>
            <GoogleMapsAutocomplete
              style="margin-top: 20px"
              @input="setPlace"
              v-model="currentPlace"
              label="Enter a location"
              noResultFoundMessage="No result"
            />
            <v-autocomplete
              v-model="localBand.genres"
              :items="Genres"
              dense
              chips
              small-chips
              label="Genres"
              multiple
              style="margin-top: 20px"
            ></v-autocomplete>
            <v-subheader>Visibility</v-subheader>
            <v-row
              align="center"
              justify="space-around"
              v-if="memberInfo.isAdmin || memberInfo.canEditInfo"
            >
              <v-switch
                v-model="localBand.isPublic"
                class="ma-1"
                label="Public"
              ></v-switch>
              <v-switch
                v-model="localBand.isMembersPublic"
                class="ma-1"
                label="Members Public"
              ></v-switch>
              <v-switch
                v-model="localBand.isSetlistPublic"
                class="ma-1"
                label="Setlist Public"
              ></v-switch>
              <v-switch
                v-model="localBand.isEventsPublic"
                class="ma-1"
                label="Events Public"
              ></v-switch>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeModal">Dismiss</v-btn>
        <v-btn color="blue darken-1" text @click="submitForm">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import GoogleMapsAutocomplete from "../../components/layout/GoogleMapsAutocomplete.vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
  name: "BandForm",
  components: {
    GoogleMapsAutocomplete,
  },
  props: {
    dialog: Boolean,
    band: Object,
    memberInfo: Object,
  },
  data() {
    return {
      localBand: {},
      valid: true,
      currentPlace: {},
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
      baseLogo: "/static-assets/empty.jpeg",
    };
  },
  methods: {
    closeModal() {
      this.$emit("close", false);
    },
    async submitForm() {
      this.$refs.form.validate();
      if (this.valid) {
        this.localBand.location = JSON.stringify(this.currentPlace);
        this.localBand = await this.Service.bandService.upsertBand(
          this.localBand
        );
        this.$emit("submitted", "Band successfully created");
        this.$emit("close", false);
      }
    },
    resetBand() {
      if (this.band) {
        this.localBand = this.copy(this.band);
        if (this.localBand.location) {
          this.currentPlace = JSON.parse(this.localBand.location);
        }
      } else {
        this.localBand = {
          bandMembers: [],
          location_address: {},
        };
      }
    },
    onFilePicket(file) {
      if (file) {
        const fr = new FileReader();
        let that = this;
        fr.readAsDataURL(file);
        fr.addEventListener("load", () => {
          that.localBand.logo = fr.result;
        });
      }
    },
    setPlace(place) {
      this.currentPlace = place;
    },
  },
  created() {
    this.resetBand();
  },
  computed: {
    isPublic() {
      return this.localBand.isPublic;
    },
    bandLogo() {
      return this.localBand.logo || this.baseLogo;
    },
  },
  watch: {
    isPublic: {
      handler(newValue) {
        if (!newValue) {
          this.localBand.isMembersPublic = false;
          this.localBand.isSetlistPublic = false;
          this.localBand.isEventsPublic = false;
        }
      },
    },
    dialog: {
      handler() {
        this.resetBand();
      },
    },
  },
};
</script>

<style>
</style>
