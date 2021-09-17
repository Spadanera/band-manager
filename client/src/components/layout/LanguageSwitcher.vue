<template>
  <v-menu
    left
    offset-x
    origin="center center"
    transition="scale-transition"
    class="to-click"
  >
    <template v-slot:activator="{ on }">
      <v-btn v-if="icon" icon text>
        <v-icon v-on="on">language</v-icon>
      </v-btn>
      <span
        v-else
        style="text-transform: uppercase"
        class="to-click"
        v-on="on"
        text
        >{{ $ml.get(currentLanguage) }}</span
      >
    </template>

    <v-list>
      <v-list-item
        v-for="(lang, i) in $ml.list"
        :key="i"
        @click="changeLanguage(lang)"
      >
        <v-list-item-title v-bind:class="{ 'text-decoration-underline': lang === currentLanguage }">{{ $ml.get(lang) }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import moment from "moment";
import "moment/locale/it";

export default {
  name: "LanguageSwitcher",
  props: {
    icon: Boolean,
  },
  data() {
    return {
      currentLanguage: "en",
    };
  },
  methods: {
    changeLanguage(lang) {
      this.currentLanguage = lang;
      this.$ml.change(lang);
      location.reload();
    },
    setMomentLocate() {
      let locale = "en-us";
      switch (this.currentLanguage) {
        case "en":
          locale = "en-us";
          break;
        case "it":
          locale = "it";
          break;
      }

      moment.locale(locale);
    },
  },
  created() {
    if (this.$ml.current && this.$ml.current.length > 2) {
      this.$ml.change("en");
    }
    this.currentLanguage = this.$ml.current;
  },
};
</script>

<style>
.to-click {
  cursor: pointer;
}
</style>