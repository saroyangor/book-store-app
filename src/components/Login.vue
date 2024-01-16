<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h1 class="mt-5">Login</h1>
        <hr>
        <form-tag @myevent="submitHandler" name="myform" event="myevent">

          <text-input
              v-model="email"
              label="Email"
              type="email"
              name="email"
              required="true">
          </text-input>

          <text-input
              v-model="password"
              label="Password"
              type="password"
              name="password"
              required="true">
          </text-input>

          <hr>
          <input type="submit" class="btn btn-primary" value="Login">
        </form-tag>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue"

import router from "@/router"

import FormTag from "./forms/FormTag.vue"
import TextInput from "./forms/TextInput.vue"
import { store } from "./store"
import Security from "./security";

export default {
  name: 'AppLogin',
  emits: ['error'],
  props: {},
  components: {
    FormTag,
    TextInput,
  },

  setup(props, ctx) {
    const email = ref("")
    const password = ref("")

    function submitHandler() {
      const payload = {
        email: email.value,
        password: password.value,
      }

      fetch(process.env.VUE_APP_API_URL + "/users/login", Security.requestOptions(payload))
          .then(res => res.json())
          .then(data => {
            if (data.error) {
              ctx.emit('error', data.message)
            } else {
              store.token = data.data.token.token
              store.user = {
                id: data.data.user.id,
                first_name: data.data.user.first_name,
                last_name: data.data.user.last_name,
                email: data.data.user.email,
              }

              const date = new Date()
              const expDays = 1
              date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000))
              const expires = "expires=" + date.toUTCString()

              document.cookie =
                  "_site_data="
                  + JSON.stringify(data.data)
                  + "; "
                  + expires
                  + "; path=/; SameSite=strict; Secure;"

              router.push("/")
            }
          })
    }

    return {
      email,
      password,
      submitHandler,
    }
  }
}
</script>