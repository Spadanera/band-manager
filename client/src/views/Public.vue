<template>
  <div>
    <Toolbar title="band manager" short-title="BM" :user-menu="false" rootMenu="/"/>
    <v-content class="max-height">
      <router-view :nav="nav"></router-view>
    </v-content>
    <NprogressContainer />
  </div>
</template>

<script>
import NprogressContainer from "vue-nprogress/src/NprogressContainer";
import Toolbar from "../components/layout/Toolbar.vue";
export default {
  components: {
    Toolbar,
    NprogressContainer
  },
  data() {
    return {
      darkTheme: false,
      nav: {
        visible: false
      }
    };
  },
  methods: {
    toggleNav() {
      this.nav.visible = !this.nav.visible;
    },
    setChronicle(chronicleName) {
      this.chronicleName = chronicleName;
    },
    toggleTheme() {
      this.$emit("theme");
    }
  }
};
</script>

<style>
</style>
