<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h1 class="mt-3">Add/Edit Book</h1>
        <hr>

        <form-tag @bookEditEvent="submitHandler" name="bookForm" event="bookEditEvent">
          <div v-if="this.book.slug !== ''" class="mb-3">
            <img :src="`${this.imgPath}/covers/${this.book.slug}.jpg`" class="img-fluid img-thumbnail book-cover" alt="cover">
          </div>

          <div class="mb-3">
            <label for="formFile" class="form-label">Cover Image</label>
            <input
                v-if="this.book.id === 0"
                ref="coverInput"
                class="form-control"
                type="file"
                name="formFile"
                id="formFile"
                required
                accept="image/jpeg"
                @change="loadCoverImage"
            >
            <input
                v-else
                ref="coverInput"
                class="form-control"
                type="file"
                name="formFile"
                id="formFile"
                accept="image/jpeg"
                @change="loadCoverImage"
            >
          </div>

          <text-input
            v-model="book.title"
            type="text"
            required="true"
            label="Title"
            :value="book.title"
            name="title"
          />
          <select-input
            name="author_id"
            v-model="this.book.author_id"
            :items="this.authors"
            required="true"
            label="Author"
          />
          <text-input
              v-model="book.publication_year"
              type="number"
              required="true"
              label="Publication year"
              :value="book.publication_year"
              name="publication-year"
          />

          <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea
                v-model="book.description"
                required
                class="form-control"
                id="description"
                rows="3"
            />
          </div>

          <div class="mb-3">
            <label for="genres" class="form-label">Genres</label>
            <select
                ref="genres"
                id="genres"
                class="form-select"
                required
                size="7"
                v-model="this.book.genre_ids"
                multiple
            >
              <option v-for="g in this.genres" :value="g.value" :key="g.value">
                {{ g.text }}
              </option>
            </select>
          </div>

          <hr>

          <div class="float-start">
            <input type="submit" class="btn btn-primary me-2" value="Save" />
            <router-link to="/admin/books" class="btn btn-outline-secondary">Cancel</router-link>
          </div>
          <div class="float-end">
            <a v-if="this.book.id > 0" class="btn btn-danger" href="javascript:void(0)" @click="confirmDelete(this.book.id)">
              Delete
            </a>
          </div>
          <div class="clearfix" />
          
        </form-tag>
      </div>
    </div>
  </div>
</template>

<script>
import notie from "notie"

import router from "@/router"

import Security from "./security"
import FormTag from "./forms/FormTag.vue"
import TextInput from "./forms/TextInput.vue"
import SelectInput from "./forms/SelectInput.vue"

export default {
  components: {
    FormTag,
    TextInput,
    SelectInput,
  },
  data() {
    return {
      book: {
        id: 0,
        title: "",
        author_id: 0,
        publication_year: null,
        description: "",
        cover: "",
        slug: "",
        genres: [],
        genre_ids: [],
      },
      authors: [],
      imgPath: process.env.VUE_APP_IMAGE_URL,
      genres: [
        { value: 1, text: "Science Fiction" },
        { value: 2, text: "Fantasy" },
        { value: 3, text: "Romance" },
        { value: 4, text: "Thriller" },
        { value: 5, text: "Mystery" },
        { value: 6, text: "Horror" },
        { value: 7, text: "Classic" },
      ],
    }
  },
  methods: {
    submitHandler() {
      const payload = {
        id: this.book.id,
        title: this.book.title,
        author_id: parseInt(this.book.author_id, 10),
        publication_year: parseInt(this.book.publication_year, 10),
        description: this.book.description,
        cover: this.book.cover,
        slug: this.book.slug,
        genre_ids: this.book.genre_ids,
      }

      fetch(`${process.env.VUE_APP_API_URL}/admin/books/save`, Security.requestOptions(payload))
          .then(res => res.json())
          .then(data => {
            if (data.error) {
              this.$emit('error', data.message)
            } else {
              this.$emit('success', 'Changes saved')
              router.push("/admin/books")
            }
          })
          .catch(err => {
            this.$emit('error', err)
          })
    },
    loadCoverImage() {
      // get a reference  to the input using ref
      const file = this.$refs.coverInput.files[0]

      // encode the file using the FileReader API
      const reader = new FileReader()
      reader.onloadend = () => {
        this.book.cover = reader.result
            .replace("data:", "")
            .replace(/^.+,/, "")
      }
      reader.readAsDataURL(file)
    },
    confirmDelete(id) {
      notie.confirm({
        text: "Are you sure you want to delete this book?",
        submitText: "Delete",
        submitCallback: () => {
          const payload = { id }

          fetch(process.env.VUE_APP_API_URL + "/admin/books/delete", Security.requestOptions(payload))
              .then(res => res.json())
              .then(data => {
                if (data.error) {
                  this.$emit('error', data.message)
                } else {
                  this.$emit('success', "Book deleted")
                  router.push("/admin/books")
                }
              })
        }
      })
    },
  },
  beforeMount() {
    Security.requireToken()

    // get book for edit if id > 0
    if (this.$route.params.bookId > 0) {
      // editing a book
      fetch(process.env.VUE_APP_API_URL + "/admin/books/" + this.$route.params.bookId, Security.requestOptions(""))
          .then(res=> res.json())
          .then(data => {
            if (data.error) {
              this.$emit('error', data.message)
            } else {
              this.book = data.data
              const genreArray = []
              for (let i = 0; i < this.book.genres.length; i++) {
                genreArray.push(this.book.genres[i].id)
              }
              this.book.genre_ids = genreArray
            }
          })
    }

    // get list of authors for drop down
    fetch(process.env.VUE_APP_API_URL + "/admin/authors/all", Security.requestOptions(""))
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            this.$emit('error', data.message)
          } else {
            this.authors = data.data
          }
        })
  },
}
</script>

<style scoped>
.book-cover {
  max-width: 10em;
}
</style>
