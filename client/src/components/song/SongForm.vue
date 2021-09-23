<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span v-if="!localSong.title" class="headline">{{
          $ml.get("addSong")
        }}</span>
        <span v-else class="headline">{{ $ml.get("editSong") }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-form
            autocomplete="off"
            ref="form"
            v-model="valid"
            @submit.prevent="saveSong"
          >
            <v-switch
              v-model="localSong.cover"
              :label="$ml.get('cover')"
              :readonly="readonly"
              style="position: absolute; right: 20px; top: 5px"
            ></v-switch>
            <v-text-field
              v-if="!localSong.cover"
              v-model="localSong.title"
              :label="$ml.get('title')"
              :readonly="readonly"
              :rules="[validationRules.required]"
            ></v-text-field>
            <v-combobox
              v-else
              :label="$ml.get('title')"
              :value="title"
              :items="virtualItems"
              :search-input.sync="search"
              :loading="isLoading"
              :hide-no-data="isLoading || !search || search.length < 3"
              clearable
              no-filter
              item-text="title_short"
              item-value="id"
              return-object
              @input="onSelected"
              :readonly="readonly"
              :hint="$ml.get('type3Char')"
            >
              <template slot="no-data">
                <v-list-item>
                  <v-list-item-title>{{
                    $ml.get("noResult")
                  }}</v-list-item-title>
                </v-list-item>
              </template>

              <template slot="item" slot-scope="{ item }">
                <v-list-item-content>
                  <v-list-item-title v-text="item.title" />
                  <v-list-item-subtitle>
                    {{ item.author }} - {{ item.album }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-combobox>
            <div class="text-right">
              <v-btn v-if="localSong.preview" small text @click="startPlay">
                <v-icon left> play_arrow </v-icon>
                {{ $ml.get("preview") }}
              </v-btn>
            </div>
            <v-text-field
              v-model="localSong.author"
              :readonly="readonly"
              :label="$ml.get('author')"
            ></v-text-field>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="localSong.bpm"
                  :readonly="readonly"
                  label="BPM"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  :readonly="readonly"
                  v-model="localSong.duration"
                  :label="$ml.get('time')"
                  :suffix="$ml.get('seconds')"
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-select
              :readonly="readonly"
              v-model="localSong.status"
              :items="statuses"
              :rules="[validationRules.required]"
              :label="$ml.get('status')"
            ></v-select>
            <v-textarea :loading="lyricsLoading" dense :label="$ml.get('lyrics')" :value="localSong.lyrics" readonly>

            </v-textarea>
            <v-btn type="submit" style="display: none"></v-btn>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" type="submit" text @click="closeDialog">{{
          $ml.get("dismiss")
        }}</v-btn>
        <v-btn v-if="!readonly" color="blue darken-1" text @click="saveSong">{{
          $ml.get("save")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "SongForm",
  components: {},
  props: {
    dialog: Boolean,
    bandType: String,
    statuses: Array,
    readonly: Boolean,
  },
  data() {
    return {
      localSong: {},
      valid: false,
      tempText: "",
      songs: [],
      search: null,
      isLoading: false,
      title: "",
      lyricsLoading: false,
    };
  },
  methods: {
    reloadSong(song) {
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
      this.selectedSong = {};
      this.localSong = this.copy(song);
      this.title = this.localSong.title;
    },
    closeDialog() {
      this.$emit("close");
    },
    saveSong() {
      this.$refs.form.validate();
      if (this.valid) {
        this.$emit("savesong", this.localSong);
      }
    },
    async onSelected(selectedItem) {
      if (selectedItem) {
        this.localSong.title = selectedItem.title_short;
        this.localSong.author = selectedItem.author;
        this.localSong.duration = selectedItem.duration;
        this.localSong.preview = selectedItem.preview;
        let deezerSong = await this.Service.bandService.getTrack(
          selectedItem.id
        );
        this.localSong.bpm = deezerSong.bpm;
        this.lyricsLoading = true;
        this.localSong.lyrics = await this.Service.bandService.getLyrics(
          selectedItem.title,
          selectedItem.author
        );
        this.lyricsLoading = false;
      } else {
        this.localSong.title = "";
      }
    },
    startPlay() {
      this.$root.$emit("startPlayer", {
        preview: this.localSong.preview,
        title: this.localSong.title,
        author: this.localSong.author,
      });
    },
  },
  computed: {
    // If we saved the value but not the items, ensure that we spoof an items array
    // with at least the value so that the component still works
    virtualItems() {
      if (this.songs.length === 0 && this.title) {
        return [
          {
            id: this.localSong.title,
            title_short: this.localSong.title,
          },
        ];
      } else {
        return this.songs;
      }
    },
  },
  watch: {
    search(text) {
      if (text && text.length > 2) {
        this.isLoading = true;
        this.tempText = text;
        let self = this;
        window.setTimeout(() => {
          if (text === self.tempText) {
            self.Service.bandService.searchSong(text).then((r) => {
              self.songs = r;
              self.isLoading = false;
            });
          }
        }, 500);
      } else {
        this.songs = [];
      }
    },
  },
};
</script>

<style>
</style>