<template>
  <v-app :dark="darkTheme" class="max-height">
    <router-view class="max-height" @theme="toggleTheme"></router-view>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      darkTheme: false
    };
  },
  methods: {
    toggleTheme() {
      this.darkTheme = !this.darkTheme;
    }
  },
  mounted() {
    if (window.location.protocol === "http:" && window.location.host !== "localhost") {
      window.location.href = window.location.href.replace(/http/i, "https");
    }
  },
  computed: {
    scrollbarColor: {
      get() {
        return this.darkTheme ? "#424242" : "#aaa"
      }
    }
  }
};
</script>

<style>
@import "~animate.css";

@media screen and (max-width: 1264px) {
  .first-nav {
    position: absolute;
    top: 0;
    left: 0;
  }
  .second-nav {
    position: absolute;
    top: 0;
    left: 60px;
  }
}

::-webkit-scrollbar {
  width: 2px;
}

::-webkit-scrollbar-track {
  background: var(--scrollbar-color);
  
}

::-webkit-scrollbar-thumb {
  background: #394AAB;
  -webkit-box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.2);
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.2);
}

::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

::-webkit-scrollbar-thumb:active {
  background: #394AAB;
  -webkit-box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.3);
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: .3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}

.page-enter-active, .page-leave-active {
  transition: opacity 1s, transform 1s;
}
.page-enter, .page-leave-to {
  opacity: 0;
  transform: translateX(30%);
}

</style>
