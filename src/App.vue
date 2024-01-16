<template>
  <app-header />
  <div class="content">
    <router-view
        v-slot="{ Component }"
        :key="componentKey"
        @forceUpdate="forceUpdate"
        @success="success"
        @error="error"
        @warning="warning"
    >
      <keep-alive include="AllBooks">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
  <app-footer />
</template>

<script>
import notie from "notie"

import AppHeader from "./components/Header.vue"
import AppFooter from "./components/Footer.vue"
import { store } from "./components/store"

const getCookie = (name) => {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=")
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, "")
}

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      componentKey: 0,
      store,
    }
  },
  methods: {
    forceUpdate() {
      this.componentKey++
    },
    success(msg) {
      notie.alert({
        type: "success",
        text: msg,
      })
    },
    error(msg) {
      notie.alert({
        type: "error",
        text: msg,
      })
    },
    warning(msg) {
      notie.alert({
        type: "warning",
        text: msg,
      })
    },
  },
  beforeMount() {
    const data = getCookie("_site_data")

    if (data !== "") {
      const cookieData = JSON.parse(data)

      store.token = cookieData.token.token
      store.user = {
        id: cookieData.user.id,
        first_name: cookieData.user.first_name,
        last_name: cookieData.user.last_name,
        email: cookieData.user.email,
      }
    }
  }
}
</script>

<style scoped>
.content {
  min-height: calc(100vh - 56px - 48px - 38.4px);
}
</style>