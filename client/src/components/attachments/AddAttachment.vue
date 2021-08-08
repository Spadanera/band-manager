<template>
  <v-dialog v-model="dialog" persistent max-width="700px">
    <v-card>
      <v-card-title>
        <span v-if="!attachment._id" class="headline">{{$ml.get('createNewAttachment')}}</span>
        <span v-else>{{$ml.get('updateAttachment')}}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-form autocomplete="off" ref="form" v-model="valid">
            <v-text-field v-model="title" :label="$ml.get('name')" required></v-text-field>
            <v-text-field
              :label="$ml.get('selectImage')"
              @click="pickFile"
              v-model="imageName"
              prepend-icon="attach_file"
              required
              v-if="!attachment._id"
            ></v-text-field>
            <input
              type="file"
              style="display: none"
              ref="image"
              
              @change="onFilePicked"
            />
            <v-autocomplete
              v-model="selectedPlayers"
              :items="players"
              outlined
              chips
              item-text="userDisplayName"
              item-value="_id"
              :label="$ml.get('playerVisibility')"
              multiple
            >
              <template v-slot:selection="data">
                <v-chip
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  close
                  @click="data.select"
                  @click:close="remove(data.item)"
                >
                  <v-avatar left>
                    <v-img :src="data.item.userPicture"></v-img>
                  </v-avatar>
                  {{ data.item.userDisplayName }}
                </v-chip>
              </template>
              <template v-slot:item="data">
                <template>
                  <v-list-item-avatar>
                    <img :src="data.item.userPicture" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-html="data.item.userDisplayName"></v-list-item-title>
                  </v-list-item-content>
                </template>
              </template>
            </v-autocomplete>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeModal">{{$ml.get("dismiss")}}</v-btn>
        <v-btn color="blue darken-1" text @click="submit">{{$ml.get("save")}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
    attachment: Object
  },
  data() {
    return {
      valid: true,
      title: "",
      imageName: "",
      imageUrl: "",
      imageFile: "",
      imageType: "",
      players: [],
      selectedPlayers: []
    };
  },
  methods: {
    closeModal() {
      this.$emit("close", false);
      this.title = "";
      this.selectedPlayers = [];
      this.imageName = "";
      this.imageUrl = "";
      this.imageFile = "";
      this.imageType = "";
    },
    async submit() {
      if (this.$refs.form.validate()) {
        let playerVisibility = [];
        for (let i = 0; i < this.selectedPlayers.length; i++) {
          let player = this.players.find(
            p => p._id === this.selectedPlayers[i]
          );
          if (player) {
            playerVisibility.push({
              playerId: player._id
            });
          }
        }
        if (this.attachment._id) {
          await this.Service.attachmentService.updateAttachment(this.attachment._id, {
            title: this.title,
            file: this.imageUrl,
            playerVisibility: playerVisibility
          });
        } else {
          await this.Service.attachmentService.createAttachment(
            this.$route.params.id,
            {
              title: this.title,
              file: this.imageFile,
              fileName: this.imageName,
              type: this.imageType,
              playerVisibility: playerVisibility
            }
          );
        }
        this.$emit("submitted", this.coterieId);
        this.closeModal();
      }
    },
    pickFile() {
      this.$refs.image.click();
    },
    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result;
          this.imageFile = files[0]; // this is an image file that can be sent to server...
          this.imageType = files[0].type;
        });
      } else {
        this.imageName = "";
        this.imageFile = "";
        this.imageUrl = "";
        this.imageType = "";
      }
    },
    remove(item) {
      const index = this.selectedPlayers.indexOf(item._id);
      if (index >= 0) {
        this.selectedPlayers.splice(index, 1);
      }
    }
  },
  async created() {
    this.players = await this.Service.playerService.getGroups(
      this.$route.params.id
    );
  },
  computed: {
    attachmentId() {
      return this.attachment._id;
    }
  },
  watch: {
    attachmentId: {
      immediate: true,
      handler(value) {
        if (value) {
          this.title = this.attachment.title;
          this.selectedPlayers = this.attachment.playerVisibility.map(p => p.playerId);
          this.imageName = "";
          this.imageUrl = this.attachment.file;
          this.imageFile = "";
          this.imageType = "";
        } else {
          this.title = "";
          this.selectedPlayers = [];
          this.imageName = "";
          this.imageUrl = "";
          this.imageFile = "";
          this.imageType = "";
        }
      }
    }
  }
};
</script>

<style>
</style>