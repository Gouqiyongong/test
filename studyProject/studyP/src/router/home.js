export default [
  {
    path: '/',
    name: 'root',
    redirect: '/antique-home'
  },
  {
    path: '/antique-home',
    name: 'root',
    component: () => import('@/components/Home/index.vue')
  }
]