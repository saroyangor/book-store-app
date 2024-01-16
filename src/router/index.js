import { createRouter, createWebHistory } from "vue-router"

import AppBody from "@/components/Body.vue"
import AppLogin from "@/components/Login.vue"
import AllBooks from "@/components/Books.vue"
import OneBook from "@/components/Book.vue"
import BooksAdmin from "@/components/BooksAdmin.vue"
import BookEdit from "@/components/BookEdit.vue"
import AllUsers from "@/components/Users.vue"
import UserEdit from "@/components/UserEdit.vue"
import Security from "@/components/security"

const routes = [
    {
        path: '/',
        name: 'Home',
        component: AppBody,
    },
    {
        path: '/login',
        name: 'Login',
        component: AppLogin,
    },
    {
        path: '/books',
        name: 'Books',
        component: AllBooks,
    },
    {
        path: '/books/:bookName',
        name: 'Book',
        component: OneBook,
    },
    {
        path: '/admin/books/',
        name: 'BooksAdmin',
        component: BooksAdmin,
    },
    {
        path: '/admin/books/:bookId',
        name: 'BookEdit',
        component: BookEdit,
    },
    {
        path: '/admin/users',
        name: 'Users',
        component: AllUsers,
    },
    {
        path: '/admin/users/:userId',
        name: 'UserEdit',
        component: UserEdit,
    },
]

const router = createRouter({ history: createWebHistory(), routes })
router.beforeEach(() => {
    Security.checkToken()
})

export default router
