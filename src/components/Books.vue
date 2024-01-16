<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h1 class="mt-3">Books</h1>
      </div>

      <hr>

      <div class="filters text-center mb-3">
        <span
            class="filter me-1"
            :class="{ active: currentFilter === 0 }"
            @click="setFilter(0)"
        >
          ALL
        </span>
        <span
            class="filter me-1"
            :class="{ active: currentFilter === 7 }"
            @click="setFilter(7)"
        >
          CLASSIC
        </span>
        <span
            class="filter me-1"
            :class="{ active: currentFilter === 2 }"
            @click="setFilter(2)"
        >
          FANTASY
        </span>
        <span
            class="filter me-1"
            :class="{ active: currentFilter === 6 }"
            @click="setFilter(6)"
        >
          HORROR
        </span>
        <span
            class="filter me-1"
            :class="{ active: currentFilter === 4 }"
            @click="setFilter(4)"
        >
          THRILLER
        </span>
        <span
            class="filter me-1"
            :class="{ active: currentFilter === 1 }"
            @click="setFilter(1)"
        >
          SCIENCE FICTION
        </span>
      </div>

      <hr>

      <div>
        <div class="card-group" v-if="ready">
          <transition-group class="p-3 d-flex flex-wrap" tag="div" appear name="books">
            <div v-for="b in books" :key="b.id">
              <div
                  v-if="b.genre_ids.includes(currentFilter) || currentFilter === 0"
                  class="card me-2 ms-1 mb-3"
                  style="width: 10rem"
              >
                <router-link :to="`/books/${b.slug}`">
                  <img
                      class="card-img-top"
                      :src="`${imgPath}/covers/${b.slug}.jpg`"
                      :alt="`cover for ${b.title}`"
                  >
                </router-link>
                <div class="card-body text-center">
                  <h6 class="card-title">
                    {{ b.title }}
                  </h6>
                  <span class="book-author">{{ b.author.author_name }}</span><br>
                  <small class="text-muted book-genre" v-for="(g, index) in b.genres" :key="g.id">
                    <em class="me-1">
                      {{ g.genre_name }}
                      <template v-if="index !== (b.genres.length - 1)">,</template>
                    </em>
                  </small>
                </div>
              </div>
            </div>
          </transition-group>
        </div>

        <p v-else>Loading...</p>

      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue"

import Security from "./security"

export default {
  name: 'AllBooks',
  emits: ['error'],
  props: {},

  setup(props, ctx) {
    const ready = ref(false)
    const currentFilter = ref(0)
    const books = ref({})
    const imgPath = ref(process.env.VUE_APP_IMAGE_URL)

    onMounted(() => {
      fetch(process.env.VUE_APP_API_URL + "/books", Security.requestOptions(""))
          .then(res => res.json())
          .then(data => {
            if (data.error) {
              ctx.emit('error', data.message)
            } else {
              books.value = data.data.books
              ready.value = true
            }
          })
          .catch(err => {
            ctx.emit('error', err)
          })
    })

    function setFilter(filter) {
      currentFilter.value = filter
    }

    return {
      currentFilter,
      imgPath,
      books,
      setFilter,
      ready,
    }
  }
}
</script>

<style scoped>
.filter {
  padding: 6px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.35s;
  border: 1px solid silver
}

.filter.active {
  background: lightgreen;
}

.filter:hover {
  background: lightgray;
}

.book-author, .book-genre {
  font-size: 0.8em;
}

/* transition styles */
.books-move {
  transition: all 0.5s ease-in-out 50ms;
}

.books-enter-active {
  transition: all 0.5s ease-in-out;
}

.books-leave-active {
  transition: all 0.5s ease-in;
}

.books-enter, .books-leave-to {
  opacity: 0;
}
</style>