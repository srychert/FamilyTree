import { createRouter, createWebHistory } from 'vue-router'
import About from '../views/About.vue'
import ContactList from '../views/ContactList.vue'
import ContactLayout from '../views/contact/Layout.vue'
import ContactDetails from '../views/contact/Details.vue'
import ContactEdit from '../views/contact/Edit.vue'
import ContactAdd from '../views/contact/Add.vue'
import NotFound from '../views/NotFound.vue'
import NetworkError from '../views/NetworkError.vue'


const routes = [
  {
    path: '/',
    name: 'ContactList',
    component: ContactList,
    props: route => ({ page: parseInt(route.query.page, 10) || 1 })
  },
  {
    path: '/person/:id',
    name: 'ContactLayout',
    props: true,
    component: ContactLayout,
    children: [
      {
        path: '',
        name: 'ContactDetails',
        component: ContactDetails
      },
      {
        path: 'edit',
        name: 'ContactEdit',
        component: ContactEdit
      },
      {
        path: 'add',
        name: 'ContactAdd',
        component: ContactAdd
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: About
  },
  {
    path: '/:stuffNotFound(.*)',
    name: 'NotFound',
    component: NotFound
   },
   {
     path: '/404/:resource',
     name: '404NotFound',
     component: NotFound,
     props: true
    },
    {
      path: '/network-error',
      name: 'NetworkError',
      component: NetworkError
    }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
