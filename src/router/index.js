import { createRouter, createWebHistory } from 'vue-router'
import xlsx from '../views/xlsx.vue';
import docx from '../views/docx.vue';
import msgx from '../views/msgx.vue';

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
  {
    path: '/msgx',
    name: 'msgx',
    component: msgx,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
