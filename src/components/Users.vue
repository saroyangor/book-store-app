<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h1 class="mt-3">All Users</h1>
      </div>
      <hr>

      <table v-if="this.ready" class="table table-compact table-striped">
        <thead>
        <tr>
          <th>User</th>
          <th>Email</th>
          <th>Active</th>
          <th>Status</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="u in users" :key="u.id">
          <td>
            <router-link :to="`/admin/users/${u.id}`">
              {{ u.last_name }} {{ u.first_name }}
            </router-link>
          </td>
          <td>{{ u.email }}</td>

          <td v-if="u.active === 1">
            <span class="badge bg-success">Active</span>
          </td>
          <td v-else>
            <span class="badge bg-danger">Inactive</span>
          </td>

          <td v-if="u.token.id > 0">
            <span class="badge bg-success" role="button" @click="logUserOut(u.id)">
              Logged in
            </span>
          </td>
          <td v-else>
            <span class="badge bg-danger">Not logged in</span>
          </td>
        </tr>
        </tbody>
      </table>

      <p v-else> Loading...</p>
    </div>
  </div>
</template>

<script>
import notie from "notie";

import Security from "./security"
import { store } from "./store"

export default {
  name: "AllUsers",
  data() {
    return {
      users: [],
      ready: false,
      store,
    }
  },
  methods: {
    logUserOut(id) {
      if (id !== store.user.id) {
        notie.confirm({
          text: "Are you sure you want to log this user out?",
          submitText: "Log Out",
          submitCallback: () => {
            fetch(process.env.VUE_APP_API_URL + "/admin/log-user-out/" + id, Security.requestOptions(""))
                .then(res => res.json())
                .then(data => {
                  if (data.error) {
                    this.$emit('error', data.message)
                  } else {
                    this.$emit('success', data.message)
                    this.$emit('forceUpdate')
                  }
                })
          }
        })
      } else {
        this.$emit('error', "You can't log yourself out!")
      }
    },
  },
  beforeMount() {
    Security.requireToken()

    fetch(process.env.VUE_APP_API_URL + "/admin/users", Security.requestOptions(""))
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            this.$emit('error', res.message)
          } else {
            this.users = res.data.users
            this.ready = true
          }
        })
        .catch(err => {
          this.$emit('error', err)
        })
  }
}
</script>
