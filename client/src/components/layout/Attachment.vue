<template>
  <div>
    <v-text-field
      label="Pick an image"
      @click="pickFile"
      v-model="imageName"
      append-icon="attach_file"
      required
    ></v-text-field>
    <input
      type="file"
      style="display: none"
      ref="image"
      @change="onFilePicked"
    />
  </div>
</template>

<script>
export default {
  name: "Attachment",
  props: {
    label: String,
    service: Object,
    parentId: String,
    name: String
  },
  data() {
    return {
      valid: true,
      imageName: "",
      imageUrl: "",
      imageFile: "",
      imageType: "",
    };
  },
  methods: {
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
          this.$emit("update", {
            imageName: this.imageName,
            imageType: this.imageType,
          });
        });
      }
    },
    async setImage() {
      if (this.imageFile) {
        await this.Service.bandService.setImage(this.parentId, {
          imageName: this.imageName,
          imageUrl: this.imageUrl,
          imageFile: this.imageFile, // this is an image file that can be sent to server...
          imageType: this.imageType,
        });
      }
    },
  },
  created() {
    this.imageName = this.name;
  }
};
</script>

<style>
</style>