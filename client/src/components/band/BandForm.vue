<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span v-if="localBand._id" class="headline">Edit band</span>
        <span v-else class="headline">New band</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-form autocomplete="off" ref="form" v-model="valid">
            <v-text-field
              v-model="localBand.name"
              label="Name"
              required
            ></v-text-field>
            <Attachment
              label="Logo"
              :service="Service.bandService"
              :parentId="localBand._id"
              :name="localBand.bandLogo.fileName"
              ref="logo"
              @update="setLogo"
            />
            <ckeditor
              :editor="editor"
              v-model="localBand.description"
              :config="editorConfig"
              tag-name="textarea"
            ></ckeditor>
            <GoogleMapsAutocomplete
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
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeModal">Dismiss</v-btn>
        <v-btn color="blue darken-1" text @click="submitForm">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Attachment from "../../components/layout/Attachment.vue";
import GoogleMapsAutocomplete from "../../components/layout/GoogleMapsAutocomplete.vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
  name: "BandForm",
  components: {
    Attachment,
    GoogleMapsAutocomplete,
  },
  props: {
    dialog: Boolean,
    band: Object,
    memberInfo: Object
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
        this.$refs.logo.setImage();
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
          bandLogo: {},
        };
      }
    },
    setLogo(image) {
      this.localBand.bandLogo = {
        fileName: image.imageName,
        fileType: image.imageType,
      };
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
