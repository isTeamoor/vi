import { createRouter, createWebHistory } from 'vue-router'
import xlsx from '../views/xlsx.vue';
import docx from '../views/docx.vue';

const routes = [
  {
    path: '/docx',
    name: 'docx',
    component: docx,
  },
  {
    path: '/xlsx',
    name: 'xlsx',
    component: xlsx,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
