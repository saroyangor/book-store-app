<template>
  <div class="container">
    <div class="row pt-4">
      <div class="col-md-2">
        <img v-if="this.ready" class="img-fluid img-thumbnail" :src="`${imgPath}/covers/${book.slug}.jpg`" alt="cover">
      </div>

      <div class="col-md-10">
        <template v-if="this.ready">
          <h3 class="mt-3">{{ book.title }}</h3>
          <hr>
          <p>
            <strong>Author:</strong> {{ book.author.author_name }}<br>
            <strong>Published:</strong> {{ book.publication_year }}
          </p>
          <p>
            {{ book.description }}
          </p>
        </template>
        <p v-else>Loading...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"

import Security from "./security"

export default {
  name: "OneBook",
  emits: ['error'],
  props: {},

  setup(props, ctx) {
    const ready = ref(false)
    const book = ref({})
    const imgPath = ref(process.env.VUE_APP_IMAGE_URL)

    const route = useRoute()

    onMounted(() => {
      fetch(process.env.VUE_APP_API_URL + "/books/" + route.params.bookName, Security.requestOptions(""))
          .then(res => res.json())
          .then(data => {
            if (data.error) {
              ctx.emit('error', data.message)
            } else {
              book.value = data.data
              ready.value = true
            }
          })
          .catch(err => {
            ctx.emit('error', err)
          })
    })

    return {
      book,
      imgPath,
      ready,
    }
  }
}
</script>
