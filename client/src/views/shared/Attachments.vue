<template>
  <v-layout fluid justify-center wrap style="overflow: auto; max-height: 100%;">
    <v-flex v-for="attachment in attachments" v-bind:key="attachment._id" pa-2 xs12 sm6 md4 lg4 xl3>
      <v-hover v-slot:default="{ hover }">
        <v-card :elevation="hover ? 12 : 2">
          <v-img
            v-if="attachment.file"
            style="cursor: pointer;"
            @click="viewAttachment(attachment.file)"
            :src="attachment.file"
            height="200px"
          ></v-img>
          <v-card-title
            style="cursor: pointer;"
            @click="viewAttachment(attachment.file)"
          >{{attachment.title}}</v-card-title>
          <v-card-text
            style="cursor: pointer;"
            @click="viewAttachment(attachment.file)"
            v-if="isStoryTeller"
          >
            <v-item-group>
              <v-item v-for="player in attachment.playerVisibility" v-bind:key="player.playerId">
                <v-chip>
                  <v-avatar left>
                    <v-img :src="player.playerImage"></v-img>
                  </v-avatar>
                  {{ player.playerName }}
                </v-chip>
              </v-item>
            </v-item-group>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="downloadAttachment(attachment)">{{$ml.get("download")}}</v-btn>
            <v-btn text v-if="isStoryTeller" @click="editAttachment(attachment)">{{$ml.get("edit")}}</v-btn>
            <v-btn
              text
              v-if="isStoryTeller"
              color="error"
              @click="deleteAttachment(attachment)"
            >{{$ml.get("delete")}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-hover>
    </v-flex>
    <v-btn
      v-if="isStoryTeller"
      color="primary"
      dark
      fixed
      bottom
      right
      fab
      @click="editAttachment()"
    >
      <v-icon>add</v-icon>
    </v-btn>
    <v-dialog content-class="view-image" v-model="viewDialog" max-width="100%">
      <v-img
        :src="imageUrl"
        class="grey lighten-2"
        max-width="100%"
        max-height="100%"
        width="100%"
        height="100%"
        :contain="true"
      ></v-img>
      <v-btn fixed fab right top @click="viewDialog = false">
        <v-icon>close</v-icon>
      </v-btn>
    </v-dialog>
    <AddAttachment
      v-if="isStoryTeller"
      :dialog="dialog"
      @submitted="getAttachments"
      @close="closeModal"
      :attachment="selectedAttachment"
    />
  </v-layout>
</template>

<script>
import AddAttachment from "../../../components/attachments/AddAttachment";
export default {
  components: {
    AddAttachment
  },
  props: {
    attachmentService: Object,
    isStoryTeller: Boolean
  },
  data() {
    return {
      attachments: [],
      dialog: false,
      selectedAttachment: {},
      viewDialog: false,
      imageUrl: ""
    };
  },
  methods: {
    closeModal() {
      this.dialog = false;
      this.selectedAttachment = {};
    },
    async getAttachments() {
      this.attachments = await this.attachmentService.getAttachments(
        this.$route.params.id
      );
    },
    async deleteAttachment(attachment) {
      let res = await this.$confirm(
        this.$ml.with("0", attachment.title).get("confirmDelete"),
        {
          title: this.$ml.get("warning")
        }
      );
      if (res) {
        await this.attachmentService.deleteAttachment(attachment._id);
        this.getAttachments();
      }
    },
    viewAttachment(attahcmentUrl) {
      if (attahcmentUrl) {
        this.imageUrl = attahcmentUrl;
        this.viewDialog = true;
      }
    },
    editAttachment(attachment) {
      this.selectedAttachment = attachment || {};
      this.dialog = true;
    },
    downloadAttachment(attachment) {
      const linkSource = `data:${attachment.type};base64,${attachment.base64}`;
      const downloadLink = document.createElement("a");
      const fileName = attachment.fileName;

      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    }
  },
  async created() {
    await this.getAttachments();
  }
};
</script>

<style>
.view-image.v-dialog.v-dialog--active {
  height: 100%;
}
</style>