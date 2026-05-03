import { createRouter, createWebHistory } from 'vue-router'
import SortingView from '../views/SortingView.vue'
import PathfindingView from '../views/PathfindingView.vue'
import DataStructureView from '../views/DataStructureView.vue'

const routes = [
  { path: '/', name: 'Sorting', component: SortingView },
  { path: '/pathfinding', name: 'Pathfinding', component: PathfindingView },
  { path: '/datastructure', name: 'DataStructure', component: DataStructureView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
