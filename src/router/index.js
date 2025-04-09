import { createRouter, createWebHistory } from "vue-router";

// Importar componentes o paginas

import Lobby from '../pages/Lobby.vue'
import Cartas from '../pages/Cartas.vue'
import HelloWorld from '../components/HelloWorld.vue'

const routes = [
  { path: '/lobby', name: 'Lobby', component: Lobby },
  { path: '/cartas', name: 'Cartas', component: Cartas },
  { path: "/", name: "main", component: HelloWorld },
  { path: "/:pathMatch(.*)*", redirect: "/login" }, //Redirigir a /login si la ruta no existe
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
// El router se encarga de gestionar las rutas de la aplicacion, es decir, que componente se va a mostrar en cada ruta.
